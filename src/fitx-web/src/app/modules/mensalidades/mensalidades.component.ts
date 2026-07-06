import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Mensalidade {
  id: string;
  aluno: string;
  plano: string;
  valor: number;
  vencimento: string;
  pagoEm: string | null;
  status: 'Paga' | 'Pendente' | 'Atrasada';
}

@Component({
  selector: 'app-mensalidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; padding: 2.5rem; background: #09090b; min-height: 100vh; color: #fafafa;">
      
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem;">
        <div>
          <h1 style="font-size: 1.875rem; font-weight: 700; color: #fafafa; margin: 0 0 0.5rem 0; letter-spacing: -0.025em;">
            <span style="color: #c8ff00;">Mensalidades</span>
          </h1>
          <p style="color: #a1a1aa; margin: 0; font-size: 0.875rem;">Controle de pagamentos da academia</p>
        </div>
        <button 
          (click)="showForm.set(!showForm())"
          style="padding: 0.625rem 1.25rem; background: #c8ff00; color: #09090b; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.2s ease; letter-spacing: -0.01em;"
          onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(200,255,0,0.2)'"
          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          {{ showForm() ? 'Cancelar' : '+ Nova Mensalidade' }}
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem; transition: all 0.2s ease;" onmouseover="this.style.borderColor='#27272a'" onmouseout="this.style.borderColor='#1e1e22'">
          <div style="color: #a1a1aa; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Recebido</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: #c8ff00; letter-spacing: -0.025em;">R$ {{ getTotalRecebido() }}</div>
        </div>
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem; transition: all 0.2s ease;" onmouseover="this.style.borderColor='#27272a'" onmouseout="this.style.borderColor='#1e1e22'">
          <div style="color: #a1a1aa; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Pendente</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: #fafafa; letter-spacing: -0.025em;">R$ {{ getTotalPendente() }}</div>
        </div>
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem; transition: all 0.2s ease;" onmouseover="this.style.borderColor='#27272a'" onmouseout="this.style.borderColor='#1e1e22'">
          <div style="color: #a1a1aa; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Atrasadas</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: #fafafa; letter-spacing: -0.025em;">{{ getAtrasadas() }}</div>
        </div>
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem; transition: all 0.2s ease;" onmouseover="this.style.borderColor='#27272a'" onmouseout="this.style.borderColor='#1e1e22'">
          <div style="color: #a1a1aa; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Pagas</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: #fafafa; letter-spacing: -0.025em;">{{ getPagas() }}</div>
        </div>
      </div>

      @if (showForm()) {
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem; animation: slideDown 0.2s ease;">
          <h3 style="color: #fafafa; margin: 0 0 1.25rem 0; font-size: 1rem; font-weight: 600;">Nova Mensalidade</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.75rem; color: #a1a1aa; margin-bottom: 0.5rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Aluno</label>
              <input 
                type="text" 
                [(ngModel)]="form.aluno" 
                placeholder="Nome do aluno"
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
              <label style="display: block; font-size: 0.75rem; color: #a1a1aa; margin-bottom: 0.5rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Valor (R$)</label>
              <input 
                type="number" 
                [(ngModel)]="form.valor"
                style="width: 100%; padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; transition: all 0.2s ease; box-sizing: border-box;"
                onfocus="this.style.borderColor='#c8ff00'; this.style.outline='none'"
                onblur="this.style.borderColor='#1e1e22'">
            </div>
            <div>
              <label style="display: block; font-size: 0.75rem; color: #a1a1aa; margin-bottom: 0.5rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Vencimento</label>
              <input 
                type="text" 
                [(ngModel)]="form.vencimento" 
                placeholder="DD/MM/AAAA"
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
              Salvar Mensalidade
            </button>
          </div>
        </div>
      }

      <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; overflow: hidden;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid #1e1e22;">
          <h2 style="font-size: 1rem; color: #fafafa; margin: 0; font-weight: 600;">Mensalidades</h2>
          <select 
            [(ngModel)]="filtroStatus" 
            (ngModelChange)="aplicarFiltro()"
            style="padding: 0.5rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.8125rem; cursor: pointer; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#c8ff00'; this.style.outline='none'"
            onblur="this.style.borderColor='#1e1e22'">
            <option value="">Todas</option>
            <option value="Paga">Pagas</option>
            <option value="Pendente">Pendentes</option>
            <option value="Atrasada">Atrasadas</option>
          </select>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Aluno</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Plano</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Valor</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Vencimento</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Pago em</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Status</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Acao</th>
            </tr>
          </thead>
          <tbody>
            @for (m of filtradas(); track m.id) {
              <tr style="transition: background 0.15s ease; border-bottom: 1px solid #1e1e22;" onmouseover="this.style.background='#18181b'" onmouseout="this.style.background='transparent'">
                <td style="padding: 1rem 1.5rem; color: #fafafa; font-size: 0.875rem; font-weight: 500;">{{ m.aluno }}</td>
                <td style="padding: 1rem 1.5rem; color: #a1a1aa; font-size: 0.875rem;">{{ m.plano }}</td>
                <td style="padding: 1rem 1.5rem; font-weight: 600; color: #c8ff00; font-size: 0.875rem;">R$ {{ m.valor.toFixed(2) }}</td>
                <td style="padding: 1rem 1.5rem; color: #a1a1aa; font-size: 0.875rem;">{{ m.vencimento }}</td>
                <td style="padding: 1rem 1.5rem; color: #a1a1aa; font-size: 0.875rem;">{{ m.pagoEm || '---' }}</td>
                <td style="padding: 1rem 1.5rem;">
                  @if (m.status === 'Paga') {
                    <span style="padding: 0.25rem 0.625rem; background: rgba(200, 255, 0, 0.1); border-radius: 1rem; font-size: 0.75rem; font-weight: 500; color: #c8ff00;">Paga</span>
                  } @else if (m.status === 'Pendente') {
                    <span style="padding: 0.25rem 0.625rem; background: rgba(161, 161, 170, 0.15); border-radius: 1rem; font-size: 0.75rem; font-weight: 500; color: #a1a1aa;">Pendente</span>
                  } @else {
                    <span style="padding: 0.25rem 0.625rem; background: rgba(250, 250, 250, 0.08); border-radius: 1rem; font-size: 0.75rem; font-weight: 500; color: #fafafa;">Atrasada</span>
                  }
                </td>
                <td style="padding: 1rem 1.5rem;">
                  @if (m.status !== 'Paga') {
                    <button 
                      (click)="marcarPago(m.id)"
                      style="padding: 0.375rem 0.75rem; background: rgba(200, 255, 0, 0.1); border: 1px solid rgba(200, 255, 0, 0.2); border-radius: 0.375rem; color: #c8ff00; cursor: pointer; font-weight: 500; font-size: 0.75rem; transition: all 0.2s ease;"
                      onmouseover="this.style.background='rgba(200, 255, 0, 0.15)'"
                      onmouseout="this.style.background='rgba(200, 255, 0, 0.1)'">
                      Marcar Pago
                    </button>
                  } @else {
                    <span style="color: #52525b; font-size: 0.8125rem;">OK</span>
                  }
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
export class MensalidadesComponent {
  showForm = signal(false);
  filtroStatus = '';
  form = { aluno: '', plano: '', valor: 0, vencimento: '' };

  mensalidades = signal<Mensalidade[]>([]);

  filtradas = signal<Mensalidade[]>([]);

  constructor() { this.aplicarFiltro(); }

  getTotalRecebido(): string {
    return this.mensalidades().filter(m => m.status === 'Paga').reduce((s, m) => s + m.valor, 0).toFixed(2);
  }

  getTotalPendente(): string {
    return this.mensalidades().filter(m => m.status !== 'Paga').reduce((s, m) => s + m.valor, 0).toFixed(2);
  }

  getAtrasadas(): number { return this.mensalidades().filter(m => m.status === 'Atrasada').length; }
  getPagas(): number { return this.mensalidades().filter(m => m.status === 'Paga').length; }

  aplicarFiltro(): void {
    const f = this.filtroStatus;
    this.filtradas.set(f ? this.mensalidades().filter(m => m.status === f) : this.mensalidades());
  }

  salvar(): void {
    if (!this.form.aluno) return;
    const nova: Mensalidade = {
      id: Date.now().toString(), aluno: this.form.aluno, plano: this.form.plano || 'Nao informado',
      valor: this.form.valor, vencimento: this.form.vencimento || 'A definir', pagoEm: null, status: 'Pendente'
    };
    this.mensalidades.update(list => [nova, ...list]);
    this.form = { aluno: '', plano: '', valor: 0, vencimento: '' };
    this.showForm.set(false);
    this.aplicarFiltro();
  }

  marcarPago(id: string): void {
    const now = new Date();
    const data = now.getDate().toString().padStart(2, '0') + '/' + (now.getMonth() + 1).toString().padStart(2, '0') + '/' + now.getFullYear();
    this.mensalidades.update(list => list.map(m => m.id === id ? { ...m, pagoEm: data, status: 'Paga' as const } : m));
    this.aplicarFiltro();
  }
}