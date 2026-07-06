import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-equipamentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 2rem; min-height: 100vh; background: #09090b; color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">

      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; max-width: 1200px; margin-left: auto; margin-right: auto;">
        <div>
          <h1 style="font-size: 1.875rem; font-weight: 700; color: #fafafa; margin: 0 0 0.375rem 0; letter-spacing: -0.02em;">Equipamentos</h1>
          <p style="color: #a1a1aa; margin: 0; font-size: 0.875rem;">Gerencie o inventário de equipamentos</p>
        </div>
        <button (click)="showForm.set(!showForm())"
          style="padding: 0.625rem 1.25rem; background: #c8ff00; color: #09090b; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.2s;"
          onmouseover="this.style.opacity='0.9'"
          onmouseout="this.style.opacity='1'">
          {{ showForm() ? 'Cancelar' : '+ Novo Equipamento' }}
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; max-width: 1200px; margin-left: auto; margin-right: auto;">
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; transition: border-color 0.2s;"
             onmouseover="this.style.borderColor='#1e1e22'" onmouseout="this.style.borderColor='#1e1e22'">
          <div style="width: 40px; height: 40px; border-radius: 0.5rem; background: rgba(200, 255, 0, 0.08); display: flex; align-items: center; justify-content: center; font-size: 1.125rem; flex-shrink: 0;">🏋️</div>
          <div>
            <div style="font-size: 1.375rem; font-weight: 700; color: #fafafa; letter-spacing: -0.02em;">{{ equipamentos().length }}</div>
            <div style="font-size: 0.75rem; color: #52525b; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Total</div>
          </div>
        </div>
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem;">
          <div style="width: 40px; height: 40px; border-radius: 0.5rem; background: rgba(200, 255, 0, 0.08); display: flex; align-items: center; justify-content: center; font-size: 1.125rem; flex-shrink: 0;">✓</div>
          <div>
            <div style="font-size: 1.375rem; font-weight: 700; color: #c8ff00; letter-spacing: -0.02em;">{{ getAtivos() }}</div>
            <div style="font-size: 0.75rem; color: #52525b; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Ativos</div>
          </div>
        </div>
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem;">
          <div style="width: 40px; height: 40px; border-radius: 0.5rem; background: rgba(161, 161, 170, 0.08); display: flex; align-items: center; justify-content: center; font-size: 1.125rem; flex-shrink: 0;">⚙</div>
          <div>
            <div style="font-size: 1.375rem; font-weight: 700; color: #a1a1aa; letter-spacing: -0.02em;">{{ getManutencao() }}</div>
            <div style="font-size: 0.75rem; color: #52525b; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Manutenção</div>
          </div>
        </div>
      </div>

      @if (showForm()) {
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.75rem; margin-bottom: 2rem; max-width: 1200px; margin-left: auto; margin-right: auto; animation: fadeIn 0.2s ease;">
          <h3 style="color: #fafafa; margin: 0 0 1.5rem 0; font-size: 1rem; font-weight: 600;">{{ editingId() ? 'Editar Equipamento' : 'Novo Equipamento' }}</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
            <div style="display: flex; flex-direction: column; gap: 0.375rem;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Nome</label>
              <input type="text" [(ngModel)]="form.nome" placeholder="Nome do equipamento"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; transition: border-color 0.2s;"
                onfocus="this.style.borderColor='#c8ff00'" onblur="this.style.borderColor='#1e1e22'">
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.375rem;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Categoria</label>
              <select [(ngModel)]="form.categoria"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; transition: border-color 0.2s; cursor: pointer;"
                onfocus="this.style.borderColor='#c8ff00'" onblur="this.style.borderColor='#1e1e22'">
                <option value="">Selecione</option>
                <option value="Cardio">Cardio</option>
                <option value="Musculação">Musculação</option>
                <option value="Funcional">Funcional</option>
                <option value="Crossfit">Crossfit</option>
              </select>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.375rem;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Localização</label>
              <input type="text" [(ngModel)]="form.localizacao" placeholder="Ex: Área Cardio"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; transition: border-color 0.2s;"
                onfocus="this.style.borderColor='#c8ff00'" onblur="this.style.borderColor='#1e1e22'">
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.375rem;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Última Manutenção</label>
              <input type="text" [(ngModel)]="form.ultimaManutencao" placeholder="DD/MM/AAAA"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; transition: border-color 0.2s;"
                onfocus="this.style.borderColor='#c8ff00'" onblur="this.style.borderColor='#1e1e22'">
            </div>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <button (click)="salvar()"
              style="padding: 0.625rem 1.75rem; background: #c8ff00; color: #09090b; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.2s;"
              onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
              Salvar
            </button>
            <button (click)="cancelar()"
              style="padding: 0.625rem 1.75rem; background: #18181b; color: #a1a1aa; border: 1px solid #1e1e22; border-radius: 0.5rem; font-size: 0.875rem; cursor: pointer; transition: all 0.2s;"
              onmouseover="this.style.borderColor='#52525b'" onmouseout="this.style.borderColor='#1e1e22'">
              Cancelar
            </button>
          </div>
        </div>
      }

      <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; overflow: hidden; max-width: 1200px; margin-left: auto; margin-right: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid #1e1e22;">
          <h2 style="font-size: 0.9375rem; color: #fafafa; margin: 0; font-weight: 600;">Equipamentos Cadastrados</h2>
          <input type="text" [(ngModel)]="filtro" (ngModelChange)="aplicarFiltro()" placeholder="Filtrar por nome..."
            style="padding: 0.5rem 0.875rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.8125rem; width: 220px; transition: border-color 0.2s;"
            onfocus="this.style.borderColor='#c8ff00'" onblur="this.style.borderColor='#1e1e22'">
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 0.875rem 1.5rem; text-align: left; background: #18181b; color: #52525b; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #1e1e22;">Nome</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; background: #18181b; color: #52525b; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #1e1e22;">Categoria</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; background: #18181b; color: #52525b; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #1e1e22;">Localização</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; background: #18181b; color: #52525b; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #1e1e22;">Status</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; background: #18181b; color: #52525b; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #1e1e22;">Última Manutenção</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; background: #18181b; color: #52525b; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #1e1e22;">Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (eq of filtrados(); track eq.id) {
              <tr style="transition: background 0.15s;"
                  onmouseover="this.style.background='rgba(200, 255, 0, 0.02)'"
                  onmouseout="this.style.background='transparent'">
                <td style="padding: 0.875rem 1.5rem; color: #fafafa; font-size: 0.875rem; border-bottom: 1px solid #1e1e22; font-weight: 500;">{{ eq.nome }}</td>
                <td style="padding: 0.875rem 1.5rem; border-bottom: 1px solid #1e1e22;">
                  <span style="padding: 0.25rem 0.625rem; border-radius: 2rem; font-size: 0.6875rem; font-weight: 600; background: rgba(200, 255, 0, 0.08); color: #c8ff00; border: 1px solid rgba(200, 255, 0, 0.15);">{{ eq.categoria }}</span>
                </td>
                <td style="padding: 0.875rem 1.5rem; color: #a1a1aa; font-size: 0.875rem; border-bottom: 1px solid #1e1e22;">{{ eq.localizacao }}</td>
                <td style="padding: 0.875rem 1.5rem; border-bottom: 1px solid #1e1e22;">
                  <span style="padding: 0.25rem 0.625rem; border-radius: 2rem; font-size: 0.6875rem; font-weight: 600;"
                    [style.background]="eq.status === 'Ativo' ? 'rgba(200, 255, 0, 0.08)' : eq.status === 'Manutenção' ? 'rgba(161, 161, 170, 0.08)' : 'rgba(82, 82, 91, 0.15)'"
                    [style.color]="eq.status === 'Ativo' ? '#c8ff00' : eq.status === 'Manutenção' ? '#a1a1aa' : '#52525b'"
                    [style.border]="eq.status === 'Ativo' ? '1px solid rgba(200, 255, 0, 0.15)' : '1px solid #1e1e22'">
                    {{ eq.status }}
                  </span>
                </td>
                <td style="padding: 0.875rem 1.5rem; color: #a1a1aa; font-size: 0.875rem; border-bottom: 1px solid #1e1e22;">{{ eq.ultimaManutencao }}</td>
                <td style="padding: 0.875rem 1.5rem; border-bottom: 1px solid #1e1e22;">
                  <div style="display: flex; gap: 0.375rem;">
                    <button (click)="editar(eq)" title="Editar"
                      style="width: 30px; height: 30px; border-radius: 0.375rem; border: 1px solid #1e1e22; background: #18181b; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.75rem; transition: all 0.2s; color: #a1a1aa;"
                      onmouseover="this.style.borderColor='#c8ff00'; this.style.color='#fafafa'"
                      onmouseout="this.style.borderColor='#1e1e22'; this.style.color='#a1a1aa'">
                      ✎
                    </button>
                    <button (click)="ciclarStatus(eq)" title="Alterar status"
                      style="width: 30px; height: 30px; border-radius: 0.375rem; border: 1px solid #1e1e22; background: #18181b; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.75rem; transition: all 0.2s; color: #a1a1aa;"
                      onmouseover="this.style.borderColor='#a1a1aa'; this.style.color='#fafafa'"
                      onmouseout="this.style.borderColor='#1e1e22'; this.style.color='#a1a1aa'">
                      ↻
                    </button>
                    <button (click)="excluir(eq.id)" title="Excluir"
                      style="width: 30px; height: 30px; border-radius: 0.375rem; border: 1px solid #1e1e22; background: #18181b; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.75rem; transition: all 0.2s; color: #a1a1aa;"
                      onmouseover="this.style.borderColor='#ef4444'; this.style.color='#ef4444'"
                      onmouseout="this.style.borderColor='#1e1e22'; this.style.color='#a1a1aa'">
                      ✕
                    </button>
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
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 768px) {
      div[style*="grid-template-columns: repeat(2"] { grid-template-columns: 1fr !important; }
      div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
      input[style*="width: 220px"] { width: 100% !important; }
    }
  `]
})
export class EquipamentosComponent {
  showForm = signal(false);
  editingId = signal<string | null>(null);
  filtro = '';
  form = { nome: '', categoria: '', localizacao: '', ultimaManutencao: '' };

  equipamentos = signal([] as { id: string; nome: string; categoria: string; localizacao: string; status: string; ultimaManutencao: string }[]);

  filtrados = signal([] as { id: string; nome: string; categoria: string; localizacao: string; status: string; ultimaManutencao: string }[]);

  constructor() { this.aplicarFiltro(); }

  getAtivos(): number { return this.equipamentos().filter(e => e.status === 'Ativo').length; }
  getManutencao(): number { return this.equipamentos().filter(e => e.status === 'Manutenção').length; }

  aplicarFiltro(): void {
    const f = this.filtro.toLowerCase();
    this.filtrados.set(f ? this.equipamentos().filter(e => e.nome.toLowerCase().includes(f)) : [...this.equipamentos()]);
  }

  editar(eq: any): void {
    this.editingId.set(eq.id);
    this.form = { nome: eq.nome, categoria: eq.categoria, localizacao: eq.localizacao, ultimaManutencao: eq.ultimaManutencao };
    this.showForm.set(true);
  }

  salvar(): void {
    if (!this.form.nome) return;
    if (this.editingId()) {
      this.equipamentos.update(list => list.map(e =>
        e.id === this.editingId()
          ? { ...e, nome: this.form.nome, categoria: this.form.categoria || 'Não informado', localizacao: this.form.localizacao, ultimaManutencao: this.form.ultimaManutencao || 'Não informado' }
          : e
      ));
    } else {
      const novo = {
        id: Date.now().toString(), nome: this.form.nome, categoria: this.form.categoria || 'Não informado',
        localizacao: this.form.localizacao || 'Não informado', status: 'Ativo', ultimaManutencao: this.form.ultimaManutencao || 'Não informado'
      };
      this.equipamentos.update(list => [novo, ...list]);
    }
    this.aplicarFiltro();
    this.cancelar();
  }

  ciclarStatus(eq: any): void {
    const ciclo: Record<string, string> = { 'Ativo': 'Manutenção', 'Manutenção': 'Inativo', 'Inativo': 'Ativo' };
    this.equipamentos.update(list => list.map(e =>
      e.id === eq.id ? { ...e, status: ciclo[e.status] || 'Ativo' } : e
    ));
    this.aplicarFiltro();
  }

  excluir(id: string): void {
    this.equipamentos.update(list => list.filter(e => e.id !== id));
    this.aplicarFiltro();
  }

  cancelar(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form = { nome: '', categoria: '', localizacao: '', ultimaManutencao: '' };
  }
}
