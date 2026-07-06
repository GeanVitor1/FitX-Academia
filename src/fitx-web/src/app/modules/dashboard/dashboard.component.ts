import { Component, signal, OnInit, OnDestroy, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <header class="page-header">
        <h1>Bem-vindo, <span class="accent">{{ getRoleName() }}</span></h1>
        <p class="subtitle">{{ getWelcomeMessage() }}</p>
      </header>

      <div class="stats-grid">
        @for (stat of getStats(); track stat.label) {
          <div class="stat-card">
            <span class="stat-icon">{{ stat.icon }}</span>
            <div class="stat-content">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
        }
      </div>

      @if (authService.isAdmin()) {
        <section class="section">
          <h2 class="section-title">Painel Admin</h2>
          <div class="actions-grid">
            <a routerLink="/admin" class="action-card">
              <span class="action-icon">⚙️</span>
              <span class="action-label">Administracao</span>
            </a>
            <a routerLink="/professores" class="action-card">
              <span class="action-icon">🏋️</span>
              <span class="action-label">Professores</span>
            </a>
            <a routerLink="/alunos" class="action-card">
              <span class="action-icon">👤</span>
              <span class="action-label">Alunos</span>
            </a>
            <a routerLink="/financeiro" class="action-card">
              <span class="action-icon">📈</span>
              <span class="action-label">Financeiro</span>
            </a>
            <a routerLink="/equipamentos" class="action-card">
              <span class="action-icon">🔧</span>
              <span class="action-label">Equipamentos</span>
            </a>
            <a routerLink="/notificacoes" class="action-card">
              <span class="action-icon">🎵</span>
              <span class="action-label">Notificacoes</span>
            </a>
          </div>
        </section>
      } @else if (authService.isProfessor()) {
        <section class="section">
          <h2 class="section-title">Painel Professor</h2>
          <div class="actions-grid">
            <a routerLink="/alunos" class="action-card">
              <span class="action-icon">👤</span>
              <span class="action-label">Meus Alunos</span>
            </a>
            <a routerLink="/treinos" class="action-card">
              <span class="action-icon">💪</span>
              <span class="action-label">Treinos</span>
            </a>
            <a routerLink="/checkin" class="action-card">
              <span class="action-icon">✅</span>
              <span class="action-label">Check-in</span>
            </a>
          </div>
        </section>
      } @else if (authService.isRecepcionista()) {
        <section class="section">
          <h2 class="section-title">Painel Recepcao</h2>
          <div class="actions-grid">
            <a routerLink="/recepcao" class="action-card">
              <span class="action-icon">🏠</span>
              <span class="action-label">Recepcao</span>
            </a>
            <a routerLink="/checkin" class="action-card">
              <span class="action-icon">✅</span>
              <span class="action-label">Check-in</span>
            </a>
            <a routerLink="/mensalidades" class="action-card">
              <span class="action-icon">💰</span>
              <span class="action-label">Mensalidades</span>
            </a>
          </div>
        </section>
      } @else if (authService.isFinanceiro()) {
        <section class="section">
          <h2 class="section-title">Painel Financeiro</h2>
          <div class="actions-grid">
            <a routerLink="/financeiro" class="action-card">
              <span class="action-icon">📈</span>
              <span class="action-label">Financeiro</span>
            </a>
            <a routerLink="/mensalidades" class="action-card">
              <span class="action-icon">💰</span>
              <span class="action-label">Mensalidades</span>
            </a>
          </div>
        </section>
      } @else if (authService.isAluno()) {
        <div class="aluno-layout">
          <div class="workout-panel">
            <div class="panel-header">
              <h2>Treino de Hoje</h2>
              <span class="tag">Peito e Triceps</span>
            </div>
            <div class="workout-card">
              <div class="exercise-list">
                @for (exercise of exercises; track exercise.name; let i = $index) {
                  <div class="exercise-row" [class.done]="exercise.completed()">
                    <span class="exercise-idx">{{ i + 1 }}</span>
                    <div class="exercise-detail">
                      <span class="exercise-name">{{ exercise.name }}</span>
                      <span class="exercise-meta">{{ exercise.sets }}x{{ exercise.reps }} &middot; {{ exercise.weight }}kg</span>
                    </div>
                    <button class="toggle-btn" (click)="toggleExercise(i)">
                      {{ exercise.completed() ? '✅' : '' }}
                    </button>
                  </div>
                }
              </div>
              <button class="btn-start" (click)="startWorkout()">
                {{ isWorkoutActive() ? 'Pausar Treino' : 'Iniciar Treino' }}
              </button>
            </div>
          </div>

          <div class="side-panel">
            <div class="timer-card">
              <span class="timer-label">Cronometro</span>
              <div class="timer-value">{{ formatTime(timer()) }}</div>
              <div class="timer-actions">
                <button class="timer-btn" (click)="toggleTimer()">
                  {{ isTimerRunning() ? 'II' : '▶' }}
                </button>
                <button class="timer-btn secondary" (click)="resetTimer()">↺</button>
              </div>
            </div>

            <div class="progress-card">
              <span class="progress-label">Progresso Semanal</span>
              <div class="progress-list">
                @for (day of weekDays; track day.name) {
                  <div class="progress-row">
                    <span class="progress-day">{{ day.name }}</span>
                    <div class="progress-track">
                      <div class="progress-fill" [style.width]="day.progress + '%'"></div>
                    </div>
                    <span class="progress-pct">{{ day.progress }}%</span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <section class="section">
          <h2 class="section-title">Acoes Rapidas</h2>
          <div class="actions-grid four">
            <a routerLink="/treinos" class="action-card">
              <span class="action-icon">☰</span>
              <span class="action-label">Ver Treinos</span>
            </a>
            <a routerLink="/historico" class="action-card">
              <span class="action-icon">📊</span>
              <span class="action-label">Historico</span>
            </a>
            <a routerLink="/agenda" class="action-card">
              <span class="action-icon">📅</span>
              <span class="action-label">Agenda</span>
            </a>
            <a routerLink="/pagamento" class="action-card">
              <span class="action-icon">💰</span>
              <span class="action-label">Pagamento</span>
            </a>
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    :host {
      display: block;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #a1a1aa;
      background: #09090b;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 2rem;
    }

    /* Header */
    .page-header {
      margin-bottom: 2.5rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 800;
      color: #fafafa;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.03em;
    }

    .accent {
      color: #c8ff00;
    }

    .subtitle {
      font-size: 0.9rem;
      color: #52525b;
      margin: 0;
      font-weight: 400;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 2.5rem;
    }

    .stat-card {
      background: #111113;
      border: 1px solid #1e1e22;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: border-color 0.2s ease, transform 0.2s ease;
    }

    .stat-card:hover {
      border-color: #3f3f46;
      transform: translateY(-2px);
    }

    .stat-icon {
      font-size: 1.25rem;
      opacity: 0.6;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fafafa;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #52525b;
      font-weight: 500;
      margin-top: 2px;
    }

    /* Section */
    .section {
      margin-bottom: 2.5rem;
    }

    .section-title {
      font-size: 0.8rem;
      font-weight: 600;
      color: #52525b;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0 0 1rem 0;
    }

    /* Actions Grid */
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }

    .actions-grid.four {
      grid-template-columns: repeat(4, 1fr);
    }

    .action-card {
      background: #111113;
      border: 1px solid #1e1e22;
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.625rem;
      text-decoration: none;
      transition: border-color 0.2s ease, transform 0.2s ease;
    }

    .action-card:hover {
      border-color: #c8ff00;
      transform: translateY(-2px);
    }

    .action-icon {
      font-size: 1.25rem;
      color: #52525b;
      transition: color 0.2s ease;
    }

    .action-card:hover .action-icon {
      color: #c8ff00;
    }

    .action-label {
      font-size: 0.8rem;
      font-weight: 500;
      color: #a1a1aa;
    }

    .action-card:hover .action-label {
      color: #fafafa;
    }

    /* Aluno Layout */
    .aluno-layout {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .panel-header h2 {
      font-size: 1rem;
      font-weight: 600;
      color: #fafafa;
      margin: 0;
    }

    .tag {
      font-size: 0.7rem;
      font-weight: 600;
      color: #c8ff00;
      background: rgba(200, 255, 0, 0.08);
      border: 1px solid rgba(200, 255, 0, 0.15);
      padding: 0.25rem 0.75rem;
      border-radius: 100px;
      letter-spacing: 0.02em;
    }

    /* Workout Card */
    .workout-card {
      background: #111113;
      border: 1px solid #1e1e22;
      border-radius: 12px;
      padding: 1.25rem;
    }

    .exercise-list {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      margin-bottom: 1rem;
    }

    .exercise-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 8px;
      background: #09090b;
      border: 1px solid transparent;
      transition: border-color 0.2s ease, background 0.2s ease;
    }

    .exercise-row:hover {
      border-color: #1e1e22;
    }

    .exercise-row.done {
      background: rgba(200, 255, 0, 0.04);
      border-color: rgba(200, 255, 0, 0.12);
    }

    .exercise-idx {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 700;
      color: #52525b;
      background: #18181b;
      border-radius: 6px;
      flex-shrink: 0;
    }

    .exercise-row.done .exercise-idx {
      background: #c8ff00;
      color: #09090b;
    }

    .exercise-detail {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .exercise-name {
      font-size: 0.825rem;
      font-weight: 600;
      color: #fafafa;
      line-height: 1.3;
    }

    .exercise-meta {
      font-size: 0.7rem;
      color: #52525b;
      font-weight: 400;
    }

    .exercise-row.done .exercise-name {
      color: #52525b;
    }

    .toggle-btn {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #1e1e22;
      border-radius: 6px;
      background: transparent;
      color: #52525b;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .toggle-btn:hover {
      border-color: #c8ff00;
      color: #c8ff00;
    }

    .exercise-row.done .toggle-btn {
      background: #c8ff00;
      border-color: #c8ff00;
      color: #09090b;
    }

    .btn-start {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #1e1e22;
      border-radius: 8px;
      background: transparent;
      color: #fafafa;
      font-size: 0.8rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-start:hover {
      background: #c8ff00;
      border-color: #c8ff00;
      color: #09090b;
    }

    /* Side Panel */
    .side-panel {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    /* Timer */
    .timer-card {
      background: #111113;
      border: 1px solid #1e1e22;
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
    }

    .timer-label {
      font-size: 0.7rem;
      font-weight: 600;
      color: #52525b;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      display: block;
      margin-bottom: 1rem;
    }

    .timer-value {
      font-size: 2.5rem;
      font-weight: 800;
      color: #c8ff00;
      font-family: 'Courier New', 'SF Mono', 'Consolas', monospace;
      font-variant-numeric: tabular-nums;
      letter-spacing: 0.04em;
      margin-bottom: 1.25rem;
      line-height: 1;
    }

    .timer-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      position: relative;
      z-index: 1;
    }

    .timer-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #1e1e22;
      border-radius: 8px;
      background: #18181b;
      color: #c8ff00;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      z-index: 2;
    }

    .timer-btn:hover {
      border-color: #c8ff00;
      background: rgba(200, 255, 0, 0.08);
    }

    .timer-btn.secondary {
      color: #52525b;
    }

    .timer-btn.secondary:hover {
      color: #a1a1aa;
      border-color: #3f3f46;
      background: transparent;
    }

    /* Progress */
    .progress-card {
      background: #111113;
      border: 1px solid #1e1e22;
      border-radius: 12px;
      padding: 1.25rem;
    }

    .progress-label {
      font-size: 0.7rem;
      font-weight: 600;
      color: #52525b;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      display: block;
      margin-bottom: 1rem;
    }

    .progress-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .progress-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .progress-day {
      width: 28px;
      font-size: 0.65rem;
      font-weight: 600;
      color: #52525b;
      flex-shrink: 0;
    }

    .progress-track {
      flex: 1;
      height: 4px;
      background: #18181b;
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #c8ff00;
      border-radius: 2px;
      transition: width 0.6s ease;
    }

    .progress-pct {
      width: 30px;
      font-size: 0.65rem;
      font-weight: 500;
      color: #52525b;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .aluno-layout {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .dashboard {
        padding: 1.5rem 1rem;
      }
      .page-header h1 {
        font-size: 1.5rem;
      }
      .stats-grid {
        grid-template-columns: 1fr;
      }
      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .actions-grid.four {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  private zone = inject(NgZone);
  timer = signal(0);
  isTimerRunning = signal(false);
  isWorkoutActive = signal(false);
  private timerInterval: any;

  exercises: { name: string; sets: number; reps: number; weight: number; completed: ReturnType<typeof signal<boolean>> }[] = [];

  weekDays = [
    { name: 'Seg', progress: 0 },
    { name: 'Ter', progress: 0 },
    { name: 'Qua', progress: 0 },
    { name: 'Qui', progress: 0 },
    { name: 'Sex', progress: 0 },
    { name: 'Sab', progress: 0 },
    { name: 'Dom', progress: 0 }
  ];

  getRoleName(): string {
    return this.authService.user()?.name || 'Usuario';
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

  getStats(): { icon: string; value: string; label: string }[] {
    const role = this.authService.user()?.role;
    if (role === 'Admin') {
      return [
        { icon: '👤', value: '0', label: 'Alunos ativos' },
        { icon: '🏋️', value: '0', label: 'Professores' },
        { icon: '💰', value: 'R$ 0', label: 'Receita mensal' },
        { icon: '📊', value: '0%', label: 'Taxa permanencia' }
      ];
    }
    if (role === 'Professor') {
      return [
        { icon: '👤', value: '0', label: 'Alunos ativos' },
        { icon: '💪', value: '0', label: 'Treinos criados' },
        { icon: '📅', value: '0', label: 'Aulas esta semana' },
        { icon: '⭐', value: '0', label: 'Avaliacao media' }
      ];
    }
    if (role === 'Recepcionista') {
      return [
        { icon: '✅', value: '0', label: 'Check-ins hoje' },
        { icon: '🏠', value: '0', label: 'Alunos presentes' },
        { icon: '☰', value: '0', label: 'Novas matriculas' },
        { icon: '💰', value: '0', label: 'Pagamentos hoje' }
      ];
    }
    if (role === 'Financeiro') {
      return [
        { icon: '💰', value: 'R$ 0', label: 'Receita mensal' },
        { icon: '📊', value: 'R$ 0', label: 'Recebido' },
        { icon: '⚠️', value: 'R$ 0', label: 'Pendente' },
        { icon: '📈', value: '0%', label: 'Crescimento' }
      ];
    }
    return [
      { icon: '💪', value: '0', label: 'Treinos este mes' },
      { icon: '⏱️', value: '0h', label: 'Tempo total' },
      { icon: '●', value: '0', label: 'Calorias queimadas' },
      { icon: '📅', value: '0', label: 'Dias seguidos' }
    ];
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  toggleTimer(): void {
    if (this.isTimerRunning()) {
      clearInterval(this.timerInterval);
    } else {
      this.zone.runOutsideAngular(() => {
        this.timerInterval = setInterval(() => {
          this.zone.run(() => {
            this.timer.update(t => t + 1);
          });
        }, 1000);
      });
    }
    this.isTimerRunning.update(v => !v);
  }

  resetTimer(): void {
    clearInterval(this.timerInterval);
    this.timer.set(0);
    this.isTimerRunning.set(false);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  toggleExercise(index: number): void {
    this.exercises[index].completed.update(v => !v);
  }

  startWorkout(): void {
    this.isWorkoutActive.update(v => !v);
    if (this.isWorkoutActive()) {
      this.toggleTimer();
    }
  }
}
