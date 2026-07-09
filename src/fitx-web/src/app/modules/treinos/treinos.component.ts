import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TreinosService } from '../../core/services/treinos.service';
import { AlunosService } from '../../core/services/alunos.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { TreinoDto, SerieDto } from '../../core/models/models';

interface GrupoExercicio {
  exercicioId: string;
  exercicioNome: string;
  series: SerieDto[];
  repeticoes: number;
  carga?: number;
  observacao?: string;
  seriesCount: number;
}

@Component({
  selector: 'app-treinos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="treinos-page">
      <div class="page-header">
        <h1>Meus <span class="highlight">Treinos</span></h1>
        <p>Acompanhe e execute seus treinos personalizados</p>
      </div>

      @if (loading()) {
        <div style="text-align:center;padding:3rem;color:#52525b;">Carregando...</div>
      }

      <div class="workout-filters">
        <button class="filter-btn" [class.active]="activeFilter() === 'all'" (click)="setFilter('all')">Todos</button>
        <button class="filter-btn" [class.active]="activeFilter() === 'pending'" (click)="setFilter('pending')">Ativos</button>
      </div>

      <div class="workout-grid">
        @for (workout of filteredWorkouts(); track workout.id) {
          <div class="workout-card" [class.completed]="isTreinoConcluido(workout.id) || !workout.ativo">
            <div class="workout-header">
              <span class="workout-day">{{ dayName(workout.diaSemana) }}</span>
              @if (isTreinoConcluido(workout.id)) {
                <span class="completed-badge done">✓ Concluído</span>
              } @else if (!workout.ativo) {
                <span class="completed-badge">✓ Inativo</span>
              }
            </div>
            <h3 class="workout-name">{{ workout.nome }}</h3>
            <div class="workout-info">
              <span class="info-item"><span class="info-icon">📋</span>{{ workout.totalSeries }} exercícios</span>
              <span class="info-item"><span class="info-icon">👤</span>{{ workout.alunoNome }}</span>
            </div>
            <div class="workout-actions">
              @if (authService.user()?.role === 'Aluno' && workout.ativo) {
                @if (isTreinoConcluido(workout.id)) {
                  <button class="btn-completed" disabled>✓ Treino Concluído</button>
                } @else {
                  <button class="btn-primary" (click)="startTreino(workout)">Iniciar Treino</button>
                }
              }
              <button class="btn-secondary" (click)="viewDetails(workout)">Ver Detalhes</button>
            </div>
          </div>
        }
        @if (!loading() && filteredWorkouts().length === 0) {
          <div style="grid-column:1/-1;text-align:center;padding:3rem;color:#52525b;">
            <p>Nenhum treino encontrado</p>
          </div>
        }
      </div>

      @if (selectedWorkout()) {
        <div class="modal-overlay" (click)="closeDetails()">
          <div class="modal-content" [class.modal-wide]="treinoMode()" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ selectedWorkout()!.nome }}</h2>
              <button class="close-btn" (click)="closeDetails()">×</button>
            </div>
            <div class="modal-body">
              @if (treinoMode()) {
                <div class="timer-section">
                  <div class="timer-display">{{ timerDisplay() }}</div>
                  <div class="timer-actions">
                    @if (!timerRunning()) {
                      <button class="timer-btn" (click)="startTimer()">▶ Iniciar</button>
                    } @else {
                      <button class="timer-btn" (click)="pauseTimer()">⏸ Pausar</button>
                    }
                    <button class="timer-btn" (click)="resetTimer()">⏹ Reset</button>
                  </div>
                </div>
              }
              @if (!treinoMode()) {
                <div class="detail-row"><span class="label">Dia da semana:</span><span class="value">{{ dayName(selectedWorkout()!.diaSemana) }}</span></div>
                <div class="detail-row"><span class="label">Data início:</span><span class="value">{{ selectedWorkout()!.dataInicio | date:'dd/MM/yyyy' }}</span></div>
                <div class="detail-row">
                  <span class="label">Status:</span>
                  <span class="value" [class]="statusClass(selectedWorkout()!)">{{ statusLabel(selectedWorkout()!) }}</span>
                </div>
                @if (selectedWorkout()!.descricao) {
                  <div class="detail-row"><span class="label">Descrição:</span><span class="value">{{ selectedWorkout()!.descricao }}</span></div>
                }
              }
              @if (groupedExercises().length) {
                <div class="detail-section">
                  <div class="section-header">
                    <span class="section-label">Exercícios ({{ groupedExercises().length }})</span>
                    @if (treinoMode()) {
                      <span class="progress-text">{{ allSeriesCompleted() }}/{{ groupedExercises().length }} exercícios</span>
                    }
                  </div>
                  @if (treinoMode()) {
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width.%]="progressPct()"></div>
                    </div>
                  }
                  <div class="exercises-list">
                    @for (grupo of groupedExercises(); track grupo.exercicioId) {
                      @if (!treinoMode()) {
                        <div class="exercise-row">
                          <div class="exercise-row-left">
                            <span class="exercise-index">1</span>
                            <div class="exercise-info">
                              <span class="ex-name">{{ grupo.exercicioNome }}</span>
                              <span class="ex-detail">{{ grupo.seriesCount }}x {{ grupo.repeticoes }} reps{{ grupo.carga ? ' - ' + grupo.carga + 'kg' : '' }}</span>
                            </div>
                          </div>
                          @if (grupo.observacao) {
                            <span class="ex-obs">{{ grupo.observacao }}</span>
                          }
                        </div>
                      } @else {
                        <div class="exercise-row" [class.completed]="exerciseCompleted(grupo.exercicioId, grupo.seriesCount)">
                          <div class="exercise-row-left">
                            <span class="exercise-index" [class.done]="exerciseCompleted(grupo.exercicioId, grupo.seriesCount)">{{ grupo.seriesCount }}</span>
                            <div class="exercise-info">
                              <span class="ex-name">{{ grupo.exercicioNome }}</span>
                              <span class="ex-detail">{{ grupo.repeticoes }} reps{{ grupo.carga ? ' - ' + grupo.carga + 'kg' : '' }}</span>
                            </div>
                          </div>
                          @if (!exerciseCompleted(grupo.exercicioId, grupo.seriesCount)) {
                            <div class="serie-counter">
                              <button class="serie-btn" (click)="decrementSeries(grupo.exercicioId)" [disabled]="getSeriesDone(grupo.exercicioId) === 0">−</button>
                              <span class="serie-value">{{ getSeriesDone(grupo.exercicioId) }}/4</span>
                              <button class="serie-btn" (click)="incrementSeries(grupo.exercicioId)">+</button>
                            </div>
                          }
                          @if (exerciseCompleted(grupo.exercicioId, grupo.seriesCount)) {
                            <span class="serie-done-badge">✓</span>
                          }
                        </div>
                      }
                    }
                  </div>
                </div>
              }
            </div>
            <div class="modal-footer">
              @if (treinoMode()) {
                <button class="btn-primary" (click)="finishTreino()">✓ Concluir Treino</button>
                <button class="btn-secondary" (click)="cancelTreino()">Sair do Treino</button>
              } @else if (authService.user()?.role === 'Aluno' && selectedWorkout()!.ativo) {
                @if (isTreinoConcluido(selectedWorkout()!.id)) {
                  <button class="btn-completed" disabled>✓ Treino Concluído</button>
                  <button class="btn-secondary" (click)="closeDetails()">Fechar</button>
                } @else {
                  <button class="btn-primary" (click)="startTreino(selectedWorkout()!)">Iniciar Treino</button>
                  <button class="btn-secondary" (click)="closeDetails()">Fechar</button>
                }
              } @else {
                <button class="btn-secondary" (click)="closeDetails()">Fechar</button>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .treinos-page { padding: 2rem; }
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 2rem; font-weight: 700; color: var(--color-text-primary); margin: 0 0 0.5rem 0; }
    .highlight { color: var(--color-primary); }
    .page-header p { color: var(--color-text-secondary); margin: 0; }
    .workout-filters { display: flex; gap: 0.5rem; margin-bottom: 2rem; }
    .filter-btn { padding: 0.5rem 1rem; background: var(--color-glass); border: 1px solid var(--color-glass-border); border-radius: 0.5rem; color: var(--color-text-secondary); cursor: pointer; transition: all 0.2s; }
    .filter-btn:hover { background: rgba(255, 255, 255, 0.1); }
    .filter-btn.active { background: var(--color-primary); color: var(--color-bg-dark); border-color: var(--color-primary); }
    .workout-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .workout-card { background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: 1rem; padding: 1.5rem; transition: all 0.3s; }
    .workout-card:hover { transform: translateY(-3px); border-color: var(--color-primary); }
    .workout-card.completed { opacity: 0.85; border-color: rgba(34, 197, 94, 0.35); }
    .workout-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .workout-day { background: rgba(200, 255, 0, 0.1); color: var(--color-primary); padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 600; }
    .completed-badge { background: rgba(161, 161, 170, 0.1); color: #a1a1aa; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 600; }
    .completed-badge.done { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
    .btn-completed {
      flex: 1;
      padding: 0.75rem;
      background: rgba(34, 197, 94, 0.15);
      color: #22c55e;
      border: 1px solid rgba(34, 197, 94, 0.35);
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: default;
    }
    .workout-name { font-size: 1.125rem; font-weight: 600; color: var(--color-text-primary); margin: 0 0 1rem 0; }
    .workout-info { display: flex; gap: 1.5rem; margin-bottom: 1.5rem; }
    .info-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--color-text-secondary); }
    .workout-actions { display: flex; gap: 0.75rem; }
    .btn-secondary { flex: 1; padding: 0.75rem; background: var(--color-glass); border: 1px solid var(--color-glass-border); border-radius: 0.5rem; color: var(--color-text-primary); cursor: pointer; transition: all 0.2s; }
    .btn-secondary:hover { border-color: var(--color-text-secondary); }
    .btn-primary { flex: 1; padding: 0.75rem; background: var(--color-primary); color: var(--color-bg-dark); border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
    .modal-content { background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: 1rem; width: 100%; max-width: 500px; max-height: 90vh; display: flex; flex-direction: column; }
    .modal-content.modal-wide { max-width: 560px; }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid var(--color-border); flex-shrink: 0; }
    .modal-header h2 { font-size: 1.15rem; font-weight: 600; color: var(--color-text-primary); margin: 0; }
    .close-btn { background: none; border: none; color: var(--color-text-secondary); font-size: 1.5rem; cursor: pointer; padding: 0; line-height: 1; }
    .modal-body { padding: 1.25rem; overflow-y: auto; flex: 1; }
    .detail-row { display: flex; justify-content: space-between; padding: 0.65rem 0; border-bottom: 1px solid var(--color-border); gap: 1rem; }
    .label { color: var(--color-text-secondary); flex-shrink: 0; }
    .value { color: var(--color-text-primary); font-weight: 500; text-align: right; }
    .status-done { color: #a1a1aa; }
    .status-pending { color: var(--color-primary); }
    .status-completed { color: #22c55e; }
    .modal-footer { display: flex; gap: 0.75rem; padding: 1rem 1.25rem; border-top: 1px solid var(--color-border); flex-shrink: 0; }

    .timer-section { text-align: center; padding: 0.75rem; background: var(--color-bg-elevated); border-radius: 0.75rem; margin-bottom: 1rem; border: 1px solid var(--color-border); }
    .timer-display { font-size: 2rem; font-weight: 800; font-variant-numeric: tabular-nums; color: var(--color-primary); letter-spacing: 2px; margin-bottom: 0.5rem; }
    .timer-actions { display: flex; gap: 0.4rem; justify-content: center; flex-wrap: wrap; }
    .timer-btn { padding: 0.3rem 0.75rem; background: transparent; border: 1px solid var(--color-border); border-radius: 0.4rem; color: var(--color-text-primary); cursor: pointer; font-size: 0.75rem; transition: all 0.2s; }
    .timer-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }

    .detail-section { margin-top: 1rem; }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
    .section-label { font-size: 0.7rem; font-weight: 600; color: var(--color-text-secondary); letter-spacing: 1px; text-transform: uppercase; }
    .progress-text { font-size: 0.7rem; font-weight: 700; color: var(--color-primary); }
    .progress-bar { height: 4px; background: var(--color-border); border-radius: 2px; margin-bottom: 0.75rem; overflow: hidden; }
    .progress-fill { height: 100%; background: var(--color-primary); border-radius: 2px; transition: width 0.3s ease; }
    .exercises-list { display: flex; flex-direction: column; gap: 0.4rem; }
    .exercise-row { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem; background: var(--color-bg-elevated); border-radius: 0.5rem; border: 1px solid var(--color-border); transition: all 0.3s; min-width: 0; }
    .exercise-row.completed { border-color: var(--color-primary); opacity: 0.8; }
    .exercise-row-left { display: flex; align-items: center; gap: 0.5rem; min-width: 0; flex: 1 1 auto; overflow: hidden; }
    .exercise-index { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; background: var(--color-primary); color: var(--color-bg-dark); border-radius: 50%; font-size: 0.7rem; font-weight: 700; flex-shrink: 0; transition: all 0.3s; }
    .exercise-index.done { background: #22c55e; }
    .exercise-info { display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
    .ex-name { font-size: 0.8rem; font-weight: 500; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ex-detail { font-size: 0.7rem; color: var(--color-text-secondary); }
    .ex-obs { font-size: 0.7rem; color: var(--color-text-secondary); font-style: italic; text-align: right; max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-shrink: 0; }

    .grupo-header { display: flex; flex-direction: column; gap: 0.1rem; padding: 0.4rem 0.15rem; margin-top: 0.5rem; }
    .grupo-header:first-child { margin-top: 0; }
    .grupo-nome { font-size: 0.85rem; font-weight: 700; color: var(--color-text-primary); }
    .grupo-meta { font-size: 0.7rem; color: var(--color-text-secondary); }

    .serie-counter { display: flex; align-items: center; gap: 0.3rem; flex-shrink: 0; }
    .serie-btn { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; background: transparent; border: 1px solid var(--color-border); border-radius: 50%; color: var(--color-text-primary); cursor: pointer; font-size: 1rem; font-weight: 700; transition: all 0.2s; padding: 0; line-height: 1; }
    .serie-btn:hover:not(:disabled) { border-color: var(--color-primary); color: var(--color-primary); }
    .serie-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .serie-value { font-size: 0.9rem; font-weight: 800; color: var(--color-primary); min-width: 36px; text-align: center; font-variant-numeric: tabular-nums; }
    .serie-done-badge { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; background: #22c55e; color: #fff; border-radius: 50%; font-size: 0.65rem; font-weight: 700; flex-shrink: 0; }

    @media (max-width: 640px) {
      .treinos-page { padding: 1rem; }
      .workout-grid { grid-template-columns: 1fr; }
      .modal-overlay { padding: 0.5rem; align-items: flex-end; }
      .modal-content { max-height: 95vh; border-radius: 1rem 1rem 0 0; }
      .modal-content.modal-wide { max-width: 100%; }
      .timer-display { font-size: 1.6rem; }
      .exercise-row { padding: 0.5rem; gap: 0.4rem; }
      .serie-btn { width: 24px; height: 24px; font-size: 0.9rem; }
      .serie-value { font-size: 0.8rem; min-width: 30px; }
    }
  `]
})
export class TreinosComponent implements OnInit, OnDestroy {
  private treinosService = inject(TreinosService);
  private alunosService = inject(AlunosService);
  protected authService = inject(AuthService);
  private toast = inject(ToastService);

  activeFilter = signal<'all' | 'pending'>('all');
  selectedWorkout = signal<TreinoDto | null>(null);
  loading = signal(false);
  workouts = signal<TreinoDto[]>([]);
  filteredWorkouts = signal<TreinoDto[]>([]);
  /** IDs de treinos concluídos no dia (força re-render do template) */
  completedToday = signal<Set<string>>(new Set());

  treinoMode = signal(false);
  exerciseSeriesDone = signal<Map<string, number>>(new Map());

  allSeriesCompleted = computed(() => {
    const groups = this.groupedExercises();
    return groups.filter(g => this.exerciseCompleted(g.exercicioId, g.seriesCount)).length;
  });
  progressPct = computed(() => {
    const total = this.groupedExercises().length || 1;
    return (this.allSeriesCompleted() / total) * 100;
  });

  groupedExercises = computed<GrupoExercicio[]>(() => {
    const series = this.selectedWorkout()?.series;
    if (!series?.length) return [];
    const map = new Map<string, SerieDto[]>();
    for (const s of series) {
      const key = s.exercicioId;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return Array.from(map.values()).map(group => ({
      exercicioId: group[0].exercicioId,
      exercicioNome: group[0].exercicioNome,
      series: group,
      repeticoes: group[0].repeticoes,
      carga: group[0].carga,
      observacao: group[0].observacao,
      seriesCount: group.length
    }));
  });

  timerRunning = signal(false);
  elapsedSeconds = signal(0);
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  timerDisplay = computed(() => {
    const totalSec = this.elapsedSeconds();
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  });

  dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  dayName(dia: number): string {
    return this.dayNames[dia] || '---';
  }

  ngOnInit(): void {
    this.refreshCompletedToday();
    this.loadTreinos();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private todayKey(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private completedStorageKey(treinoId: string): string {
    const userId = this.authService.user()?.id ?? 'anon';
    return `treino_concluido_${userId}_${treinoId}_${this.todayKey()}`;
  }

  private refreshCompletedToday(): void {
    const userId = this.authService.user()?.id ?? 'anon';
    const prefix = `treino_concluido_${userId}_`;
    const suffix = `_${this.todayKey()}`;
    const ids = new Set<string>();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(prefix) || !key.endsWith(suffix)) continue;
      const mid = key.slice(prefix.length, key.length - suffix.length);
      if (mid) ids.add(mid);
    }
    this.completedToday.set(ids);
  }

  isTreinoConcluido(treinoId: string): boolean {
    return this.completedToday().has(treinoId);
  }

  private markTreinoConcluido(treinoId: string): void {
    localStorage.setItem(this.completedStorageKey(treinoId), '1');
    const next = new Set(this.completedToday());
    next.add(treinoId);
    this.completedToday.set(next);
  }

  statusLabel(workout: TreinoDto): string {
    if (this.isTreinoConcluido(workout.id)) return 'Concluído hoje';
    return workout.ativo ? 'Ativo' : 'Inativo';
  }

  statusClass(workout: TreinoDto): string {
    if (this.isTreinoConcluido(workout.id)) return 'status-completed';
    return workout.ativo ? 'status-pending' : 'status-done';
  }

  serieCompleted(serieId: string): boolean {
    return false;
  }

  exerciseCompleted(exercicioId: string, _totalSeries: number): boolean {
    return (this.exerciseSeriesDone().get(exercicioId) || 0) >= 4;
  }

  getSeriesDone(exercicioId: string): number {
    return this.exerciseSeriesDone().get(exercicioId) || 0;
  }

  loadTreinos(): void {
    this.loading.set(true);
    const user = this.authService.user();
    if (user?.role === 'Aluno') {
      this.alunosService.getByUsuarioId(user.id).subscribe({
        next: (alunoRes) => {
        if (alunoRes.success && alunoRes.data) {
          this.treinosService.getByAlunoId(alunoRes.data.id).subscribe({
            next: (res) => { if (res.success && res.data) { this.workouts.set(res.data); this.setFilter('all'); } this.loading.set(false); },
            error: () => { this.loading.set(false); this.toast.error('Erro ao carregar treinos'); }
          });
        } else { this.loading.set(false); }
        },
        error: () => { this.loading.set(false); this.toast.error('Erro ao carregar dados do aluno'); }
      });
    } else if (user?.role === 'Professor') {
      this.treinosService.getByProfessorId(user.id).subscribe({
        next: (res) => { if (res.success && res.data) { this.workouts.set(res.data); this.setFilter('all'); } this.loading.set(false); },
        error: () => { this.loading.set(false); this.toast.error('Erro ao carregar treinos'); }
      });
    } else {
      this.loading.set(false);
    }
  }

  setFilter(filter: 'all' | 'pending'): void {
    this.activeFilter.set(filter);
    if (filter === 'all') {
      this.filteredWorkouts.set(this.workouts());
    } else {
      this.filteredWorkouts.set(this.workouts().filter(w => w.ativo));
    }
  }

  viewDetails(workout: TreinoDto): void {
    this.selectedWorkout.set(workout);
    this.treinoMode.set(false);
  }

  closeDetails(): void {
    this.selectedWorkout.set(null);
    this.treinoMode.set(false);
    this.exerciseSeriesDone.set(new Map());
    this.stopTimer();
    this.elapsedSeconds.set(0);
    this.timerRunning.set(false);
  }

  private storageKey(workoutId: string): string {
    return `treino_series_${workoutId}`;
  }

  private saveExerciseSeriesDone(): void {
    const workout = this.selectedWorkout();
    if (!workout) return;
    const obj: Record<string, number> = {};
    this.exerciseSeriesDone().forEach((v, k) => { obj[k] = v; });
    localStorage.setItem(this.storageKey(workout.id), JSON.stringify(obj));
  }

  private loadExerciseSeriesDone(workoutId: string): Map<string, number> {
    try {
      const raw = localStorage.getItem(this.storageKey(workoutId));
      if (!raw) return new Map();
      const obj = JSON.parse(raw);
      return new Map(Object.entries(obj).map(([k, v]) => [k, v as number]));
    } catch {
      return new Map();
    }
  }

  startTreino(workout: TreinoDto): void {
    if (this.isTreinoConcluido(workout.id)) {
      this.toast.error('Este treino já foi concluído hoje.');
      return;
    }
    this.selectedWorkout.set(workout);
    this.treinoMode.set(true);
    this.exerciseSeriesDone.set(this.loadExerciseSeriesDone(workout.id));
    this.elapsedSeconds.set(0);
    this.timerRunning.set(false);
    this.stopTimer();
    this.toast.success('Treino iniciado! Use + para contar suas séries.');
  }

  incrementSeries(exercicioId: string): void {
    const current = this.exerciseSeriesDone().get(exercicioId) || 0;
    if (current >= 4) return;
    const map = new Map(this.exerciseSeriesDone());
    map.set(exercicioId, current + 1);
    this.exerciseSeriesDone.set(map);
    this.saveExerciseSeriesDone();
  }

  decrementSeries(exercicioId: string): void {
    const current = this.exerciseSeriesDone().get(exercicioId) || 0;
    if (current === 0) return;
    const map = new Map(this.exerciseSeriesDone());
    map.set(exercicioId, current - 1);
    this.exerciseSeriesDone.set(map);
    this.saveExerciseSeriesDone();
  }

  startTimer(): void {
    if (this.timerInterval) return;
    this.timerRunning.set(true);
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds.update(v => v + 1);
    }, 1000);
  }

  pauseTimer(): void {
    this.stopTimer();
    this.timerRunning.set(false);
  }

  resetTimer(): void {
    this.stopTimer();
    this.elapsedSeconds.set(0);
    this.timerRunning.set(false);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  finishTreino(): void {
    const workout = this.selectedWorkout();
    this.stopTimer();
    this.treinoMode.set(false);
    this.exerciseSeriesDone.set(new Map());
    this.elapsedSeconds.set(0);
    this.timerRunning.set(false);
    if (workout) {
      localStorage.removeItem(this.storageKey(workout.id));
      this.markTreinoConcluido(workout.id);
      // Mantém o modal aberto mostrando o estado concluído
      this.selectedWorkout.set({ ...workout });
    } else {
      this.selectedWorkout.set(null);
    }
    this.toast.success('Treino concluído com sucesso!');
  }

  cancelTreino(): void {
    const workout = this.selectedWorkout();
    this.stopTimer();
    this.treinoMode.set(false);
    this.exerciseSeriesDone.set(new Map());
    this.elapsedSeconds.set(0);
    this.timerRunning.set(false);
    if (workout) localStorage.removeItem(this.storageKey(workout.id));
    this.toast.success('Treino encerrado.');
  }
}
