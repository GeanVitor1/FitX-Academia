import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="padding:2.5rem;max-width:1400px;margin:0 auto;font-family:'Inter',system-ui,-apple-system,sans-serif;">

      <div style="margin-bottom:2.5rem;">
        <h1 style="font-size:1.875rem;font-weight:700;color:#fff;margin:0 0 0.375rem 0;letter-spacing:-0.025em;">
          Painel <span style="color:#c8ff00;">Financeiro</span>
        </h1>
        <p style="color:#a1a1aa;margin:0;font-size:0.875rem;">Visao geral das financias da academia</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem;">

        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;transition:all 0.2s ease;"
             onmouseover="this.style.borderColor='#2a2a2e'" onmouseout="this.style.borderColor='#1e1e22'">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:0.75rem;font-weight:500;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.05em;">Receita Mensal</span>
            <span style="font-size:0.7rem;color:#c8ff00;font-weight:600;background:rgba(200,255,0,0.08);padding:0.2rem 0.5rem;border-radius:100px;">+0%</span>
          </div>
          <span style="font-size:1.75rem;font-weight:700;color:#fff;letter-spacing:-0.03em;">R$ 0</span>
        </div>

        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;transition:all 0.2s ease;"
             onmouseover="this.style.borderColor='#2a2a2e'" onmouseout="this.style.borderColor='#1e1e22'">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:0.75rem;font-weight:500;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.05em;">Alunos Ativos</span>
            <span style="font-size:0.7rem;color:#c8ff00;font-weight:600;background:rgba(200,255,0,0.08);padding:0.2rem 0.5rem;border-radius:100px;">+0</span>
          </div>
          <span style="font-size:1.75rem;font-weight:700;color:#fff;letter-spacing:-0.03em;">0</span>
        </div>

        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;transition:all 0.2s ease;"
             onmouseover="this.style.borderColor='#2a2a2e'" onmouseout="this.style.borderColor='#1e1e22'">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:0.75rem;font-weight:500;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.05em;">Inadimplentes</span>
            <span style="font-size:0.7rem;color:#a1a1aa;font-weight:600;background:rgba(161,161,170,0.08);padding:0.2rem 0.5rem;border-radius:100px;">0%</span>
          </div>
          <span style="font-size:1.75rem;font-weight:700;color:#fff;letter-spacing:-0.03em;">0</span>
        </div>

        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;transition:all 0.2s ease;"
             onmouseover="this.style.borderColor='#2a2a2e'" onmouseout="this.style.borderColor='#1e1e22'">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:0.75rem;font-weight:500;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.05em;">Ticket Medio</span>
            <span style="font-size:0.7rem;color:#c8ff00;font-weight:600;background:rgba(200,255,0,0.08);padding:0.2rem 0.5rem;border-radius:100px;">+0%</span>
          </div>
          <span style="font-size:1.75rem;font-weight:700;color:#fff;letter-spacing:-0.03em;">R$ 0,00</span>
        </div>

      </div>

      <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:1.5rem;margin-bottom:2rem;">

        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.5rem;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;">
            <h2 style="font-size:1rem;font-weight:600;color:#fff;margin:0;">Receita Mensal</h2>
            <div style="display:flex;gap:1.25rem;">
              <span style="display:flex;align-items:center;gap:0.375rem;font-size:0.7rem;color:#a1a1aa;">
                <span style="width:8px;height:8px;border-radius:2px;background:#c8ff00;display:inline-block;"></span>Receita
              </span>
              <span style="display:flex;align-items:center;gap:0.375rem;font-size:0.7rem;color:#a1a1aa;">
                <span style="width:8px;height:8px;border-radius:2px;background:#52525b;display:inline-block;"></span>Despesas
              </span>
            </div>
          </div>
          <div style="display:flex;align-items:flex-end;justify-content:space-between;height:200px;gap:0.5rem;padding-top:1rem;">
            @for (month of monthlyData(); track month.name) {
              <div style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%;gap:0;">
                <div style="flex:1;display:flex;align-items:flex-end;gap:3px;width:100%;justify-content:center;">
                  <div [style.height.%]="month.revenue" style="flex:1;max-width:20px;border-radius:3px 3px 0 0;background:#c8ff00;transition:height 0.5s ease;"></div>
                  <div [style.height.%]="month.expense" style="flex:1;max-width:20px;border-radius:3px 3px 0 0;background:#52525b;transition:height 0.5s ease;"></div>
                </div>
                <span style="font-size:0.65rem;color:#52525b;margin-top:0.5rem;">{{ month.name }}</span>
              </div>
            }
          </div>
        </div>

        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.5rem;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;">
            <h2 style="font-size:1rem;font-weight:600;color:#fff;margin:0;">Ultimos Pagamentos</h2>
            <a routerLink="/financeiro/relatorios" style="font-size:0.75rem;color:#c8ff00;text-decoration:none;font-weight:500;">Ver todos</a>
          </div>
          <div style="display:flex;flex-direction:column;gap:0;">
            @for (payment of recentPayments(); track payment.id; let i = $index) {
              <div [style.border-bottom]="i < recentPayments().length - 1 ? '1px solid #1e1e22' : 'none'"
                   style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 0;transition:background 0.15s ease;"
                   onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                <div style="width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.8rem;background:rgba(200,255,0,0.08);color:#c8ff00;flex-shrink:0;">
                  {{ payment.status === 'paid' ? '✓' : '○' }}
                </div>
                <div style="flex:1;min-width:0;">
                  <div style="font-size:0.8125rem;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ payment.student }}</div>
                  <div style="font-size:0.6875rem;color:#52525b;">{{ payment.plan }}</div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:0.8125rem;font-weight:600;color:#fff;">R$ {{ payment.amount }}</div>
                  <div style="font-size:0.625rem;color:#52525b;">{{ payment.date }}</div>
                </div>
              </div>
            }
          </div>
        </div>

      </div>

      <div style="margin-bottom:1rem;">
        <h2 style="font-size:1rem;font-weight:600;color:#fff;margin:0 0 1rem 0;">Inadimplencia</h2>
        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;overflow:hidden;">
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr>
                <th style="padding:0.875rem 1.25rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Aluno</th>
                <th style="padding:0.875rem 1.25rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Plano</th>
                <th style="padding:0.875rem 1.25rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Valor</th>
                <th style="padding:0.875rem 1.25rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Dias Atraso</th>
                <th style="padding:0.875rem 1.25rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Status</th>
              </tr>
            </thead>
            <tbody>
              @for (item of inadimplentes(); track item.id) {
                <tr style="transition:background 0.15s ease;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                  <td style="padding:0.875rem 1.25rem;font-size:0.8125rem;color:#fff;border-bottom:1px solid #1e1e22;font-weight:500;">{{ item.aluno }}</td>
                  <td style="padding:0.875rem 1.25rem;font-size:0.8125rem;color:#a1a1aa;border-bottom:1px solid #1e1e22;">{{ item.plano }}</td>
                  <td style="padding:0.875rem 1.25rem;font-size:0.8125rem;color:#fff;border-bottom:1px solid #1e1e22;font-weight:600;">R$ {{ item.valor }}</td>
                  <td style="padding:0.875rem 1.25rem;font-size:0.8125rem;color:#a1a1aa;border-bottom:1px solid #1e1e22;">{{ item.dias }}</td>
                  <td style="padding:0.875rem 1.25rem;border-bottom:1px solid #1e1e22;">
                    <span style="display:inline-block;padding:0.2rem 0.625rem;border-radius:100px;font-size:0.6875rem;font-weight:600;background:rgba(161,161,170,0.1);color:#a1a1aa;">{{ item.status }}</span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :host {
      display: block;
      background: #09090b;
      min-height: 100vh;
    }
  `]
})
export class FinanceiroComponent {
  monthlyData = signal([] as { name: string; revenue: number; expense: number }[]);

  recentPayments = signal([] as { id: string; student: string; plan: string; amount: string; date: string; status: string }[]);

  inadimplentes = signal([] as { id: string; aluno: string; plano: string; valor: string; dias: string; status: string }[]);
}
