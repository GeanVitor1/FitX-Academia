import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TreinosService } from '../../core/services/treinos.service';
import { AlunosService } from '../../core/services/alunos.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { TreinoDto } from '../../core/models/models';

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
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ selectedWorkout()!.nome }}</h2>
              <button class="close-btn" (click)="closeDetails()">×</button>
            </div>
            <div class="modal-body">
              <div class="detail-row"><span class="label">Aluno:</span><span class="value">{{ selectedWorkout()!.alunoNome }}</span></div>
              <div class="detail-row"><span class="label">Dia da semana:</span><span class="value">{{ dayName(selectedWorkout()!.diaSemana) }}</span></div>
              <div class="detail-row"><span class="label">Exercícios:</span><span class="value">{{ selectedWorkout()!.totalSeries }}</span></div>
              <div class="detail-row"><span class="label">Data início:</span><span class="value">{{ selectedWorkout()!.dataInicio | date:'dd/MM/yyyy' }}</span></div>
              <div class="detail-row"><span class="label">Status:</span><span class="value" [class]="selectedWorkout()!.ativo ? 'status-pending' : 'status-done'">{{ selectedWorkout()!.ativo ? 'Ativo' : 'Inativo' }}</span></div>
              @if (selectedWorkout()!.descricao) {
                <div class="detail-row"><span class="label">Descrição:</span><span class="value">{{ selectedWorkout()!.descricao }}</span></div>
              }
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" (click)="closeDetails()">Fechar</button>
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
    .btn-secondary { flex: 1; padding: 0.75rem; background: var(--color-glass); border: 1px solid var(--color-glass-border); border-radius: 0.5rem; color: var(--color-text-primary); cursor: pointer; }
    .btn-primary { flex: 1; padding: 0.75rem; background: var(--color-primary); color: var(--color-bg-dark); border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
    .modal-content { background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: 1rem; width: 100%; max-width: 500px; }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem; border-bottom: 1px solid var(--color-border); }
    .modal-header h2 { font-size: 1.25rem; font-weight: 600; color: var(--color-text-primary); margin: 0; }
    .close-btn { background: none; border: none; color: var(--color-text-secondary); font-size: 1.5rem; cursor: pointer; }
    .modal-body { padding: 1.5rem; }
    .detail-row { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--color-border); }
    .label { color: var(--color-text-secondary); }
    .value { color: var(--color-text-primary); font-weight: 500; }
    .status-done { color: #a1a1aa; }
    .status-pending { color: var(--color-primary); }
    .modal-footer { display: flex; gap: 1rem; padding: 1.5rem; border-top: 1px solid var(--color-border); }
  `]
})
export class TreinosComponent implements OnInit {
  private treinosService = inject(TreinosService);
  private alunosService = inject(AlunosService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  activeFilter = signal<'all' | 'pending'>('all');
  selectedWorkout = signal<TreinoDto | null>(null);
  loading = signal(false);
  workouts = signal<TreinoDto[]>([]);
  filteredWorkouts = signal<TreinoDto[]>([]);

  dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  dayName(dia: number): string {
    return this.dayNames[dia] || '---';
  }

  ngOnInit(): void {
    this.loadTreinos();
  }

  loadTreinos(): void {
    this.loading.set(true);
    const user = this.authService.user();
    if (user?.role === 'Aluno') {
      this.alunosService.getByUsuarioId(user.id).subscribe(alunoRes => {
        if (alunoRes.success && alunoRes.data) {
          this.treinosService.getByAlunoId(alunoRes.data.id).subscribe({
            next: (res) => { if (res.success && res.data) { this.workouts.set(res.data); this.setFilter('all'); } this.loading.set(false); },
            error: () => { this.loading.set(false); this.toast.error('Erro ao carregar treinos'); }
          });
        } else { this.loading.set(false); }
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
  }

  closeDetails(): void {
    this.selectedWorkout.set(null);
  }
}
