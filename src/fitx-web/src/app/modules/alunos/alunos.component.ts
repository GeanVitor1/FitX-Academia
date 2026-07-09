import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AlunosService } from '../../core/services/alunos.service';
import { PlanosService } from '../../core/services/planos.service';
import { ProfessoresService } from '../../core/services/professores.service';
import { ToastService } from '../../shared/services/toast.service';
import {
  AlunoDto,
  CreateAlunoDto,
  UpdateAlunoDto,
  PlanoDto,
  ProfessorDto,
  StatusAluno
} from '../../core/models/models';

@Component({
  selector: 'app-alunos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; padding: 2.5rem; background: #09090b; min-height: 100vh; color: #fafafa;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem;">
        <div>
          <h1 style="font-size: 1.875rem; font-weight: 700; color: #fafafa; margin: 0 0 0.5rem 0; letter-spacing: -0.025em;">
            <span style="color: #c8ff00;">Alunos</span>
          </h1>
          <p style="color: #a1a1aa; margin: 0; font-size: 0.875rem;">Gerenciamento de alunos da academia</p>
        </div>
        <button (click)="showForm.set(!showForm())"
          style="padding: 0.625rem 1.25rem; background: #c8ff00; color: #09090b; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer;">
          {{ showForm() ? 'Cancelar' : '+ Novo Aluno' }}
        </button>
      </div>

      @if (loading()) {
        <div style="text-align: center; padding: 3rem; color: #52525b;">Carregando...</div>
      }

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem;">
          <div style="color: #a1a1aa; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Total</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: #fafafa;">{{ alunos().length }}</div>
        </div>
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem;">
          <div style="color: #a1a1aa; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Ativos</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: #c8ff00;">{{ getAtivos() }}</div>
        </div>
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem;">
          <div style="color: #a1a1aa; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Inativos</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: #fafafa;">{{ getInativos() }}</div>
        </div>
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem;">
          <div style="color: #a1a1aa; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Pendentes</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: #fafafa;">{{ getPendentes() }}</div>
        </div>
      </div>

      @if (showForm()) {
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem;">
          <h3 style="color: #fafafa; margin: 0 0 1.25rem 0; font-size: 1rem; font-weight: 600;">{{ editingId() ? 'Editar Aluno' : 'Novo Aluno' }}</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.75rem; color: #a1a1aa; margin-bottom: 0.5rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Nome Completo</label>
              <input type="text" [(ngModel)]="form.nome" placeholder="Nome do aluno"
                style="width: 100%; padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; box-sizing: border-box;">
            </div>
            <div>
              <label style="display: block; font-size: 0.75rem; color: #a1a1aa; margin-bottom: 0.5rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Email</label>
              <input type="email" [(ngModel)]="form.email" placeholder="email@exemplo.com"
                style="width: 100%; padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; box-sizing: border-box;">
            </div>
            <div>
              <label style="display: block; font-size: 0.75rem; color: #a1a1aa; margin-bottom: 0.5rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Telefone</label>
              <input type="text" [(ngModel)]="form.telefone" placeholder="(11) 99999-9999"
                style="width: 100%; padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; box-sizing: border-box;">
            </div>
            <div>
              <label style="display: block; font-size: 0.75rem; color: #a1a1aa; margin-bottom: 0.5rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Plano</label>
              <select [(ngModel)]="form.planoId"
                style="width: 100%; padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; box-sizing: border-box;">
                <option value="">Sem plano</option>
                @for (p of planos(); track p.id) {
                  <option [value]="p.id">{{ p.nome }} - R$ {{ p.preco.toFixed(2) }}</option>
                }
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 0.75rem; color: #a1a1aa; margin-bottom: 0.5rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Professor</label>
              <select [(ngModel)]="form.professorId"
                style="width: 100%; padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; box-sizing: border-box;">
                <option value="">Nao atribuido</option>
                @for (prof of professores(); track prof.id) {
                  <option [value]="prof.id">{{ prof.nome }}</option>
                }
              </select>
            </div>
          </div>
          @if (erroMensagem()) {
            <div style="margin-top: 1rem; padding: 0.75rem 1rem; background: rgba(255, 70, 70, 0.12); border: 1px solid rgba(255, 70, 70, 0.3); border-radius: 0.5rem; color: #ff6b6b; font-size: 0.8125rem;">
              {{ erroMensagem() }}
            </div>
          }
          <div style="margin-top: 1.25rem;">
            <button (click)="salvar()" [disabled]="salvando()"
              style="padding: 0.625rem 1.5rem; background: {{ salvando() ? '#6b6b6b' : '#c8ff00' }}; color: #09090b; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: {{ salvando() ? 'not-allowed' : 'pointer' }};">
              {{ salvando() ? 'Salvando...' : (editingId() ? 'Atualizar Aluno' : 'Salvar Aluno') }}
            </button>
          </div>
        </div>
      }

      <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; overflow: hidden;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid #1e1e22;">
          <h2 style="font-size: 1rem; color: #fafafa; margin: 0; font-weight: 600;">Alunos Cadastrados</h2>
          <input type="text" [(ngModel)]="filtro" (ngModelChange)="aplicarFiltro()" placeholder="Filtrar por nome..."
            style="padding: 0.5rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.8125rem; width: 250px; box-sizing: border-box;">
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Aluno</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Plano</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Professor</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Status</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Acao</th>
            </tr>
          </thead>
          <tbody>
            @if (filtrados().length === 0) {
              <tr>
                <td colspan="5" style="padding: 3rem 1.5rem; text-align: center; color: #52525b; font-size: 0.875rem;">
                  Nenhum aluno encontrado
                </td>
              </tr>
            }
            @for (aluno of filtrados(); track aluno.id) {
              <tr style="border-bottom: 1px solid #1e1e22;">
                <td style="padding: 1rem 1.5rem;">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 36px; height: 36px; background: #18181b; border: 1px solid #1e1e22; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #c8ff00; font-size: 0.875rem; flex-shrink: 0;">
                      {{ aluno.nome.charAt(0) }}
                    </div>
                    <div>
                      <div style="color: #fafafa; font-size: 0.875rem; font-weight: 500;">{{ aluno.nome }}</div>
                      <div style="color: #a1a1aa; font-size: 0.75rem;">{{ aluno.email }}</div>
                    </div>
                  </div>
                </td>
                <td style="padding: 1rem 1.5rem;">
                  <span style="padding: 0.25rem 0.625rem; background: rgba(200, 255, 0, 0.1); border-radius: 1rem; font-size: 0.75rem; font-weight: 500; color: #c8ff00;">{{ aluno.planoNome || '---' }}</span>
                </td>
                <td style="padding: 1rem 1.5rem; color: #a1a1aa; font-size: 0.875rem;">{{ aluno.professorNome || 'Nao atribuido' }}</td>
                <td style="padding: 1rem 1.5rem;">
                  @if (aluno.status === 'Ativo') {
                    <span style="padding: 0.25rem 0.625rem; background: rgba(200, 255, 0, 0.1); border-radius: 1rem; font-size: 0.75rem; font-weight: 500; color: #c8ff00;">Ativo</span>
                  } @else if (aluno.status === 'Inativo') {
                    <span style="padding: 0.25rem 0.625rem; background: rgba(161, 161, 170, 0.15); border-radius: 1rem; font-size: 0.75rem; font-weight: 500; color: #a1a1aa;">Inativo</span>
                  } @else {
                    <span style="padding: 0.25rem 0.625rem; background: rgba(250, 250, 250, 0.08); border-radius: 1rem; font-size: 0.75rem; font-weight: 500; color: #fafafa;">{{ aluno.status }}</span>
                  }
                </td>
                <td style="padding: 1rem 1.5rem;">
                  <div style="display: flex; gap: 0.5rem;">
                    <button (click)="toggleStatus(aluno)"
                      style="padding: 0.375rem 0.75rem; background: rgba(250, 250, 250, 0.05); border: 1px solid #1e1e22; border-radius: 0.375rem; color: #a1a1aa; cursor: pointer; font-weight: 500; font-size: 0.75rem;">
                      {{ aluno.status === 'Ativo' ? 'Desativar' : 'Ativar' }}
                    </button>
                    <button (click)="deletar(aluno)"
                      style="padding: 0.375rem 0.75rem; background: rgba(255, 70, 70, 0.1); border: 1px solid rgba(255, 70, 70, 0.3); border-radius: 0.375rem; color: #ff6b6b; cursor: pointer; font-weight: 500; font-size: 0.75rem;">
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

      @if (showDeleteModal()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000;" (click)="showDeleteModal.set(false)">
          <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 1rem; padding: 2rem; max-width: 420px; width: 90%; box-shadow: 0 25px 60px rgba(0,0,0,0.5);" (click)="$event.stopPropagation()">
            <div style="width: 48px; height: 48px; background: rgba(255,70,70,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
              <span style="font-size: 1.5rem;">🗑️</span>
            </div>
            <h3 style="color: #fafafa; margin: 0 0 0.5rem 0; font-size: 1.125rem; font-weight: 600;">Excluir aluno</h3>
            <p style="color: #a1a1aa; margin: 0 0 1.5rem 0; font-size: 0.875rem; line-height: 1.5;">
              Tem certeza que deseja excluir <strong style="color: #fafafa;">{{ deletingAluno()?.nome }}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
              <button (click)="showDeleteModal.set(false)"
                style="padding: 0.625rem 1.25rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #a1a1aa; cursor: pointer; font-weight: 500; font-size: 0.875rem;">
                Cancelar
              </button>
              <button (click)="confirmarExclusao()" [disabled]="excluindo()"
                style="padding: 0.625rem 1.25rem; background: {{ excluindo() ? '#6b6b6b' : '#ff4646' }}; border: none; border-radius: 0.5rem; color: #fff; cursor: pointer; font-weight: 600; font-size: 0.875rem;">
                {{ excluindo() ? 'Excluindo...' : 'Sim, excluir' }}
              </button>
            </div>
          </div>
        </div>
      }
  `,
  styles: [`
    :host { display: block; }
    * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
  `]
})
export class AlunosComponent implements OnInit {
  private alunosService = inject(AlunosService);
  private planosService = inject(PlanosService);
  private professoresService = inject(ProfessoresService);
  private toast = inject(ToastService);

  showForm = signal(false);
  editingId = signal<string | null>(null);
  loading = signal(false);
  salvando = signal(false);
  filtro = '';
  erroMensagem = signal('');

  planos = signal<PlanoDto[]>([]);
  professores = signal<ProfessorDto[]>([]);
  form = { nome: '', email: '', telefone: '', planoId: '', professorId: '' };
  alunos = signal<AlunoDto[]>([]);
  filtrados = signal<AlunoDto[]>([]);
  showDeleteModal = signal(false);
  deletingAluno = signal<AlunoDto | null>(null);
  excluindo = signal(false);

  ngOnInit(): void {
    this.loadAlunos();
    this.planosService.getAll().subscribe({ next: (res) => { if (res.success && res.data) this.planos.set(res.data); }, error: () => this.toast.error('Erro ao carregar planos') });
    this.professoresService.getAll().subscribe({ next: (res) => { if (res.success && res.data) this.professores.set(res.data); }, error: () => this.toast.error('Erro ao carregar professores') });
  }

  loadAlunos(): void {
    this.loading.set(true);
    this.alunosService.getAll().subscribe({
      next: (res) => { if (res.success && res.data) { this.alunos.set(res.data); this.aplicarFiltro(); } this.loading.set(false); },
      error: (err: HttpErrorResponse) => { this.loading.set(false); this.toast.error(this.extrairErro(err)); }
    });
  }

  getAtivos(): number { return this.alunos().filter(a => a.status === 'Ativo').length; }
  getInativos(): number { return this.alunos().filter(a => a.status === 'Inativo').length; }
  getPendentes(): number { return this.alunos().filter(a => a.status === 'Pendente').length; }

  aplicarFiltro(): void {
    const f = this.filtro.toLowerCase();
    this.filtrados.set(f ? this.alunos().filter(a => a.nome.toLowerCase().includes(f)) : this.alunos());
  }

  salvar(): void {
    if (!this.form.nome || this.salvando()) return;

    this.erroMensagem.set('');
    this.salvando.set(true);

    const onSuccess = () => {
      this.loadAlunos();
      this.showForm.set(false);
      this.editingId.set(null);
      this.form = { nome: '', email: '', telefone: '', planoId: '', professorId: '' };
      this.salvando.set(false);
    };

    const onError = (err: HttpErrorResponse) => {
      this.erroMensagem.set(this.extrairErro(err));
      this.salvando.set(false);
    };

    if (this.editingId()) {
      const dto: UpdateAlunoDto = { telefone: this.form.telefone };
      this.alunosService.update(this.editingId()!, dto).subscribe({
        next: onSuccess,
        error: onError
      });
    } else {
      const dto: CreateAlunoDto = {
        nome: this.form.nome,
        email: this.form.email,
        password: '123456',
        telefone: this.form.telefone,
        planoId: this.form.planoId || undefined,
        professorId: this.form.professorId || undefined
      };
      this.alunosService.create(dto).subscribe({
        next: onSuccess,
        error: onError
      });
    }
  }

  deletar(aluno: AlunoDto): void {
    this.deletingAluno.set(aluno);
    this.showDeleteModal.set(true);
  }

  confirmarExclusao(): void {
    const aluno = this.deletingAluno();
    if (!aluno) return;
    this.excluindo.set(true);
    this.alunosService.delete(aluno.id).subscribe({
      next: () => { this.toast.success('Aluno excluído'); this.loadAlunos(); this.showDeleteModal.set(false); this.deletingAluno.set(null); this.excluindo.set(false); },
      error: (err) => { this.toast.error(this.extrairErro(err)); this.excluindo.set(false); }
    });
  }

  toggleStatus(aluno: AlunoDto): void {
    const novoStatus: StatusAluno = aluno.status === 'Ativo' ? 'Inativo' : 'Ativo';
    this.alunosService.update(aluno.id, { status: novoStatus }).subscribe({
      next: () => { this.toast.success('Status alterado'); this.loadAlunos(); },
      error: (err: HttpErrorResponse) => this.toast.error(this.extrairErro(err))
    });
  }

  private extrairErro(err: HttpErrorResponse): string {
    if (err.error?.errors?.length) return err.error.errors[0];
    if (err.error?.message) return err.error.message;
    return err.message || 'Erro desconhecido';
  }
}
