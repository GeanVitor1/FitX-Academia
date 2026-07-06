import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { PagamentosService } from '../../core/services/pagamentos.service';
import { DashboardDto, PagamentoDto } from '../../core/models/models';

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
        <p style="color:#a1a1aa;margin:0;font-size:0.875rem;">Visao geral das financas da academia</p>
      </div>

      @if (loading()) {
        <div style="text-align:center;padding:3rem;color:#52525b;">Carregando dados financeiros...</div>
      }

      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem;">
        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:0.75rem;font-weight:500;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.05em;">Receita Mensal</span>
            <span style="font-size:0.7rem;color:#c8ff00;font-weight:600;background:rgba(200,255,0,0.08);padding:0.2rem 0.5rem;border-radius:100px;">+0%</span>
          </div>
          <span style="font-size:1.75rem;font-weight:700;color:#fff;letter-spacing:-0.03em;">R$ {{ ((dashboardData()?.receitaMensal || 0)).toFixed(2) }}</span>
        </div>
        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:0.75rem;font-weight:500;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.05em;">Alunos Ativos</span>
            <span style="font-size:0.7rem;color:#c8ff00;font-weight:600;background:rgba(200,255,0,0.08);padding:0.2rem 0.5rem;border-radius:100px;">+0</span>
          </div>
          <span style="font-size:1.75rem;font-weight:700;color:#fff;letter-spacing:-0.03em;">{{ dashboardData()?.alunosAtivos || 0 }}</span>
        </div>
        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:0.75rem;font-weight:500;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.05em;">Inadimplentes</span>
          </div>
          <span style="font-size:1.75rem;font-weight:700;color:#fff;letter-spacing:-0.03em;">{{ dashboardData()?.mensalidadesPendentes || 0 }}</span>
        </div>
        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:0.75rem;font-weight:500;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.05em;">Novas Matriculas</span>
          </div>
          <span style="font-size:1.75rem;font-weight:700;color:#fff;letter-spacing:-0.03em;">{{ dashboardData()?.novasMatriculasMes || 0 }}</span>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:1.5rem;margin-bottom:2rem;">
        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.5rem;">
          <h2 style="font-size:1rem;font-weight:600;color:#fff;margin:0 0 1rem 0;">Ultimos Pagamentos</h2>
          <div style="display:flex;flex-direction:column;gap:0;">
            @for (payment of pagamentos().slice(0, 10); track payment.id; let i = $index) {
              <div [style.border-bottom]="i < pagamentos().slice(0, 10).length - 1 ? '1px solid #1e1e22' : 'none'"
                   style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 0;">
                <div style="width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.8rem;background:rgba(200,255,0,0.08);color:#c8ff00;flex-shrink:0;">
                  {{ payment.status === 'Pago' ? '✓' : '○' }}
                </div>
                <div style="flex:1;min-width:0;">
                  <div style="font-size:0.8125rem;font-weight:600;color:#fff;">Pagamento</div>
                  <div style="font-size:0.6875rem;color:#52525b;">{{ payment.data | date:'dd/MM/yyyy' }}</div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:0.8125rem;font-weight:600;color:#fff;">R$ {{ payment.valor.toFixed(2) }}</div>
                </div>
              </div>
            }
          </div>
        </div>

        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.5rem;">
          <h2 style="font-size:1rem;font-weight:600;color:#fff;margin:0 0 1rem 0;">Atividades Recentes</h2>
          <div style="display:flex;flex-direction:column;gap:0;">
            @for (act of (dashboardData()?.atividadesRecentes || []).slice(0, 8); track act.tipo + act.data; let i = $index) {
              <div [style.border-bottom]="i < 7 ? '1px solid #1e1e22' : 'none'"
                   style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 0;">
                <div style="width:8px;height:8px;border-radius:50%;background:#c8ff00;flex-shrink:0;"></div>
                <div style="flex:1;display:flex;flex-direction:column;gap:2px;">
                  <span style="font-size:0.8125rem;color:#fff;">{{ act.descricao }}</span>
                  <span style="font-size:0.6875rem;color:#52525b;">{{ act.data }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; background: #09090b; min-height: 100vh; }
  `]
})
export class FinanceiroComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private pagamentosService = inject(PagamentosService);

  loading = signal(false);
  dashboardData = signal<DashboardDto | null>(null);
  pagamentos = signal<PagamentoDto[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.dashboardService.getDashboard().subscribe({
      next: (res) => { if (res.success && res.data) this.dashboardData.set(res.data); },
      error: () => {}
    });
    this.pagamentosService.getAll().subscribe({
      next: (res) => { if (res.success && res.data) this.pagamentos.set(res.data); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }
}
