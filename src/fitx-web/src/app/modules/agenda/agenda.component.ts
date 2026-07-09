import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TreinosService } from '../../core/services/treinos.service';
import { AuthService } from '../../core/services/auth.service';

interface Aluno {
  id: string;
  nome: string;
  email: string;
  plano: string;
  telefone: string;
  peso: string;
  altura: string;
  observacoes: string;
}

interface Treino {
  id: string;
  alunoId: string;
  alunoNome: string;
  data: string;
  horario: string;
  tipo: string;
  descricao: string;
  observacoes: string;
  status: 'Agendado' | 'Concluido' | 'Cancelado';
  exercicios: ExercicioTreino[];
}

interface ExercicioTreino {
  id: string;
  nome: string;
  grupoMuscular: string;
  series: number;
  repeticoes: string;
  carga: string;
  descanso: string;
  observacoes: string;
}

interface ExercicioLib {
  id: string;
  nome: string;
  grupoMuscular: string;
  categoria: string;
  favorito: boolean;
}

interface DayColumn {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
}

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="agenda-page">
      <header class="page-header">
        <div class="header-left">
          <h1>Agenda de <span class="accent">Treinos</span></h1>
          <p class="subtitle">Gerencie os treinos dos seus alunos</p>
        </div>
        <div class="header-actions">
          <button class="btn-ghost" (click)="goToToday()">Hoje</button>
          <button class="btn-primary" (click)="openNewTraining()">+ Novo Treino</button>
        </div>
      </header>

      <div class="week-nav">
        <button class="week-nav-btn" (click)="previousWeek()">
          <span class="nav-arrow">&#8249;</span>
        </button>
        <div class="week-info">
          <span class="week-label">{{ weekLabel() }}</span>
          <span class="week-range">{{ weekRange() }}</span>
        </div>
        <button class="week-nav-btn" (click)="nextWeek()">
          <span class="nav-arrow">&#8250;</span>
        </button>
      </div>

      <div class="calendar-grid">
        <div class="day-headers">
          <div class="day-header-corner"></div>
          @for (day of weekDays(); track day.date.toISOString()) {
            <div class="day-header" [class.today]="day.isToday">
              <span class="day-name">{{ day.dayName }}</span>
              <span class="day-number" [class.today-number]="day.isToday">{{ day.dayNumber }}</span>
            </div>
          }
        </div>

        <div class="time-grid">
          @for (hour of hours; track hour) {
            <div class="time-row">
              <div class="time-label">{{ hour }}</div>
              @for (day of weekDays(); track day.date.toISOString()) {
                <div class="time-slot" [class.today]="day.isToday" (click)="openSlot(day, hour)">
                  @for (treino of getTreinosForSlot(day.date, hour); track treino.id) {
                    <div class="treino-card" [class]="treino.status.toLowerCase()" (click)="openTraining(treino, $event)">
                      <span class="treino-aluno">{{ treino.alunoNome }}</span>
                      <span class="treino-tipo">{{ treino.tipo }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      </div>

      @if (showModal()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal-panel" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ modalMode() === 'create' ? 'Novo Treino' : modalMode() === 'edit' ? 'Editar Treino' : 'Detalhes do Treino' }}</h2>
              <button class="close-btn" (click)="closeModal()">&#215;</button>
            </div>

            @if (modalMode() === 'detail') {
              <div class="modal-body">
                <div class="detail-grid">
                  <div class="detail-row">
                    <span class="detail-label">Aluno</span>
                    <span class="detail-value">{{ selectedTreino()?.alunoNome }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Data</span>
                    <span class="detail-value">{{ selectedTreino()?.data }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Horario</span>
                    <span class="detail-value">{{ selectedTreino()?.horario }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Tipo</span>
                    <span class="detail-value">{{ selectedTreino()?.tipo }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Status</span>
                    <span class="status-badge" [class]="selectedTreino()?.status?.toLowerCase()">{{ selectedTreino()?.status }}</span>
                  </div>
                </div>

                @if (selectedTreino()?.descricao) {
                  <div class="detail-section">
                    <span class="section-label">Descricao</span>
                    <p class="detail-desc">{{ selectedTreino()?.descricao }}</p>
                  </div>
                }

                @if (selectedTreino()?.exercicios?.length) {
                  <div class="detail-section">
                    <span class="section-label">Exercicios ({{ selectedTreino()?.exercicios?.length }})</span>
                    <div class="exercises-list">
                      @for (ex of selectedTreino()?.exercicios || []; track ex.id) {
                        <div class="exercise-row">
                          <div class="exercise-row-left">
                            <span class="exercise-index">{{ $index + 1 }}</span>
                            <div class="exercise-info">
                              <span class="ex-name">{{ ex.nome }}</span>
                              <span class="ex-group">{{ ex.grupoMuscular }}</span>
                            </div>
                          </div>
                          <span class="ex-detail">{{ ex.series }}x{{ ex.repeticoes }} {{ ex.carga }}kg</span>
                        </div>
                      }
                    </div>
                  </div>
                }

                @if (selectedTreino()?.observacoes) {
                  <div class="detail-section">
                    <span class="section-label">Observacoes</span>
                    <p class="detail-desc">{{ selectedTreino()?.observacoes }}</p>
                  </div>
                }

                <div class="modal-actions">
                  <button class="btn-secondary" (click)="duplicateTraining()">Duplicar</button>
                  <button class="btn-secondary" (click)="editFromDetail()">Editar</button>
                  <button class="btn-danger-sm" (click)="deleteTraining()">Excluir</button>
                </div>
              </div>
            } @else {
              <div class="modal-tabs">
                <button class="tab-btn" [class.active]="activeTab() === 'info'" (click)="activeTab.set('info')">Informacoes</button>
                <button class="tab-btn" [class.active]="activeTab() === 'exercises'" (click)="activeTab.set('exercises')">
                  Exercicios
                  @if (formData.exercicios.length > 0) {
                    <span class="tab-count">{{ formData.exercicios.length }}</span>
                  }
                </button>
              </div>

              @if (activeTab() === 'info') {
                <div class="modal-body">
                  <div class="form-section">
                    <label class="form-label">Aluno</label>
                    <select class="form-select" [(ngModel)]="formData.alunoId" (ngModelChange)="onAlunoChange()">
                      <option value="">Selecione o aluno</option>
                      @for (aluno of alunos; track aluno.id) {
                        <option [value]="aluno.id">{{ aluno.nome }}</option>
                      }
                    </select>
                  </div>

                  @if (selectedAluno()) {
                    <div class="aluno-info-card">
                      <div class="aluno-info-grid">
                        <div class="aluno-info-item">
                          <span class="aluno-info-key">Plano</span>
                          <span class="aluno-info-val">{{ selectedAluno()?.plano }}</span>
                        </div>
                        <div class="aluno-info-item">
                          <span class="aluno-info-key">Telefone</span>
                          <span class="aluno-info-val">{{ selectedAluno()?.telefone }}</span>
                        </div>
                        <div class="aluno-info-item">
                          <span class="aluno-info-key">Peso</span>
                          <span class="aluno-info-val">{{ selectedAluno()?.peso }}kg</span>
                        </div>
                        <div class="aluno-info-item">
                          <span class="aluno-info-key">Altura</span>
                          <span class="aluno-info-val">{{ selectedAluno()?.altura }}</span>
                        </div>
                      </div>
                      @if (selectedAluno()?.observacoes) {
                        <div class="aluno-obs">{{ selectedAluno()?.observacoes }}</div>
                      }
                    </div>
                  }

                  <div class="form-section">
                    <label class="form-label">Tipo de Treino</label>
                    <input class="form-input" [(ngModel)]="formData.tipo" placeholder="Ex: Peito e Triceps, Pernas, Full Body...">
                  </div>

                  <div class="form-row-2">
                    <div class="form-section">
                      <label class="form-label">Status</label>
                      <select class="form-select" [(ngModel)]="formData.status">
                        <option value="Agendado">Agendado</option>
                        <option value="Concluido">Concluido</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </div>
                    <div class="form-section">
                      <label class="form-label">Data</label>
                      <input class="form-input" type="text" [value]="formData.data" (input)="formData.data = $any($event.target).value" placeholder="DD/MM/AAAA">
                    </div>
                  </div>

                  <div class="form-section">
                    <label class="form-label">Descricao</label>
                    <textarea class="form-textarea" [(ngModel)]="formData.descricao" rows="2" placeholder="Descricao do treino..."></textarea>
                  </div>

                  <div class="form-section">
                    <label class="form-label">Observacoes</label>
                    <textarea class="form-textarea" [(ngModel)]="formData.observacoes" rows="2" placeholder="Observacoes adicionais..."></textarea>
                  </div>

                  <div class="modal-actions">
                    <button class="btn-secondary" (click)="closeModal()">Cancelar</button>
                    <button class="btn-primary" (click)="activeTab.set('exercises')">Proximo &#8594;</button>
                  </div>
                </div>
              }

              @if (activeTab() === 'exercises') {
                <div class="modal-body exercise-layout">
                  <div class="exercise-browser">
                    <input class="exercise-search" type="text" placeholder="Buscar exercicio..." [(ngModel)]="searchExerciseTerm">

                    <div class="grupo-grid">
                      @for (grupo of gruposMusculares; track grupo) {
                        <button class="grupo-card" [class.active]="selectedGrupoMuscular() === grupo" (click)="toggleGrupoMuscular(grupo)">
                          <span class="grupo-name">{{ grupo }}</span>
                        </button>
                      }
                    </div>

                    @if (selectedGrupoMuscular()) {
                      <div class="categoria-list">
                        @for (cat of getCategoriasForGrupo(selectedGrupoMuscular()!); track cat) {
                          <button class="categoria-btn" [class.active]="selectedCategoria() === cat" (click)="toggleCategoria(cat)">
                            <span>{{ cat }}</span>
                            <span class="categoria-count">{{ getExerciciosForCategoria(selectedGrupoMuscular()!, cat).length }}</span>
                          </button>
                        }
                      </div>

                      <div class="exercicio-lib-list">
                        @for (ex of getFilteredExercicios(); track ex.id) {
                          <div class="exercicio-lib-item">
                            <div class="exercicio-lib-left">
                              <button class="fav-btn" [class.favorited]="ex.favorito" (click)="toggleFavorite(ex.id)">&#9733;</button>
                              <div class="exercicio-lib-info">
                                <span class="exercicio-lib-name">{{ ex.nome }}</span>
                                <span class="exercicio-lib-meta">{{ ex.categoria }}</span>
                              </div>
                            </div>
                            <button class="add-ex-btn" (click)="addExercicioFromLib(ex)">+</button>
                          </div>
                        }
                        @if (getFilteredExercicios().length === 0) {
                          <div class="empty-lib">
                            <p>Nenhum exercicio encontrado</p>
                          </div>
                        }
                      </div>
                    }
                  </div>

                  <div class="exercise-panel">
                    <div class="exercise-panel-header">
                      <span class="exercise-panel-title">Exercicios Adicionados</span>
                      <span class="exercise-panel-count">{{ formData.exercicios.length }}</span>
                    </div>

                    <div class="exercise-panel-list">
                      @if (formData.exercicios.length === 0) {
                        <div class="empty-exercises">
                          <span class="empty-icon">&#9881;</span>
                          <p>Nenhum exercicio adicionado</p>
                          <span class="empty-hint">Selecione um grupo muscular ao lado e adicione exercicios</span>
                        </div>
                      }

                      @for (ex of formData.exercicios; track ex.id; let i = $index) {
                        <div class="exercise-edit-card">
                          <div class="exercise-edit-header">
                            <div class="exercise-edit-left">
                              <span class="exercise-edit-index">{{ i + 1 }}</span>
                              <div>
                                <span class="exercise-edit-name">{{ ex.nome }}</span>
                                <span class="exercise-edit-group">{{ ex.grupoMuscular }}</span>
                              </div>
                            </div>
                            <div class="exercise-edit-actions">
                              <button class="move-btn" [disabled]="i === 0" (click)="moveExercicioUp(i)">&#9650;</button>
                              <button class="move-btn" [disabled]="i === formData.exercicios.length - 1" (click)="moveExercicioDown(i)">&#9660;</button>
                              <button class="del-btn" (click)="removeExercicio(i)">&#215;</button>
                            </div>
                          </div>
                          <div class="exercise-edit-fields">
                            <div class="ex-field">
                              <label class="ex-field-label">Series</label>
                              <input class="ex-field-input" type="number" [(ngModel)]="ex.series" min="1">
                            </div>
                            <div class="ex-field">
                              <label class="ex-field-label">Reps</label>
                              <input class="ex-field-input" [(ngModel)]="ex.repeticoes" placeholder="12">
                            </div>
                            <div class="ex-field">
                              <label class="ex-field-label">Carga</label>
                              <input class="ex-field-input" [(ngModel)]="ex.carga" placeholder="kg">
                            </div>
                            <div class="ex-field">
                              <label class="ex-field-label">Descanso</label>
                              <input class="ex-field-input" [(ngModel)]="ex.descanso" placeholder="60s">
                            </div>
                          </div>
                          <div class="exercise-edit-obs">
                            <input class="ex-obs-input" [(ngModel)]="ex.observacoes" placeholder="Observacao...">
                          </div>
                        </div>
                      }
                    </div>

                    <div class="modal-actions">
                      <button class="btn-secondary" (click)="activeTab.set('info')">&#8592; Voltar</button>
                      <button class="btn-primary" (click)="saveTraining()">{{ modalMode() === 'edit' ? 'Salvar' : 'Agendar' }}</button>
                    </div>
                  </div>
                </div>
              }
            }
          </div>
        </div>
      }

      <div class="history-section">
        <div class="section-header-row">
          <h2>Historico de Treinos</h2>
          <span class="count-badge">{{ treinos().length }} treinos</span>
        </div>
        <div class="history-list">
          @for (treino of treinos(); track treino.id) {
            <div class="history-item" (click)="openTraining(treino, $event)">
              <div class="history-date">
                <span class="history-day">{{ treino.data }}</span>
                <span class="history-time">{{ treino.horario }}</span>
              </div>
              <div class="history-info">
                <span class="history-aluno">{{ treino.alunoNome }}</span>
                <span class="history-tipo">{{ treino.tipo }}</span>
              </div>
              <span class="status-badge" [class]="treino.status.toLowerCase()">{{ treino.status }}</span>
            </div>
          }
          @if (treinos().length === 0) {
            <div class="empty-state">
              <span class="empty-icon">&#9671;</span>
              <p>Nenhum treino encontrado</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :host {
      --c-bg: #09090b;
      --c-bg-elevated: #111113;
      --c-bg-surface: #18181b;
      --c-bg-hover: #1e1e22;
      --c-primary: #c8ff00;
      --c-primary-hover: #d4ff33;
      --c-text: #fafafa;
      --c-text-secondary: #a1a1aa;
      --c-text-muted: #52525b;
      --c-text-dim: #3f3f46;
      --c-border: #1e1e22;
      --c-border-subtle: #18181b;
      --c-success: #a1a1aa;
      --c-danger: #a1a1aa;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .agenda-page { padding: 2rem; max-width: 1400px; margin: 0 auto; font-family: 'Inter', -apple-system, sans-serif; background: var(--c-bg); color: var(--c-text); min-height: 100vh; }

    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: var(--c-text); margin: 0; letter-spacing: -0.02em; }
    .accent { color: var(--c-primary); }
    .subtitle { font-size: 13px; color: var(--c-text-muted); margin: 4px 0 0; }
    .header-actions { display: flex; gap: 8px; }

    .btn-primary { display: inline-flex; align-items: center; height: 36px; padding: 0 16px; background: var(--c-primary); color: #09090b; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 200ms ease; }
    .btn-primary:hover { background: var(--c-primary-hover); }
    .btn-secondary { display: inline-flex; align-items: center; height: 36px; padding: 0 16px; background: var(--c-bg-surface); color: var(--c-text-secondary); border: 1px solid var(--c-border); border-radius: 8px; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 200ms ease; }
    .btn-secondary:hover { color: var(--c-text); border-color: var(--c-text-muted); }
    .btn-ghost { display: inline-flex; align-items: center; height: 36px; padding: 0 16px; color: var(--c-text-muted); font-size: 13px; font-weight: 600; border-radius: 8px; border: none; background: none; font-family: inherit; cursor: pointer; transition: all 200ms ease; }
    .btn-ghost:hover { color: var(--c-text-secondary); background: var(--c-bg-surface); }
    .btn-danger-sm { display: inline-flex; align-items: center; height: 36px; padding: 0 16px; background: var(--c-bg-surface); color: var(--c-text-muted); border: 1px solid var(--c-border); border-radius: 8px; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 200ms ease; }
    .btn-danger-sm:hover { color: var(--c-text-secondary); border-color: var(--c-text-muted); }

    .week-nav { display: flex; align-items: center; justify-content: center; gap: 2rem; margin-bottom: 2rem; }
    .week-nav-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: var(--c-bg-elevated); border: 1px solid var(--c-border); border-radius: 8px; color: var(--c-text-secondary); font-size: 20px; font-family: inherit; cursor: pointer; transition: all 200ms ease; }
    .week-nav-btn:hover { border-color: var(--c-primary); color: var(--c-primary); }
    .nav-arrow { font-size: 1.25rem; font-weight: 300; }
    .week-info { display: flex; flex-direction: column; align-items: center; gap: 2px; }
    .week-label { font-size: 14px; font-weight: 600; color: var(--c-text); }
    .week-range { font-size: 12px; color: var(--c-text-muted); }

    .calendar-grid { background: var(--c-bg-elevated); border: 1px solid var(--c-border); border-radius: 12px; overflow: hidden; margin-bottom: 2rem; }
    .day-headers { display: grid; grid-template-columns: 60px repeat(7, 1fr); border-bottom: 1px solid var(--c-border); }
    .day-header-corner { border-right: 1px solid var(--c-border); }
    .day-header { padding: 12px 8px; text-align: center; display: flex; flex-direction: column; gap: 2px; }
    .day-header.today { background: rgba(200,255,0,0.04); }
    .day-name { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--c-text-muted); }
    .day-number { font-size: 16px; font-weight: 700; color: var(--c-text-secondary); }
    .today-number { color: var(--c-primary); }

    .time-grid { max-height: 500px; overflow-y: auto; }
    .time-row { display: grid; grid-template-columns: 60px repeat(7, 1fr); border-bottom: 1px solid var(--c-border-subtle); }
    .time-label { padding: 8px; font-size: 11px; font-weight: 500; color: var(--c-text-muted); text-align: right; padding-right: 12px; border-right: 1px solid var(--c-border); display: flex; align-items: flex-start; justify-content: flex-end; padding-top: 4px; font-variant-numeric: tabular-nums; }
    .time-slot { min-height: 48px; padding: 4px; border-right: 1px solid var(--c-border-subtle); cursor: pointer; transition: background 200ms ease; }
    .time-slot:hover { background: var(--c-bg-hover); }
    .time-slot.today { background: rgba(200,255,0,0.01); }

    .treino-card { padding: 4px 8px; background: rgba(200,255,0,0.08); border-left: 2px solid var(--c-primary); border-radius: 4px; cursor: pointer; transition: all 200ms ease; }
    .treino-card:hover { background: rgba(200,255,0,0.12); }
    .treino-card.concluido { background: rgba(161,161,170,0.08); border-left-color: var(--c-text-muted); }
    .treino-card.cancelado { background: rgba(161,161,170,0.05); border-left-color: var(--c-text-dim); opacity: 0.5; }
    .treino-aluno { display: block; font-size: 11px; font-weight: 600; color: var(--c-text); }
    .treino-tipo { display: block; font-size: 10px; color: var(--c-text-muted); }

    .history-section { background: var(--c-bg-elevated); border: 1px solid var(--c-border); border-radius: 12px; overflow: hidden; }
    .section-header-row { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--c-border); }
    .section-header-row h2 { font-size: 14px; font-weight: 600; color: var(--c-text); margin: 0; }
    .count-badge { font-size: 11px; font-weight: 600; color: var(--c-text-muted); background: var(--c-bg-surface); padding: 4px 10px; border-radius: 4px; }
    .history-list { max-height: 400px; overflow-y: auto; }
    .history-item { display: flex; align-items: center; gap: 16px; padding: 12px 20px; border-bottom: 1px solid var(--c-border-subtle); cursor: pointer; transition: background 200ms ease; }
    .history-item:hover { background: var(--c-bg-hover); }
    .history-date { display: flex; flex-direction: column; align-items: flex-end; min-width: 80px; }
    .history-day { font-size: 12px; font-weight: 600; color: var(--c-text-secondary); }
    .history-time { font-size: 11px; color: var(--c-text-muted); font-variant-numeric: tabular-nums; }
    .history-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .history-aluno { font-size: 13px; font-weight: 600; color: var(--c-text); }
    .history-tipo { font-size: 12px; color: var(--c-text-muted); }

    .status-badge { display: inline-flex; align-items: center; height: 22px; padding: 0 8px; font-size: 11px; font-weight: 600; border-radius: 4px; }
    .status-badge.agendado { background: rgba(200,255,0,0.1); color: var(--c-primary); }
    .status-badge.concluido { background: rgba(161,161,170,0.1); color: var(--c-text-secondary); }
    .status-badge.cancelado { background: rgba(161,161,170,0.06); color: var(--c-text-muted); }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 1000; display: flex; justify-content: flex-end; }
    .modal-panel { width: 680px; max-width: 100%; height: 100vh; background: var(--c-bg); border-left: 1px solid var(--c-border); display: flex; flex-direction: column; animation: slideIn 200ms cubic-bezier(0.4,0,0.2,1); }
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--c-border); }
    .modal-header h2 { font-size: 16px; font-weight: 600; color: var(--c-text); margin: 0; }
    .close-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; color: var(--c-text-muted); font-size: 20px; border: none; background: none; cursor: pointer; transition: all 200ms ease; }
    .close-btn:hover { background: var(--c-bg-surface); color: var(--c-text); }

    .modal-tabs { display: flex; border-bottom: 1px solid var(--c-border); }
    .tab-btn { flex: 1; padding: 12px; font-size: 13px; font-weight: 600; color: var(--c-text-muted); background: none; border: none; border-bottom: 2px solid transparent; font-family: inherit; cursor: pointer; transition: all 200ms ease; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .tab-btn:hover { color: var(--c-text-secondary); }
    .tab-btn.active { color: var(--c-primary); border-bottom-color: var(--c-primary); }
    .tab-count { font-size: 11px; font-weight: 600; background: rgba(200,255,0,0.12); color: var(--c-primary); padding: 2px 7px; border-radius: 10px; }

    .modal-body { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

    .form-section { display: flex; flex-direction: column; gap: 6px; }
    .form-label { font-size: 12px; font-weight: 600; color: var(--c-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
    .form-select, .form-input, .form-textarea { width: 100%; padding: 10px 12px; background: var(--c-bg-surface); border: 1px solid var(--c-border); border-radius: 8px; color: var(--c-text); font-size: 13px; font-family: inherit; transition: border-color 200ms ease; }
    .form-select:focus, .form-input:focus, .form-textarea:focus { border-color: var(--c-primary); outline: none; }
    .form-textarea { resize: vertical; min-height: 60px; }
    .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    .aluno-info-card { padding: 12px; background: var(--c-bg-surface); border: 1px solid var(--c-border); border-radius: 8px; }
    .aluno-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .aluno-info-item { display: flex; flex-direction: column; gap: 2px; }
    .aluno-info-key { font-size: 11px; color: var(--c-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .aluno-info-val { font-size: 13px; font-weight: 600; color: var(--c-text); }
    .aluno-obs { font-size: 12px; color: var(--c-text-muted); margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--c-border); }

    .modal-actions { display: flex; gap: 8px; padding-top: 16px; border-top: 1px solid var(--c-border); }

    .detail-grid { display: flex; flex-direction: column; gap: 0; }
    .detail-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--c-border-subtle); }
    .detail-label { font-size: 12px; color: var(--c-text-muted); }
    .detail-value { font-size: 13px; font-weight: 600; color: var(--c-text); }
    .detail-section { display: flex; flex-direction: column; gap: 8px; }
    .section-label { font-size: 12px; font-weight: 600; color: var(--c-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
    .detail-desc { font-size: 13px; color: var(--c-text-secondary); line-height: 1.5; }
    .exercises-list { display: flex; flex-direction: column; gap: 4px; }
    .exercise-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: var(--c-bg-surface); border: 1px solid var(--c-border); border-radius: 6px; }
    .exercise-row-left { display: flex; align-items: center; gap: 10px; }
    .exercise-index { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: var(--c-text-muted); background: var(--c-bg-elevated); border-radius: 4px; }
    .exercise-info { display: flex; flex-direction: column; gap: 1px; }
    .ex-name { font-size: 13px; font-weight: 600; color: var(--c-text); }
    .ex-group { font-size: 11px; color: var(--c-text-muted); }
    .ex-detail { font-size: 12px; color: var(--c-text-secondary); font-variant-numeric: tabular-nums; }

    .exercise-layout { display: flex; gap: 0; padding: 0; overflow: hidden; height: calc(100vh - 130px); }
    .exercise-browser { width: 40%; border-right: 1px solid var(--c-border); display: flex; flex-direction: column; overflow-y: auto; }
    .exercise-panel { width: 60%; display: flex; flex-direction: column; }
    .exercise-panel-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--c-border); }
    .exercise-panel-title { font-size: 13px; font-weight: 600; color: var(--c-text); }
    .exercise-panel-count { font-size: 11px; font-weight: 600; color: var(--c-primary); background: rgba(200,255,0,0.1); padding: 2px 8px; border-radius: 10px; }
    .exercise-panel-list { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; }

    .exercise-search { width: 100%; padding: 10px 14px; background: var(--c-bg-surface); border: none; border-bottom: 1px solid var(--c-border); color: var(--c-text); font-size: 13px; font-family: inherit; }
    .exercise-search:focus { outline: none; border-bottom-color: var(--c-primary); }
    .exercise-search::placeholder { color: var(--c-text-dim); }

    .grupo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 12px; }
    .grupo-card { padding: 10px 8px; background: var(--c-bg-surface); border: 1px solid var(--c-border); border-radius: 8px; color: var(--c-text-secondary); font-size: 11px; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 200ms ease; text-align: center; }
    .grupo-card:hover { border-color: var(--c-text-dim); color: var(--c-text); }
    .grupo-card.active { border-color: var(--c-primary); color: var(--c-primary); background: rgba(200,255,0,0.06); }

    .categoria-list { display: flex; flex-direction: column; padding: 0 12px; gap: 4px; }
    .categoria-btn { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--c-bg-elevated); border: 1px solid var(--c-border); border-radius: 6px; color: var(--c-text-secondary); font-size: 12px; font-weight: 500; font-family: inherit; cursor: pointer; transition: all 200ms ease; }
    .categoria-btn:hover { border-color: var(--c-text-dim); color: var(--c-text); }
    .categoria-btn.active { border-color: var(--c-primary); color: var(--c-primary); }
    .categoria-count { font-size: 10px; font-weight: 600; color: var(--c-text-dim); background: var(--c-bg-surface); padding: 2px 6px; border-radius: 4px; }

    .exercicio-lib-list { display: flex; flex-direction: column; padding: 12px; gap: 4px; flex: 1; overflow-y: auto; }
    .exercicio-lib-item { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-radius: 6px; transition: background 200ms ease; }
    .exercicio-lib-item:hover { background: var(--c-bg-hover); }
    .exercicio-lib-left { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
    .fav-btn { background: none; border: none; color: var(--c-text-dim); font-size: 14px; cursor: pointer; transition: color 200ms ease; padding: 0 2px; }
    .fav-btn:hover, .fav-btn.favorited { color: var(--c-primary); }
    .exercicio-lib-info { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
    .exercicio-lib-name { font-size: 12px; font-weight: 600; color: var(--c-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .exercicio-lib-meta { font-size: 10px; color: var(--c-text-dim); }
    .add-ex-btn { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; background: var(--c-bg-surface); border: 1px solid var(--c-border); border-radius: 6px; color: var(--c-primary); font-size: 16px; font-weight: 600; cursor: pointer; transition: all 200ms ease; flex-shrink: 0; }
    .add-ex-btn:hover { background: rgba(200,255,0,0.1); border-color: var(--c-primary); }

    .empty-lib { padding: 24px; text-align: center; }
    .empty-lib p { font-size: 12px; color: var(--c-text-dim); }

    .empty-exercises { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; text-align: center; gap: 6px; }
    .empty-exercises .empty-icon { font-size: 2rem; color: var(--c-text-dim); }
    .empty-exercises p { font-size: 13px; font-weight: 600; color: var(--c-text-muted); margin: 0; }
    .empty-hint { font-size: 11px; color: var(--c-text-dim); }

    .exercise-edit-card { background: var(--c-bg-surface); border: 1px solid var(--c-border); border-radius: 8px; overflow: hidden; }
    .exercise-edit-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-bottom: 1px solid var(--c-border-subtle); }
    .exercise-edit-left { display: flex; align-items: center; gap: 10px; }
    .exercise-edit-index { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: var(--c-primary); background: rgba(200,255,0,0.1); border-radius: 4px; }
    .exercise-edit-name { font-size: 12px; font-weight: 600; color: var(--c-text); display: block; }
    .exercise-edit-group { font-size: 10px; color: var(--c-text-dim); display: block; }
    .exercise-edit-actions { display: flex; gap: 4px; }
    .move-btn { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: none; border: 1px solid var(--c-border); border-radius: 4px; color: var(--c-text-muted); font-size: 8px; cursor: pointer; transition: all 200ms ease; }
    .move-btn:hover:not(:disabled) { border-color: var(--c-text-dim); color: var(--c-text); }
    .move-btn:disabled { opacity: 0.3; cursor: default; }
    .del-btn { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: none; border: 1px solid var(--c-border); border-radius: 4px; color: var(--c-text-muted); font-size: 14px; cursor: pointer; transition: all 200ms ease; }
    .del-btn:hover { border-color: var(--c-text-dim); color: var(--c-text); }

    .exercise-edit-fields { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; padding: 10px 12px; }
    .ex-field { display: flex; flex-direction: column; gap: 3px; }
    .ex-field-label { font-size: 10px; font-weight: 600; color: var(--c-text-dim); text-transform: uppercase; letter-spacing: 0.05em; }
    .ex-field-input { width: 100%; padding: 6px 8px; background: var(--c-bg-elevated); border: 1px solid var(--c-border); border-radius: 4px; color: var(--c-text); font-size: 12px; font-family: inherit; text-align: center; }
    .ex-field-input:focus { border-color: var(--c-primary); outline: none; }

    .exercise-edit-obs { padding: 0 12px 10px; }
    .ex-obs-input { width: 100%; padding: 6px 8px; background: var(--c-bg-elevated); border: 1px solid var(--c-border); border-radius: 4px; color: var(--c-text-secondary); font-size: 11px; font-family: inherit; }
    .ex-obs-input:focus { border-color: var(--c-primary); outline: none; }
    .ex-obs-input::placeholder { color: var(--c-text-dim); }

    .empty-state { padding: 48px; text-align: center; }
    .empty-state .empty-icon { font-size: 2rem; color: var(--c-text-dim); display: block; margin-bottom: 8px; }
    .empty-state p { font-size: 13px; color: var(--c-text-muted); margin: 0; }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--c-border); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--c-text-dim); }

    @media (max-width: 768px) {
      .agenda-page { padding: 1rem; }
      .page-header { flex-direction: column; gap: 1rem; }
      .day-headers, .time-row { grid-template-columns: 50px repeat(7, 1fr); }
      .day-name { font-size: 9px; }
      .day-number { font-size: 13px; }
      .modal-panel { width: 100%; }
      .exercise-layout { flex-direction: column; }
      .exercise-browser, .exercise-panel { width: 100%; }
      .exercise-browser { max-height: 50vh; border-right: none; border-bottom: 1px solid var(--c-border); }
      .grupo-grid { grid-template-columns: repeat(3, 1fr); }
    }
  `]
})
export class AgendaComponent implements OnInit {
  private router = inject(Router);
  private treinosService = inject(TreinosService);
  private authService = inject(AuthService);
  showModal = signal(false);
  modalMode = signal<'create' | 'edit' | 'detail'>('create');
  activeTab = signal<'info' | 'exercises'>('info');
  selectedTreino = signal<Treino | null>(null);
  selectedAluno = signal<Aluno | null>(null);
  currentWeekStart = signal<Date>(new Date());
  searchExerciseTerm = signal('');
  selectedGrupoMuscular = signal<string | null>(null);
  selectedCategoria = signal<string | null>(null);
  favoriteIds = signal<Set<string>>(new Set());

  formData = {
    alunoId: '',
    tipo: '',
    descricao: '',
    observacoes: '',
    status: 'Agendado',
    data: '',
    exercicios: [] as ExercicioTreino[]
  };

  hours = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  gruposMusculares = ['Peito', 'Costas', 'Ombros', 'Biceps', 'Triceps', 'Antebracos', 'Pernas', 'Abdomen', 'Cardio'];

  alunos: Aluno[] = [];

  exercicioLib: ExercicioLib[] = [
    { id: 'pe01', nome: 'Supino Reto Barra', grupoMuscular: 'Peito', categoria: 'Supinos', favorito: false },
    { id: 'pe02', nome: 'Supino Reto Halteres', grupoMuscular: 'Peito', categoria: 'Supinos', favorito: false },
    { id: 'pe03', nome: 'Supino Reto Maquina', grupoMuscular: 'Peito', categoria: 'Supinos', favorito: false },
    { id: 'pe04', nome: 'Supino Inclinado Barra', grupoMuscular: 'Peito', categoria: 'Supinos', favorito: true },
    { id: 'pe05', nome: 'Supino Inclinado Halteres', grupoMuscular: 'Peito', categoria: 'Supinos', favorito: true },
    { id: 'pe06', nome: 'Supino Inclinado Maquina', grupoMuscular: 'Peito', categoria: 'Supinos', favorito: false },
    { id: 'pe07', nome: 'Supino Declinado Barra', grupoMuscular: 'Peito', categoria: 'Supinos', favorito: false },
    { id: 'pe08', nome: 'Supino Declinado Halteres', grupoMuscular: 'Peito', categoria: 'Supinos', favorito: false },
    { id: 'pe09', nome: 'Supino Declinado Smith', grupoMuscular: 'Peito', categoria: 'Supinos', favorito: false },
    { id: 'pe10', nome: 'Supino Smith', grupoMuscular: 'Peito', categoria: 'Supinos', favorito: false },
    { id: 'pe11', nome: 'Supino com Pegada Fechada', grupoMuscular: 'Peito', categoria: 'Supinos', favorito: false },
    { id: 'pe12', nome: 'Supino Inclinado Smith', grupoMuscular: 'Peito', categoria: 'Supinos', favorito: false },
    { id: 'pe13', nome: 'Crucifixo Reto', grupoMuscular: 'Peito', categoria: 'Fly/Crucifixo', favorito: false },
    { id: 'pe14', nome: 'Crucifixo Inclinado', grupoMuscular: 'Peito', categoria: 'Fly/Crucifixo', favorito: false },
    { id: 'pe15', nome: 'Crucifixo Declinado', grupoMuscular: 'Peito', categoria: 'Fly/Crucifixo', favorito: false },
    { id: 'pe16', nome: 'Peck Deck', grupoMuscular: 'Peito', categoria: 'Fly/Crucifixo', favorito: true },
    { id: 'pe17', nome: 'Fly Maquina', grupoMuscular: 'Peito', categoria: 'Fly/Crucifixo', favorito: false },
    { id: 'pe18', nome: 'Fly Cabo Reto', grupoMuscular: 'Peito', categoria: 'Fly/Crucifixo', favorito: false },
    { id: 'pe19', nome: 'Fly Cabo Inclinado', grupoMuscular: 'Peito', categoria: 'Fly/Crucifixo', favorito: false },
    { id: 'pe20', nome: 'Cross Over Alto', grupoMuscular: 'Peito', categoria: 'Fly/Crucifixo', favorito: false },
    { id: 'pe21', nome: 'Cross Over Medio', grupoMuscular: 'Peito', categoria: 'Fly/Crucifixo', favorito: false },
    { id: 'pe22', nome: 'Cross Over Baixo', grupoMuscular: 'Peito', categoria: 'Fly/Crucifixo', favorito: false },
    { id: 'pe23', nome: 'Crossover Unilateral', grupoMuscular: 'Peito', categoria: 'Fly/Crucifixo', favorito: false },
    { id: 'pe24', nome: 'Flexao Tradicional', grupoMuscular: 'Peito', categoria: 'Peso Corporal', favorito: false },
    { id: 'pe25', nome: 'Flexao Inclinada', grupoMuscular: 'Peito', categoria: 'Peso Corporal', favorito: false },
    { id: 'pe26', nome: 'Flexao Declinada', grupoMuscular: 'Peito', categoria: 'Peso Corporal', favorito: false },
    { id: 'pe27', nome: 'Flexao Diamante', grupoMuscular: 'Peito', categoria: 'Peso Corporal', favorito: false },
    { id: 'pe28', nome: 'Flexao Explosiva', grupoMuscular: 'Peito', categoria: 'Peso Corporal', favorito: false },
    { id: 'pe29', nome: 'Flexao com Aplauso', grupoMuscular: 'Peito', categoria: 'Peso Corporal', favorito: false },
    { id: 'pe30', nome: 'Flexao com Pes Elevados', grupoMuscular: 'Peito', categoria: 'Peso Corporal', favorito: false },
    { id: 'pe31', nome: 'Flexao em Arco', grupoMuscular: 'Peito', categoria: 'Peso Corporal', favorito: false },
    { id: 'pe32', nome: 'Flexao com Apoio Unilateral', grupoMuscular: 'Peito', categoria: 'Peso Corporal', favorito: false },
    { id: 'pe33', nome: 'Paralelas', grupoMuscular: 'Peito', categoria: 'Outros', favorito: false },
    { id: 'pe34', nome: 'Paralelas com Peso', grupoMuscular: 'Peito', categoria: 'Outros', favorito: false },
    { id: 'pe35', nome: 'Pullover Halteres', grupoMuscular: 'Peito', categoria: 'Outros', favorito: false },
    { id: 'pe36', nome: 'Pullover Maquina', grupoMuscular: 'Peito', categoria: 'Outros', favorito: false },
    { id: 'pe37', nome: 'Pullover Cabo', grupoMuscular: 'Peito', categoria: 'Outros', favorito: false },
    { id: 'pe38', nome: 'Dips Maquina', grupoMuscular: 'Peito', categoria: 'Outros', favorito: false },

    { id: 'co01', nome: 'Puxada Frontal', grupoMuscular: 'Costas', categoria: 'Puxadas', favorito: true },
    { id: 'co02', nome: 'Puxada Pronada', grupoMuscular: 'Costas', categoria: 'Puxadas', favorito: false },
    { id: 'co03', nome: 'Puxada Supinada', grupoMuscular: 'Costas', categoria: 'Puxadas', favorito: false },
    { id: 'co04', nome: 'Puxada Triangulo', grupoMuscular: 'Costas', categoria: 'Puxadas', favorito: false },
    { id: 'co05', nome: 'Puxada Aberta', grupoMuscular: 'Costas', categoria: 'Puxadas', favorito: false },
    { id: 'co06', nome: 'Puxada Fechada', grupoMuscular: 'Costas', categoria: 'Puxadas', favorito: false },
    { id: 'co07', nome: 'Puxada Alta Pronada', grupoMuscular: 'Costas', categoria: 'Puxadas', favorito: false },
    { id: 'co08', nome: 'Puxada Alta Supinada', grupoMuscular: 'Costas', categoria: 'Puxadas', favorito: false },
    { id: 'co09', nome: 'Pulldown Neutro', grupoMuscular: 'Costas', categoria: 'Puxadas', favorito: false },
    { id: 'co10', nome: 'Remada Curvada Barra', grupoMuscular: 'Costas', categoria: 'Remadas', favorito: true },
    { id: 'co11', nome: 'Remada Curvada Halteres', grupoMuscular: 'Costas', categoria: 'Remadas', favorito: false },
    { id: 'co12', nome: 'Remada Cavalinho', grupoMuscular: 'Costas', categoria: 'Remadas', favorito: false },
    { id: 'co13', nome: 'Remada Unilateral Halteres', grupoMuscular: 'Costas', categoria: 'Remadas', favorito: false },
    { id: 'co14', nome: 'Remada Unilateral Cabo', grupoMuscular: 'Costas', categoria: 'Remadas', favorito: false },
    { id: 'co15', nome: 'Remada Maquina', grupoMuscular: 'Costas', categoria: 'Remadas', favorito: false },
    { id: 'co16', nome: 'Remada Pronada', grupoMuscular: 'Costas', categoria: 'Remadas', favorito: false },
    { id: 'co17', nome: 'Remada Supinada', grupoMuscular: 'Costas', categoria: 'Remadas', favorito: false },
    { id: 'co18', nome: 'Remada Triangulo', grupoMuscular: 'Costas', categoria: 'Remadas', favorito: false },
    { id: 'co19', nome: 'Remada na Polia Baixa', grupoMuscular: 'Costas', categoria: 'Remadas', favorito: false },
    { id: 'co20', nome: 'Remada na Polia Alta', grupoMuscular: 'Costas', categoria: 'Remadas', favorito: false },
    { id: 'co21', nome: 'Remada Smith', grupoMuscular: 'Costas', categoria: 'Remadas', favorito: false },
    { id: 'co22', nome: 'Remada com Barra T', grupoMuscular: 'Costas', categoria: 'Remadas', favorito: false },
    { id: 'co23', nome: 'Barra Fixa Pronada', grupoMuscular: 'Costas', categoria: 'Peso Corporal', favorito: false },
    { id: 'co24', nome: 'Barra Fixa Supinada', grupoMuscular: 'Costas', categoria: 'Peso Corporal', favorito: false },
    { id: 'co25', nome: 'Barra Fixa Neutra', grupoMuscular: 'Costas', categoria: 'Peso Corporal', favorito: false },
    { id: 'co26', nome: 'Dominada', grupoMuscular: 'Costas', categoria: 'Peso Corporal', favorito: true },
    { id: 'co27', nome: 'Dominada com Peso', grupoMuscular: 'Costas', categoria: 'Peso Corporal', favorito: false },
    { id: 'co28', nome: 'Barra Fixa Pegada Aberta', grupoMuscular: 'Costas', categoria: 'Peso Corporal', favorito: false },
    { id: 'co29', nome: 'Barra Fixa Pegada Fechada', grupoMuscular: 'Costas', categoria: 'Peso Corporal', favorito: false },
    { id: 'co30', nome: 'Australiana', grupoMuscular: 'Costas', categoria: 'Peso Corporal', favorito: false },
    { id: 'co31', nome: 'Encolhimento Barra', grupoMuscular: 'Costas', categoria: 'Outros', favorito: false },
    { id: 'co32', nome: 'Encolhimento Halteres', grupoMuscular: 'Costas', categoria: 'Outros', favorito: false },
    { id: 'co33', nome: 'Bom Dia', grupoMuscular: 'Costas', categoria: 'Outros', favorito: false },
    { id: 'co34', nome: 'Hiperextensao', grupoMuscular: 'Costas', categoria: 'Outros', favorito: false },

    { id: 'om01', nome: 'Elevacao Lateral Halteres', grupoMuscular: 'Ombros', categoria: 'Laterais', favorito: true },
    { id: 'om02', nome: 'Elevacao Lateral Maquina', grupoMuscular: 'Ombros', categoria: 'Laterais', favorito: false },
    { id: 'om03', nome: 'Elevacao Lateral Cabo', grupoMuscular: 'Ombros', categoria: 'Laterais', favorito: false },
    { id: 'om04', nome: 'Elevacao Lateral Unilateral', grupoMuscular: 'Ombros', categoria: 'Laterais', favorito: false },
    { id: 'om05', nome: 'Elevacao Lateral Sentado', grupoMuscular: 'Ombros', categoria: 'Laterais', favorito: false },
    { id: 'om06', nome: 'Elevacao Lateral Inclinado', grupoMuscular: 'Ombros', categoria: 'Laterais', favorito: false },
    { id: 'om07', nome: 'Elevacao Frontal Halteres', grupoMuscular: 'Ombros', categoria: 'Frontais', favorito: false },
    { id: 'om08', nome: 'Elevacao Frontal Barra', grupoMuscular: 'Ombros', categoria: 'Frontais', favorito: false },
    { id: 'om09', nome: 'Elevacao Frontal Cabo', grupoMuscular: 'Ombros', categoria: 'Frontais', favorito: false },
    { id: 'om10', nome: 'Elevacao Frontal Anilha', grupoMuscular: 'Ombros', categoria: 'Frontais', favorito: false },
    { id: 'om11', nome: 'Elevacao Frontal Alternada', grupoMuscular: 'Ombros', categoria: 'Frontais', favorito: false },
    { id: 'om12', nome: 'Elevacao Frontal Polia Baixa', grupoMuscular: 'Ombros', categoria: 'Frontais', favorito: false },
    { id: 'om13', nome: 'Face Pull', grupoMuscular: 'Ombros', categoria: 'Traseira', favorito: true },
    { id: 'om14', nome: 'Elevacao Posterior', grupoMuscular: 'Ombros', categoria: 'Traseira', favorito: false },
    { id: 'om15', nome: 'Reverse Fly', grupoMuscular: 'Ombros', categoria: 'Traseira', favorito: false },
    { id: 'om16', nome: 'Reverse Fly Maquina', grupoMuscular: 'Ombros', categoria: 'Traseira', favorito: false },
    { id: 'om17', nome: 'Elevacao Posterior Cabo', grupoMuscular: 'Ombros', categoria: 'Traseira', favorito: false },
    { id: 'om18', nome: 'Elevacao Posterior Halteres Sentado', grupoMuscular: 'Ombros', categoria: 'Traseira', favorito: false },
    { id: 'om19', nome: 'Press Militar Barra', grupoMuscular: 'Ombros', categoria: 'Press', favorito: true },
    { id: 'om20', nome: 'Press Militar Halteres', grupoMuscular: 'Ombros', categoria: 'Press', favorito: false },
    { id: 'om21', nome: 'Press Militar Maquina', grupoMuscular: 'Ombros', categoria: 'Press', favorito: false },
    { id: 'om22', nome: 'Press Arnold', grupoMuscular: 'Ombros', categoria: 'Press', favorito: false },
    { id: 'om23', nome: 'Desenvolvimento Maquina', grupoMuscular: 'Ombros', categoria: 'Press', favorito: false },
    { id: 'om24', nome: 'Desenvolvimento Smith', grupoMuscular: 'Ombros', categoria: 'Press', favorito: false },
    { id: 'om25', nome: 'Press com Cabo', grupoMuscular: 'Ombros', categoria: 'Press', favorito: false },
    { id: 'om26', nome: 'Limpeza e Press', grupoMuscular: 'Ombros', categoria: 'Outros', favorito: false },
    { id: 'om27', nome: 'Y Raise', grupoMuscular: 'Ombros', categoria: 'Outros', favorito: false },
    { id: 'om28', nome: 'T Raise', grupoMuscular: 'Ombros', categoria: 'Outros', favorito: false },
    { id: 'om29', nome: 'W Raise', grupoMuscular: 'Ombros', categoria: 'Outros', favorito: false },

    { id: 'bi01', nome: 'Rosca Direta Barra', grupoMuscular: 'Biceps', categoria: 'Roscas', favorito: true },
    { id: 'bi02', nome: 'Rosca Direta Halteres', grupoMuscular: 'Biceps', categoria: 'Roscas', favorito: false },
    { id: 'bi03', nome: 'Rosca Direta Barra W', grupoMuscular: 'Biceps', categoria: 'Roscas', favorito: false },
    { id: 'bi04', nome: 'Rosca Scott', grupoMuscular: 'Biceps', categoria: 'Roscas', favorito: false },
    { id: 'bi05', nome: 'Rosca Scott Unilateral', grupoMuscular: 'Biceps', categoria: 'Roscas', favorito: false },
    { id: 'bi06', nome: 'Rosca Martelo', grupoMuscular: 'Biceps', categoria: 'Roscas', favorito: true },
    { id: 'bi07', nome: 'Rosca Martelo Cabo', grupoMuscular: 'Biceps', categoria: 'Roscas', favorito: false },
    { id: 'bi08', nome: 'Rosca Martelo Cruzado', grupoMuscular: 'Biceps', categoria: 'Roscas', favorito: false },
    { id: 'bi09', nome: 'Rosca Concentrada', grupoMuscular: 'Biceps', categoria: 'Roscas', favorito: false },
    { id: 'bi10', nome: 'Rosca Concentrada Cabo', grupoMuscular: 'Biceps', categoria: 'Roscas', favorito: false },
    { id: 'bi11', nome: 'Rosca Cabo', grupoMuscular: 'Biceps', categoria: 'Roscas', favorito: false },
    { id: 'bi12', nome: 'Rosca Cabo Unilateral', grupoMuscular: 'Biceps', categoria: 'Roscas', favorito: false },
    { id: 'bi13', nome: 'Rosca Alternada', grupoMuscular: 'Biceps', categoria: 'Roscas', favorito: false },
    { id: 'bi14', nome: 'Rosca Inclinada', grupoMuscular: 'Biceps', categoria: 'Roscas', favorito: false },
    { id: 'bi15', nome: 'Rosca Polia Alta', grupoMuscular: 'Biceps', categoria: 'Roscas', favorito: false },
    { id: 'bi16', nome: 'Rosca Polia Baixa', grupoMuscular: 'Biceps', categoria: 'Roscas', favorito: false },
    { id: 'bi17', nome: 'Rosca Inversa', grupoMuscular: 'Biceps', categoria: 'Roscas', favorito: false },
    { id: 'bi18', nome: 'Rosca 21', grupoMuscular: 'Biceps', categoria: 'Roscas', favorito: false },
    { id: 'bi19', nome: 'Rosca no Banco 45', grupoMuscular: 'Biceps', categoria: 'Roscas', favorito: false },
    { id: 'bi20', nome: 'Barra Fixa Supinada Biceps', grupoMuscular: 'Biceps', categoria: 'Peso Corporal', favorito: false },

    { id: 'tr01', nome: 'Triceps Pulley', grupoMuscular: 'Triceps', categoria: 'Polia', favorito: true },
    { id: 'tr02', nome: 'Triceps Corda', grupoMuscular: 'Triceps', categoria: 'Polia', favorito: false },
    { id: 'tr03', nome: 'Triceps Barra', grupoMuscular: 'Triceps', categoria: 'Polia', favorito: false },
    { id: 'tr04', nome: 'Triceps Barra V', grupoMuscular: 'Triceps', categoria: 'Polia', favorito: false },
    { id: 'tr05', nome: 'Triceps Unilateral Corda', grupoMuscular: 'Triceps', categoria: 'Polia', favorito: false },
    { id: 'tr06', nome: 'Triceps Polia Alta', grupoMuscular: 'Triceps', categoria: 'Polia', favorito: false },
    { id: 'tr07', nome: 'Triceps Polia Baixa', grupoMuscular: 'Triceps', categoria: 'Polia', favorito: false },
    { id: 'tr08', nome: 'Triceps Testa', grupoMuscular: 'Triceps', categoria: 'Halteres', favorito: false },
    { id: 'tr09', nome: 'Triceps Testa Unilateral', grupoMuscular: 'Triceps', categoria: 'Halteres', favorito: false },
    { id: 'tr10', nome: 'Triceps Frances', grupoMuscular: 'Triceps', categoria: 'Halteres', favorito: false },
    { id: 'tr11', nome: 'Triceps Frances Unilateral', grupoMuscular: 'Triceps', categoria: 'Halteres', favorito: false },
    { id: 'tr12', nome: 'Triceps Coice', grupoMuscular: 'Triceps', categoria: 'Halteres', favorito: false },
    { id: 'tr13', nome: 'Triceps Coice Unilateral', grupoMuscular: 'Triceps', categoria: 'Halteres', favorito: false },
    { id: 'tr14', nome: 'Triceps Coice Cabo', grupoMuscular: 'Triceps', categoria: 'Halteres', favorito: false },
    { id: 'tr15', nome: 'Mergulho', grupoMuscular: 'Triceps', categoria: 'Peso Corporal', favorito: true },
    { id: 'tr16', nome: 'Mergulho com Peso', grupoMuscular: 'Triceps', categoria: 'Peso Corporal', favorito: false },
    { id: 'tr17', nome: 'Mergulho no Banco', grupoMuscular: 'Triceps', categoria: 'Peso Corporal', favorito: false },
    { id: 'tr18', nome: 'Flexao Diamante Triceps', grupoMuscular: 'Triceps', categoria: 'Peso Corporal', favorito: false },
    { id: 'tr19', nome: 'Triceps Maquina', grupoMuscular: 'Triceps', categoria: 'Maquina', favorito: false },
    { id: 'tr20', nome: 'Kickback Halteres', grupoMuscular: 'Triceps', categoria: 'Halteres', favorito: false },

    { id: 'an01', nome: 'Rosca Punho Barra', grupoMuscular: 'Antebracos', categoria: 'Punho', favorito: false },
    { id: 'an02', nome: 'Rosca Punho Halteres', grupoMuscular: 'Antebracos', categoria: 'Punho', favorito: false },
    { id: 'an03', nome: 'Rosca Punho Inversa Barra', grupoMuscular: 'Antebracos', categoria: 'Punho', favorito: false },
    { id: 'an04', nome: 'Rosca Punho Inversa Halteres', grupoMuscular: 'Antebracos', categoria: 'Punho', favorito: false },
    { id: 'an05', nome: 'Rosca Punho Polia', grupoMuscular: 'Antebracos', categoria: 'Punho', favorito: false },
    { id: 'an06', nome: 'Extensao Punho Barra', grupoMuscular: 'Antebracos', categoria: 'Punho', favorito: false },
    { id: 'an07', nome: 'Extensao Punho Halteres', grupoMuscular: 'Antebracos', categoria: 'Punho', favorito: false },
    { id: 'an08', nome: 'Pendura na Barra', grupoMuscular: 'Antebracos', categoria: 'Isometrico', favorito: false },
    { id: 'an09', nome: 'Passeio do Fazendeiro', grupoMuscular: 'Antebracos', categoria: 'Isometrico', favorito: false },
    { id: 'an10', nome: 'Passeio do Fazendeiro Unilateral', grupoMuscular: 'Antebracos', categoria: 'Isometrico', favorito: false },
    { id: 'an11', nome: 'Punho de Fermiao', grupoMuscular: 'Antebracos', categoria: 'Punho', favorito: false },

    { id: 'pe01', nome: 'Agachamento Livre', grupoMuscular: 'Pernas', categoria: 'Quadriceps', favorito: true },
    { id: 'pe02', nome: 'Agachamento Frontal', grupoMuscular: 'Pernas', categoria: 'Quadriceps', favorito: false },
    { id: 'pe03', nome: 'Agachamento Smith', grupoMuscular: 'Pernas', categoria: 'Quadriceps', favorito: false },
    { id: 'pe04', nome: 'Agachamento Sumo', grupoMuscular: 'Pernas', categoria: 'Quadriceps', favorito: false },
    { id: 'pe05', nome: 'Agachamento com Salto', grupoMuscular: 'Pernas', categoria: 'Quadriceps', favorito: false },
    { id: 'pe06', nome: 'Agachamento Bulgaro', grupoMuscular: 'Pernas', categoria: 'Quadriceps', favorito: false },
    { id: 'pe07', nome: 'Agachamento Bulgaro Halteres', grupoMuscular: 'Pernas', categoria: 'Quadriceps', favorito: false },
    { id: 'pe08', nome: 'Leg Press 45', grupoMuscular: 'Pernas', categoria: 'Quadriceps', favorito: true },
    { id: 'pe09', nome: 'Leg Press 90', grupoMuscular: 'Pernas', categoria: 'Quadriceps', favorito: false },
    { id: 'pe10', nome: 'Leg Press Unilateral', grupoMuscular: 'Pernas', categoria: 'Quadriceps', favorito: false },
    { id: 'pe11', nome: 'Cadeira Extensora', grupoMuscular: 'Pernas', categoria: 'Quadriceps', favorito: false },
    { id: 'pe12', nome: 'Cadeira Extensora Unilateral', grupoMuscular: 'Pernas', categoria: 'Quadriceps', favorito: false },
    { id: 'pe13', nome: 'Cadeira Hack', grupoMuscular: 'Pernas', categoria: 'Quadriceps', favorito: false },
    { id: 'pe14', nome: 'Afundo', grupoMuscular: 'Pernas', categoria: 'Quadriceps', favorito: false },
    { id: 'pe15', nome: 'Afundo Reverso', grupoMuscular: 'Pernas', categoria: 'Quadriceps', favorito: false },
    { id: 'pe16', nome: 'Afundo Lateral', grupoMuscular: 'Pernas', categoria: 'Quadriceps', favorito: false },
    { id: 'pe17', nome: 'Afundo Caminhando', grupoMuscular: 'Pernas', categoria: 'Quadriceps', favorito: false },
    { id: 'pe18', nome: 'Passadeira', grupoMuscular: 'Pernas', categoria: 'Quadriceps', favorito: false },
    { id: 'pe19', nome: 'Mesa Flexora', grupoMuscular: 'Pernas', categoria: 'Posterior', favorito: true },
    { id: 'pe20', nome: 'Mesa Flexora Unilateral', grupoMuscular: 'Pernas', categoria: 'Posterior', favorito: false },
    { id: 'pe21', nome: 'Cadeira Flexora', grupoMuscular: 'Pernas', categoria: 'Posterior', favorito: false },
    { id: 'pe22', nome: 'Cadeira Flexora Unilateral', grupoMuscular: 'Pernas', categoria: 'Posterior', favorito: false },
    { id: 'pe23', nome: 'Stiff', grupoMuscular: 'Pernas', categoria: 'Posterior', favorito: false },
    { id: 'pe24', nome: 'Stiff Unilateral', grupoMuscular: 'Pernas', categoria: 'Posterior', favorito: false },
    { id: 'pe25', nome: 'RDL', grupoMuscular: 'Pernas', categoria: 'Posterior', favorito: false },
    { id: 'pe26', nome: 'RDL Unilateral', grupoMuscular: 'Pernas', categoria: 'Posterior', favorito: false },
    { id: 'pe27', nome: 'Cadeira Adutora', grupoMuscular: 'Pernas', categoria: 'Posterior', favorito: false },
    { id: 'pe28', nome: 'Cadeira Abdutora', grupoMuscular: 'Pernas', categoria: 'Posterior', favorito: false },
    { id: 'pe29', nome: 'Hip Thrust', grupoMuscular: 'Pernas', categoria: 'Gluteos', favorito: true },
    { id: 'pe30', nome: 'Hip Thrust Unilateral', grupoMuscular: 'Pernas', categoria: 'Gluteos', favorito: false },
    { id: 'pe31', nome: 'Abducao Maquina', grupoMuscular: 'Pernas', categoria: 'Gluteos', favorito: false },
    { id: 'pe32', nome: 'Elevacao Pelvica', grupoMuscular: 'Pernas', categoria: 'Gluteos', favorito: false },
    { id: 'pe33', nome: 'Ponte Unilateral', grupoMuscular: 'Pernas', categoria: 'Gluteos', favorito: false },
    { id: 'pe34', nome: 'Coice Cabo', grupoMuscular: 'Pernas', categoria: 'Gluteos', favorito: false },
    { id: 'pe35', nome: 'Panturrilha Sentado', grupoMuscular: 'Pernas', categoria: 'Panturrilha', favorito: false },
    { id: 'pe36', nome: 'Panturrilha Sentado Unilateral', grupoMuscular: 'Pernas', categoria: 'Panturrilha', favorito: false },
    { id: 'pe37', nome: 'Panturrilha em Pe', grupoMuscular: 'Pernas', categoria: 'Panturrilha', favorito: true },
    { id: 'pe38', nome: 'Panturrilha em Pe Unilateral', grupoMuscular: 'Pernas', categoria: 'Panturrilha', favorito: false },
    { id: 'pe39', nome: 'Panturrilha Smith', grupoMuscular: 'Pernas', categoria: 'Panturrilha', favorito: false },
    { id: 'pe40', nome: 'Panturrilha no Hack', grupoMuscular: 'Pernas', categoria: 'Panturrilha', favorito: false },

    { id: 'ab01', nome: 'Ab Crunch Maquina', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: false },
    { id: 'ab02', nome: 'Abdominal Reto', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: true },
    { id: 'ab03', nome: 'Abdominal Inclinado', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: false },
    { id: 'ab04', nome: 'Abdominal Infra', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: false },
    { id: 'ab05', nome: 'Abdominal Canivete', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: false },
    { id: 'ab06', nome: 'Abdominal Cabo', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: false },
    { id: 'ab07', nome: 'Prancha', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: true },
    { id: 'ab08', nome: 'Prancha Lateral', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: false },
    { id: 'ab09', nome: 'Prancha com Peso', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: false },
    { id: 'ab10', nome: 'Elevacao Pernas', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: false },
    { id: 'ab11', nome: 'Elevacao Pernas Barra', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: false },
    { id: 'ab12', nome: 'Dragon Flag', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: false },
    { id: 'ab13', nome: 'Russian Twist', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: false },
    { id: 'ab14', nome: 'Bicicleta', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: false },
    { id: 'ab15', nome: 'Woodchop Cabo', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: false },
    { id: 'ab16', nome: 'V Ups', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: false },
    { id: 'ab17', nome: 'Crunches Reverso', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: false },
    { id: 'ab18', nome: 'Abdominal Roda', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: false },
    { id: 'ab19', nome: 'Mountain Climber', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: false },
    { id: 'ab20', nome: 'Prancha com Toque no Ombro', grupoMuscular: 'Abdomen', categoria: 'Abdomen', favorito: false },

    { id: 'ca01', nome: 'Esteira', grupoMuscular: 'Cardio', categoria: 'Cardio', favorito: true },
    { id: 'ca02', nome: 'Bicicleta Ergometrica', grupoMuscular: 'Cardio', categoria: 'Cardio', favorito: false },
    { id: 'ca03', nome: 'Bicicleta Spinning', grupoMuscular: 'Cardio', categoria: 'Cardio', favorito: false },
    { id: 'ca04', nome: 'Elipitico', grupoMuscular: 'Cardio', categoria: 'Cardio', favorito: false },
    { id: 'ca05', nome: 'Remador', grupoMuscular: 'Cardio', categoria: 'Cardio', favorito: false },
    { id: 'ca06', nome: 'Escada', grupoMuscular: 'Cardio', categoria: 'Cardio', favorito: false },
    { id: 'ca07', nome: 'Air Bike', grupoMuscular: 'Cardio', categoria: 'Cardio', favorito: false },
    { id: 'ca08', nome: 'Pular Corda', grupoMuscular: 'Cardio', categoria: 'Cardio', favorito: false },
    { id: 'ca09', nome: 'Corrida', grupoMuscular: 'Cardio', categoria: 'Cardio', favorito: false },
    { id: 'ca10', nome: 'Polichinelo', grupoMuscular: 'Cardio', categoria: 'Cardio', favorito: false },
    { id: 'ca11', nome: 'Burpee', grupoMuscular: 'Cardio', categoria: 'Cardio', favorito: false },
    { id: 'ca12', nome: 'Natacao', grupoMuscular: 'Cardio', categoria: 'Cardio', favorito: false }
  ];

  treinos = signal<Treino[]>([]);

  weekDays = computed(() => {
    const start = this.currentWeekStart();
    const days: DayColumn[] = [];
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dateNoTime = new Date(date);
      dateNoTime.setHours(0, 0, 0, 0);
      days.push({
        date,
        dayName: dayNames[date.getDay()],
        dayNumber: date.getDate(),
        isToday: dateNoTime.getTime() === today.getTime()
      });
    }
    return days;
  });

  weekLabel = computed(() => {
    const start = this.currentWeekStart();
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `Semana ${start.getDate()} ${start.toLocaleDateString('pt-BR', { month: 'short' })} - ${end.getDate()} ${end.toLocaleDateString('pt-BR', { month: 'short' })}`;
  });

  weekRange = computed(() => {
    const start = this.currentWeekStart();
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${this.formatDate(start)} ate ${this.formatDate(end)}`;
  });

  ngOnInit(): void {
    this.goToToday();
    this.generateSampleTreinos();
  }

  private generateSampleTreinos(): void {
    this.treinosService.getAll().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const mapped = res.data.map(t => ({
            id: t.id,
            alunoId: t.alunoId,
            alunoNome: t.alunoNome,
            data: this.formatDate(new Date(t.dataInicio)),
            horario: '08:00',
            tipo: t.nome,
            descricao: t.descricao || '',
            observacoes: '',
            status: 'Agendado' as const,
            exercicios: []
          }));
          this.treinos.set(mapped);
        }
      }
    });
  }

  private formatDate(date: Date): string {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }

  goToToday(): void {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - dayOfWeek);
    start.setHours(0, 0, 0, 0);
    this.currentWeekStart.set(start);
  }

  previousWeek(): void {
    const current = this.currentWeekStart();
    const prev = new Date(current);
    prev.setDate(current.getDate() - 7);
    this.currentWeekStart.set(prev);
  }

  nextWeek(): void {
    const current = this.currentWeekStart();
    const next = new Date(current);
    next.setDate(current.getDate() + 7);
    this.currentWeekStart.set(next);
  }

  getTreinosForSlot(date: Date, hour: string): Treino[] {
    const dateStr = this.formatDate(date);
    return this.treinos().filter(t => t.data === dateStr && t.horario === hour);
  }

  openSlot(day: DayColumn, hour: string): void {
    const dateStr = this.formatDate(day.date);
    this.router.navigate(['/professores/treinos/criar'], {
      queryParams: { data: dateStr, horario: hour }
    });
  }

  openNewTraining(): void {
    this.router.navigate(['/professores/treinos/criar']);
  }

  openTraining(treino: Treino, event: Event): void {
    event.stopPropagation();
    this.selectedTreino.set(treino);
    this.modalMode.set('detail');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onAlunoChange(): void {
    const aluno = this.alunos.find(a => a.id === this.formData.alunoId);
    this.selectedAluno.set(aluno || null);
  }

  toggleGrupoMuscular(grupo: string): void {
    if (this.selectedGrupoMuscular() === grupo) {
      this.selectedGrupoMuscular.set(null);
      this.selectedCategoria.set(null);
    } else {
      this.selectedGrupoMuscular.set(grupo);
      this.selectedCategoria.set(null);
    }
  }

  toggleCategoria(categoria: string): void {
    if (this.selectedCategoria() === categoria) {
      this.selectedCategoria.set(null);
    } else {
      this.selectedCategoria.set(categoria);
    }
  }

  getCategoriasForGrupo(grupo: string): string[] {
    const cats = new Set(this.exercicioLib.filter(e => e.grupoMuscular === grupo).map(e => e.categoria));
    return Array.from(cats);
  }

  getExerciciosForCategoria(grupo: string, categoria: string): ExercicioLib[] {
    return this.exercicioLib.filter(e => e.grupoMuscular === grupo && e.categoria === categoria);
  }

  getFilteredExercicios(): ExercicioLib[] {
    const grupo = this.selectedGrupoMuscular();
    const cat = this.selectedCategoria();
    const term = this.searchExerciseTerm().toLowerCase().trim();

    let list = this.exercicioLib;

    if (grupo) {
      list = list.filter(e => e.grupoMuscular === grupo);
    }
    if (cat) {
      list = list.filter(e => e.categoria === cat);
    }
    if (term) {
      list = list.filter(e => e.nome.toLowerCase().includes(term) || e.grupoMuscular.toLowerCase().includes(term) || e.categoria.toLowerCase().includes(term));
    }

    const favs = list.filter(e => e.favorito);
    const nonFavs = list.filter(e => !e.favorito);
    return [...favs, ...nonFavs];
  }

  addExercicioFromLib(exercicio: ExercicioLib): void {
    const newEx: ExercicioTreino = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      nome: exercicio.nome,
      grupoMuscular: exercicio.grupoMuscular,
      series: 3,
      repeticoes: '12',
      carga: '',
      descanso: '60s',
      observacoes: ''
    };
    this.formData.exercicios.push(newEx);
  }

  removeExercicio(index: number): void {
    this.formData.exercicios.splice(index, 1);
  }

  moveExercicioUp(index: number): void {
    if (index <= 0) return;
    const temp = this.formData.exercicios[index];
    this.formData.exercicios[index] = this.formData.exercicios[index - 1];
    this.formData.exercicios[index - 1] = temp;
  }

  moveExercicioDown(index: number): void {
    if (index >= this.formData.exercicios.length - 1) return;
    const temp = this.formData.exercicios[index];
    this.formData.exercicios[index] = this.formData.exercicios[index + 1];
    this.formData.exercicios[index + 1] = temp;
  }

  toggleFavorite(exercicioId: string): void {
    const favs = new Set(this.favoriteIds());
    const ex = this.exercicioLib.find(e => e.id === exercicioId);
    if (!ex) return;

    if (ex.favorito) {
      ex.favorito = false;
      favs.delete(exercicioId);
    } else {
      ex.favorito = true;
      favs.add(exercicioId);
    }
    this.favoriteIds.set(favs);
  }

  saveTraining(): void {
    if (!this.formData.alunoId || !this.formData.tipo) return;
    const aluno = this.alunos.find(a => a.id === this.formData.alunoId);
    if (!aluno) return;

    if (this.modalMode() === 'edit' && this.selectedTreino()) {
      this.treinos.update(list => list.map(t =>
        t.id === this.selectedTreino()!.id
          ? {
              ...t,
              alunoId: this.formData.alunoId,
              alunoNome: aluno.nome,
              tipo: this.formData.tipo,
              descricao: this.formData.descricao,
              observacoes: this.formData.observacoes,
              status: this.formData.status as Treino['status'],
              exercicios: [...this.formData.exercicios]
            }
          : t
      ));
    } else {
      const newTreino: Treino = {
        id: Date.now().toString(),
        alunoId: this.formData.alunoId,
        alunoNome: aluno.nome,
        data: this.formData.data || this.formatDate(new Date()),
        horario: '08:00',
        tipo: this.formData.tipo,
        descricao: this.formData.descricao,
        observacoes: this.formData.observacoes,
        status: this.formData.status as Treino['status'],
        exercicios: [...this.formData.exercicios]
      };
      this.treinos.update(list => [newTreino, ...list]);
    }
    this.closeModal();
  }

  editFromDetail(): void {
    const treino = this.selectedTreino();
    if (!treino) return;
    this.formData = {
      alunoId: treino.alunoId,
      tipo: treino.tipo,
      descricao: treino.descricao,
      observacoes: treino.observacoes,
      status: treino.status,
      data: treino.data,
      exercicios: treino.exercicios.map(e => ({ ...e }))
    };
    this.onAlunoChange();
    this.modalMode.set('edit');
    this.activeTab.set('info');
  }

  duplicateTraining(): void {
    const treino = this.selectedTreino();
    if (!treino) return;
    const newTreino: Treino = {
      ...treino,
      id: Date.now().toString(),
      status: 'Agendado',
      exercicios: treino.exercicios.map(e => ({ ...e, id: Date.now().toString() + Math.random().toString(36).substr(2, 5) }))
    };
    this.treinos.update(list => [newTreino, ...list]);
    this.closeModal();
  }

  deleteTraining(): void {
    const treino = this.selectedTreino();
    if (!treino) return;
    this.treinos.update(list => list.filter(t => t.id !== treino.id));
    this.closeModal();
    this.treinosService.delete(treino.id).subscribe({
      error: () => {
        this.treinos.update(list => [...list, treino]);
      }
    });
  }
}