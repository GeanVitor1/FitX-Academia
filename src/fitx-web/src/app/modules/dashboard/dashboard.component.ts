import { Component, signal, OnInit, OnDestroy, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { ToastService } from '../../shared/services/toast.service';
import { DashboardDto } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <header class="page-header">
        <h1>Bem-vindo, <span class="accent">{{ authService.user()?.name || 'Usuario' }}</span></h1>
        <p class="subtitle">{{ getWelcomeMessage() }}</p>
      </header>

      @if (loading()) {
        <div style="text-align:center;padding:3rem;color:#52525b;">Carregando dashboard...</div>
      }

      @if (!loading() && authService.isAdmin()) {
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-icon">👤</span>
            <div class="stat-content">
              <span class="stat-value">{{ dashboardData()?.alunosAtivos || 0 }}</span>
              <span class="stat-label">Alunos ativos</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">🏋️</span>
            <div class="stat-content">
              <span class="stat-value">{{ dashboardData()?.totalCheckinsHoje || 0 }}</span>
              <span class="stat-label">Check-ins hoje</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">💰</span>
            <div class="stat-content">
              <span class="stat-value">R$ {{ (dashboardData()?.receitaMensal || 0).toFixed(2) }}</span>
              <span class="stat-label">Receita mensal</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">📊</span>
            <div class="stat-content">
              <span class="stat-value">{{ dashboardData()?.novasMatriculasMes || 0 }}</span>
              <span class="stat-label">Novas matrículas</span>
            </div>
          </div>
        </div>
      }

      @if (!loading() && authService.isProfessor()) {
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-icon">👤</span>
            <div class="stat-content">
              <span class="stat-value">{{ dashboardData()?.alunosAtivos || 0 }}</span>
              <span class="stat-label">Alunos ativos</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">💪</span>
            <div class="stat-content">
              <span class="stat-value">{{ dashboardData()?.aulasHoje || 0 }}</span>
              <span class="stat-label">Aulas hoje</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">📅</span>
            <div class="stat-content">
              <span class="stat-value">{{ dashboardData()?.totalCheckinsHoje || 0 }}</span>
              <span class="stat-label">Check-ins hoje</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">⭐</span>
            <div class="stat-content">
              <span class="stat-value">{{ dashboardData()?.notificacoesNaoLidas || 0 }}</span>
              <span class="stat-label">Notificações</span>
            </div>
          </div>
        </div>
      }

      @if (!loading() && authService.isRecepcionista()) {
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-icon">✅</span>
            <div class="stat-content">
              <span class="stat-value">{{ dashboardData()?.totalCheckinsHoje || 0 }}</span>
              <span class="stat-label">Check-ins hoje</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">👤</span>
            <div class="stat-content">
              <span class="stat-value">{{ dashboardData()?.alunosAtivos || 0 }}</span>
              <span class="stat-label">Alunos ativos</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">💰</span>
            <div class="stat-content">
              <span class="stat-value">{{ dashboardData()?.mensalidadesPendentes || 0 }}</span>
              <span class="stat-label">Mensalidades pendentes</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">☰</span>
            <div class="stat-content">
              <span class="stat-value">{{ dashboardData()?.novasMatriculasMes || 0 }}</span>
              <span class="stat-label">Novas matrículas</span>
            </div>
          </div>
        </div>
      }

      @if (!loading() && authService.isAluno()) {
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-icon">💪</span>
            <div class="stat-content">
              <span class="stat-value">{{ dashboardData()?.totalCheckinsHoje || 0 }}</span>
              <span class="stat-label">Check-ins este mês</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">📅</span>
            <div class="stat-content">
              <span class="stat-value">{{ dashboardData()?.notificacoesNaoLidas || 0 }}</span>
              <span class="stat-label">Notificações</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">●</span>
            <div class="stat-content">
              <span class="stat-value">{{ dashboardData()?.mensalidadesPendentes || 0 }}</span>
              <span class="stat-label">Mensalidades pendentes</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">💰</span>
            <div class="stat-content">
              <span class="stat-value">R$ {{ (dashboardData()?.receitaMensal || 0).toFixed(2) }}</span>
              <span class="stat-label">Receita mensal</span>
            </div>
          </div>
        </div>
      }

      @if (authService.isAdmin()) {
        <section class="section">
          <h2 class="section-title">Painel Admin</h2>
          <div class="actions-grid">
            <a routerLink="/admin" class="action-card"><span class="action-icon">⚙️</span><span class="action-label">Administracao</span></a>
            <a routerLink="/professores" class="action-card"><span class="action-icon">🏋️</span><span class="action-label">Professores</span></a>
            <a routerLink="/alunos" class="action-card"><span class="action-icon">👤</span><span class="action-label">Alunos</span></a>
            <a routerLink="/financeiro" class="action-card"><span class="action-icon">📈</span><span class="action-label">Financeiro</span></a>
            <a routerLink="/equipamentos" class="action-card"><span class="action-icon">🔧</span><span class="action-label">Equipamentos</span></a>
            <a routerLink="/notificacoes" class="action-card"><span class="action-icon">🔔</span><span class="action-label">Notificacoes</span></a>
          </div>
        </section>
      }

      @if (authService.isProfessor()) {
        <section class="section">
          <h2 class="section-title">Painel Professor</h2>
          <div class="actions-grid">
            <a routerLink="/alunos" class="action-card"><span class="action-icon">👤</span><span class="action-label">Meus Alunos</span></a>
            <a routerLink="/treinos" class="action-card"><span class="action-icon">💪</span><span class="action-label">Treinos</span></a>
            <a routerLink="/checkin" class="action-card"><span class="action-icon">✅</span><span class="action-label">Check-in</span></a>
          </div>
        </section>
      }

      @if (authService.isAluno()) {
        <section class="section">
          <h2 class="section-title">Acoes Rapidas</h2>
          <div class="actions-grid four">
            <a routerLink="/treinos" class="action-card"><span class="action-icon">☰</span><span class="action-label">Ver Treinos</span></a>
            <a routerLink="/historico" class="action-card"><span class="action-icon">📊</span><span class="action-label">Historico</span></a>
            <a routerLink="/agenda" class="action-card"><span class="action-icon">📅</span><span class="action-label">Agenda</span></a>
            <a routerLink="/pagamento" class="action-card"><span class="action-icon">💰</span><span class="action-label">Pagamento</span></a>
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    :host { display: block; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #a1a1aa; background: #09090b; min-height: 100vh; }
    .dashboard { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem; }
    .page-header { margin-bottom: 2.5rem; }
    .page-header h1 { font-size: 2rem; font-weight: 800; color: #fafafa; margin: 0 0 0.5rem 0; }
    .accent { color: #c8ff00; }
    .subtitle { font-size: 0.9rem; color: #52525b; margin: 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2.5rem; }
    .stat-card { background: #111113; border: 1px solid #1e1e22; border-radius: 12px; padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 1rem; }
    .stat-icon { font-size: 1.25rem; opacity: 0.6; }
    .stat-content { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.5rem; font-weight: 700; color: #fafafa; }
    .stat-label { font-size: 0.75rem; color: #52525b; font-weight: 500; margin-top: 2px; }
    .section { margin-bottom: 2.5rem; }
    .section-title { font-size: 0.8rem; font-weight: 600; color: #52525b; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 1rem 0; }
    .actions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
    .actions-grid.four { grid-template-columns: repeat(4, 1fr); }
    .action-card { background: #111113; border: 1px solid #1e1e22; border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; align-items: center; gap: 0.625rem; text-decoration: none; }
    .action-card:hover { border-color: #c8ff00; transform: translateY(-2px); }
    .action-icon { font-size: 1.25rem; color: #52525b; }
    .action-card:hover .action-icon { color: #c8ff00; }
    .action-label { font-size: 0.8rem; font-weight: 500; color: #a1a1aa; }
    @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 768px) { .dashboard { padding: 1.5rem 1rem; } .stats-grid { grid-template-columns: 1fr; } .actions-grid { grid-template-columns: repeat(2, 1fr); } .actions-grid.four { grid-template-columns: repeat(2, 1fr); } }
  `]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private toast = inject(ToastService);

  loading = signal(false);
  dashboardData = signal<DashboardDto | null>(null);

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.dashboardService.getDashboard().subscribe({
      next: (res) => { if (res.success && res.data) this.dashboardData.set(res.data); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  getWelcomeMessage(): string {
    const role = this.authService.user()?.role;
    const messages: Record<string, string> = {
      'Admin': 'Painel de administracao do sistema',
      'Professor': 'Gerencie seus alunos e treinos',
      'Aluno': 'Comece sua jornada de treinos',
      'Recepcionista': 'Controle de acesso e recepcao',
      'Financeiro': 'Gestao financeira da academia'
    };
    return messages[role || ''] || 'Bem-vindo ao sistema';
  }
}
