import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-criar-avaliacao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="criar-avaliacao-page">
      <div class="page-header">
        <h1>Nova <span class="highlight">Avaliação</span></h1>
        <p>Registre a avaliação física do aluno</p>
      </div>

      <div class="form-section">
        <div class="form-row">
          <div class="form-group">
            <label>Aluno</label>
            <select class="form-select" [(ngModel)]="selectedStudent">
              <option value="">Selecione o aluno</option>
              @for (student of students; track student.id) {
                <option [value]="student.id">{{ student.name }}</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label>Data da Avaliação</label>
            <input type="date" class="form-input" [(ngModel)]="evaluationDate" />
          </div>
        </div>
      </div>

      <div class="metrics-section">
        <h2>Medidas Corporais</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">⚖️</div>
            <div class="form-group">
              <label>Peso (kg)</label>
              <input type="number" class="form-input" [(ngModel)]="weight" step="0.1" />
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">📏</div>
            <div class="form-group">
              <label>Altura (cm)</label>
              <input type="number" class="form-input" [(ngModel)]="height" step="0.1" />
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">🔥</div>
            <div class="form-group">
              <label>% Gordura</label>
              <input type="number" class="form-input" [(ngModel)]="bodyFat" step="0.1" />
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">💪</div>
            <div class="form-group">
              <label>Massa Muscular (kg)</label>
              <input type="number" class="form-input" [(ngModel)]="muscleMass" step="0.1" />
            </div>
          </div>
        </div>
      </div>

      <div class="circumferences-section">
        <h2>Circunferências</h2>
        <div class="circumferences-grid">
          <div class="form-group">
            <label>Braços (cm)</label>
            <input type="number" class="form-input" [(ngModel)]="armCircumference" step="0.1" />
          </div>
          <div class="form-group">
            <label>Peito (cm)</label>
            <input type="number" class="form-input" [(ngModel)]="chestCircumference" step="0.1" />
          </div>
          <div class="form-group">
            <label>Cintura (cm)</label>
            <input type="number" class="form-input" [(ngModel)]="waistCircumference" step="0.1" />
          </div>
          <div class="form-group">
            <label>Quadril (cm)</label>
            <input type="number" class="form-input" [(ngModel)]="hipCircumference" step="0.1" />
          </div>
          <div class="form-group">
            <label>Pernas (cm)</label>
            <input type="number" class="form-input" [(ngModel)]="legCircumference" step="0.1" />
          </div>
        </div>
      </div>

      <div class="notes-section">
        <h2>Observações</h2>
        <textarea class="form-textarea" rows="4" placeholder="Adicione observações sobre o aluno..." [(ngModel)]="notes"></textarea>
      </div>

      <div class="imc-preview">
        <h2>IMC Calculado</h2>
        <div class="imc-value">
          {{ calculateIMC() }}
        </div>
        <div class="imc-classification">
          {{ getIMCClassification() }}
        </div>
      </div>

      <div class="form-actions">
        <a routerLink="/professores" class="btn-secondary">Cancelar</a>
        <button class="btn-primary" (click)="saveEvaluation()" [disabled]="!canSave()">
          Salvar Avaliação
        </button>
      </div>
    </div>
  `,
  styles: [`
    .criar-avaliacao-page {
      padding: 2rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 0.5rem 0;
    }

    .highlight {
      color: var(--color-primary);
    }

    .page-header p {
      color: var(--color-text-secondary);
      margin: 0;
    }

    .form-section, .metrics-section, .circumferences-section, .notes-section, .imc-preview {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .form-section h2, .metrics-section h2, .circumferences-section h2, .notes-section h2, .imc-preview h2 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 1.5rem 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-primary);
    }

    .form-input, .form-select, .form-textarea {
      padding: 0.75rem 1rem;
      background: var(--color-glass);
      border: 1px solid var(--color-glass-border);
      border-radius: 0.5rem;
      color: var(--color-text-primary);
      font-size: 0.875rem;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .form-textarea {
      resize: vertical;
      font-family: inherit;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }

    .metric-card {
      text-align: center;
    }

    .metric-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .circumferences-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1rem;
    }

    .imc-preview {
      text-align: center;
    }

    .imc-value {
      font-size: 4rem;
      font-weight: 900;
      color: var(--color-primary);
      margin-bottom: 0.5rem;
    }

    .imc-classification {
      font-size: 1.25rem;
      color: var(--color-text-secondary);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .btn-secondary {
      padding: 0.75rem 2rem;
      background: var(--color-glass);
      border: 1px solid var(--color-glass-border);
      border-radius: 0.5rem;
      color: var(--color-text-primary);
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .btn-primary {
      padding: 0.75rem 2rem;
      background: var(--color-primary);
      color: var(--color-bg-dark);
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--color-primary-dark);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 1024px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .circumferences-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .metrics-grid, .circumferences-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CriarAvaliacaoComponent {
  private toast = inject(ToastService);
  selectedStudent = '';
  evaluationDate = new Date().toISOString().split('T')[0];
  weight = 0;
  height = 0;
  bodyFat = 0;
  muscleMass = 0;
  armCircumference = 0;
  chestCircumference = 0;
  waistCircumference = 0;
  hipCircumference = 0;
  legCircumference = 0;
  notes = '';

  students: { id: string; name: string }[] = [];

  calculateIMC(): string {
    if (this.weight > 0 && this.height > 0) {
      const heightInMeters = this.height / 100;
      const imc = this.weight / (heightInMeters * heightInMeters);
      return imc.toFixed(1);
    }
    return '0.0';
  }

  getIMCClassification(): string {
    const imc = parseFloat(this.calculateIMC());
    if (imc === 0) return 'Insira peso e altura';
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidade';
  }

  canSave(): boolean {
    return !!this.selectedStudent && this.weight > 0 && this.height > 0;
  }

  saveEvaluation(): void {
    if (this.canSave()) {
      this.toast.success('Avaliacao salva com sucesso!');
    }
  }
}
