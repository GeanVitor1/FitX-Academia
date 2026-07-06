import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Plano {
  id: string;
  nome: string;
  preco: number;
  descricao: string;
  recursos: string[];
  duracaoDias: number;
  permitePersonal: boolean;
  permiteAulas: boolean;
  ativo: boolean;
}

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 2rem; min-height: 100vh; background: #09090b; color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">

      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; max-width: 1200px; margin-left: auto; margin-right: auto;">
        <div>
          <h1 style="font-size: 1.875rem; font-weight: 700; color: #fafafa; margin: 0 0 0.375rem 0; letter-spacing: -0.02em;">Planos</h1>
          <p style="color: #a1a1aa; margin: 0; font-size: 0.875rem;">Gerencie os planos de assinatura da academia</p>
        </div>
        <button (click)="showForm.set(!showForm())"
          style="padding: 0.625rem 1.25rem; background: #c8ff00; color: #09090b; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.2s; letter-spacing: -0.01em;"
          onmouseover="this.style.opacity='0.9'"
          onmouseout="this.style.opacity='1'">
          {{ showForm() ? 'Cancelar' : '+ Novo Plano' }}
        </button>
      </div>

      @if (showForm()) {
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.75rem; margin-bottom: 2.5rem; max-width: 1200px; margin-left: auto; margin-right: auto; animation: fadeIn 0.2s ease;">
          <h3 style="color: #fafafa; margin: 0 0 1.5rem 0; font-size: 1rem; font-weight: 600;">{{ editingId() ? 'Editar Plano' : 'Novo Plano' }}</h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
            <div style="display: flex; flex-direction: column; gap: 0.375rem;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Nome</label>
              <input type="text" [(ngModel)]="formData.nome" placeholder="Ex: Premium"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; transition: border-color 0.2s;"
                onfocus="this.style.borderColor='#c8ff00'" onblur="this.style.borderColor='#1e1e22'">
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.375rem;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Preço (R$)</label>
              <input type="number" [(ngModel)]="formData.preco" placeholder="0.00"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; transition: border-color 0.2s;"
                onfocus="this.style.borderColor='#c8ff00'" onblur="this.style.borderColor='#1e1e22'">
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.375rem;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Duração (dias)</label>
              <input type="number" [(ngModel)]="formData.duracaoDias" placeholder="30"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; transition: border-color 0.2s;"
                onfocus="this.style.borderColor='#c8ff00'" onblur="this.style.borderColor='#1e1e22'">
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.375rem; grid-column: 1 / -1;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Descrição</label>
              <input type="text" [(ngModel)]="formData.descricao" placeholder="Descrição do plano"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; transition: border-color 0.2s;"
                onfocus="this.style.borderColor='#c8ff00'" onblur="this.style.borderColor='#1e1e22'">
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.375rem; grid-column: 1 / -1;">
              <label style="font-size: 0.8125rem; color: #a1a1aa; font-weight: 500;">Recursos (separados por vírgula)</label>
              <input type="text" [(ngModel)]="formData.recursosStr" placeholder="Musculação, Aulas, Personal"
                style="padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; transition: border-color 0.2s;"
                onfocus="this.style.borderColor='#c8ff00'" onblur="this.style.borderColor='#1e1e22'">
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <input type="checkbox" [(ngModel)]="formData.permitePersonal" id="chk-personal"
                style="accent-color: #c8ff00; width: 1rem; height: 1rem; cursor: pointer;">
              <label for="chk-personal" style="font-size: 0.875rem; color: #a1a1aa; cursor: pointer;">Permite Personal</label>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <input type="checkbox" [(ngModel)]="formData.permiteAulas" id="chk-aulas"
                style="accent-color: #c8ff00; width: 1rem; height: 1rem; cursor: pointer;">
              <label for="chk-aulas" style="font-size: 0.875rem; color: #a1a1aa; cursor: pointer;">Permite Aulas</label>
            </div>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <button (click)="save()"
              style="padding: 0.625rem 1.75rem; background: #c8ff00; color: #09090b; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.2s;"
              onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
              Salvar
            </button>
            <button (click)="cancel()"
              style="padding: 0.625rem 1.75rem; background: #18181b; color: #a1a1aa; border: 1px solid #1e1e22; border-radius: 0.5rem; font-size: 0.875rem; cursor: pointer; transition: all 0.2s;"
              onmouseover="this.style.borderColor='#52525b'" onmouseout="this.style.borderColor='#1e1e22'">
              Cancelar
            </button>
          </div>
        </div>
      }

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; max-width: 1200px; margin-left: auto; margin-right: auto;">
        @for (plano of planos(); track plano.id) {
          <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.75rem; transition: all 0.25s ease; display: flex; flex-direction: column;"
               [style.opacity]="plano.ativo ? '1' : '0.5'"
               [style.transform]="'none'"
               onmouseover="this.style.borderColor='#c8ff00'; this.style.transform='translateY(-2px)'"
               onmouseout="this.style.borderColor='#1e1e22'; this.style.transform='none'">

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <h3 style="color: #fafafa; margin: 0; font-size: 1.125rem; font-weight: 600; letter-spacing: -0.01em;">{{ plano.nome }}</h3>
              <span style="padding: 0.25rem 0.625rem; border-radius: 2rem; font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.02em;"
                [style.background]="plano.ativo ? 'rgba(200, 255, 0, 0.1)' : 'rgba(161, 161, 170, 0.1)'"
                [style.color]="plano.ativo ? '#c8ff00' : '#a1a1aa'">
                {{ plano.ativo ? 'ATIVO' : 'INATIVO' }}
              </span>
            </div>

            <div style="margin-bottom: 1rem;">
              <span style="font-size: 0.875rem; color: #a1a1aa; vertical-align: top;">R$</span>
              <span style="font-size: 2.25rem; font-weight: 800; color: #c8ff00; letter-spacing: -0.03em; line-height: 1;">{{ plano.preco.toFixed(2) }}</span>
              <span style="font-size: 0.8125rem; color: #52525b; margin-left: 0.25rem;">/mês</span>
            </div>

            <p style="color: #a1a1aa; font-size: 0.8125rem; margin: 0 0 1.25rem 0; line-height: 1.5;">{{ plano.descricao }}</p>

            <div style="flex: 1;">
              <ul style="list-style: none; padding: 0; margin: 0 0 1.25rem 0;">
                @for (recurso of plano.recursos; track recurso) {
                  <li style="padding: 0.5rem 0; color: #e4e4e7; font-size: 0.8125rem; border-bottom: 1px solid #1e1e22; display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: #c8ff00; font-size: 0.75rem;">→</span>
                    {{ recurso }}
                  </li>
                }
              </ul>
            </div>

            <div style="display: flex; gap: 0.625rem; margin-bottom: 1.25rem;">
              <span style="padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 500; display: flex; align-items: center; gap: 0.375rem;"
                [style.background]="plano.permitePersonal ? 'rgba(200, 255, 0, 0.08)' : 'rgba(82, 82, 91, 0.15)'"
                [style.color]="plano.permitePersonal ? '#c8ff00' : '#52525b'"
                [style.border]="plano.permitePersonal ? '1px solid rgba(200, 255, 0, 0.2)' : '1px solid #1e1e22'">
                {{ plano.permitePersonal ? '✓' : '✗' }} Personal
              </span>
              <span style="padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 500; display: flex; align-items: center; gap: 0.375rem;"
                [style.background]="plano.permiteAulas ? 'rgba(200, 255, 0, 0.08)' : 'rgba(82, 82, 91, 0.15)'"
                [style.color]="plano.permiteAulas ? '#c8ff00' : '#52525b'"
                [style.border]="plano.permiteAulas ? '1px solid rgba(200, 255, 0, 0.2)' : '1px solid #1e1e22'">
                {{ plano.permiteAulas ? '✓' : '✗' }} Aulas
              </span>
            </div>

            <div style="display: flex; gap: 0.625rem;">
              <button (click)="edit(plano)"
                style="flex: 1; padding: 0.5rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #a1a1aa; cursor: pointer; font-weight: 500; font-size: 0.8125rem; transition: all 0.2s;"
                onmouseover="this.style.borderColor='#c8ff00'; this.style.color='#fafafa'"
                onmouseout="this.style.borderColor='#1e1e22'; this.style.color='#a1a1aa'">
                Editar
              </button>
              <button (click)="toggleAtivo(plano)"
                style="flex: 1; padding: 0.5rem; border-radius: 0.5rem; font-weight: 500; font-size: 0.8125rem; cursor: pointer; transition: all 0.2s;"
                [style.background]="plano.ativo ? 'rgba(161, 161, 170, 0.08)' : 'rgba(200, 255, 0, 0.08)'"
                [style.border]="plano.ativo ? '1px solid rgba(161, 161, 170, 0.2)' : '1px solid rgba(200, 255, 0, 0.2)'"
                [style.color]="plano.ativo ? '#a1a1aa' : '#c8ff00'">
                {{ plano.ativo ? 'Desativar' : 'Ativar' }}
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 1024px) {
      div[style*="grid-template-columns: repeat(3"] { grid-template-columns: repeat(2, 1fr) !important; }
    }
    @media (max-width: 768px) {
      div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
      div[style*="grid-template-columns: repeat(2"] { grid-template-columns: 1fr !important; }
    }
  `]
})
export class PlanosComponent {
  showForm = signal(false);
  editingId = signal<string | null>(null);

  planos = signal<Plano[]>([
    {
      id: '1', nome: 'Basico', preco: 89.90, descricao: 'Comece sua transformação com o essencial',
      recursos: ['Musculação', 'Avaliação física', 'Treinos livres', 'Suporte básico'],
      duracaoDias: 30, permitePersonal: false, permiteAulas: false, ativo: true
    },
    {
      id: '2', nome: 'Completo', preco: 129.90, descricao: 'Resultados mais rápidos e completos',
      recursos: ['Musculação', 'Avaliação física', 'Aulas coletivas', 'Treinos personalizados', 'Suporte prioritário'],
      duracaoDias: 30, permitePersonal: true, permiteAulas: true, ativo: true
    },
    {
      id: '3', nome: 'Premium', preco: 199.90, descricao: 'Experiência sem limites para quem quer o máximo',
      recursos: ['Tudo do Completo', 'Consultoria exclusiva', 'Check-ups mensais', 'App personalizado', 'Acesso total'],
      duracaoDias: 30, permitePersonal: true, permiteAulas: true, ativo: true
    }
  ]);

  formData = {
    nome: '', preco: 0, descricao: '', duracaoDias: 30,
    recursosStr: '', permitePersonal: false, permiteAulas: false
  };

  save(): void {
    const recursos = this.formData.recursosStr.split(',').map(r => r.trim()).filter(r => r);
    if (this.editingId()) {
      this.planos.update(list => list.map(p =>
        p.id === this.editingId()
          ? { ...p, nome: this.formData.nome, preco: this.formData.preco, descricao: this.formData.descricao,
              duracaoDias: this.formData.duracaoDias, recursos, permitePersonal: this.formData.permitePersonal,
              permiteAulas: this.formData.permiteAulas }
          : p
      ));
    } else {
      const newPlano: Plano = {
        id: Date.now().toString(), nome: this.formData.nome, preco: this.formData.preco,
        descricao: this.formData.descricao, duracaoDias: this.formData.duracaoDias, recursos,
        permitePersonal: this.formData.permitePersonal, permiteAulas: this.formData.permiteAulas, ativo: true
      };
      this.planos.update(list => [...list, newPlano]);
    }
    this.cancel();
  }

  edit(plano: Plano): void {
    this.editingId.set(plano.id);
    this.formData = {
      nome: plano.nome, preco: plano.preco, descricao: plano.descricao,
      duracaoDias: plano.duracaoDias, recursosStr: plano.recursos.join(', '),
      permitePersonal: plano.permitePersonal, permiteAulas: plano.permiteAulas
    };
    this.showForm.set(true);
  }

  toggleAtivo(plano: Plano): void {
    this.planos.update(list => list.map(p =>
      p.id === plano.id ? { ...p, ativo: !p.ativo } : p
    ));
  }

  cancel(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.formData = { nome: '', preco: 0, descricao: '', duracaoDias: 30, recursosStr: '', permitePersonal: false, permiteAulas: false };
  }
}
