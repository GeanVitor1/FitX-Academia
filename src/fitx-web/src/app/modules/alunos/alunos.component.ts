import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Aluno {
  id: string;
  nome: string;
  email: string;
  plano: string;
  professor: string;
  matricula: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
}

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
        <button 
          (click)="showForm.set(!showForm())"
          style="padding: 0.625rem 1.25rem; background: #c8ff00; color: #09090b; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.2s ease; letter-spacing: -0.01em;"
          onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(200,255,0,0.2)'"
          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          {{ showForm() ? 'Cancelar' : '+ Novo Aluno' }}
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem; transition: all 0.2s ease;" onmouseover="this.style.borderColor='#27272a'" onmouseout="this.style.borderColor='#1e1e22'">
          <div style="color: #a1a1aa; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Total</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: #fafafa; letter-spacing: -0.025em;">{{ alunos().length }}</div>
        </div>
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem; transition: all 0.2s ease;" onmouseover="this.style.borderColor='#27272a'" onmouseout="this.style.borderColor='#1e1e22'">
          <div style="color: #a1a1aa; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Ativos</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: #c8ff00; letter-spacing: -0.025em;">{{ getAtivos() }}</div>
        </div>
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem; transition: all 0.2s ease;" onmouseover="this.style.borderColor='#27272a'" onmouseout="this.style.borderColor='#1e1e22'">
          <div style="color: #a1a1aa; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Inativos</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: #fafafa; letter-spacing: -0.025em;">{{ getInativos() }}</div>
        </div>
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem; transition: all 0.2s ease;" onmouseover="this.style.borderColor='#27272a'" onmouseout="this.style.borderColor='#1e1e22'">
          <div style="color: #a1a1aa; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Pendentes</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: #fafafa; letter-spacing: -0.025em;">{{ getPendentes() }}</div>
        </div>
      </div>

      @if (showForm()) {
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem; animation: slideDown 0.2s ease;">
          <h3 style="color: #fafafa; margin: 0 0 1.25rem 0; font-size: 1rem; font-weight: 600;">Novo Aluno</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.75rem; color: #a1a1aa; margin-bottom: 0.5rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Nome Completo</label>
              <input 
                type="text" 
                [(ngModel)]="form.nome" 
                placeholder="Nome do aluno"
                style="width: 100%; padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; transition: all 0.2s ease; box-sizing: border-box;"
                onfocus="this.style.borderColor='#c8ff00'; this.style.outline='none'"
                onblur="this.style.borderColor='#1e1e22'">
            </div>
            <div>
              <label style="display: block; font-size: 0.75rem; color: #a1a1aa; margin-bottom: 0.5rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Email</label>
              <input 
                type="email" 
                [(ngModel)]="form.email" 
                placeholder="email@exemplo.com"
                style="width: 100%; padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; transition: all 0.2s ease; box-sizing: border-box;"
                onfocus="this.style.borderColor='#c8ff00'; this.style.outline='none'"
                onblur="this.style.borderColor='#1e1e22'">
            </div>
            <div>
              <label style="display: block; font-size: 0.75rem; color: #a1a1aa; margin-bottom: 0.5rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Plano</label>
              <input 
                type="text" 
                [(ngModel)]="form.plano" 
                placeholder="Basico, Completo, Premium"
                style="width: 100%; padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; transition: all 0.2s ease; box-sizing: border-box;"
                onfocus="this.style.borderColor='#c8ff00'; this.style.outline='none'"
                onblur="this.style.borderColor='#1e1e22'">
            </div>
            <div>
              <label style="display: block; font-size: 0.75rem; color: #a1a1aa; margin-bottom: 0.5rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Professor</label>
              <input 
                type="text" 
                [(ngModel)]="form.professor" 
                placeholder="Professor responsavel"
                style="width: 100%; padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; transition: all 0.2s ease; box-sizing: border-box;"
                onfocus="this.style.borderColor='#c8ff00'; this.style.outline='none'"
                onblur="this.style.borderColor='#1e1e22'">
            </div>
          </div>
          <div style="margin-top: 1.25rem;">
            <button 
              (click)="salvar()"
              style="padding: 0.625rem 1.5rem; background: #c8ff00; color: #09090b; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(200,255,0,0.2)'"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
              Salvar Aluno
            </button>
          </div>
        </div>
      }

      <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; overflow: hidden;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid #1e1e22;">
          <h2 style="font-size: 1rem; color: #fafafa; margin: 0; font-weight: 600;">Alunos Cadastrados</h2>
          <input 
            type="text" 
            [(ngModel)]="filtro" 
            (ngModelChange)="aplicarFiltro()"
            placeholder="Filtrar por nome..."
            style="padding: 0.5rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.8125rem; width: 250px; transition: all 0.2s ease; box-sizing: border-box;"
            onfocus="this.style.borderColor='#c8ff00'; this.style.outline='none'"
            onblur="this.style.borderColor='#1e1e22'">
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Aluno</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Plano</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Professor</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Matricula</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Status</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Acao</th>
            </tr>
          </thead>
          <tbody>
            @for (aluno of filtrados(); track aluno.id) {
              <tr style="transition: background 0.15s ease; border-bottom: 1px solid #1e1e22;" onmouseover="this.style.background='#18181b'" onmouseout="this.style.background='transparent'">
                <td style="padding: 1rem 1.5rem;">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 36px; height: 36px; background: #18181b; border: 1px solid #1e1e22; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #c8ff00; font-size: 0.875rem; flex-shrink: 0; letter-spacing: -0.025em;">
                      {{ aluno.nome.charAt(0) }}
                    </div>
                    <div>
                      <div style="color: #fafafa; font-size: 0.875rem; font-weight: 500;">{{ aluno.nome }}</div>
                      <div style="color: #a1a1aa; font-size: 0.75rem; font-weight: 400;">{{ aluno.email }}</div>
                    </div>
                  </div>
                </td>
                <td style="padding: 1rem 1.5rem;">
                  <span style="padding: 0.25rem 0.625rem; background: rgba(200, 255, 0, 0.1); border-radius: 1rem; font-size: 0.75rem; font-weight: 500; color: #c8ff00;">{{ aluno.plano }}</span>
                </td>
                <td style="padding: 1rem 1.5rem; color: #a1a1aa; font-size: 0.875rem;">{{ aluno.professor }}</td>
                <td style="padding: 1rem 1.5rem; color: #a1a1aa; font-size: 0.875rem; font-family: 'SF Mono', 'Fira Code', monospace;">{{ aluno.matricula }}</td>
                <td style="padding: 1rem 1.5rem;">
                  @if (aluno.status === 'Ativo') {
                    <span style="padding: 0.25rem 0.625rem; background: rgba(200, 255, 0, 0.1); border-radius: 1rem; font-size: 0.75rem; font-weight: 500; color: #c8ff00;">Ativo</span>
                  } @else if (aluno.status === 'Inativo') {
                    <span style="padding: 0.25rem 0.625rem; background: rgba(161, 161, 170, 0.15); border-radius: 1rem; font-size: 0.75rem; font-weight: 500; color: #a1a1aa;">Inativo</span>
                  } @else {
                    <span style="padding: 0.25rem 0.625rem; background: rgba(250, 250, 250, 0.08); border-radius: 1rem; font-size: 0.75rem; font-weight: 500; color: #fafafa;">Pendente</span>
                  }
                </td>
                <td style="padding: 1rem 1.5rem;">
                  <button 
                    (click)="toggleStatus(aluno)"
                    style="padding: 0.375rem 0.75rem; background: rgba(250, 250, 250, 0.05); border: 1px solid #1e1e22; border-radius: 0.375rem; color: #a1a1aa; cursor: pointer; font-weight: 500; font-size: 0.75rem; transition: all 0.2s ease;"
                    onmouseover="this.style.borderColor='#27272a'; this.style.color='#fafafa'"
                    onmouseout="this.style.borderColor='#1e1e22'; this.style.color='#a1a1aa'">
                    {{ aluno.status === 'Ativo' ? 'Desativar' : 'Ativar' }}
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    :host { display: block; }
    * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
  `]
})
export class AlunosComponent {
  showForm = signal(false);
  filtro = '';
  form = { nome: '', email: '', plano: '', professor: '' };

  alunos = signal<Aluno[]>([]);

  filtrados = signal<Aluno[]>([]);

  constructor() { this.aplicarFiltro(); }

  getAtivos(): number { return this.alunos().filter(a => a.status === 'Ativo').length; }
  getInativos(): number { return this.alunos().filter(a => a.status === 'Inativo').length; }
  getPendentes(): number { return this.alunos().filter(a => a.status === 'Pendente').length; }

  aplicarFiltro(): void {
    const f = this.filtro.toLowerCase();
    this.filtrados.set(f ? this.alunos().filter(a => a.nome.toLowerCase().includes(f)) : this.alunos());
  }

  salvar(): void {
    if (!this.form.nome) return;
    const num = this.alunos().length + 1;
    const novo: Aluno = {
      id: Date.now().toString(), nome: this.form.nome, email: this.form.email,
      plano: this.form.plano || 'Nao informado', professor: this.form.professor || 'Nao atribuido',
      matricula: 'MAT-2026-' + num.toString().padStart(3, '0'), status: 'Ativo'
    };
    this.alunos.update(list => [novo, ...list]);
    this.form = { nome: '', email: '', plano: '', professor: '' };
    this.showForm.set(false);
    this.aplicarFiltro();
  }

  toggleStatus(aluno: Aluno): void {
    this.alunos.update(list => list.map(a =>
      a.id === aluno.id ? { ...a, status: a.status === 'Ativo' ? 'Inativo' : 'Ativo' } : a
    ));
    this.aplicarFiltro();
  }
}