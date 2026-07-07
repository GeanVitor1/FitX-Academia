import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-image-side">
        <div class="image-overlay"></div>
        <img src="images/auth/gym.jpg" alt="Academia" class="bg-image">
        <div class="image-content">
          <div class="brand">
            <span class="brand-icon">💪</span>
            <span class="brand-name">FitX</span>
          </div>
          <h2>Transforme seu corpo,<br>transforme sua vida.</h2>
          <p>Acesse seus treinos, acompanhe seu progresso e alcance seus objetivos.</p>
          <div class="stats">
            <div class="stat">
              <span class="stat-number">500+</span>
              <span class="stat-label">Alunos ativos</span>
            </div>
            <div class="stat">
              <span class="stat-number">98%</span>
              <span class="stat-label">Satisfação</span>
            </div>
          </div>
        </div>
      </div>

      <div class="auth-form-side">
        <div class="auth-card">
          <div class="auth-header">
            <h1>Bem-vindo de volta</h1>
            <p>Entre na sua conta para continuar</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label>Email</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="seu@email.com"
                required
                autocomplete="email"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>Senha</label>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••"
                required
                autocomplete="current-password"
                class="form-input"
              />
            </div>

            <div class="form-options">
              <a routerLink="/auth/forgot-password" class="forgot-link">Esqueceu a senha?</a>
            </div>

            <button type="submit" class="btn-primary" [disabled]="loading()">
              @if (loading()) {
                <span class="spinner"></span>
              }
              Entrar
            </button>
          </form>

          <div class="auth-footer">
            <p>Não tem uma conta? <a routerLink="/auth/register">Cadastre-se</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0a;
      padding: 2rem;
      gap: 2rem;
    }

    .auth-image-side {
      width: 450px;
      height: 580px;
      position: relative;
      border-radius: 1rem;
      overflow: hidden;
      flex-shrink: 0;
    }

    .bg-image {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }

    .image-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.9) 0%,
        rgba(0, 0, 0, 0.5) 50%,
        rgba(0, 0, 0, 0.2) 100%
      );
      z-index: 1;
    }

    .image-content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 2;
      padding: 2rem;
      color: white;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .brand-icon {
      font-size: 1.5rem;
    }

    .brand-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #c8ff00;
    }

    .image-content h2 {
      font-size: 1.5rem;
      font-weight: 800;
      line-height: 1.2;
      margin: 0 0 0.75rem 0;
      letter-spacing: -0.5px;
    }

    .image-content p {
      font-size: 0.875rem;
      color: #999;
      margin: 0 0 1.5rem 0;
      line-height: 1.5;
    }

    .stats {
      display: flex;
      gap: 2rem;
    }

    .stat {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: 800;
      color: #c8ff00;
    }

    .stat-label {
      font-size: 0.7rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .auth-form-side {
      width: 420px;
      flex-shrink: 0;
    }

    .auth-card {
      width: 100%;
    }

    .auth-header {
      margin-bottom: 2rem;
    }

    .auth-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #fff;
      margin: 0 0 0.5rem 0;
    }

    .auth-header p {
      color: #666;
      margin: 0;
      font-size: 0.9375rem;
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
      color: #ccc;
    }

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem;
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 0.5rem;
      color: #fff;
      font-size: 0.9375rem;
      transition: all 0.2s ease;
    }

    .form-input:focus {
      border-color: #c8ff00;
      box-shadow: 0 0 0 3px rgba(200, 255, 0, 0.1);
      outline: none;
    }

    .form-input::placeholder {
      color: #555;
    }

    .form-options {
      display: flex;
      justify-content: flex-end;
    }

    .forgot-link {
      font-size: 0.875rem;
      color: #c8ff00;
      text-decoration: none;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .btn-primary {
      width: 100%;
      padding: 1rem;
      background: #c8ff00;
      color: #0a0a0a;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
      margin-top: 0.5rem;
    }

    .btn-primary:hover:not(:disabled) {
      background: #d4ff33;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(200, 255, 0, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #222;
    }

    .auth-footer p {
      color: #666;
      margin: 0;
    }

    .auth-footer a {
      color: #c8ff00;
      text-decoration: none;
      font-weight: 600;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }

    @media (max-width: 900px) {
      .auth-image-side {
        display: none;
      }

      .auth-form-side {
        width: 100%;
        max-width: 420px;
      }
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.toastService.error('Preencha todos os campos');
      return;
    }

    this.loading.set(true);

    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          if (response.success) {
            this.toastService.success('Login realizado com sucesso!');
            const role = this.authService.user()?.role;
            const routes: Record<string, string> = {
              'Admin': '/admin',
              'Professor': '/professores',
              'Recepcionista': '/recepcao',
              'Financeiro': '/financeiro'
            };
            this.router.navigate([routes[role || ''] || '/dashboard']);
          } else {
            this.toastService.error(response.error || 'Erro ao fazer login');
          }
        },
        error: (err) => {
          this.loading.set(false);
          const msg = err.error?.error || err.error?.errors?.join(', ') || 'Email ou senha invalidos';
          this.toastService.error(msg);
        }
      });
  }
}
