import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfessoresService } from '../../core/services/professores.service';
import { ToastService } from '../../shared/services/toast.service';
import { ProfessorDto, CreateProfessorDto, UpdateProfessorDto } from '../../core/models/models';

@Component({
  selector: 'app-professores-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; padding: 2rem; background: #09090b; min-height: 100vh; color: #fff;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin: 0 0 0.375rem 0; letter-spacing: -0.02em;">
            Gerenciar <span style="color: #c8ff00;">Professores</span>
          </h1>
          <p style="color: #a1a1aa; margin: 0; font-size: 0.875rem;">Professores cadastrados na academia</p>
        </div>
        <button (click)="showForm.set(!showForm())"
          style="padding: 0.625rem 1.25rem; background: #c8ff00; color: #09090b; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer;">
          {{ showForm() ? 'Cancelar' : '+ Novo Professor' }}
        </button>
      </div>

      @if (loading()) {
        <div style="text-align:center;padding:3rem;color:#52525b;">Carregando...</div>
      }

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem;">
          <div style="width: 40px; height: 40px; background: #18181b; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; border: 1px solid #1e1e22;">🏋️</div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 700; color: #fff; line-height: 1.2;">{{ professores().length }}</div>
            <div style="font-size: 0.75rem; color: #a1a1aa;">Total</div>
          </div>
        </div>
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem;">
          <div style="width: 40px; height: 40px; background: #18181b; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; border: 1px solid #1e1e22;">✅</div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 700; color: #c8ff00; line-height: 1.2;">{{ getAtivos() }}</div>
            <div style="font-size: 0.75rem; color: #a1a1aa;">Ativos</div>
          </div>
        </div>
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem;">
          <div style="width: 40px; height: 40px; background: #18181b; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; border: 1px solid #1e1e22;">👥</div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 700; color: #fff; line-height: 1.2;">{{ getTotalAlunos() }}</div>
            <div style="font-size: 0.75rem; color: #a1a1aa;">Total Alunos</div>
          </div>
        </div>
      </div>

      @if (showForm()) {
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem;">
          <h3 style="color: #fff; margin: 0 0 1.25rem 0; font-size: 1rem; font-weight: 600;">
            {{ editingId() ? 'Editar Professor' : 'Novo Professor' }}
          </h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Nome</label>
              <input type="text" [(ngModel)]="form.nome" placeholder="Nome completo"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fff; font-size: 0.875rem; font-family: inherit;">
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Email</label>
              <input type="email" [(ngModel)]="form.email" placeholder="email@fitx.com"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fff; font-size: 0.875rem; font-family: inherit;">
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Especialidade</label>
              <input type="text" [(ngModel)]="form.especialidade" placeholder="Ex: Musculacao"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fff; font-size: 0.875rem; font-family: inherit;">
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">CREF</label>
              <input type="text" [(ngModel)]="form.cref" placeholder="CREF-00000"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fff; font-size: 0.875rem; font-family: inherit;">
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; grid-column: 1 / -1;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Biografia</label>
              <textarea [(ngModel)]="form.bio" placeholder="Sobre o professor..." rows="3"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fff; font-size: 0.875rem; font-family: inherit; resize: vertical;"></textarea>
            </div>
          </div>
          <div style="display: flex; gap: 0.75rem; margin-top: 1.25rem;">
            <button (click)="salvar()"
              style="padding: 0.625rem 1.5rem; background: #c8ff00; color: #09090b; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer;">Salvar</button>
            <button (click)="cancelar()"
              style="padding: 0.625rem 1.5rem; background: #18181b; color: #fff; border: 1px solid #1e1e22; border-radius: 0.5rem; font-weight: 500; font-size: 0.875rem; cursor: pointer;">Cancelar</button>
          </div>
        </div>
      }

      <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #18181b;">
              <th style="padding: 0.75rem 1.25rem; text-align: left; font-size: 0.6875rem; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #1e1e22;">Nome</th>
              <th style="padding: 0.75rem 1.25rem; text-align: left; font-size: 0.6875rem; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #1e1e22;">Email</th>
              <th style="padding: 0.75rem 1.25rem; text-align: left; font-size: 0.6875rem; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #1e1e22;">Especialidade</th>
              <th style="padding: 0.75rem 1.25rem; text-align: left; font-size: 0.6875rem; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #1e1e22;">Alunos</th>
              <th style="padding: 0.75rem 1.25rem; text-align: left; font-size: 0.6875rem; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #1e1e22;">Status</th>
              <th style="padding: 0.75rem 1.25rem; text-align: left; font-size: 0.6875rem; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #1e1e22;">Acoes</th>
            </tr>
          </thead>
          <tbody>
            @for (prof of professores(); track prof.id) {
              <tr style="border-bottom: 1px solid #1e1e22;">
                <td style="padding: 0.875rem 1.25rem; font-weight: 600; color: #fff; font-size: 0.875rem;">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 32px; height: 32px; background: #18181b; border: 1px solid #1e1e22; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #c8ff00; font-size: 0.8125rem;">{{ prof.nome.charAt(0) }}</div>
                    {{ prof.nome }}
                  </div>
                </td>
                <td style="padding: 0.875rem 1.25rem; color: #a1a1aa; font-size: 0.875rem;">{{ prof.email }}</td>
                <td style="padding: 0.875rem 1.25rem;">
                  <span style="padding: 0.25rem 0.625rem; background: #18181b; color: #a1a1aa; border: 1px solid #1e1e22; border-radius: 2rem; font-size: 0.75rem; font-weight: 500;">{{ prof.especialidade }}</span>
                </td>
                <td style="padding: 0.875rem 1.25rem; color: #a1a1aa; font-size: 0.875rem; font-weight: 500;">{{ prof.totalAlunos }}</td>
                <td style="padding: 0.875rem 1.25rem;">
                  @if (prof.nome) {
                    <span style="padding: 0.25rem 0.625rem; background: rgba(200, 255, 0, 0.1); color: #c8ff00; border-radius: 2rem; font-size: 0.75rem; font-weight: 600;">Ativo</span>
                  }
                </td>
                <td style="padding: 0.875rem 1.25rem;">
                  <div style="display: flex; gap: 0.5rem;">
                    <button (click)="editar(prof)"
                      style="padding: 0.375rem 0.75rem; background: rgba(250, 250, 250, 0.05); border: 1px solid #1e1e22; border-radius: 0.375rem; color: #a1a1aa; cursor: pointer; font-weight: 500; font-size: 0.75rem;">
                      Editar
                    </button>
                    <button (click)="deletar(prof)"
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
            <h3 style="color: #fafafa; margin: 0 0 0.5rem 0; font-size: 1.125rem; font-weight: 600;">Excluir professor</h3>
            <p style="color: #a1a1aa; margin: 0 0 1.5rem 0; font-size: 0.875rem; line-height: 1.5;">
              Tem certeza que deseja excluir <strong style="color: #fafafa;">{{ deletingProfessor()?.nome }}</strong>? Esta ação não pode ser desfeita.
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
    * { box-sizing: border-box; margin: 0; padding: 0; }
  `]
})
export class ProfessoresAdminComponent implements OnInit {
  private professoresService = inject(ProfessoresService);
  private toast = inject(ToastService);

  showForm = signal(false);
  editingId = signal<string | null>(null);
  loading = signal(false);
  professores = signal<ProfessorDto[]>([]);
  form = { nome: '', email: '', especialidade: '', cref: '', bio: '' };
  showDeleteModal = signal(false);
  deletingProfessor = signal<ProfessorDto | null>(null);
  excluindo = signal(false);

  ngOnInit(): void {
    this.loadProfessores();
  }

  loadProfessores(): void {
    this.loading.set(true);
    this.professoresService.getAll().subscribe({
      next: (res) => { if (res.success && res.data) this.professores.set(res.data); this.loading.set(false); },
      error: () => { this.loading.set(false); this.toast.error('Erro ao carregar professores'); }
    });
  }

  getAtivos(): number { return this.professores().length; }
  getTotalAlunos(): number { return this.professores().reduce((sum, p) => sum + p.totalAlunos, 0); }

  editar(prof: ProfessorDto): void {
    this.editingId.set(prof.id);
    this.form = { nome: prof.nome, email: prof.email, especialidade: prof.especialidade || '', cref: prof.cref || '', bio: prof.bio || '' };
    this.showForm.set(true);
  }

  salvar(): void {
    if (!this.form.nome) return;
    if (this.editingId()) {
      const dto: UpdateProfessorDto = {
        telefone: '', especialidade: this.form.especialidade, cref: this.form.cref, bio: this.form.bio
      };
      this.professoresService.update(this.editingId()!, dto).subscribe({
        next: () => { this.toast.success('Professor atualizado'); this.loadProfessores(); },
        error: () => this.toast.error('Erro ao atualizar professor')
      });
    } else {
      const dto: CreateProfessorDto = {
        nome: this.form.nome, email: this.form.email, password: '123456',
        especialidade: this.form.especialidade, cref: this.form.cref, bio: this.form.bio
      };
      this.professoresService.create(dto).subscribe({
        next: () => { this.toast.success('Professor criado'); this.loadProfessores(); },
        error: () => this.toast.error('Erro ao criar professor')
      });
    }
    this.cancelar();
  }

  deletar(prof: ProfessorDto): void {
    this.deletingProfessor.set(prof);
    this.showDeleteModal.set(true);
  }

  confirmarExclusao(): void {
    const prof = this.deletingProfessor();
    if (!prof) return;
    this.excluindo.set(true);
    this.professoresService.delete(prof.id).subscribe({
      next: () => { this.toast.success('Professor excluído'); this.loadProfessores(); this.showDeleteModal.set(false); this.deletingProfessor.set(null); this.excluindo.set(false); },
      error: () => { this.toast.error('Erro ao excluir professor'); this.excluindo.set(false); }
    });
  }

  cancelar(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form = { nome: '', email: '', especialidade: '', cref: '', bio: '' };
  }
}
