import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="historico-page">
      <header class="page-header">
        <h1>Meu <span class="accent">Historico</span></h1>
        <p class="subtitle">Acompanhe sua evolucao ao longo do tempo</p>
      </header>

      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Peso</span>
          </div>
          <div class="metric-value">-- <span class="unit">kg</span></div>
          <div class="metric-change">Aguardando avaliacao</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">IMC</span>
          </div>
          <div class="metric-value">--</div>
          <div class="metric-change">Aguardando avaliacao</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Gordura</span>
          </div>
          <div class="metric-value">-- <span class="unit">%</span></div>
          <div class="metric-change">Aguardando avaliacao</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Musculo</span>
          </div>
          <div class="metric-value">-- <span class="unit">kg</span></div>
          <div class="metric-change">Aguardando avaliacao</div>
        </div>
      </div>

      <div class="measurements-section">
        <h2>Medidas Corporais</h2>
        <div class="measurements-grid">
          <div class="measurement-item">
            <span class="measurement-label">Bracos</span>
            <span class="measurement-value">-- cm</span>
          </div>
          <div class="measurement-item">
            <span class="measurement-label">Peito</span>
            <span class="measurement-value">-- cm</span>
          </div>
          <div class="measurement-item">
            <span class="measurement-label">Cintura</span>
            <span class="measurement-value">-- cm</span>
          </div>
          <div class="measurement-item">
            <span class="measurement-label">Quadril</span>
            <span class="measurement-value">-- cm</span>
          </div>
          <div class="measurement-item">
            <span class="measurement-label">Pernas</span>
            <span class="measurement-value">-- cm</span>
          </div>
        </div>
      </div>

      <div class="evolution-section">
        <h2>Evolucao Mensal</h2>
        <div class="empty-state">
          <span class="empty-icon">◇</span>
          <p>Nenhum dado de evolucao ainda</p>
          <span>Seus dados aparecero aqui apos suas avaliacoes</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .historico-page { padding: 2rem; max-width: 1000px; margin: 0 auto; }

    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #fafafa; margin: 0; }
    .accent { color: #c8ff00; }
    .subtitle { font-size: 13px; color: #52525b; margin: 4px 0 0; }

    .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .metric-card {
      background: #111113; border: 1px solid #1e1e22; border-radius: 12px;
      padding: 1.25rem; transition: border-color 0.2s;
    }
    .metric-card:hover { border-color: #3f3f46; }
    .metric-header { margin-bottom: 0.75rem; }
    .metric-title { font-size: 12px; font-weight: 600; color: #52525b; }
    .metric-value { font-size: 1.75rem; font-weight: 700; color: #3f3f46; margin-bottom: 0.25rem; }
    .metric-value .unit { font-size: 0.875rem; font-weight: 500; color: #3f3f46; }
    .metric-change { font-size: 11px; color: #3f3f46; }

    .measurements-section { margin-bottom: 2rem; }
    .measurements-section h2 { font-size: 14px; font-weight: 600; color: #fafafa; margin: 0 0 1rem; }
    .measurements-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem; }
    .measurement-item {
      background: #111113; border: 1px solid #1e1e22; border-radius: 10px;
      padding: 1rem; text-align: center;
    }
    .measurement-label { display: block; font-size: 11px; color: #52525b; margin-bottom: 0.5rem; }
    .measurement-value { font-size: 1rem; font-weight: 700; color: #3f3f46; }

    .evolution-section h2 { font-size: 14px; font-weight: 600; color: #fafafa; margin: 0 0 1rem; }
    .empty-state {
      text-align: center; padding: 3rem;
      background: #111113; border: 1px solid #1e1e22; border-radius: 12px;
    }
    .empty-state .empty-icon { font-size: 2rem; color: #1e1e22; display: block; margin-bottom: 0.5rem; }
    .empty-state p { font-size: 13px; color: #52525b; margin: 0 0 0.25rem; }
    .empty-state span { font-size: 11px; color: #3f3f46; }

    @media (max-width: 768px) {
      .metrics-grid { grid-template-columns: repeat(2, 1fr); }
      .measurements-grid { grid-template-columns: repeat(3, 1fr); }
    }
  `]
})
export class HistoricoComponent {}
