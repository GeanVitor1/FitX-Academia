import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface Log {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  details: string;
}

interface Settings {
  academyName: string;
  contactEmail: string;
  phone: string;
  address: string;
}

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
        <button
          class="tab-btn"
          [class.active]="activeTab() === 'dashboard'"
          (click)="activeTab.set('dashboard')">
          Dashboard
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab() === 'usuarios'"
          (click)="activeTab.set('usuarios')">
          Usuarios
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab() === 'logs'"
          (click)="activeTab.set('logs')">
          Logs
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab() === 'configuracoes'"
          (click)="activeTab.set('configuracoes')">
          Configuracoes
        </button>
      </nav>

      @if (activeTab() === 'dashboard') {
        <section class="tab-content">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon-wrap">
                <span class="stat-icon">👥</span>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ totalUsers() }}</span>
                <span class="stat-label">Total Usuarios</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon-wrap">
                <span class="stat-icon">🏋️</span>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ totalStudents() }}</span>
                <span class="stat-label">Alunos Cadastrados</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon-wrap">
                <span class="stat-icon">👨‍🏫</span>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ totalProfessors() }}</span>
                <span class="stat-label">Professores</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon-wrap">
                <span class="stat-icon">📋</span>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ totalLogs() }}</span>
                <span class="stat-label">Logs do Sistema</span>
              </div>
            </div>
          </div>

          <div class="quick-actions">
            <h3 class="section-title">Acoes Rapidas</h3>
            <div class="actions-grid">
              <button class="action-card" (click)="activeTab.set('usuarios')">
                <span class="action-icon">👤</span>
                <span class="action-text">Gerenciar Usuarios</span>
                <span class="action-desc">Adicionar, editar ou desativar</span>
              </button>
              <button class="action-card" (click)="activeTab.set('logs')">
                <span class="action-icon">📄</span>
                <span class="action-text">Visualizar Logs</span>
                <span class="action-desc">Auditoria do sistema</span>
              </button>
              <button class="action-card" (click)="activeTab.set('configuracoes')">
                <span class="action-icon">⚙️</span>
                <span class="action-text">Configuracoes</span>
                <span class="action-desc">Ajustar preferencias</span>
              </button>
              <button class="action-card" routerLink="/financeiro">
                <span class="action-icon">📈</span>
                <span class="action-text">Relatorios</span>
                <span class="action-desc">Gerar relatorios</span>
              </button>
              <button class="action-card" routerLink="/financeiro">
                <span class="action-icon">💰</span>
                <span class="action-text">Financeiro</span>
                <span class="action-desc">Pagamentos e cobrancas</span>
              </button>
              <button class="action-card" routerLink="/agenda">
                <span class="action-icon">📅</span>
                <span class="action-text">Agenda</span>
                <span class="action-desc">Aulas e horarios</span>
              </button>
              <button class="action-card" routerLink="/equipamentos">
                <span class="action-icon">🏋️</span>
                <span class="action-text">Equipamentos</span>
                <span class="action-desc">Controle de estoque</span>
              </button>
              <button class="action-card" routerLink="/notificacoes">
                <span class="action-icon">🔔</span>
                <span class="action-text">Notificacoes</span>
                <span class="action-desc">Alertas e lembretes</span>
              </button>
            </div>
          </div>
        </section>
      }

      @if (activeTab() === 'usuarios') {
        <section class="tab-content">
          <div class="tab-header">
            <h2 class="section-title">Gerenciamento de Usuarios</h2>
            <button class="btn-primary" (click)="openUserModal()">
              <span>+</span> Novo Usuario
            </button>
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
                        <div class="avatar-sm">{{ user.name.charAt(0) }}</div>
                        <span>{{ user.name }}</span>
                      </div>
                    </td>
                    <td class="email-cell">{{ user.email }}</td>
                    <td>
                      <span class="role-badge" [class]="'role-' + user.role">{{ user.role }}</span>
                    </td>
                    <td>
                      <span class="status-badge" [class]="'status-' + user.status">{{ user.status }}</span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-icon" title="Editar" (click)="editUser(user)">
                          ✏️
                        </button>
                        <button
                          class="btn-icon btn-icon-action"
                          [title]="user.status === 'ativo' ? 'Desativar' : 'Ativar'"
                          (click)="toggleUserStatus(user)">
                          {{ user.status === 'ativo' ? '❌' : '✅' }}
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

      @if (activeTab() === 'logs') {
        <section class="tab-content">
          <div class="tab-header">
            <h2 class="section-title">Logs de Auditoria</h2>
            <div class="filter-group">
              <select class="filter-select" [(value)]="logFilter">
                <option value="todos">Todos</option>
                <option value="login">Login</option>
                <option value="create">Criacao</option>
                <option value="update">Atualizacao</option>
                <option value="delete">Exclusao</option>
              </select>
            </div>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Usuario</th>
                  <th>Acao</th>
                  <th>Entidade</th>
                  <th>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                @for (log of filteredLogs(); track log.id) {
                  <tr>
                    <td class="timestamp-cell">{{ log.timestamp }}</td>
                    <td>
                      <div class="user-cell">
                        <div class="avatar-sm">{{ log.user.charAt(0) }}</div>
                        <span>{{ log.user }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="action-badge" [class]="'action-' + log.action.toLowerCase()">
                        {{ log.action }}
                      </span>
                    </td>
                    <td>{{ log.entity }}</td>
                    <td class="details-cell">{{ log.details }}</td>
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
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="settings().academyName"
                    placeholder="Ex: FitX Academy">
                </div>
                <div class="form-group">
                  <label class="form-label">Email de Contato</label>
                  <input
                    type="email"
                    class="form-input"
                    [(ngModel)]="settings().contactEmail"
                    placeholder="contato&#64;fitx.com.br">
                </div>
                <div class="form-group">
                  <label class="form-label">Telefone</label>
                  <input
                    type="tel"
                    class="form-input"
                    [(ngModel)]="settings().phone"
                    placeholder="(11) 99999-9999">
                </div>
                <div class="form-group full-width">
                  <label class="form-label">Endereco</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="settings().address"
                    placeholder="Rua Example, 123 - Sao Paulo, SP">
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
    :host {
      --color-primary: #c8ff00;
      --color-bg: #09090b;
      --color-bg-elevated: #111113;
      --color-bg-surface: #18181b;
      --color-text: #ffffff;
      --color-text-secondary: #a1a1aa;
      --color-text-muted: #52525b;
      --color-border: #1e1e22;
      --color-border-subtle: #1e1e22;
      display: block;
      min-height: 100vh;
      background: var(--color-bg);
      color: var(--color-text);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .admin-page {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--color-border);
    }

    .header-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.025em;
      color: var(--color-text);
    }

    .page-subtitle {
      font-size: 0.9rem;
      color: var(--color-text-secondary);
      margin: 0;
      letter-spacing: -0.01em;
    }

    .tabs-nav {
      display: flex;
      gap: 0.375rem;
      margin-bottom: 2rem;
      padding: 0.25rem;
      background: var(--color-bg-elevated);
      border-radius: 0.75rem;
      border: 1px solid var(--color-border);
    }

    .tab-btn {
      padding: 0.625rem 1.25rem;
      background: transparent;
      border: none;
      border-radius: 0.5rem;
      color: var(--color-text-secondary);
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      letter-spacing: -0.01em;
    }

    .tab-btn:hover {
      color: var(--color-text);
      background: var(--color-bg-surface);
    }

    .tab-btn.active {
      background: var(--color-primary);
      color: #09090b;
      font-weight: 600;
    }

    .tab-content {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .section-title {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 1.25rem 0;
      color: var(--color-text);
      letter-spacing: -0.02em;
    }

    .tab-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .tab-header .section-title {
      margin-bottom: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stat-card:hover {
      border-color: var(--color-text-muted);
    }

    .stat-icon-wrap {
      width: 40px;
      height: 40px;
      border-radius: 0.5rem;
      background: var(--color-bg-surface);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon {
      font-size: 1.125rem;
      line-height: 1;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: -0.03em;
      color: var(--color-text);
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      letter-spacing: -0.01em;
    }

    .quick-actions {
      margin-top: 1rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
    }

    .action-card {
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: left;
    }

    .action-card:hover {
      border-color: var(--color-text-muted);
      background: var(--color-bg-surface);
    }

    .action-icon {
      font-size: 1.25rem;
      line-height: 1;
    }

    .action-text {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text);
      letter-spacing: -0.01em;
    }

    .action-desc {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      letter-spacing: -0.01em;
    }

    .table-container {
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      overflow: hidden;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th,
    .data-table td {
      padding: 0.875rem 1rem;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }

    .data-table th {
      background: var(--color-bg-surface);
      font-weight: 500;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-muted);
    }

    .data-table tr:last-child td {
      border-bottom: none;
    }

    .data-table tbody tr {
      transition: background 0.15s ease;
    }

    .data-table tbody tr:hover td {
      background: var(--color-bg-surface);
    }

    .user-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .avatar-sm {
      width: 32px;
      height: 32px;
      border-radius: 0.5rem;
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: var(--color-text);
      font-size: 0.75rem;
      flex-shrink: 0;
    }

    .email-cell {
      color: var(--color-text-secondary);
      font-size: 0.875rem;
    }

    .role-badge {
      display: inline-block;
      padding: 0.25rem 0.625rem;
      border-radius: 1rem;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: capitalize;
      letter-spacing: 0.02em;
    }

    .role-admin {
      background: var(--color-primary);
      color: #09090b;
    }

    .role-professor {
      background: var(--color-bg-surface);
      color: var(--color-text);
      border: 1px solid var(--color-border);
    }

    .role-aluno {
      background: var(--color-bg-surface);
      color: var(--color-text-secondary);
    }

    .role-recepcionista {
      background: var(--color-bg-surface);
      color: var(--color-text-muted);
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.625rem;
      border-radius: 1rem;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: capitalize;
      letter-spacing: 0.02em;
    }

    .status-ativo {
      background: rgba(200, 255, 0, 0.1);
      color: var(--color-primary);
    }

    .status-inativo {
      background: var(--color-bg-surface);
      color: var(--color-text-muted);
      border: 1px solid var(--color-border);
    }

    .action-buttons {
      display: flex;
      gap: 0.375rem;
    }

    .btn-icon {
      width: 32px;
      height: 32px;
      border-radius: 0.375rem;
      border: 1px solid var(--color-border);
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      color: var(--color-text-secondary);
      transition: all 0.15s ease;
    }

    .btn-icon:hover {
      border-color: var(--color-text-muted);
      color: var(--color-text);
      background: var(--color-bg-surface);
    }

    .btn-icon-action:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      background: var(--color-primary);
      color: #09090b;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      letter-spacing: -0.01em;
    }

    .btn-primary:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      background: transparent;
      color: var(--color-text-secondary);
      border: 1px solid var(--color-border);
      border-radius: 0.5rem;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      letter-spacing: -0.01em;
    }

    .btn-secondary:hover {
      border-color: var(--color-text-muted);
      color: var(--color-text);
    }

    .filter-group {
      display: flex;
      gap: 0.75rem;
    }

    .filter-select {
      padding: 0.5rem 0.875rem;
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border);
      border-radius: 0.375rem;
      color: var(--color-text);
      font-size: 0.8125rem;
      cursor: pointer;
      transition: border-color 0.15s ease;
      appearance: auto;
    }

    .filter-select:focus {
      outline: none;
      border-color: var(--color-text-muted);
    }

    .timestamp-cell {
      color: var(--color-text-muted);
      font-size: 0.8125rem;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }

    .action-badge {
      display: inline-block;
      padding: 0.25rem 0.625rem;
      border-radius: 1rem;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.02em;
    }

    .action-login {
      background: var(--color-bg-surface);
      color: var(--color-text-secondary);
    }

    .action-create {
      background: rgba(200, 255, 0, 0.1);
      color: var(--color-primary);
    }

    .action-update {
      background: var(--color-bg-surface);
      color: var(--color-text-secondary);
      border: 1px solid var(--color-border);
    }

    .action-delete {
      background: var(--color-bg-surface);
      color: var(--color-text-muted);
    }

    .details-cell {
      color: var(--color-text-secondary);
      font-size: 0.8125rem;
      max-width: 250px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .settings-form {
      max-width: 640px;
    }

    .form-card {
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      padding: 1.5rem;
    }

    .form-title {
      font-size: 0.9375rem;
      font-weight: 600;
      margin: 0 0 1.25rem 0;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--color-border);
      color: var(--color-text);
      letter-spacing: -0.01em;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      letter-spacing: -0.01em;
    }

    .form-input {
      padding: 0.625rem 0.875rem;
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border);
      border-radius: 0.375rem;
      color: var(--color-text);
      font-size: 0.875rem;
      transition: border-color 0.15s ease;
      letter-spacing: -0.01em;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--color-text-muted);
    }

    .form-input::placeholder {
      color: var(--color-text-muted);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--color-border);
    }

    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .admin-page {
        padding: 1rem;
      }

      .tabs-nav {
        flex-wrap: wrap;
        gap: 0.25rem;
      }

      .tab-btn {
        font-size: 0.8125rem;
        padding: 0.5rem 1rem;
        flex: 1;
        min-width: 0;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }

      .tab-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .btn-secondary,
      .btn-primary {
        width: 100%;
        justify-content: center;
      }

      .data-table {
        font-size: 0.8125rem;
      }

      .data-table th,
      .data-table td {
        padding: 0.75rem 0.625rem;
      }
    }
  `]
})
export class AdministracaoComponent {
  private toast = inject(ToastService);
  activeTab = signal<'dashboard' | 'usuarios' | 'logs' | 'configuracoes'>('dashboard');
  logFilter = 'todos';

  totalUsers = signal(0);
  totalStudents = signal(0);
  totalProfessors = signal(0);
  totalLogs = signal(0);

  users = signal<User[]>([]);

  logs = signal<Log[]>([]);

  settings = signal<Settings>({
    academyName: 'FitX Academy',
    contactEmail: 'contato@fitx.com.br',
    phone: '(11) 99999-9999',
    address: 'Rua das Acacias, 456 - Jardim Paulista, Sao Paulo - SP'
  });

  filteredLogs = computed(() => {
    if (this.logFilter === 'todos') {
      return this.logs();
    }
    return this.logs().filter(log => log.action.toLowerCase() === this.logFilter);
  });

  openUserModal(): void {
    this.toast.info('Modal de novo usuario seria aberto aqui');
  }

  editUser(user: User): void {
    this.toast.info('Editando usuario: ' + user.name);
  }

  toggleUserStatus(user: User): void {
    const currentUsers = this.users();
    const updatedUsers = currentUsers.map(u => {
      if (u.id === user.id) {
        return { ...u, status: u.status === 'ativo' ? 'inativo' : 'ativo' };
      }
      return u;
    });
    this.users.set(updatedUsers);
  }

  saveSettings(): void {
    this.toast.success('Configuracoes salvas com sucesso!');
  }

  resetSettings(): void {
    this.settings.set({
      academyName: 'FitX Academy',
      contactEmail: 'contato@fitx.com.br',
      phone: '(11) 99999-9999',
      address: 'Rua das Acacias, 456 - Jardim Paulista, Sao Paulo - SP'
    });
  }
}
