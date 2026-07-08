import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsuariosService } from '../../core/services/usuarios.service';
import { AlunosService } from '../../core/services/alunos.service';
import { ProfessoresService } from '../../core/services/professores.service';
import { ToastService } from '../../shared/services/toast.service';
import { UsuarioDto, UpdateUsuarioDto } from '../../core/models/models';

@Component({
  selector: 'app-administracao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-page">
      <header class="page-header">
        <div class="header-content">
          <h1 class="page-title">Administracao</h1>
          <p class="page-subtitle">Gerencie o sistema FitX de forma completa</p>
        </div>
      </header>

      <nav class="tabs-nav">
        <button class="tab-btn" [class.active]="activeTab() === 'dashboard'" (click)="activeTab.set('dashboard')">Dashboard</button>
        <button class="tab-btn" [class.active]="activeTab() === 'usuarios'" (click)="activeTab.set('usuarios')">Usuarios</button>
        <button class="tab-btn" [class.active]="activeTab() === 'configuracoes'" (click)="activeTab.set('configuracoes')">Configuracoes</button>
      </nav>

      @if (activeTab() === 'dashboard') {
        <section class="tab-content">
          @if (loading()) {
            <div style="text-align:center;padding:3rem;color:#52525b;">Carregando...</div>
          }
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon-wrap"><span class="stat-icon">👥</span></div>
              <div class="stat-info">
                <span class="stat-value">{{ users().length }}</span>
                <span class="stat-label">Total Usuarios</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon-wrap"><span class="stat-icon">🏋️</span></div>
              <div class="stat-info">
                <span class="stat-value">{{ totalAlunos() }}</span>
                <span class="stat-label">Alunos Cadastrados</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon-wrap"><span class="stat-icon">👨‍🏫</span></div>
              <div class="stat-info">
                <span class="stat-value">{{ totalProfessores() }}</span>
                <span class="stat-label">Professores</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon-wrap"><span class="stat-icon">📋</span></div>
              <div class="stat-info">
                <span class="stat-value">{{ users().length }}</span>
                <span class="stat-label">Usuarios no sistema</span>
              </div>
            </div>
          </div>
        </section>
      }

      @if (activeTab() === 'usuarios') {
        <section class="tab-content">
          @if (loading()) {
            <div style="text-align:center;padding:3rem;color:#52525b;">Carregando usuarios...</div>
          }
          <div class="tab-header">
            <h2 class="section-title">Gerenciamento de Usuarios</h2>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Perfil</th>
                  <th>Status</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                @for (user of users(); track user.id) {
                  <tr>
                    <td>
                      <div class="user-cell">
                        <div class="avatar-sm">{{ user.nome.charAt(0) }}</div>
                        <span>{{ user.nome }}</span>
                      </div>
                    </td>
                    <td class="email-cell">{{ user.email }}</td>
                    <td>
                      <span class="role-badge" [class]="'role-' + user.role.toLowerCase()">{{ user.role }}</span>
                    </td>
                    <td>
                      <span class="status-badge" [class]="user.ativo ? 'status-ativo' : 'status-inativo'">
                        {{ user.ativo ? 'Ativo' : 'Inativo' }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-icon" title="Desativar" (click)="toggleUserStatus(user)">
                          {{ user.ativo ? '❌' : '✅' }}
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      }

      @if (activeTab() === 'configuracoes') {
        <section class="tab-content">
          <div class="tab-header">
            <h2 class="section-title">Configuracoes do Sistema</h2>
          </div>
          <div class="settings-form">
            <div class="form-card">
              <h3 class="form-title">Informacoes da Academia</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Nome da Academia</label>
                  <input type="text" class="form-input" [(ngModel)]="settings().academyName" placeholder="Ex: FitX Academy">
                </div>
                <div class="form-group">
                  <label class="form-label">Email de Contato</label>
                  <input type="email" class="form-input" [(ngModel)]="settings().contactEmail" placeholder="contato@fitx.com.br">
                </div>
                <div class="form-group">
                  <label class="form-label">Telefone</label>
                  <input type="tel" class="form-input" [(ngModel)]="settings().phone" placeholder="(11) 99999-9999">
                </div>
                <div class="form-group full-width">
                  <label class="form-label">Endereco</label>
                  <input type="text" class="form-input" [(ngModel)]="settings().address" placeholder="Rua Example, 123 - Sao Paulo, SP">
                </div>
              </div>
              <div class="form-actions">
                <button class="btn-secondary" (click)="resetSettings()">Restaurar Padrao</button>
                <button class="btn-primary" (click)="saveSettings()">Salvar Alteracoes</button>
              </div>
            </div>
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    :host { --color-primary: #c8ff00; --color-bg: #09090b; --color-bg-elevated: #111113; --color-bg-surface: #18181b; --color-text: #ffffff; --color-text-secondary: #a1a1aa; --color-text-muted: #52525b; --color-border: #1e1e22; display: block; min-height: 100vh; background: var(--color-bg); color: var(--color-text); font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .admin-page { padding: 2rem; max-width: 1400px; margin: 0 auto; }
    .page-header { margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--color-border); }
    .header-content { display: flex; flex-direction: column; gap: 0.5rem; }
    .page-title { font-size: 1.75rem; font-weight: 700; margin: 0; color: var(--color-text); }
    .page-subtitle { font-size: 0.9rem; color: var(--color-text-secondary); margin: 0; }
    .tabs-nav { display: flex; gap: 0.375rem; margin-bottom: 2rem; padding: 0.25rem; background: var(--color-bg-elevated); border-radius: 0.75rem; border: 1px solid var(--color-border); }
    .tab-btn { padding: 0.625rem 1.25rem; background: transparent; border: none; border-radius: 0.5rem; color: var(--color-text-secondary); font-weight: 500; font-size: 0.875rem; cursor: pointer; }
    .tab-btn:hover { color: var(--color-text); background: var(--color-bg-surface); }
    .tab-btn.active { background: var(--color-primary); color: #09090b; font-weight: 600; }
    .tab-content { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .section-title { font-size: 1rem; font-weight: 600; margin: 0 0 1.25rem 0; color: var(--color-text); }
    .tab-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .tab-header .section-title { margin-bottom: 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .stat-card { background: var(--color-bg-elevated); border: 1px solid var(--color-border); border-radius: 0.75rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; }
    .stat-card:hover { border-color: var(--color-text-muted); }
    .stat-icon-wrap { width: 40px; height: 40px; border-radius: 0.5rem; background: var(--color-bg-surface); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .stat-icon { font-size: 1.125rem; }
    .stat-info { display: flex; flex-direction: column; gap: 0.125rem; }
    .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--color-text); }
    .stat-label { font-size: 0.75rem; color: var(--color-text-secondary); }
    .table-container { background: var(--color-bg-elevated); border: 1px solid var(--color-border); border-radius: 0.75rem; overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 0.875rem 1rem; text-align: left; border-bottom: 1px solid var(--color-border); }
    .data-table th { background: var(--color-bg-surface); font-weight: 500; font-size: 0.75rem; text-transform: uppercase; color: var(--color-text-muted); }
    .data-table tr:last-child td { border-bottom: none; }
    .user-cell { display: flex; align-items: center; gap: 0.75rem; }
    .avatar-sm { width: 32px; height: 32px; border-radius: 0.5rem; background: var(--color-bg-surface); border: 1px solid var(--color-border); display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--color-text); font-size: 0.75rem; flex-shrink: 0; }
    .email-cell { color: var(--color-text-secondary); font-size: 0.875rem; }
    .role-badge { display: inline-block; padding: 0.25rem 0.625rem; border-radius: 1rem; font-size: 0.7rem; font-weight: 600; text-transform: capitalize; }
    .role-admin { background: var(--color-primary); color: #09090b; }
    .role-professor { background: var(--color-bg-surface); color: var(--color-text); border: 1px solid var(--color-border); }
    .role-aluno { background: var(--color-bg-surface); color: var(--color-text-secondary); }
    .role-recepcionista { background: var(--color-bg-surface); color: var(--color-text-muted); }
    .status-badge { display: inline-block; padding: 0.25rem 0.625rem; border-radius: 1rem; font-size: 0.7rem; font-weight: 600; }
    .status-ativo { background: rgba(200, 255, 0, 0.1); color: var(--color-primary); }
    .status-inativo { background: var(--color-bg-surface); color: var(--color-text-muted); border: 1px solid var(--color-border); }
    .action-buttons { display: flex; gap: 0.375rem; }
    .btn-icon { width: 32px; height: 32px; border-radius: 0.375rem; border: 1px solid var(--color-border); background: transparent; cursor: pointer; font-size: 0.8rem; color: var(--color-text-secondary); }
    .btn-icon:hover { border-color: var(--color-text-muted); color: var(--color-text); }
    .btn-primary { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.25rem; background: var(--color-primary); color: #09090b; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; }
    .btn-primary:hover { opacity: 0.9; }
    .btn-secondary { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.25rem; background: transparent; color: var(--color-text-secondary); border: 1px solid var(--color-border); border-radius: 0.5rem; font-weight: 500; font-size: 0.875rem; cursor: pointer; }
    .btn-secondary:hover { border-color: var(--color-text-muted); color: var(--color-text); }
    .settings-form { max-width: 640px; }
    .form-card { background: var(--color-bg-elevated); border: 1px solid var(--color-border); border-radius: 0.75rem; padding: 1.5rem; }
    .form-title { font-size: 0.9375rem; font-weight: 600; margin: 0 0 1.25rem 0; padding-bottom: 1rem; border-bottom: 1px solid var(--color-border); color: var(--color-text); }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-group.full-width { grid-column: 1 / -1; }
    .form-label { font-size: 0.8125rem; font-weight: 500; color: var(--color-text-secondary); }
    .form-input { padding: 0.625rem 0.875rem; background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: 0.375rem; color: var(--color-text); font-size: 0.875rem; }
    .form-input:focus { outline: none; border-color: var(--color-text-muted); }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--color-border); }
    @media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 768px) { .admin-page { padding: 1rem; } .tabs-nav { flex-wrap: wrap; } .tab-btn { flex: 1; } .stats-grid { grid-template-columns: 1fr; } .form-grid { grid-template-columns: 1fr; } }
  `]
})
export class AdministracaoComponent implements OnInit {
  private usuariosService = inject(UsuariosService);
  private alunosService = inject(AlunosService);
  private professoresService = inject(ProfessoresService);
  private toast = inject(ToastService);

  activeTab = signal<'dashboard' | 'usuarios' | 'configuracoes'>('dashboard');
  loading = signal(false);
  users = signal<UsuarioDto[]>([]);
  totalAlunos = signal(0);
  totalProfessores = signal(0);

  settings = signal({ academyName: 'FitX Academy', contactEmail: 'contato@fitx.com.br', phone: '(11) 99999-9999', address: 'Rua das Acacias, 456 - Jardim Paulista, Sao Paulo - SP' });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.usuariosService.getAll().subscribe({
      next: (res) => { if (res.success && res.data) this.users.set(res.data); },
      error: () => this.toast.error('Erro ao carregar usuários')
    });
    this.alunosService.getAll().subscribe({
      next: (res) => { if (res.success && res.data) this.totalAlunos.set(res.data.length); },
      error: () => this.toast.error('Erro ao carregar alunos')
    });
    this.professoresService.getAll().subscribe({
      next: (res) => { if (res.success && res.data) this.totalProfessores.set(res.data.length); this.loading.set(false); },
      error: () => { this.loading.set(false); this.toast.error('Erro ao carregar professores'); }
    });
  }

  toggleUserStatus(user: UsuarioDto): void {
    this.usuariosService.update(user.id, { ativo: !user.ativo }).subscribe({
      next: () => { this.toast.success('Status alterado'); this.loadData(); },
      error: () => this.toast.error('Erro ao alterar status')
    });
  }

  saveSettings(): void {
    this.toast.success('Configuracoes salvas com sucesso!');
  }

  resetSettings(): void {
    this.settings.set({ academyName: 'FitX Academy', contactEmail: 'contato@fitx.com.br', phone: '(11) 99999-9999', address: 'Rua das Acacias, 456 - Jardim Paulista, Sao Paulo - SP' });
  }
}
