import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';
import { AlunosService } from '../../../../core/services/alunos.service';
import { TreinosService } from '../../../../core/services/treinos.service';
import { ExerciciosService } from '../../../../core/services/exercicios.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AlunoDto, CreateTreinoDto, CreateSerieDto, ExercicioDto } from '../../../../core/models/models';

interface ExercicioLib {
  id: string;
  nome: string;
  grupoMuscular: string;
  categoria: string;
  favorito: boolean;
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

interface Aluno {
  id: string;
  nome: string;
  plano: string;
  telefone: string;
}

interface TreinoHistorico {
  id: string;
  nome: string;
  data: string;
  exercicios: ExercicioTreino[];
  selected: boolean;
}

@Component({
  selector: 'app-criar-treino',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="editor-page">
      <header class="editor-header">
        <div class="header-left">
          <a routerLink="/professor" class="back-btn">←</a>
          <div class="header-title">
            <h1>Criar Novo Treino</h1>
            @if (selectedAluno()) {
              <span class="aluno-badge">{{ selectedAluno()?.nome }}</span>
            }
          </div>
        </div>
        <div class="header-fields">
          <div class="field-group">
            <label>Aluno</label>
            <select class="field-select" [(ngModel)]="alunoId" (ngModelChange)="onAlunoChange()">
              <option value="">Selecionar aluno</option>
              @for (aluno of alunos; track aluno.id) {
                <option [value]="aluno.id">{{ aluno.nome }}</option>
              }
            </select>
          </div>
          <div class="field-group">
            <label>Nome do Treino</label>
            <input type="text" class="field-input" [(ngModel)]="treinoNome" placeholder="Ex: Costas + Biceps">
          </div>
          <div class="field-group">
            <label>Data</label>
            <input type="date" class="field-input field-date" [(ngModel)]="treinoData">
          </div>
        </div>
      </header>

      <div class="editor-layout">
        <aside class="panel-left">
          <div class="lib-header">
            <h3>Biblioteca de Exercicios</h3>
            @if (!alunoId) {
              <div class="select-aluno-alert">
                <span class="alert-icon">⚠</span>
                <div class="alert-text">
                  <strong>Selecione um aluno</strong>
                  <span>Escolha um aluno no menu acima para liberar a biblioteca de exercicios</span>
                </div>
              </div>
            } @else {
              <div class="search-box">
                <span class="search-icon">⌕</span>
                <input type="text" class="search-input" placeholder="Buscar exercicio..." [(ngModel)]="searchTerm">
              </div>
            }
          </div>
          @if (alunoId) {
            <div class="exercise-list">
              @for (grupo of gruposComCategorias(); track grupo.nome) {
                <div class="grupo-section">
                  <button class="grupo-header" (click)="toggleGrupo(grupo.nome)">
                    <span class="grupo-icon">{{ getIcon(grupo.nome) }}</span>
                    <span class="grupo-name">{{ grupo.nome }}</span>
                    <span class="grupo-count">{{ grupo.totalExercicios }}</span>
                    <span class="grupo-arrow" [class.open]="gruposAbertos().has(grupo.nome)">›</span>
                  </button>
                  @if (gruposAbertos().has(grupo.nome)) {
                    <div class="grupo-content">
                      @for (cat of grupo.categorias; track cat.nome) {
                        <div class="categoria-section">
                          <button class="categoria-header" (click)="toggleCategoria(grupo.nome + cat.nome)">
                            <span class="categoria-name">{{ cat.nome }}</span>
                            <span class="categoria-arrow" [class.open]="categoriasAbertas().has(grupo.nome + cat.nome)">›</span>
                          </button>
                          @if (categoriasAbertas().has(grupo.nome + cat.nome)) {
                            <div class="categoria-content">
                              @for (ex of cat.exercicios; track ex.id) {
                                <div class="exercise-card" (click)="addExercicio(ex)">
                                  <span class="ex-name">{{ ex.nome }}</span>
                                  <button class="ex-add" (click)="addExercicio(ex); $event.stopPropagation()">+</button>
                                </div>
                              }
                            </div>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          }
        </aside>

        <main class="panel-center">
          <div class="workout-header">
            <h3>Novo Treino</h3>
            @if (alunoId) {
              <span class="workout-meta">{{ exerciciosTreino().length }} exercicios</span>
            }
          </div>

          @if (!alunoId) {
            <div class="empty-workout">
              <div class="empty-icon">1</div>
              <p class="empty-title">Selecione um aluno</p>
              <span class="empty-desc">Escolha um aluno no menu acima para comecar a montar o treino</span>
            </div>
          } @else if (exerciciosTreino().length === 0) {
            <div class="empty-workout">
              <div class="empty-icon">2</div>
              <p class="empty-title">Adicione exercicios</p>
              <span class="empty-desc">Selecione exercicios da biblioteca ao lado</span>
            </div>
          } @else {
            <div class="workout-list">
              @for (ex of exerciciosTreino(); track $index; let i = $index) {
                <div class="workout-item" [class.selected]="exercicioSelecionado()?.id === ex.id" (click)="selecionarExercicio(ex)">
                  <span class="item-number">{{ i + 1 }}</span>
                  <div class="item-info">
                    <span class="item-name">{{ ex.nome }}</span>
                    <span class="item-detail">{{ ex.series }}x{{ ex.repeticoes }} {{ ex.carga }}{{ ex.carga ? 'kg' : '' }}</span>
                  </div>
                  <div class="item-actions">
                    <button class="action-btn" (click)="moverCima(i); $event.stopPropagation()" [disabled]="i === 0" title="Mover para cima">↑</button>
                    <button class="action-btn" (click)="moverBaixo(i); $event.stopPropagation()" [disabled]="i === exerciciosTreino().length - 1" title="Mover para baixo">↓</button>
                    <button class="action-btn danger" (click)="excluirExercicio(ex.id); $event.stopPropagation()" title="Excluir">×</button>
                  </div>
                </div>
              }
            </div>
          }
        </main>

        <aside class="panel-right">
          @if (exercicioSelecionado()) {
            <div class="details-panel">
              <div class="details-header">
                <h3>Detalhes do Exercicio</h3>
                <h4 class="detail-ex-name">{{ exercicioSelecionado()?.nome }}</h4>
                <span class="detail-ex-group">{{ exercicioSelecionado()?.grupoMuscular }}</span>
              </div>

              <div class="detail-fields">
                <div class="detail-row">
                  <label>Series</label>
                  <input type="number" class="detail-input" [(ngModel)]="exercicioSelecionado()!.series" min="1" max="20">
                </div>
                <div class="detail-row">
                  <label>Repeticoes</label>
                  <input type="text" class="detail-input" [(ngModel)]="exercicioSelecionado()!.repeticoes" placeholder="10-12">
                </div>
                <div class="detail-row">
                  <label>Carga (kg)</label>
                  <input type="text" class="detail-input" [(ngModel)]="exercicioSelecionado()!.carga" placeholder="45">
                </div>
                <div class="detail-row">
                  <label>Descanso (seg)</label>
                  <input type="text" class="detail-input" [(ngModel)]="exercicioSelecionado()!.descanso" placeholder="60">
                </div>
              </div>

              <div class="detail-field-full">
                <label>Observacoes</label>
                <textarea class="detail-textarea" [(ngModel)]="exercicioSelecionado()!.observacoes" rows="3" placeholder="Ex: Controlar a descida por 3 segundos..."></textarea>
              </div>
            </div>
          } @else {
            <div class="details-empty">
              <span class="empty-icon">◇</span>
              <p>Selecione um exercicio</p>
              <span>para ver os detalhes</span>
            </div>
          }

          <div class="history-panel">
            <h3>Historico</h3>
            <div class="history-list">
              @for (treino of historico(); track treino.id) {
                <label class="history-item" [class.selected]="treino.selected">
                  <input type="checkbox" [(ngModel)]="treino.selected" class="checkbox">
                  <div class="history-info">
                    <span class="history-name">{{ treino.nome }}</span>
                    <span class="history-date">{{ treino.data }}</span>
                  </div>
                </label>
              }
            </div>
            <button class="btn-import" (click)="importarSelecionados()" [disabled]="!temSelecionados()">
              Importar Selecionados
            </button>
          </div>
        </aside>
      </div>

      <footer class="editor-footer">
        <button class="btn-secondary" (click)="limparTreino()">Limpar</button>
        <button class="btn-primary" (click)="salvarTreino()" [disabled]="exerciciosTreino().length === 0 || !alunoId || saving()">{{ saving() ? 'Salvando...' : 'Salvar Treino' }}</button>
      </footer>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #09090b; }
    .editor-page { display: flex; flex-direction: column; min-height: 100vh; }

    .editor-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 24px; border-bottom: 1px solid #1e1e22; background: #111113;
      flex-wrap: wrap; gap: 12px;
    }
    .header-left { display: flex; align-items: center; gap: 12px; }
    .back-btn {
      width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
      background: #18181b; border: 1px solid #1e1e22; border-radius: 6px;
      color: #a1a1aa; font-size: 14px; text-decoration: none; transition: all 0.2s;
    }
    .back-btn:hover { border-color: #c8ff00; color: #c8ff00; }
    .header-title { display: flex; align-items: center; gap: 8px; }
    .header-title h1 { font-size: 15px; font-weight: 600; color: #fafafa; margin: 0; }
    .aluno-badge {
      padding: 3px 10px; background: rgba(200, 255, 0, 0.1); color: #c8ff00;
      border-radius: 4px; font-size: 11px; font-weight: 600;
    }
    .header-fields { display: flex; gap: 12px; align-items: flex-end; }
    .field-group { display: flex; flex-direction: column; gap: 4px; }
    .field-group label { font-size: 10px; color: #52525b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .field-input, .field-select {
      padding: 6px 10px; background: #18181b; border: 1px solid #1e1e22;
      border-radius: 6px; color: #fafafa; font-size: 12px; height: 32px;
    }
    .field-input:focus, .field-select:focus { border-color: #c8ff00; outline: none; }
    .field-select { width: 160px; }
    .field-input { width: 180px; }
    .field-date { width: 130px; }

    .editor-layout { display: flex; flex: 1; overflow: hidden; }

    .panel-left {
      width: 320px; border-right: 1px solid #1e1e22; display: flex;
      flex-direction: column; background: #0d0d0f; overflow: hidden;
    }
    .lib-header { padding: 16px; border-bottom: 1px solid #1e1e22; }
    .lib-header h3 { font-size: 13px; font-weight: 600; color: #fafafa; margin: 0 0 10px; }
    .select-aluno-alert {
      display: flex; align-items: flex-start; gap: 10px; padding: 12px;
      background: rgba(200, 255, 0, 0.06); border: 1px solid rgba(200, 255, 0, 0.2);
      border-radius: 8px;
    }
    .alert-icon { font-size: 16px; color: #c8ff00; flex-shrink: 0; margin-top: 1px; }
    .alert-text { display: flex; flex-direction: column; gap: 4px; }
    .alert-text strong { font-size: 12px; color: #fafafa; font-weight: 600; }
    .alert-text span { font-size: 11px; color: #a1a1aa; line-height: 1.4; }
    .search-box { position: relative; margin-bottom: 10px; }
    .search-icon {
      position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
      color: #3f3f46; font-size: 14px;
    }
    .search-input {
      width: 100%; padding: 7px 10px 7px 30px; background: #18181b;
      border: 1px solid #1e1e22; border-radius: 6px; color: #fafafa; font-size: 12px;
    }
    .search-input:focus { border-color: #c8ff00; outline: none; }
    .search-input::placeholder { color: #3f3f46; }
    .filter-chips { display: flex; gap: 4px; flex-wrap: wrap; }
    .chip {
      padding: 4px 10px; background: #18181b; border: 1px solid #1e1e22;
      border-radius: 4px; color: #a1a1aa; font-size: 11px; font-weight: 500;
      cursor: pointer; transition: all 0.15s;
    }
    .chip:hover { border-color: #52525b; color: #fafafa; }
    .chip.active { background: #c8ff00; color: #000; border-color: #c8ff00; font-weight: 600; }

    .exercise-list {
      flex: 1; overflow-y: auto; padding: 8px;
    }
    .grupo-section { margin-bottom: 4px; }
    .grupo-header {
      display: flex; align-items: center; gap: 8px; width: 100%;
      padding: 8px 10px; background: #18181b; border: 1px solid #1e1e22;
      border-radius: 6px; cursor: pointer; transition: all 0.15s;
    }
    .grupo-header:hover { border-color: #3f3f46; }
    .grupo-icon { font-size: 14px; color: #c8ff00; }
    .grupo-name { flex: 1; font-size: 12px; font-weight: 600; color: #fafafa; text-align: left; }
    .grupo-count { font-size: 10px; color: #52525b; background: #0d0d0f; padding: 2px 6px; border-radius: 4px; }
    .grupo-arrow { font-size: 12px; color: #52525b; transition: transform 0.2s; }
    .grupo-arrow.open { transform: rotate(90deg); }
    .grupo-content { padding: 4px 0 4px 12px; }
    .categoria-section { margin-bottom: 2px; }
    .categoria-header {
      display: flex; align-items: center; justify-content: space-between;
      width: 100%; padding: 6px 10px; background: transparent;
      border: none; border-radius: 4px; cursor: pointer; transition: background 0.15s;
    }
    .categoria-header:hover { background: #18181b; }
    .categoria-name { font-size: 11px; font-weight: 500; color: #a1a1aa; }
    .categoria-arrow { font-size: 10px; color: #3f3f46; transition: transform 0.2s; }
    .categoria-arrow.open { transform: rotate(90deg); }
    .categoria-content { padding: 4px 0 4px 8px; }
    .exercise-card {
      display: flex; align-items: center; gap: 8px; padding: 8px 10px;
      border-radius: 6px; cursor: pointer; transition: background 0.15s;
    }
    .exercise-card:hover { background: #18181b; }
    .ex-name { flex: 1; font-size: 12px; font-weight: 500; color: #a1a1aa; }
    .exercise-card:hover .ex-name { color: #fafafa; }
    .ex-add {
      width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
      background: transparent; border: 1px solid #1e1e22; border-radius: 4px;
      color: #52525b; font-size: 12px; cursor: pointer; transition: all 0.15s; opacity: 0;
    }
    .exercise-card:hover .ex-add { opacity: 1; }
    .ex-add:hover { background: #c8ff00; color: #000; border-color: #c8ff00; }
    .empty-msg { padding: 20px; text-align: center; font-size: 12px; color: #3f3f46; }

    .panel-center {
      flex: 1; display: flex; flex-direction: column; padding: 16px 20px;
      overflow-y: auto; background: #09090b;
    }
    .workout-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .workout-header h3 { font-size: 14px; font-weight: 600; color: #fafafa; margin: 0; }
    .workout-meta { font-size: 12px; color: #52525b; }

    .empty-workout {
      flex: 1; display: flex; flex-direction: column; align-items: center;
      justify-content: center; border: 2px dashed #1e1e22; border-radius: 12px;
      min-height: 300px;
    }
    .empty-workout .empty-icon {
      width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
      background: #18181b; border: 2px dashed #3f3f46; border-radius: 50%;
      color: #c8ff00; font-size: 16px; font-weight: 700; margin-bottom: 12px;
    }
    .empty-workout .empty-title { font-size: 14px; color: #fafafa; margin: 0 0 4px; font-weight: 600; }
    .empty-workout .empty-desc { font-size: 12px; color: #52525b; }

    .workout-list { display: flex; flex-direction: column; gap: 6px; }
    .workout-item {
      display: flex; align-items: center; gap: 12px; padding: 10px 14px;
      background: #111113; border: 1px solid #1e1e22; border-radius: 10px;
      cursor: pointer; transition: all 0.2s;
    }
    .workout-item:hover { border-color: #3f3f46; }
    .workout-item.selected { border-color: #c8ff00; background: rgba(200, 255, 0, 0.04); }
    .item-number {
      width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
      background: #18181b; border-radius: 6px; font-size: 11px; font-weight: 700;
      color: #52525b; flex-shrink: 0;
    }
    .workout-item.selected .item-number { background: #c8ff00; color: #000; }
    .item-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .item-name { font-size: 13px; font-weight: 600; color: #fafafa; }
    .workout-item.selected .item-name { color: #c8ff00; }
    .item-detail { font-size: 11px; color: #52525b; font-variant-numeric: tabular-nums; }
    .item-actions { display: flex; gap: 4px; }
    .action-btn {
      width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
      background: transparent; border: 1px solid #1e1e22; border-radius: 6px;
      color: #52525b; font-size: 12px; cursor: pointer; transition: all 0.15s;
    }
    .action-btn:hover:not(:disabled) { border-color: #3f3f46; color: #a1a1aa; background: #18181b; }
    .action-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .action-btn.danger:hover { border-color: #dc2626; color: #f87171; background: rgba(220, 38, 38, 0.1); }

    .panel-right {
      width: 300px; border-left: 1px solid #1e1e22; display: flex;
      flex-direction: column; background: #0d0d0f; overflow: hidden;
    }
    .details-panel { flex: 1; padding: 16px; overflow-y: auto; }
    .details-header { margin-bottom: 16px; }
    .details-header h3 { font-size: 13px; font-weight: 600; color: #fafafa; margin: 0 0 12px; }
    .detail-ex-name { font-size: 14px; font-weight: 600; color: #c8ff00; margin: 0 0 4px; }
    .detail-ex-group { font-size: 11px; color: #52525b; }
    .detail-fields { display: flex; flex-direction: column; gap: 10px; }
    .detail-row { display: flex; flex-direction: column; gap: 4px; }
    .detail-row label { font-size: 10px; color: #52525b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .detail-input {
      width: 100%; padding: 7px 10px; background: #18181b; border: 1px solid #1e1e22;
      border-radius: 6px; color: #fafafa; font-size: 12px;
    }
    .detail-input:focus { border-color: #c8ff00; outline: none; }
    .detail-field-full { display: flex; flex-direction: column; gap: 4px; margin-top: 10px; }
    .detail-field-full label { font-size: 10px; color: #52525b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .detail-textarea {
      width: 100%; padding: 7px 10px; background: #18181b; border: 1px solid #1e1e22;
      border-radius: 6px; color: #fafafa; font-size: 12px; resize: vertical;
      font-family: inherit; min-height: 70px;
    }
    .detail-textarea:focus { border-color: #c8ff00; outline: none; }

    .details-empty {
      flex: 1; display: flex; flex-direction: column; align-items: center;
      justify-content: center; text-align: center; padding: 20px;
    }
    .details-empty .empty-icon { font-size: 2rem; color: #1e1e22; margin-bottom: 8px; }
    .details-empty p { font-size: 12px; color: #52525b; margin: 0 0 2px; }
    .details-empty span { font-size: 11px; color: #3f3f46; }

    .history-panel {
      border-top: 1px solid #1e1e22; padding: 12px 16px; max-height: 200px;
      overflow-y: auto;
    }
    .history-panel h3 { font-size: 12px; font-weight: 600; color: #a1a1aa; margin: 0 0 8px; }
    .history-list { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
    .history-item {
      display: flex; align-items: center; gap: 8px; padding: 6px 8px;
      border-radius: 6px; cursor: pointer; transition: background 0.15s;
    }
    .history-item:hover { background: #18181b; }
    .history-item.selected { background: rgba(200, 255, 0, 0.05); }
    .checkbox { accent-color: #c8ff00; width: 14px; height: 14px; }
    .history-info { display: flex; flex-direction: column; gap: 1px; }
    .history-name { font-size: 11px; font-weight: 500; color: #a1a1aa; }
    .history-date { font-size: 10px; color: #3f3f46; }
    .btn-import {
      width: 100%; padding: 7px; background: #c8ff00; color: #000;
      border: none; border-radius: 6px; font-size: 11px; font-weight: 600;
      cursor: pointer; transition: all 0.15s;
    }
    .btn-import:hover { background: #d4ff33; }
    .btn-import:disabled { background: #1e1e22; color: #3f3f46; cursor: not-allowed; }

    .editor-footer {
      display: flex; justify-content: flex-end; gap: 8px;
      padding: 12px 24px; border-top: 1px solid #1e1e22; background: #111113;
    }
    .btn-secondary {
      padding: 8px 20px; background: #18181b; border: 1px solid #1e1e22;
      border-radius: 6px; color: #a1a1aa; font-size: 12px; font-weight: 600;
      cursor: pointer; transition: all 0.15s;
    }
    .btn-secondary:hover { color: #fafafa; border-color: #3f3f46; }
    .btn-primary {
      padding: 8px 24px; background: #c8ff00; border: none;
      border-radius: 6px; color: #000; font-size: 12px; font-weight: 600;
      cursor: pointer; transition: all 0.15s;
    }
    .btn-primary:hover { background: #d4ff33; }
    .btn-primary:disabled { background: #1e1e22; color: #3f3f46; cursor: not-allowed; }

    @media (max-width: 1024px) {
      .panel-left { width: 260px; }
      .panel-right { width: 260px; }
    }
    @media (max-width: 768px) {
      .editor-layout { flex-direction: column; }
      .panel-left, .panel-right { width: 100%; border: none; border-bottom: 1px solid #1e1e22; max-height: 300px; }
      .header-fields { flex-wrap: wrap; }
    }
  `]
})
export class CriarTreinoComponent implements OnInit {
  private router2 = inject(Router);
  private route = inject(ActivatedRoute);
  private alunosService = inject(AlunosService);
  private treinosService = inject(TreinosService);
  private exerciciosService = inject(ExerciciosService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  treinoNome = '';
  treinoData = new Date().toISOString().split('T')[0];
  searchTerm = '';
  filtroGrupo = signal('');
  exercicioSelecionado = signal<ExercicioTreino | null>(null);
  alunoId = '';
  gruposAbertos = signal<Set<string>>(new Set());
  categoriasAbertas = signal<Set<string>>(new Set());
  selectedAluno = signal<Aluno | null>(null);
  saving = signal(false);

  alunos: Aluno[] = [];

  exerciciosTreino = signal<ExercicioTreino[]>([]);

  historico = signal<TreinoHistorico[]>([]);

  allExercicios = signal<ExercicioLib[]>([]);

  gruposDisponiveis = computed(() => {
    const grupos = new Set(this.allExercicios().map(e => e.grupoMuscular));
    return Array.from(grupos);
  });

  gruposComCategorias = computed(() => {
    const map = new Map<string, Map<string, ExercicioLib[]>>();
    for (const ex of this.allExercicios()) {
      if (!map.has(ex.grupoMuscular)) map.set(ex.grupoMuscular, new Map());
      const cats = map.get(ex.grupoMuscular)!;
      if (!cats.has(ex.categoria)) cats.set(ex.categoria, []);
      cats.get(ex.categoria)!.push(ex);
    }
    const result: { nome: string; categorias: { nome: string; exercicios: ExercicioLib[] }[]; totalExercicios: number }[] = [];
    for (const [grupo, cats] of map) {
      const categorias: { nome: string; exercicios: ExercicioLib[] }[] = [];
      let total = 0;
      for (const [cat, exercicios] of cats) {
        categorias.push({ nome: cat, exercicios });
        total += exercicios.length;
      }
      result.push({ nome: grupo, categorias, totalExercicios: total });
    }
    return result;
  });

  exerciciosFiltrados = computed(() => {
    let list = this.allExercicios();
    const grupo = this.filtroGrupo();
    const term = this.searchTerm.toLowerCase();
    if (grupo) list = list.filter(e => e.grupoMuscular === grupo);
    if (term) list = list.filter(e => e.nome.toLowerCase().includes(term) || e.grupoMuscular.toLowerCase().includes(term));
    const favs = list.filter(e => e.favorito);
    const others = list.filter(e => !e.favorito);
    return [...favs, ...others];
  });

  toggleGrupo(grupo: string): void {
    this.gruposAbertos.update(set => {
      const s = new Set(set);
      if (s.has(grupo)) s.delete(grupo); else s.add(grupo);
      return s;
    });
  }

  toggleCategoria(key: string): void {
    this.categoriasAbertas.update(set => {
      const s = new Set(set);
      if (s.has(key)) s.delete(key); else s.add(key);
      return s;
    });
  }

  temSelecionados(): boolean { return this.historico().some(t => t.selected); }

  getIcon(grupo: string): string {
    const icons: Record<string, string> = {
      'Peito': '◆', 'Costas': '◇', 'Ombros': '▣', 'Biceps': '◉',
      'Triceps': '◎', 'Pernas': '▧', 'Abdomen': '▩', 'Cardio': '▨'
    };
    return icons[grupo] || '◆';
  }

  onAlunoChange(): void {
    const aluno = this.alunos.find(a => a.id === this.alunoId);
    this.selectedAluno.set(aluno || null);
  }

  addExercicio(ex: ExercicioLib): void {
    const novo: ExercicioTreino = {
      id: ex.id,
      nome: ex.nome, grupoMuscular: ex.grupoMuscular,
      series: 4, repeticoes: '10-12', carga: '', descanso: '60', observacoes: ''
    };
    this.exerciciosTreino.update(list => [...list, novo]);
  }

  selecionarExercicio(ex: ExercicioTreino): void { this.exercicioSelecionado.set(ex); }

  excluirExercicio(id: string): void {
    this.exerciciosTreino.update(list => list.filter(e => e.id !== id));
    if (this.exercicioSelecionado()?.id === id) this.exercicioSelecionado.set(null);
  }

  moverCima(i: number): void {
    if (i === 0) return;
    this.exerciciosTreino.update(list => {
      const arr = [...list]; [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; return arr;
    });
  }

  moverBaixo(i: number): void {
    this.exerciciosTreino.update(list => {
      if (i >= list.length - 1) return list;
      const arr = [...list]; [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; return arr;
    });
  }

  importarSelecionados(): void {
    const selecionados = this.historico().filter(t => t.selected);
    const novos: ExercicioTreino[] = [];
    for (const treino of selecionados) {
      for (const ex of treino.exercicios) {
        novos.push({ ...ex });
      }
    }
    this.exerciciosTreino.update(list => [...list, ...novos]);
    this.historico.update(list => list.map(t => ({ ...t, selected: false })));
  }

  limparTreino(): void { this.exerciciosTreino.set([]); this.exercicioSelecionado.set(null); this.treinoNome = ''; }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        const parts = params['data'].split('/');
        if (parts.length === 3) {
          this.treinoData = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }
    });
    this.loadAlunos();
    this.loadExercicios();
  }

  private loadExercicios(): void {
    this.exerciciosService.getAll().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.allExercicios.set(res.data.map(e => ({
            id: e.id,
            nome: e.nome,
            grupoMuscular: e.grupoMuscular,
            categoria: e.grupoMuscular,
            favorito: false
          })));
        }
      }
    });
  }

  private loadAlunos(): void {
    this.alunosService.getAll().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.alunos = res.data.map(a => ({ id: a.id, nome: a.nome, plano: a.planoNome || '', telefone: a.telefone || '' }));
          this.loadHistorico();
        }
      },
      error: () => this.toast.error('Erro ao carregar alunos')
    });
  }

  private loadHistorico(): void {
    const professor = this.authService.user();
    if (!professor) return;
    this.treinosService.getByProfessorId(professor.id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.historico.set(res.data.map(t => ({
            id: t.id, nome: t.nome, data: t.dataInicio,
            exercicios: [], selected: false
          })));
        }
      }
    });
  }

  salvarTreino(): void {
    if (!this.alunoId || this.exerciciosTreino().length === 0) {
      this.toast.error('Selecione um aluno e adicione exercicios');
      return;
    }
    this.saving.set(true);
    const dto: CreateTreinoDto = {
      alunoId: this.alunoId,
      nome: this.treinoNome || 'Treino personalizado',
      dataInicio: this.treinoData,
      diaSemana: new Date(this.treinoData).getDay()
    };
    this.treinosService.create(dto).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const treinoId = res.data.id;
          let completed = 0;
          const total = this.exerciciosTreino().length;
          for (const [i, ex] of this.exerciciosTreino().entries()) {
            const serie: CreateSerieDto = {
              exercicioId: ex.id,
              repeticoes: parseInt(ex.repeticoes) || 10,
              carga: parseFloat(ex.carga) || undefined,
              descansoSegundos: parseInt(ex.descanso) || 60,
              ordem: i + 1,
              observacao: ex.observacoes || undefined
            };
            this.treinosService.addSeries(treinoId, serie).subscribe({
              next: () => { completed++; if (completed === total) { this.saving.set(false); this.toast.success('Treino salvo com sucesso!'); setTimeout(() => this.router2.navigate(['/agenda']), 1500); } },
              error: () => { completed++; if (completed === total) { this.saving.set(false); this.toast.success('Treino salvo com sucesso!'); setTimeout(() => this.router2.navigate(['/agenda']), 1500); } }
            });
          }
        } else {
          this.saving.set(false);
          this.toast.error('Erro ao criar treino');
        }
      },
      error: () => { this.saving.set(false); this.toast.error('Erro ao criar treino'); }
    });
  }

  private buildLibrary(): ExercicioLib[] {
    const lib: ExercicioLib[] = [];
    const data: Record<string, Record<string, string[]>> = {
      'Peito': {
        'Supinos': ['Supino Reto Barra', 'Supino Reto Halteres', 'Supino Reto Maquina', 'Supino Inclinado Barra', 'Supino Inclinado Halteres', 'Supino Declinado Smith'],
        'Fly': ['Crucifixo Reto', 'Crucifixo Inclinado', 'Peck Deck', 'Fly Maquina', 'Fly Cabo', 'Cross Over Alto', 'Cross Over Medio', 'Cross Over Baixo'],
        'Peso Corporal': ['Flexao Tradicional', 'Flexao Inclinada', 'Flexao Declinada', 'Flexao Diamante'],
        'Outros': ['Paralelas', 'Pullover', 'Pullover Maquina']
      },
      'Costas': {
        'Puxadas': ['Puxada Alta Aberta', 'Puxada Frontal', 'Puxada Supinada', 'Puxada Triangulo'],
        'Remadas': ['Remada Curvada', 'Remada Cavalinho', 'Remada Unilateral', 'Remada Maquina'],
        'Peso Corporal': ['Barra Fixa Pronada', 'Barra Fixa Supinada', 'Dominada'],
        'Outros': ['Pullover', 'Pulldown']
      },
      'Ombros': {
        'Press': ['Press Militar Barra', 'Press Militar Halteres', 'Press Militar Maquina'],
        'Laterais': ['Elevacao Lateral Halteres', 'Elevacao Lateral Maquina', 'Elevacao Lateral Cabo'],
        'Frontais': ['Elevacao Frontal Halteres', 'Elevacao Frontal Barra', 'Elevacao Frontal Cabo'],
        'Traseira': ['Face Pull', 'Elevacao Posterior', 'Reverse Fly']
      },
      'Biceps': {
        'Roscas': ['Rosca Direta Barra', 'Rosca Direta Halteres', 'Rosca Scott', 'Rosca Martelo', 'Rosca Concentrada', 'Rosca Cabo', 'Rosca Alternada']
      },
      'Triceps': {
        'Polia': ['Triceps Pulley', 'Triceps Corda', 'Triceps Barra'],
        'Halteres': ['Triceps Testa', 'Triceps Frances', 'Triceps Coice'],
        'Peso Corporal': ['Mergulho', 'Flexao Diamante']
      },
      'Pernas': {
        'Quadriceps': ['Agachamento Livre', 'Agachamento Smith', 'Leg Press 45', 'Leg Press 90', 'Cadeira Extensora', 'Agachamento Bulgaro', 'Cadeira Hack'],
        'Posterior': ['Mesa Flexora', 'Cadeira Flexora', 'Stiff', 'RDL', 'Cadeira Adutora'],
        'Gluteos': ['Hip Thrust', 'Abducao', 'Elevacao Pelvica'],
        'Panturrilha': ['Panturrilha Sentado', 'Panturrilha em Pe', 'Panturrilha No Leg']
      },
      'Abdomen': { 'Abdomen': ['Ab Crunch Maquina', 'Abdominal Reto', 'Prancha', 'Elevacao Pernas', 'Russian Twist', 'Bicicleta', 'Woodchop'] },
      'Cardio': { 'Cardio': ['Esteira', 'Bicicleta Ergometrica', 'Elipitico', 'Remador', 'Escada', 'Air Bike'] }
    };

    let id = 0;
    for (const [grupo, cats] of Object.entries(data)) {
      for (const [cat, exercicios] of Object.entries(cats)) {
        for (const nome of exercicios) {
          lib.push({
            id: (id++).toString(),
            nome,
            grupoMuscular: grupo,
            categoria: cat,
            favorito: false
          });
        }
      }
    }
    return lib;
  }
}
