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
          <div class="workout-card" [class.completed]="!workout.ativo">
            <div class="workout-header">
              <span class="workout-day">{{ dayName(workout.diaSemana) }}</span>
              @if (!workout.ativo) {
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
                <button class="btn-primary" (click)="startTreino(workout)">Iniciar Treino</button>
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
                <div class="detail-row"><span class="label">Status:</span><span class="value" [class]="selectedWorkout()!.ativo ? 'status-pending' : 'status-done'">{{ selectedWorkout()!.ativo ? 'Ativo' : 'Inativo' }}</span></div>
                @if (selectedWorkout()!.descricao) {
                  <div class="detail-row"><span class="label">Descrição:</span><span class="value">{{ selectedWorkout()!.descricao }}</span></div>
                }
              }
              @if (groupedExercises().length) {
                <div class="detail-section">
                  <div class="section-header">
                    <span class="section-label">Exercícios ({{ groupedExercises().length }})</span>
                    @if (treinoMode()) {
                      <span class="progress-text">{{ allSeriesCompleted() }}/{{ selectedWorkout()!.series!.length }} séries</span>
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
                        <div class="grupo-header">
                          <span class="grupo-nome">{{ grupo.exercicioNome }}</span>
                          <span class="grupo-meta">{{ grupo.seriesCount }} séries de {{ grupo.repeticoes }} reps{{ grupo.carga ? ' - ' + grupo.carga + 'kg' : '' }}</span>
                        </div>
                        @for (serie of grupo.series; track serie.id) {
                          <div class="exercise-row" [class.completed]="serieCompleted(serie.id)">
                            <div class="exercise-row-left">
                              <span class="exercise-index" [class.done]="serieCompleted(serie.id)">{{ serie.ordem }}</span>
                              <div class="exercise-info">
                                <span class="ex-name">Série {{ serie.ordem }}</span>
                                <span class="ex-detail">{{ repCounts().get(serie.id) || 0 }}/{{ serie.repeticoes }} reps{{ serie.carga ? ' - ' + serie.carga + 'kg' : '' }}</span>
                              </div>
                            </div>
                            <div class="rep-counter">
                              <button class="rep-btn" (click)="decrementRep(serie.id)" [disabled]="(repCounts().get(serie.id) || 0) === 0">−</button>
                              <span class="rep-value">{{ repCounts().get(serie.id) || 0 }}</span>
                              <button class="rep-btn" (click)="incrementRep(serie.id)">+</button>
                            </div>
                            @if (serieCompleted(serie.id)) {
                              <span class="serie-done-badge">✓</span>
                            }
                          </div>
                        }
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
                <button class="btn-primary" (click)="startTreino(selectedWorkout()!)">Iniciar Treino</button>
                <button class="btn-secondary" (click)="closeDetails()">Fechar</button>
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
    .workout-card.completed { opacity: 0.7; border-color: rgba(161, 161, 170, 0.3); }
    .workout-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .workout-day { background: rgba(200, 255, 0, 0.1); color: var(--color-primary); padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 600; }
    .completed-badge { background: rgba(161, 161, 170, 0.1); color: #a1a1aa; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 600; }
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

    .rep-counter { display: flex; align-items: center; gap: 0.3rem; flex-shrink: 0; }
    .rep-btn { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; background: transparent; border: 1px solid var(--color-border); border-radius: 50%; color: var(--color-text-primary); cursor: pointer; font-size: 1rem; font-weight: 700; transition: all 0.2s; padding: 0; line-height: 1; }
    .rep-btn:hover:not(:disabled) { border-color: var(--color-primary); color: var(--color-primary); }
    .rep-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .rep-value { font-size: 1rem; font-weight: 800; color: var(--color-primary); min-width: 20px; text-align: center; font-variant-numeric: tabular-nums; }
    .serie-done-badge { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; background: #22c55e; color: #fff; border-radius: 50%; font-size: 0.65rem; font-weight: 700; flex-shrink: 0; }

    @media (max-width: 640px) {
      .treinos-page { padding: 1rem; }
      .workout-grid { grid-template-columns: 1fr; }
      .modal-overlay { padding: 0.5rem; align-items: flex-end; }
      .modal-content { max-height: 95vh; border-radius: 1rem 1rem 0 0; }
      .modal-content.modal-wide { max-width: 100%; }
      .timer-display { font-size: 1.6rem; }
      .exercise-row { padding: 0.5rem; gap: 0.4rem; }
      .rep-btn { width: 24px; height: 24px; font-size: 0.9rem; }
      .rep-value { font-size: 0.9rem; min-width: 18px; }
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

  treinoMode = signal(false);
  repCounts = signal<Map<string, number>>(new Map());

  allSeriesCompleted = computed(() => {
    const series = this.selectedWorkout()?.series;
    if (!series?.length) return 0;
    return series.filter(s => (this.repCounts().get(s.id) || 0) >= s.repeticoes).length;
  });
  progressPct = computed(() => {
    const total = this.selectedWorkout()?.series?.length ?? 1;
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
  private timerInterval: any = null;

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
    this.loadTreinos();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  serieCompleted(serieId: string): boolean {
    const serie = this.selectedWorkout()?.series?.find(s => s.id === serieId);
    if (!serie) return false;
    return (this.repCounts().get(serieId) || 0) >= serie.repeticoes;
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
    this.repCounts.set(new Map());
    this.stopTimer();
    this.elapsedSeconds.set(0);
    this.timerRunning.set(false);
  }

  private storageKey(workoutId: string): string {
    return `treino_reps_${workoutId}`;
  }

  private saveRepCounts(): void {
    const workout = this.selectedWorkout();
    if (!workout) return;
    const obj: Record<string, number> = {};
    this.repCounts().forEach((v, k) => { obj[k] = v; });
    localStorage.setItem(this.storageKey(workout.id), JSON.stringify(obj));
  }

  private loadRepCounts(workoutId: string): Map<string, number> {
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
    this.selectedWorkout.set(workout);
    this.treinoMode.set(true);
    this.repCounts.set(this.loadRepCounts(workout.id));
    this.elapsedSeconds.set(0);
    this.timerRunning.set(false);
    this.stopTimer();
    this.toast.success('Treino iniciado! Conte suas repetições e use o cronômetro.');
  }

  incrementRep(serieId: string): void {
    const current = this.repCounts().get(serieId) || 0;
    const map = new Map(this.repCounts());
    map.set(serieId, current + 1);
    this.repCounts.set(map);
    this.saveRepCounts();
  }

  decrementRep(serieId: string): void {
    const current = this.repCounts().get(serieId) || 0;
    if (current === 0) return;
    const map = new Map(this.repCounts());
    map.set(serieId, current - 1);
    this.repCounts.set(map);
    this.saveRepCounts();
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
    this.repCounts.set(new Map());
    this.elapsedSeconds.set(0);
    this.timerRunning.set(false);
    this.selectedWorkout.set(null);
    if (workout) localStorage.removeItem(this.storageKey(workout.id));
    this.toast.success('Treino concluído com sucesso!');
  }

  cancelTreino(): void {
    const workout = this.selectedWorkout();
    this.stopTimer();
    this.treinoMode.set(false);
    this.repCounts.set(new Map());
    this.elapsedSeconds.set(0);
    this.timerRunning.set(false);
    if (workout) localStorage.removeItem(this.storageKey(workout.id));
    this.toast.success('Treino encerrado.');
  }
}
