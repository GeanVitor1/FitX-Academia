import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AlunosService } from '../../core/services/alunos.service';
import { TreinosService } from '../../core/services/treinos.service';
import { AvaliacoesService } from '../../core/services/avaliacoes.service';
import { NotificacoesService } from '../../core/services/notificacoes.service';
import { ToastService } from '../../shared/services/toast.service';
import { AlunoDto, TreinoDto, AvaliacaoDto } from '../../core/models/models';

const DIA_SEMANA: Record<number, string> = {
  0: 'Dom',
  1: 'Seg',
  2: 'Ter',
  3: 'Qua',
  4: 'Qui',
  5: 'Sex',
  6: 'Sáb'
};

@Component({
  selector: 'app-professores',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="professor-dashboard">
      <div class="welcome-section">
        <h1>Painel do <span class="highlight">Professor</span></h1>
        <p>Olá, {{ authService.user()?.name || 'Professor' }} — gerencie alunos e treinos</p>
      </div>

      @if (loading()) {
        <div class="loading-state">Carregando painel...</div>
      } @else {
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <span class="stat-value">{{ alunosAtivos() }}</span>
              <span class="stat-label">Alunos Ativos</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📋</div>
            <div class="stat-info">
              <span class="stat-value">{{ treinos().length }}</span>
              <span class="stat-label">Treinos Criados</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <span class="stat-value">{{ avaliacoes().length }}</span>
              <span class="stat-label">Avaliações</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">💬</div>
            <div class="stat-info">
              <span class="stat-value">{{ unreadCount() }}</span>
              <span class="stat-label">Não Lidas</span>
            </div>
          </div>
        </div>

        <div class="main-content">
          <div class="students-section">
            <div class="section-header">
              <h2>Meus Alunos</h2>
              <a routerLink="/alunos" class="view-all">Ver todos →</a>
            </div>
            <div class="students-list">
              @for (student of alunosPreview(); track student.id) {
                <div class="student-card">
                  <div class="student-avatar">
                    <span>{{ student.nome.charAt(0) }}</span>
                  </div>
                  <div class="student-info">
                    <h4>{{ student.nome }}</h4>
                    <p>{{ student.planoNome || 'Sem plano' }}</p>
                  </div>
                  <div class="student-status">
                    <span class="status" [class.active]="student.status === 'Ativo'" [class.inactive]="student.status !== 'Ativo'">
                      {{ student.status }}
                    </span>
                  </div>
                  <div class="student-actions">
                    <a routerLink="/professores/treinos/criar" [queryParams]="{ alunoId: student.id }" class="action-btn" title="Criar treino">📋</a>
                    <a routerLink="/professores/avaliacoes/criar" [queryParams]="{ alunoId: student.id }" class="action-btn" title="Avaliação">📊</a>
                  </div>
                </div>
              } @empty {
                <div class="empty-block">Nenhum aluno vinculado ainda.</div>
              }
            </div>
          </div>

          <div class="schedule-section">
            <div class="section-header">
              <h2>Treinos recentes</h2>
              <a routerLink="/agenda" class="view-all">Agenda →</a>
            </div>
            <div class="schedule-list">
              @for (treino of treinosPreview(); track treino.id) {
                <div class="schedule-item">
                  <div class="schedule-time">
                    <span class="time">{{ DIA_SEMANA[treino.diaSemana] || '—' }}</span>
                    <span class="day">{{ treino.ativo ? 'Ativo' : 'Inativo' }}</span>
                  </div>
                  <div class="schedule-info">
                    <h4>{{ treino.nome }}</h4>
                    <p>{{ treino.alunoNome }} · {{ treino.totalSeries }} séries</p>
                  </div>
                  <span class="schedule-status" [class.confirmed]="treino.ativo" [class.pending]="!treino.ativo">
                    {{ treino.ativo ? 'Ativo' : 'Inativo' }}
                  </span>
                </div>
              } @empty {
                <div class="empty-block">Nenhum treino criado ainda.</div>
              }
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h3>Ações Rápidas</h3>
          <div class="actions-grid">
            <a routerLink="/professores/treinos/criar" class="action-card">
              <span class="action-icon">📝</span>
              <span class="action-text">Criar Treino</span>
            </a>
            <a routerLink="/professores/avaliacoes/criar" class="action-card">
              <span class="action-icon">📊</span>
              <span class="action-text">Nova Avaliação</span>
            </a>
            <a routerLink="/alunos" class="action-card">
              <span class="action-icon">👥</span>
              <span class="action-text">Ver Alunos</span>
            </a>
            <a routerLink="/agenda" class="action-card">
              <span class="action-icon">📅</span>
              <span class="action-text">Agenda</span>
            </a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .professor-dashboard {
      padding: 2rem;
    }

    .welcome-section {
      margin-bottom: 2rem;
    }

    .welcome-section h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 0.5rem 0;
    }

    .highlight {
      color: var(--color-primary);
    }

    .welcome-section p {
      color: var(--color-text-secondary);
      margin: 0;
    }

    .loading-state,
    .empty-block {
      text-align: center;
      padding: 2rem;
      color: var(--color-text-tertiary);
      font-size: 0.875rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-3px);
      border-color: var(--color-primary);
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
    }

    .main-content {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .section-header h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0;
    }

    .view-all {
      font-size: 0.875rem;
      color: var(--color-primary);
      text-decoration: none;
    }

    .view-all:hover {
      text-decoration: underline;
    }

    .students-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .student-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      padding: 1rem;
      transition: all 0.2s;
    }

    .student-card:hover {
      border-color: var(--color-primary);
    }

    .student-avatar {
      width: 45px;
      height: 45px;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: var(--color-bg-dark);
    }

    .student-info {
      flex: 1;
    }

    .student-info h4 {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 0.25rem 0;
    }

    .student-info p {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      margin: 0;
    }

    .status.active {
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .status.inactive {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .student-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      width: 32px;
      height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--color-glass);
      border: 1px solid var(--color-glass-border);
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }

    .action-btn:hover {
      background: var(--color-primary);
      color: var(--color-bg-dark);
    }

    .schedule-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .schedule-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      padding: 1rem;
    }

    .schedule-time {
      text-align: center;
      min-width: 60px;
    }

    .schedule-time .time {
      display: block;
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-primary);
    }

    .schedule-time .day {
      display: block;
      font-size: 0.7rem;
      color: var(--color-text-secondary);
    }

    .schedule-info {
      flex: 1;
    }

    .schedule-info h4 {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 0.25rem 0;
    }

    .schedule-info p {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      margin: 0;
    }

    .schedule-status {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
    }

    .schedule-status.confirmed {
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
    }

    .schedule-status.pending {
      background: rgba(234, 179, 8, 0.1);
      color: #eab308;
    }

    .quick-actions h3 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 1rem 0;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .action-card {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      transition: all 0.3s;
    }

    .action-card:hover {
      transform: translateY(-3px);
      border-color: var(--color-primary);
      box-shadow: 0 10px 30px rgba(200, 255, 0, 0.1);
    }

    .action-icon {
      font-size: 2rem;
    }

    .action-text {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-primary);
    }

    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .main-content {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class ProfessoresComponent implements OnInit {
  readonly DIA_SEMANA = DIA_SEMANA;

  authService = inject(AuthService);
  private alunosService = inject(AlunosService);
  private treinosService = inject(TreinosService);
  private avaliacoesService = inject(AvaliacoesService);
  private notificacoesService = inject(NotificacoesService);
  private toast = inject(ToastService);

  loading = signal(true);
  alunos = signal<AlunoDto[]>([]);
  treinos = signal<TreinoDto[]>([]);
  avaliacoes = signal<AvaliacaoDto[]>([]);
  unreadCount = signal(0);

  alunosAtivos = computed(() => this.alunos().filter(a => a.status === 'Ativo').length);
  alunosPreview = computed(() => this.alunos().slice(0, 6));
  treinosPreview = computed(() => this.treinos().slice(0, 6));

  ngOnInit(): void {
    this.loadPanel();
  }

  private loadPanel(): void {
    this.loading.set(true);
    const user = this.authService.user();
    if (!user) {
      this.loading.set(false);
      return;
    }

    forkJoin({
      alunos: this.alunosService.getAll().pipe(catchError(() => of({ success: false, data: [] as AlunoDto[] }))),
      treinos: this.treinosService.getByProfessorId(user.id).pipe(
        catchError(() =>
          this.treinosService.getAll().pipe(catchError(() => of({ success: false, data: [] as TreinoDto[] })))
        )
      ),
      avaliacoes: this.avaliacoesService.getAll().pipe(
        catchError(() => of({ success: false, data: [] as AvaliacaoDto[] }))
      ),
      unread: this.notificacoesService.countNaoLidas().pipe(
        catchError(() => of({ success: false, data: 0 }))
      )
    }).subscribe({
      next: ({ alunos, treinos, avaliacoes, unread }) => {
        const allAlunos = alunos.success && alunos.data ? alunos.data : [];
        // Prefer students assigned to this professor when professorId is present
        const mine = allAlunos.filter(a => a.professorId === user.id);
        this.alunos.set(mine.length > 0 ? mine : allAlunos);

        const allTreinos = treinos.success && treinos.data ? treinos.data : [];
        this.treinos.set(allTreinos);

        const allAvaliacoes = avaliacoes.success && avaliacoes.data ? avaliacoes.data : [];
        this.avaliacoes.set(allAvaliacoes);

        if (unread.success && typeof unread.data === 'number') {
          this.unreadCount.set(unread.data);
        }

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Erro ao carregar painel do professor');
      }
    });
  }
}
