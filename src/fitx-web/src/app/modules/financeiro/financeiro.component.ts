import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { RelatoriosService, RelatorioFinanceiroDto } from '../../core/services/relatorios.service';
import { PagamentosService } from '../../core/services/pagamentos.service';
import { ToastService } from '../../shared/services/toast.service';
import { PagamentoDto } from '../../core/models/models';

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  template: `
    <div style="padding:2.5rem;max-width:1400px;margin:0 auto;font-family:'Inter',system-ui,-apple-system,sans-serif;">
      <div style="margin-bottom:2rem;">
        <h1 style="font-size:1.875rem;font-weight:700;color:#fff;margin:0 0 0.375rem 0;letter-spacing:-0.025em;">
          Dashboard <span style="color:#c8ff00;">Financeiro</span>
        </h1>
        <p style="color:#a1a1aa;margin:0;font-size:0.875rem;">Visao geral das financas da academia</p>
      </div>

      @if (loading()) {
        <div style="display:flex;align-items:center;justify-content:center;padding:4rem;color:#a1a1aa;gap:0.75rem;">
          <span style="width:20px;height:20px;border:2px solid #1e1e22;border-top-color:#c8ff00;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block;"></span>
          Carregando dados financeiros...
        </div>
      }

      @if (error(); as err) {
        <div style="background:rgba(255,50,50,0.08);border:1px solid rgba(255,50,50,0.2);border-radius:12px;padding:1.5rem;text-align:center;color:#ff6b6b;margin-bottom:2rem;">
          <p style="margin:0 0 0.75rem 0;font-weight:600;">{{ err }}</p>
          <button (click)="loadData()"
            style="background:#c8ff00;color:#09090b;border:none;border-radius:8px;padding:0.5rem 1.5rem;font-weight:600;cursor:pointer;font-size:0.8125rem;">
            Tentar novamente
          </button>
        </div>
      }

      @if (!loading() && !error()) {
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem;">
          <div class="stat-card">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <span class="stat-label">Receita Total</span>
              <span style="font-size:1.25rem;color:#c8ff00;">R</span>
            </div>
            <span class="stat-value">R$ {{ (dados()?.receitaTotal || 0).toFixed(2) }}</span>
          </div>
          <div class="stat-card">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <span class="stat-label">Receita Mensal</span>
              <span style="font-size:1.25rem;color:#c8ff00;">$</span>
            </div>
            <span class="stat-value">R$ {{ (dados()?.receitaMensal || 0).toFixed(2) }}</span>
          </div>
          <div class="stat-card">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <span class="stat-label">Total Pagamentos</span>
              <span style="font-size:1.25rem;color:#c8ff00;">&#10003;</span>
            </div>
            <span class="stat-value">{{ dados()?.totalPagamentos || 0 }}</span>
          </div>
          <div class="stat-card">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <span class="stat-label">Pagamentos Pendentes</span>
              <span style="font-size:1.25rem;color:#ff6b6b;">!</span>
            </div>
            <span class="stat-value">{{ dados()?.pagamentosPendentes || 0 }}</span>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:1.5rem;margin-bottom:2rem;">
          <div class="chart-card">
            <h2 class="card-title">Receita por M&ecirc;s</h2>
            @if (dados()?.receitaPorMes?.length) {
              <apx-chart
                [series]="barChartOptions.series!"
                [chart]="barChartOptions.chart!"
                [xaxis]="barChartOptions.xaxis!"
                [yaxis]="barChartOptions.yaxis!"
                [colors]="barChartOptions.colors!"
                [plotOptions]="barChartOptions.plotOptions!"
                [dataLabels]="barChartOptions.dataLabels!"
                [grid]="barChartOptions.grid!"
                [tooltip]="barChartOptions.tooltip!"
                [legend]="barChartOptions.legend!"
              ></apx-chart>
            } @else {
              <div class="empty-chart">Nenhum dado dispon&iacute;vel</div>
            }
          </div>

          <div class="chart-card">
            <h2 class="card-title">Planos Mais Vendidos</h2>
            @if (dados()?.planosMaisVendidos?.length) {
              <apx-chart
                [series]="pieChartOptions.series!"
                [chart]="pieChartOptions.chart!"
                [labels]="pieChartOptions.labels!"
                [colors]="pieChartOptions.colors!"
                [plotOptions]="pieChartOptions.plotOptions!"
                [dataLabels]="pieChartOptions.dataLabels!"
                [legend]="pieChartOptions.legend!"
                [tooltip]="pieChartOptions.tooltip!"
                [responsive]="pieChartOptions.responsive!"
              ></apx-chart>
            } @else {
              <div class="empty-chart">Nenhum dado dispon&iacute;vel</div>
            }
          </div>
        </div>

        <div class="chart-card">
          <h2 class="card-title">Pagamentos Recentes</h2>
          @if (pagamentos().length) {
            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr style="border-bottom:1px solid #1e1e22;">
                    <th style="text-align:left;padding:0.75rem 0.5rem;color:#a1a1aa;font-size:0.75rem;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;">Status</th>
                    <th style="text-align:left;padding:0.75rem 0.5rem;color:#a1a1aa;font-size:0.75rem;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;">Valor</th>
                    <th style="text-align:left;padding:0.75rem 0.5rem;color:#a1a1aa;font-size:0.75rem;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;">Data</th>
                    <th style="text-align:left;padding:0.75rem 0.5rem;color:#a1a1aa;font-size:0.75rem;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;">M&eacute;todo</th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of pagamentos().slice(0, 10); track p.id) {
                    <tr style="border-bottom:1px solid #1e1e22;">
                      <td style="padding:0.75rem 0.5rem;">
                        <span [style.background]="p.status === 'Pago' ? 'rgba(200,255,0,0.08)' : 'rgba(255,50,50,0.08)'"
                              [style.color]="p.status === 'Pago' ? '#c8ff00' : '#ff6b6b'"
                              style="padding:0.2rem 0.5rem;border-radius:100px;font-size:0.75rem;font-weight:600;">
                          {{ p.status }}
                        </span>
                      </td>
                      <td style="padding:0.75rem 0.5rem;color:#fff;font-weight:600;font-size:0.8125rem;">R$ {{ p.valor.toFixed(2) }}</td>
                      <td style="padding:0.75rem 0.5rem;color:#a1a1aa;font-size:0.8125rem;">{{ p.data | date:'dd/MM/yyyy' }}</td>
                      <td style="padding:0.75rem 0.5rem;color:#a1a1aa;font-size:0.8125rem;">{{ p.metodo }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <div class="empty-chart">Nenhum pagamento encontrado</div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; background: #09090b; min-height: 100vh; }
    .stat-card {
      background: #111113;
      border: 1px solid #1e1e22;
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      transition: border-color 0.2s;
    }
    .stat-card:hover { border-color: #2a2a2e; }
    .stat-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: #a1a1aa;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.03em;
    }
    .chart-card {
      background: #111113;
      border: 1px solid #1e1e22;
      border-radius: 12px;
      padding: 1.5rem;
    }
    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: #fff;
      margin: 0 0 1rem 0;
    }
    .empty-chart {
      padding: 3rem;
      text-align: center;
      color: #52525b;
      font-size: 0.875rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class FinanceiroComponent implements OnInit {
  private relatoriosService = inject(RelatoriosService);
  private pagamentosService = inject(PagamentosService);
  private toast = inject(ToastService);

  loading = signal(true);
  error = signal<string | null>(null);
  dados = signal<RelatorioFinanceiroDto | null>(null);
  pagamentos = signal<PagamentoDto[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.relatoriosService.getFinanceiro().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.dados.set(res.data);
        } else {
          this.error.set(res.message || 'Erro ao carregar relatorio financeiro');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar dados financeiros. Verifique a conexao com o servidor.');
        this.loading.set(false);
        this.toast.error('Erro ao carregar dashboard financeiro');
      }
    });

    this.pagamentosService.getAll().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.pagamentos.set(res.data);
        }
      },
      error: () => this.toast.error('Erro ao carregar pagamentos')
    });
  }

  get barChartOptions(): ApexOptions {
    const meses = this.dados()?.receitaPorMes ?? [];
    return {
      series: [{ name: 'Receita', data: meses.map(m => m.valor) }],
      chart: {
        type: 'bar',
        height: 280,
        background: 'transparent',
        foreColor: '#a1a1aa',
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      colors: ['#c8ff00'],
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '55%',
          borderRadiusApplication: 'end'
        }
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: meses.map(m => m.mes),
        labels: { style: { colors: '#a1a1aa', fontSize: '12px' } },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { colors: '#a1a1aa', fontSize: '12px' },
          formatter: (val) => `R$ ${val.toFixed(0)}`
        }
      },
      grid: {
        borderColor: '#1e1e22',
        strokeDashArray: 4,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: true } }
      },
      tooltip: {
        theme: 'dark',
        y: { formatter: (val) => `R$ ${val.toFixed(2)}` }
      },
      legend: { show: false }
    };
  }

  get pieChartOptions(): ApexOptions {
    const planos = this.dados()?.planosMaisVendidos ?? [];
    return {
      series: planos.map(p => p.receita),
      chart: {
        type: 'pie',
        height: 280,
        background: 'transparent',
        foreColor: '#a1a1aa',
        toolbar: { show: false }
      },
      colors: ['#c8ff00', '#a3d900', '#7aa300', '#527000', '#c8ff00'],
      labels: planos.map(p => p.planoNome),
      plotOptions: {
        pie: {
          expandOnClick: false,
          donut: { size: '55%' }
        }
      },
      dataLabels: {
        enabled: true,
        style: { colors: ['#09090b'], fontSize: '11px', fontWeight: '600' },
        dropShadow: { enabled: false }
      },
      legend: {
        position: 'bottom',
        labels: { colors: '#a1a1aa' },
        markers: { size: 6 }
      },
      tooltip: {
        theme: 'dark',
        y: { formatter: (val) => `R$ ${val.toFixed(2)}` }
      },
      responsive: [{
        breakpoint: 768,
        options: {
          legend: { position: 'bottom', show: true }
        }
      }]
    };
  }
}
