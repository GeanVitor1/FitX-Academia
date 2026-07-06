import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Professor {
  id: string;
  nome: string;
  email: string;
  especialidade: string;
  cref: string;
  bio: string;
  alunos: number;
  status: string;
}

@Component({
  selector: 'app-professores-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; padding: 2rem; background: #09090b; min-height: 100vh; color: #fff;">

      <!-- Page Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin: 0 0 0.375rem 0; letter-spacing: -0.02em;">
            Gerenciar <span style="color: #c8ff00;">Professores</span>
          </h1>
          <p style="color: #a1a1aa; margin: 0; font-size: 0.875rem; font-weight: 400;">Professores cadastrados na academia</p>
        </div>
        <button
          (click)="showForm.set(!showForm())"
          style="padding: 0.625rem 1.25rem; background: #c8ff00; color: #09090b; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.2s ease; letter-spacing: -0.01em;"
          onmouseover="this.style.opacity='0.9'"
          onmouseout="this.style.opacity='1'"
        >
          {{ showForm() ? 'Cancelar' : '+ Novo Professor' }}
        </button>
      </div>

      <!-- Stats Grid -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem;">
          <div style="width: 40px; height: 40px; background: #18181b; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; font-size: 1.125rem; border: 1px solid #1e1e22;">🏋️</div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 700; color: #fff; line-height: 1.2; letter-spacing: -0.02em;">{{ professores().length }}</div>
            <div style="font-size: 0.75rem; color: #a1a1aa; font-weight: 500;">Total</div>
          </div>
        </div>
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem;">
          <div style="width: 40px; height: 40px; background: #18181b; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; font-size: 1.125rem; border: 1px solid #1e1e22;">✅</div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 700; color: #c8ff00; line-height: 1.2; letter-spacing: -0.02em;">{{ getAtivos() }}</div>
            <div style="font-size: 0.75rem; color: #a1a1aa; font-weight: 500;">Ativos</div>
          </div>
        </div>
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem;">
          <div style="width: 40px; height: 40px; background: #18181b; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; font-size: 1.125rem; border: 1px solid #1e1e22;">👥</div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 700; color: #fff; line-height: 1.2; letter-spacing: -0.02em;">{{ getTotalAlunos() }}</div>
            <div style="font-size: 0.75rem; color: #a1a1aa; font-weight: 500;">Total Alunos</div>
          </div>
        </div>
      </div>

      <!-- Form Card -->
      @if (showForm()) {
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem; animation: slideDown 0.2s ease;">
          <h3 style="color: #fff; margin: 0 0 1.25rem 0; font-size: 1rem; font-weight: 600; letter-spacing: -0.01em;">
            {{ editingId() ? 'Editar Professor' : 'Novo Professor' }}
          </h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Nome</label>
              <input
                type="text"
                [(ngModel)]="form.nome"
                placeholder="Nome completo"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fff; font-size: 0.875rem; font-family: inherit; transition: border-color 0.2s ease; outline: none;"
                onfocus="this.style.borderColor='#c8ff00'"
                onblur="this.style.borderColor='#1e1e22'"
              >
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Email</label>
              <input
                type="email"
                [(ngModel)]="form.email"
                placeholder="email@fitx.com"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fff; font-size: 0.875rem; font-family: inherit; transition: border-color 0.2s ease; outline: none;"
                onfocus="this.style.borderColor='#c8ff00'"
                onblur="this.style.borderColor='#1e1e22'"
              >
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Especialidade</label>
              <input
                type="text"
                [(ngModel)]="form.especialidade"
                placeholder="Ex: Musculacao"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fff; font-size: 0.875rem; font-family: inherit; transition: border-color 0.2s ease; outline: none;"
                onfocus="this.style.borderColor='#c8ff00'"
                onblur="this.style.borderColor='#1e1e22'"
              >
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">CREF</label>
              <input
                type="text"
                [(ngModel)]="form.cref"
                placeholder="CREF-00000"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fff; font-size: 0.875rem; font-family: inherit; transition: border-color 0.2s ease; outline: none;"
                onfocus="this.style.borderColor='#c8ff00'"
                onblur="this.style.borderColor='#1e1e22'"
              >
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; grid-column: 1 / -1;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Biografia</label>
              <textarea
                [(ngModel)]="form.bio"
                placeholder="Sobre o professor..."
                rows="3"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fff; font-size: 0.875rem; font-family: inherit; resize: vertical; transition: border-color 0.2s ease; outline: none;"
                onfocus="this.style.borderColor='#c8ff00'"
                onblur="this.style.borderColor='#1e1e22'"
              ></textarea>
            </div>
          </div>
          <div style="display: flex; gap: 0.75rem; margin-top: 1.25rem;">
            <button
              (click)="salvar()"
              style="padding: 0.625rem 1.5rem; background: #c8ff00; color: #09090b; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.2s ease;"
              onmouseover="this.style.opacity='0.9'"
              onmouseout="this.style.opacity='1'"
            >
              Salvar
            </button>
            <button
              (click)="cancelar()"
              style="padding: 0.625rem 1.5rem; background: #18181b; color: #fff; border: 1px solid #1e1e22; border-radius: 0.5rem; font-weight: 500; font-size: 0.875rem; cursor: pointer; transition: all 0.2s ease;"
              onmouseover="this.style.borderColor='#52525b'"
              onmouseout="this.style.borderColor='#1e1e22'"
            >
              Cancelar
            </button>
          </div>
        </div>
      }

      <!-- Table Container -->
      <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #18181b;">
              <th style="padding: 0.75rem 1.25rem; text-align: left; font-size: 0.6875rem; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #1e1e22;">Nome</th>
              <th style="padding: 0.75rem 1.25rem; text-align: left; font-size: 0.6875rem; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #1e1e22;">Email</th>
              <th style="padding: 0.75rem 1.25rem; text-align: left; font-size: 0.6875rem; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #1e1e22;">Especialidade</th>
              <th style="padding: 0.75rem 1.25rem; text-align: left; font-size: 0.6875rem; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #1e1e22;">CREF</th>
              <th style="padding: 0.75rem 1.25rem; text-align: left; font-size: 0.6875rem; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #1e1e22;">Alunos</th>
              <th style="padding: 0.75rem 1.25rem; text-align: left; font-size: 0.6875rem; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #1e1e22;">Status</th>
              <th style="padding: 0.75rem 1.25rem; text-align: left; font-size: 0.6875rem; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #1e1e22;">Acoes</th>
            </tr>
          </thead>
          <tbody>
            @for (prof of professores(); track prof.id) {
              <tr style="border-bottom: 1px solid #1e1e22; transition: background 0.15s ease;" onmouseover="this.style.background='#18181b'" onmouseout="this.style.background='transparent'">
                <td style="padding: 0.875rem 1.25rem; font-weight: 600; color: #fff; font-size: 0.875rem;">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 32px; height: 32px; background: #18181b; border: 1px solid #1e1e22; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #c8ff00; font-size: 0.8125rem; flex-shrink: 0; letter-spacing: -0.01em;">{{ prof.nome.charAt(0) }}</div>
                    {{ prof.nome }}
                  </div>
                </td>
                <td style="padding: 0.875rem 1.25rem; color: #a1a1aa; font-size: 0.875rem;">{{ prof.email }}</td>
                <td style="padding: 0.875rem 1.25rem;">
                  <span style="padding: 0.25rem 0.625rem; background: #18181b; color: #a1a1aa; border: 1px solid #1e1e22; border-radius: 2rem; font-size: 0.75rem; font-weight: 500;">{{ prof.especialidade }}</span>
                </td>
                <td style="padding: 0.875rem 1.25rem; font-family: 'SF Mono', 'Fira Code', monospace; color: #52525b; font-size: 0.8125rem;">{{ prof.cref }}</td>
                <td style="padding: 0.875rem 1.25rem; color: #a1a1aa; font-size: 0.875rem; font-weight: 500;">{{ prof.alunos }}</td>
                <td style="padding: 0.875rem 1.25rem;">
                  @if (prof.status === 'Ativo') {
                    <span style="padding: 0.25rem 0.625rem; background: rgba(200, 255, 0, 0.1); color: #c8ff00; border-radius: 2rem; font-size: 0.75rem; font-weight: 600;">Ativo</span>
                  } @else {
                    <span style="padding: 0.25rem 0.625rem; background: #18181b; color: #52525b; border: 1px solid #1e1e22; border-radius: 2rem; font-size: 0.75rem; font-weight: 600;">Inativo</span>
                  }
                </td>
                <td style="padding: 0.875rem 1.25rem;">
                  <div style="display: flex; gap: 0.5rem;">
                    <button
                      (click)="editar(prof)"
                      title="Editar"
                      style="width: 30px; height: 30px; border-radius: 0.375rem; border: 1px solid #1e1e22; background: #18181b; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.8125rem; transition: all 0.2s ease; color: #a1a1aa;"
                      onmouseover="this.style.borderColor='#c8ff00'; this.style.color='#c8ff00'"
                      onmouseout="this.style.borderColor='#1e1e22'; this.style.color='#a1a1aa'"
                    >✏️</button>
                    <button
                      (click)="toggleStatus(prof)"
                      [title]="prof.status === 'Ativo' ? 'Desativar' : 'Ativar'"
                      style="width: 30px; height: 30px; border-radius: 0.375rem; border: 1px solid #1e1e22; background: #18181b; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.8125rem; transition: all 0.2s ease; color: #a1a1aa;"
                      onmouseover="this.style.borderColor='#c8ff00'; this.style.color='#c8ff00'"
                      onmouseout="this.style.borderColor='#1e1e22'; this.style.color='#a1a1aa'"
                    >
                      {{ prof.status === 'Ativo' ? '🔴' : '🟢' }}
                    </button>
                    <button
                      (click)="excluir(prof.id)"
                      title="Excluir"
                      style="width: 30px; height: 30px; border-radius: 0.375rem; border: 1px solid #1e1e22; background: #18181b; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.8125rem; transition: all 0.2s ease; color: #a1a1aa;"
                      onmouseover="this.style.borderColor='#ef4444'; this.style.color='#ef4444'; this.style.background='rgba(239,68,68,0.1)'"
                      onmouseout="this.style.borderColor='#1e1e22'; this.style.color='#a1a1aa'; this.style.background='#18181b'"
                    >🗑️</button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    :host { display: block; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    input::placeholder, textarea::placeholder { color: #52525b; }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ProfessoresAdminComponent {
  showForm = signal(false);
  editingId = signal<string | null>(null);

  professores = signal<Professor[]>([]);

  form = { nome: '', email: '', especialidade: '', cref: '', bio: '' };

  getAtivos(): number { return this.professores().filter(p => p.status === 'Ativo').length; }
  getTotalAlunos(): number { return this.professores().reduce((sum, p) => sum + p.alunos, 0); }

  editar(prof: Professor): void {
    this.editingId.set(prof.id);
    this.form = { nome: prof.nome, email: prof.email, especialidade: prof.especialidade, cref: prof.cref, bio: prof.bio };
    this.showForm.set(true);
  }

  salvar(): void {
    if (!this.form.nome) return;
    if (this.editingId()) {
      this.professores.update(list => list.map(p =>
        p.id === this.editingId()
          ? { ...p, nome: this.form.nome, email: this.form.email, especialidade: this.form.especialidade, cref: this.form.cref, bio: this.form.bio }
          : p
      ));
    } else {
      const novo: Professor = {
        id: Date.now().toString(), nome: this.form.nome, email: this.form.email,
        especialidade: this.form.especialidade || 'Nao informado', cref: this.form.cref || 'Nao informado',
        bio: this.form.bio, alunos: 0, status: 'Ativo'
      };
      this.professores.update(list => [...list, novo]);
    }
    this.cancelar();
  }

  toggleStatus(prof: Professor): void {
    this.professores.update(list => list.map(p =>
      p.id === prof.id ? { ...p, status: p.status === 'Ativo' ? 'Inativo' : 'Ativo' } : p
    ));
  }

  excluir(id: string): void {
    this.professores.update(list => list.filter(p => p.id !== id));
  }

  cancelar(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form = { nome: '', email: '', especialidade: '', cref: '', bio: '' };
  }
}
