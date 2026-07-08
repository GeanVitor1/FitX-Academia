import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { AlunosService } from '../../core/services/alunos.service';
import { ToastService } from '../../shared/services/toast.service';
import { AlunoDto } from '../../core/models/models';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="perfil-page">
      <div class="container">
        <div class="page-header">
          <h1>Meu Perfil</h1>
          <p>Gerencie suas informacoes pessoais</p>
        </div>

        <div class="card">
          <div class="avatar-section">
            <div class="avatar-circle">{{ getInitials() }}</div>
            <div class="avatar-info">
              <h2>{{ user()?.name }}</h2>
              <span class="role-badge">{{ formatRole() }}</span>
            </div>
          </div>

          <form #perfilForm="ngForm" (ngSubmit)="salvar()" class="form">
            <div class="form-group">
              <label for="nome">Nome</label>
              <input
                id="nome"
                name="nome"
                type="text"
                [(ngModel)]="formData.nome"
                required
                placeholder="Seu nome"
                class="input"
              />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                type="email"
                [value]="user()?.email"
                readonly
                class="input input-readonly"
              />
            </div>

            <div class="form-group">
              <label for="telefone">Telefone</label>
              <input
                id="telefone"
                name="telefone"
                type="text"
                [(ngModel)]="formData.telefone"
                placeholder="(11) 99999-9999"
                class="input"
              />
            </div>

            @if (alunoData(); as aluno) {
              <div class="plan-section">
                <div class="plan-section-header">
                  <span class="plan-icon">◈</span>
                  <span>Plano Atual</span>
                </div>
                <div class="plan-info">
                  <div class="plan-name">{{ aluno.planoNome || 'Nenhum plano' }}</div>
                  <div class="plan-status" [class.active]="aluno.status === 'Ativo'">
                    {{ aluno.status }}
                  </div>
                </div>
                <div class="plan-meta">
                  <span>Matricula: {{ aluno.dataMatricula | date:'dd/MM/yyyy' }}</span>
                </div>
              </div>
            }

            <div class="form-actions">
              <button type="submit" class="btn-save" [disabled]="saving()">
                {{ saving() ? 'Salvando...' : 'Salvar alteracoes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: #09090b;
      min-height: 100vh;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    .container {
      max-width: 640px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #fafafa;
      margin: 0 0 0.25rem 0;
      letter-spacing: -0.02em;
    }

    .page-header h1::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 24px;
      background: #c8ff00;
      border-radius: 2px;
      margin-right: 12px;
      vertical-align: middle;
    }

    .page-header p {
      color: #a1a1aa;
      margin: 0;
      font-size: 0.875rem;
      margin-left: 16px;
    }

    .card {
      background: #111113;
      border: 1px solid #1e1e22;
      border-radius: 12px;
      padding: 2rem;
    }

    .avatar-section {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding-bottom: 1.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #1e1e22;
    }

    .avatar-circle {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #c8ff00;
      color: #000;
      font-size: 1.25rem;
      font-weight: 700;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .avatar-info h2 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #fafafa;
      margin: 0 0 0.25rem 0;
    }

    .role-badge {
      display: inline-block;
      padding: 0.1875rem 0.625rem;
      background: rgba(200, 255, 0, 0.08);
      border: 1px solid rgba(200, 255, 0, 0.15);
      border-radius: 5px;
      color: #c8ff00;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .form-group label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #a1a1aa;
    }

    .input {
      padding: 0.625rem 0.875rem;
      background: #09090b;
      border: 1px solid #27272a;
      border-radius: 8px;
      color: #fafafa;
      font-size: 0.875rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .input:focus {
      border-color: #c8ff00;
    }

    .input::placeholder {
      color: #52525b;
    }

    .input-readonly {
      color: #52525b;
      cursor: not-allowed;
    }

    .plan-section {
      background: #09090b;
      border: 1px solid #27272a;
      border-radius: 10px;
      padding: 1.25rem;
    }

    .plan-section-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #a1a1aa;
      margin-bottom: 0.75rem;
    }

    .plan-icon {
      color: #c8ff00;
      font-size: 1rem;
    }

    .plan-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .plan-name {
      font-size: 1rem;
      font-weight: 600;
      color: #fafafa;
    }

    .plan-status {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.1875rem 0.5rem;
      border-radius: 4px;
      background: rgba(82, 82, 91, 0.2);
      color: #52525b;
      text-transform: capitalize;
    }

    .plan-status.active {
      background: rgba(200, 255, 0, 0.08);
      color: #c8ff00;
    }

    .plan-meta {
      font-size: 0.75rem;
      color: #52525b;
    }

    .form-actions {
      padding-top: 0.5rem;
    }

    .btn-save {
      width: 100%;
      padding: 0.75rem 1.5rem;
      background: #c8ff00;
      color: #000;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: opacity 0.2s ease;
    }

    .btn-save:hover:not(:disabled) {
      opacity: 0.9;
    }

    .btn-save:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class PerfilComponent implements OnInit {
  private authService = inject(AuthService);
  private usuariosService = inject(UsuariosService);
  private alunosService = inject(AlunosService);
  private toast = inject(ToastService);

  saving = signal(false);
  alunoData = signal<AlunoDto | null>(null);

  formData = {
    nome: '',
    telefone: ''
  };

  user = this.authService.user;

  ngOnInit(): void {
    const user = this.authService.user();
    if (user) {
      this.formData.nome = user.name;
    }
    this.loadAlunoData();
  }

  private loadAlunoData(): void {
    const user = this.authService.user();
    if (user?.role === 'Aluno') {
      this.alunosService.getByUsuarioId(user.id).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.alunoData.set(res.data);
            this.formData.telefone = res.data.telefone || '';
          }
        }
      });
    }
  }

  getInitials(): string {
    const name = this.user()?.name || '';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .filter((_, i, arr) => i === 0 || i === arr.length - 1)
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatRole(): string {
    const role = this.user()?.role || '';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }

  salvar(): void {
    const user = this.authService.user();
    if (!user) return;

    this.saving.set(true);
    this.usuariosService.update(user.id, {
      nome: this.formData.nome,
      telefone: this.formData.telefone || undefined
    }).subscribe({
      next: () => {
        this.toast.success('Perfil atualizado com sucesso');
        this.saving.set(false);
      },
      error: () => {
        this.toast.error('Erro ao atualizar perfil');
        this.saving.set(false);
      }
    });
  }
}
