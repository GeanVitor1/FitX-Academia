import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipamentosService, EquipamentoDto, CreateEquipamentoDto, UpdateEquipamentoDto } from '../../core/services/equipamentos.service';
import { ToastService } from '../../shared/services/toast.service';

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
          style="padding: 0.625rem 1.25rem; background: #c8ff00; color: #09090b; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.2s;">
          {{ showForm() ? 'Cancelar' : '+ Novo Equipamento' }}
        </button>
      </div>

      @if (loading()) {
        <div style="text-align:center;padding:3rem;color:#52525b;">Carregando...</div>
      }

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; max-width: 1200px; margin-left: auto; margin-right: auto;">
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem;">
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
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.75rem; margin-bottom: 2rem; max-width: 1200px; margin-left: auto; margin-right: auto;">
          <h3 style="color: #fafafa; margin: 0 0 1.5rem 0; font-size: 1rem; font-weight: 600;">{{ editingId() ? 'Editar Equipamento' : 'Novo Equipamento' }}</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
            <div style="display: flex; flex-direction: column; gap: 0.375rem;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Nome</label>
              <input type="text" [(ngModel)]="form.nome" placeholder="Nome do equipamento"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem;">
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.375rem;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Categoria</label>
              <select [(ngModel)]="form.categoria"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; cursor: pointer;">
                <option value="">Selecione</option>
                <option value="Cardio">Cardio</option>
                <option value="Musculacao">Musculação</option>
                <option value="Funcional">Funcional</option>
                <option value="Crossfit">Crossfit</option>
              </select>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.375rem;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Localização</label>
              <input type="text" [(ngModel)]="form.localizacao" placeholder="Ex: Área Cardio"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem;">
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.375rem;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Última Manutenção</label>
              <input type="text" [(ngModel)]="form.ultimaManutencao" placeholder="DD/MM/AAAA"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem;">
            </div>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <button (click)="salvar()"
              style="padding: 0.625rem 1.75rem; background: #c8ff00; color: #09090b; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.2s;">
              {{ saving() ? 'Salvando...' : 'Salvar' }}
            </button>
            <button (click)="cancelar()"
              style="padding: 0.625rem 1.75rem; background: #18181b; color: #a1a1aa; border: 1px solid #1e1e22; border-radius: 0.5rem; font-size: 0.875rem; cursor: pointer;">
              Cancelar
            </button>
          </div>
        </div>
      }

      <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; overflow: hidden; max-width: 1200px; margin-left: auto; margin-right: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid #1e1e22;">
          <h2 style="font-size: 0.9375rem; color: #fafafa; margin: 0; font-weight: 600;">Equipamentos Cadastrados</h2>
          <input type="text" [(ngModel)]="filtro" (ngModelChange)="aplicarFiltro()" placeholder="Filtrar por nome..."
            style="padding: 0.5rem 0.875rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.8125rem; width: 220px;">
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 0.875rem 1.5rem; text-align: left; background: #18181b; color: #52525b; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #1e1e22;">Nome</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; background: #18181b; color: #52525b; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #1e1e22;">Categoria</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; background: #18181b; color: #52525b; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #1e1e22;">Localização</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; background: #18181b; color: #52525b; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #1e1e22;">Status</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; background: #18181b; color: #52525b; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #1e1e22;">Manutenção</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; background: #18181b; color: #52525b; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #1e1e22;">Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (eq of filtrados(); track eq.id) {
              <tr>
                <td style="padding: 0.875rem 1.5rem; color: #fafafa; font-size: 0.875rem; border-bottom: 1px solid #1e1e22; font-weight: 500;">{{ eq.nome }}</td>
                <td style="padding: 0.875rem 1.5rem; border-bottom: 1px solid #1e1e22;">
                  <span style="padding: 0.25rem 0.625rem; border-radius: 2rem; font-size: 0.6875rem; font-weight: 600; background: rgba(200, 255, 0, 0.08); color: #c8ff00; border: 1px solid rgba(200, 255, 0, 0.15);">{{ eq.categoria }}</span>
                </td>
                <td style="padding: 0.875rem 1.5rem; color: #a1a1aa; font-size: 0.875rem; border-bottom: 1px solid #1e1e22;">{{ eq.localizacao }}</td>
                <td style="padding: 0.875rem 1.5rem; border-bottom: 1px solid #1e1e22;">
                  <span style="padding: 0.25rem 0.625rem; border-radius: 2rem; font-size: 0.6875rem; font-weight: 600;"
                    [style.background]="eq.status === 'Ativo' ? 'rgba(200, 255, 0, 0.08)' : eq.status === 'Manutencao' ? 'rgba(161, 161, 170, 0.08)' : 'rgba(82, 82, 91, 0.15)'"
                    [style.color]="eq.status === 'Ativo' ? '#c8ff00' : eq.status === 'Manutencao' ? '#a1a1aa' : '#52525b'"
                    [style.border]="eq.status === 'Ativo' ? '1px solid rgba(200, 255, 0, 0.15)' : '1px solid #1e1e22'">
                    {{ getStatusLabel(eq.status) }}
                  </span>
                </td>
                <td style="padding: 0.875rem 1.5rem; color: #a1a1aa; font-size: 0.875rem; border-bottom: 1px solid #1e1e22;">{{ eq.ultimaManutencao }}</td>
                <td style="padding: 0.875rem 1.5rem; border-bottom: 1px solid #1e1e22;">
                  <div style="display: flex; gap: 0.375rem;">
                    <button (click)="editar(eq)" title="Editar"
                      style="width: 30px; height: 30px; border-radius: 0.375rem; border: 1px solid #1e1e22; background: #18181b; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.75rem; color: #a1a1aa;">✎</button>
                    <button (click)="ciclarStatus(eq)" title="Alterar status"
                      style="width: 30px; height: 30px; border-radius: 0.375rem; border: 1px solid #1e1e22; background: #18181b; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.75rem; color: #a1a1aa;">↻</button>
                    <button (click)="excluir(eq)" title="Excluir"
                      style="width: 30px; height: 30px; border-radius: 0.375rem; border: 1px solid #1e1e22; background: #18181b; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.75rem; color: #a1a1aa;">✕</button>
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
    @media (max-width: 768px) {
      div[style*="grid-template-columns: repeat(2"] { grid-template-columns: 1fr !important; }
      div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
      input[style*="width: 220px"] { width: 100% !important; }
    }
  `]
})
export class EquipamentosComponent implements OnInit {
  private equipamentosService = inject(EquipamentosService);
  private toast = inject(ToastService);

  showForm = signal(false);
  editingId = signal<string | null>(null);
  loading = signal(false);
  saving = signal(false);
  filtro = '';
  form = { nome: '', categoria: '', localizacao: '', ultimaManutencao: '' };

  equipamentos = signal<EquipamentoDto[]>([]);
  filtrados = signal<EquipamentoDto[]>([]);

  ngOnInit(): void {
    this.loadEquipamentos();
  }

  private loadEquipamentos(): void {
    this.loading.set(true);
    this.equipamentosService.getAll().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.equipamentos.set(res.data);
          this.aplicarFiltro();
        }
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); this.toast.error('Erro ao carregar equipamentos'); }
    });
  }

  getStatusLabel(status: string): string {
    return status === 'Manutencao' ? 'Manutenção' :
           status === 'Ativo' ? 'Ativo' : 'Inativo';
  }

  getAtivos(): number { return this.equipamentos().filter(e => e.status === 'Ativo').length; }
  getManutencao(): number { return this.equipamentos().filter(e => e.status === 'Manutencao').length; }

  aplicarFiltro(): void {
    const f = this.filtro.toLowerCase();
    this.filtrados.set(f ? this.equipamentos().filter(e => e.nome.toLowerCase().includes(f)) : [...this.equipamentos()]);
  }

  editar(eq: EquipamentoDto): void {
    this.editingId.set(eq.id);
    this.form = { nome: eq.nome, categoria: eq.categoria, localizacao: eq.localizacao || '', ultimaManutencao: eq.ultimaManutencao || '' };
    this.showForm.set(true);
  }

  salvar(): void {
    if (!this.form.nome) return;
    this.saving.set(true);
    if (this.editingId()) {
      const dto: UpdateEquipamentoDto = {
        nome: this.form.nome,
        categoria: this.form.categoria || undefined,
        localizacao: this.form.localizacao || undefined,
        ultimaManutencao: this.form.ultimaManutencao || undefined
      };
      this.equipamentosService.update(this.editingId()!, dto).subscribe({
        next: () => { this.saving.set(false); this.toast.success('Equipamento atualizado'); this.loadEquipamentos(); },
        error: () => { this.saving.set(false); this.toast.error('Erro ao atualizar'); }
      });
    } else {
      const dto: CreateEquipamentoDto = {
        nome: this.form.nome,
        categoria: this.form.categoria || 'Nao informado',
        localizacao: this.form.localizacao || undefined,
        ultimaManutencao: this.form.ultimaManutencao || undefined
      };
      this.equipamentosService.create(dto).subscribe({
        next: () => { this.saving.set(false); this.toast.success('Equipamento criado'); this.loadEquipamentos(); },
        error: () => { this.saving.set(false); this.toast.error('Erro ao criar'); }
      });
    }
    this.cancelar();
  }

  ciclarStatus(eq: EquipamentoDto): void {
    const ciclo: Record<string, string> = { 'Ativo': 'Manutencao', 'Manutencao': 'Inativo', 'Inativo': 'Ativo' };
    const novoStatus = ciclo[eq.status] || 'Ativo';
    this.equipamentosService.update(eq.id, { status: novoStatus }).subscribe({
      next: () => this.loadEquipamentos(),
      error: () => this.toast.error('Erro ao alterar status')
    });
  }

  excluir(eq: EquipamentoDto): void {
    this.equipamentosService.delete(eq.id).subscribe({
      next: () => { this.toast.success('Equipamento excluido'); this.loadEquipamentos(); },
      error: () => this.toast.error('Erro ao excluir')
    });
  }

  cancelar(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form = { nome: '', categoria: '', localizacao: '', ultimaManutencao: '' };
  }
}