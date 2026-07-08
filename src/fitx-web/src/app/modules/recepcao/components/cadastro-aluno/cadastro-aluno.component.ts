import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AlunosService } from '../../../../core/services/alunos.service';
import { PlanosService } from '../../../../core/services/planos.service';
import { ProfessoresService } from '../../../../core/services/professores.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { CreateAlunoDto, PlanoDto, ProfessorDto } from '../../../../core/models/models';

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
            <input type="text" class="form-input" placeholder="Nome do aluno" [(ngModel)]="formData.nome" />
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input type="email" class="form-input" placeholder="email@exemplo.com" [(ngModel)]="formData.email" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Telefone</label>
            <input type="tel" class="form-input" placeholder="(00) 00000-0000" [(ngModel)]="formData.telefone" />
          </div>
          <div class="form-group">
            <label>Plano</label>
            <select class="form-select" [(ngModel)]="formData.planoId">
              <option value="">Selecione o plano</option>
              @for (p of planos(); track p.id) {
                <option [value]="p.id">{{ p.nome }} - R$ {{ p.preco.toFixed(2) }}/mês</option>
              }
            </select>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h2>Professor</h2>
        <div class="form-row">
          <div class="form-group">
            <label>Professor</label>
            <select class="form-select" [(ngModel)]="formData.professorId">
              <option value="">Selecione o professor</option>
              @for (prof of professores(); track prof.id) {
                <option [value]="prof.id">{{ prof.nome }}</option>
              }
            </select>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h2>Observações</h2>
        <textarea class="form-textarea" rows="3" placeholder="Observações sobre o aluno..." [(ngModel)]="formData.observacoes"></textarea>
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
    .cadastro-page { padding: 2rem; max-width: 800px; }
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 2rem; font-weight: 700; color: var(--color-text-primary); margin: 0 0 0.5rem 0; }
    .highlight { color: var(--color-primary); }
    .page-header p { color: var(--color-text-secondary); margin: 0; }
    .form-section { background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem; }
    .form-section h2 { font-size: 1.125rem; font-weight: 600; color: var(--color-text-primary); margin: 0 0 1.5rem 0; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
    .form-row:last-child { margin-bottom: 0; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-size: 0.875rem; font-weight: 500; color: var(--color-text-primary); }
    .form-input, .form-select, .form-textarea { padding: 0.75rem 1rem; background: var(--color-glass); border: 1px solid var(--color-glass-border); border-radius: 0.5rem; color: var(--color-text-primary); font-size: 0.875rem; }
    .form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: var(--color-primary); }
    .form-textarea { resize: vertical; font-family: inherit; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; }
    .btn-secondary { padding: 0.75rem 2rem; background: var(--color-glass); border: 1px solid var(--color-glass-border); border-radius: 0.5rem; color: var(--color-text-primary); text-decoration: none; cursor: pointer; }
    .btn-secondary:hover { background: rgba(255, 255, 255, 0.1); }
    .btn-primary { padding: 0.75rem 2rem; background: var(--color-primary); color: var(--color-bg-dark); border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
    .btn-primary:hover:not(:disabled) { background: var(--color-primary-dark); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } }
  `]
})
export class CadastroAlunoComponent implements OnInit {
  private alunosService = inject(AlunosService);
  private planosService = inject(PlanosService);
  private professoresService = inject(ProfessoresService);
  private toast = inject(ToastService);
  private router = inject(Router);

  planos = signal<PlanoDto[]>([]);
  professores = signal<ProfessorDto[]>([]);

  formData = {
    nome: '', email: '', telefone: '',
    planoId: '', professorId: '', observacoes: ''
  };

  ngOnInit(): void {
    this.planosService.getAll().subscribe({ next: (res) => { if (res.success && res.data) this.planos.set(res.data); }, error: () => this.toast.error('Erro ao carregar planos') });
    this.professoresService.getAll().subscribe({ next: (res) => { if (res.success && res.data) this.professores.set(res.data); }, error: () => this.toast.error('Erro ao carregar professores') });
  }

  canSave(): boolean {
    return !!this.formData.nome && !!this.formData.email;
  }

  saveStudent(): void {
    if (!this.canSave()) return;
    const dto: CreateAlunoDto = {
      nome: this.formData.nome, email: this.formData.email, password: '123456',
      telefone: this.formData.telefone, planoId: this.formData.planoId || undefined,
      professorId: this.formData.professorId || undefined, observacoes: this.formData.observacoes
    };
    this.alunosService.create(dto).subscribe({
      next: () => { this.toast.success('Aluno cadastrado com sucesso!'); this.router.navigate(['/recepcao']); },
      error: () => this.toast.error('Erro ao cadastrar aluno')
    });
  }
}
