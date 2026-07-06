import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-cadastro-aluno',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="cadastro-page">
      <div class="page-header">
        <h1>Cadastrar <span class="highlight">Aluno</span></h1>
        <p>Registre um novo aluno no sistema</p>
      </div>

      <div class="form-section">
        <h2>Dados Pessoais</h2>
        <div class="form-row">
          <div class="form-group">
            <label>Nome Completo *</label>
            <input type="text" class="form-input" placeholder="Nome do aluno" [(ngModel)]="formData.name" />
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input type="email" class="form-input" placeholder="email&#64;exemplo.com" [(ngModel)]="formData.email" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>CPF</label>
            <input type="text" class="form-input" placeholder="000.000.000-00" [(ngModel)]="formData.cpf" />
          </div>
          <div class="form-group">
            <label>Telefone</label>
            <input type="tel" class="form-input" placeholder="(00) 00000-0000" [(ngModel)]="formData.phone" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Data de Nascimento</label>
            <input type="date" class="form-input" [(ngModel)]="formData.birthDate" />
          </div>
          <div class="form-group">
            <label>Sexo</label>
            <select class="form-select" [(ngModel)]="formData.gender">
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h2>Plano e Matrícula</h2>
        <div class="form-row">
          <div class="form-group">
            <label>Plano *</label>
            <select class="form-select" [(ngModel)]="formData.plan">
              <option value="">Selecione o plano</option>
              <option value="basico">Básico - R$ 89,90/mês</option>
              <option value="completo">Completo - R$ 129,90/mês</option>
              <option value="premium">Premium - R$ 199,90/mês</option>
            </select>
          </div>
          <div class="form-group">
            <label>Professor</label>
            <select class="form-select" [(ngModel)]="formData.teacher">
              <option value="">Selecione o professor</option>
              <option value="1">Carlos Silva</option>
              <option value="2">Ana Santos</option>
              <option value="3">Pedro Lima</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Data de Matrícula</label>
            <input type="date" class="form-input" [(ngModel)]="formData.enrollmentDate" />
          </div>
          <div class="form-group">
            <label>Forma de Pagamento</label>
            <select class="form-select" [(ngModel)]="formData.paymentMethod">
              <option value="">Selecione</option>
              <option value="pix">PIX</option>
              <option value="card">Cartão</option>
              <option value="boleto">Boleto</option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h2>Foto do Aluno</h2>
        <div class="photo-upload">
          <div class="photo-preview">
            @if (photoPreview()) {
              <img [src]="photoPreview()" alt="Preview" />
            } @else {
              <span class="upload-icon">📷</span>
              <span class="upload-text">Adicionar foto</span>
            }
          </div>
          <input type="file" accept="image/*" (change)="onPhotoSelect($event)" class="file-input" #fileInput />
          <button class="upload-btn" (click)="fileInput.click()">Selecionar Foto</button>
        </div>
      </div>

      <div class="form-section">
        <h2>Observações</h2>
        <textarea class="form-textarea" rows="3" placeholder="Observações sobre o aluno..." [(ngModel)]="formData.notes"></textarea>
      </div>

      <div class="form-actions">
        <a routerLink="/recepcao" class="btn-secondary">Cancelar</a>
        <button class="btn-primary" (click)="saveStudent()" [disabled]="!canSave()">
          Cadastrar Aluno
        </button>
      </div>
    </div>
  `,
  styles: [`
    .cadastro-page {
      padding: 2rem;
      max-width: 800px;
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

    .form-section {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .form-section h2 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 1.5rem 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .form-row:last-child {
      margin-bottom: 0;
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

    .photo-upload {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .photo-preview {
      width: 120px;
      height: 120px;
      background: var(--color-glass);
      border: 2px dashed var(--color-border);
      border-radius: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .photo-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .upload-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .upload-text {
      font-size: 0.7rem;
      color: var(--color-text-secondary);
    }

    .file-input {
      display: none;
    }

    .upload-btn {
      padding: 0.75rem 1.5rem;
      background: var(--color-glass);
      border: 1px solid var(--color-glass-border);
      border-radius: 0.5rem;
      color: var(--color-text-primary);
      cursor: pointer;
      transition: all 0.2s;
    }

    .upload-btn:hover {
      background: rgba(255, 255, 255, 0.1);
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

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CadastroAlunoComponent {
  private toast = inject(ToastService);
  photoPreview = signal<string | null>(null);

  formData = {
    name: '',
    email: '',
    cpf: '',
    phone: '',
    birthDate: '',
    gender: '',
    plan: '',
    teacher: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    notes: ''
  };

  onPhotoSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  canSave(): boolean {
    return !!this.formData.name && !!this.formData.email && !!this.formData.plan;
  }

  saveStudent(): void {
    if (this.canSave()) {
      this.toast.success('Aluno cadastrado com sucesso!');
    }
  }
}
