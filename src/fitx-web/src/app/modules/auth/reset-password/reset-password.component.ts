import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <span class="logo-icon">💪</span>
            <span class="logo-text">FitX</span>
          </div>
          <h1>Redefinir senha</h1>
          <p>Crie uma nova senha para sua conta</p>
        </div>

        @if (!success()) {
          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label>Email</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="seu@email.com"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>Token de recuperação</label>
              <input
                type="text"
                [(ngModel)]="token"
                name="token"
                placeholder="Cole o token recebido por email"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>Nova senha</label>
              <input
                type="password"
                [(ngModel)]="newPassword"
                name="newPassword"
                placeholder="••••••••"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>Confirmar nova senha</label>
              <input
                type="password"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                required
                class="form-input"
              />
            </div>

            <button type="submit" class="btn-primary" [disabled]="loading()">
              @if (loading()) {
                <span class="spinner"></span>
              }
              Redefinir senha
            </button>
          </form>
        } @else {
          <div class="success-message">
            <span class="success-icon">✅</span>
            <p>Sua senha foi redefinida com sucesso!</p>
          </div>
        }

        <div class="auth-footer">
          <p><a routerLink="/auth/login">Voltar para o login</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-bg-dark);
      padding: 2rem;
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: 1rem;
      padding: 2.5rem;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .logo-icon {
      font-size: 2rem;
    }

    .logo-text {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-primary);
    }

    .auth-header h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 0.5rem 0;
    }

    .auth-header p {
      color: var(--color-text-secondary);
      margin: 0;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-primary);
    }

    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: var(--color-glass);
      border: 1px solid var(--color-glass-border);
      border-radius: 0.5rem;
      color: var(--color-text-primary);
      font-size: 0.875rem;
      outline: none;
      transition: all 0.2s;
    }

    .form-input:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(200, 255, 0, 0.1);
    }

    .form-input::placeholder {
      color: var(--color-text-secondary);
    }

    .btn-primary {
      width: 100%;
      padding: 0.875rem;
      background: var(--color-primary);
      color: var(--color-bg-dark);
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--color-primary-dark);
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .success-message {
      text-align: center;
      padding: 2rem 0;
    }

    .success-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 1rem;
    }

    .success-message p {
      color: var(--color-text-secondary);
      margin: 0;
      line-height: 1.6;
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--color-border);
    }

    .auth-footer p {
      color: var(--color-text-secondary);
      margin: 0;
    }

    .auth-footer a {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 500;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class ResetPasswordComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  token = '';
  newPassword = '';
  confirmPassword = '';
  loading = signal(false);
  success = signal(false);

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.token = params['token'];
      }
      if (params['email']) {
        this.email = params['email'];
      }
    });
  }

  onSubmit(): void {
    if (!this.email || !this.token || !this.newPassword || !this.confirmPassword) {
      this.toastService.error('Preencha todos os campos');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.toastService.error('As senhas não conferem');
      return;
    }

    if (this.newPassword.length < 6) {
      this.toastService.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    this.loading.set(true);

    this.authService.resetPassword(this.email, this.token, this.newPassword)
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          if (response.success) {
            this.success.set(true);
          } else {
            this.toastService.error(response.error || 'Erro ao redefinir senha');
          }
        },
        error: () => {
          this.loading.set(false);
          this.toastService.error('Erro ao conectar com o servidor');
        }
      });
  }
}
