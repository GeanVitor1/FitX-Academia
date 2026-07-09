import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvaliacoesService } from '../../core/services/avaliacoes.service';
import { AuthService } from '../../core/services/auth.service';
import { AlunosService } from '../../core/services/alunos.service';
import { AvaliacaoDto } from '../../core/models/models';

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

      @if (loading()) {
        <div style="text-align:center;padding:3rem;color:#52525b;">Carregando...</div>
      }

      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Peso</span>
          </div>
          <div class="metric-value" [style.color]="ultimaAvaliacao() ? '#c8ff00' : '#3f3f46'">
            {{ ultimaAvaliacao()?.peso ?? '--' }} @if (ultimaAvaliacao()) { <span class="unit">kg</span> }
          </div>
          <div class="metric-change">{{ ultimaAvaliacao() ? 'Ultima: ' + (ultimaAvaliacao()?.data | date:'dd/MM/yyyy') : 'Aguardando avaliacao' }}</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">IMC</span>
          </div>
          <div class="metric-value" [style.color]="ultimaAvaliacao() ? '#c8ff00' : '#3f3f46'">
            {{ ultimaAvaliacao()?.imc?.toFixed(1) ?? '--' }}
          </div>
          <div class="metric-change">{{ getImcClassificacao() }}</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Gordura</span>
          </div>
          <div class="metric-value" [style.color]="ultimaAvaliacao()?.percentualGordura ? '#c8ff00' : '#3f3f46'">
            {{ ultimaAvaliacao()?.percentualGordura ?? '--' }} @if (ultimaAvaliacao()?.percentualGordura) { <span class="unit">%</span> }
          </div>
          <div class="metric-change">Aguardando avaliacao</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Musculo</span>
          </div>
          <div class="metric-value" [style.color]="ultimaAvaliacao()?.massaMuscular ? '#c8ff00' : '#3f3f46'">
            {{ ultimaAvaliacao()?.massaMuscular ?? '--' }} @if (ultimaAvaliacao()?.massaMuscular) { <span class="unit">kg</span> }
          </div>
          <div class="metric-change">Aguardando avaliacao</div>
        </div>
      </div>

      <div class="measurements-section">
        <h2>Medidas Corporais</h2>
        <div class="measurements-grid">
          <div class="measurement-item">
            <span class="measurement-label">Bracos</span>
            <span class="measurement-value" [style.color]="ultimaAvaliacao()?.circunferenciaBracos ? '#c8ff00' : '#3f3f46'">{{ ultimaAvaliacao()?.circunferenciaBracos ?? '--' }} cm</span>
          </div>
          <div class="measurement-item">
            <span class="measurement-label">Cintura</span>
            <span class="measurement-value" [style.color]="ultimaAvaliacao()?.circunferenciaCintura ? '#c8ff00' : '#3f3f46'">{{ ultimaAvaliacao()?.circunferenciaCintura ?? '--' }} cm</span>
          </div>
          <div class="measurement-item">
            <span class="measurement-label">Abdomen</span>
            <span class="measurement-value" [style.color]="ultimaAvaliacao()?.circunferenciaAbdomen ? '#c8ff00' : '#3f3f46'">{{ ultimaAvaliacao()?.circunferenciaAbdomen ?? '--' }} cm</span>
          </div>
          <div class="measurement-item">
            <span class="measurement-label">Pernas</span>
            <span class="measurement-value" [style.color]="ultimaAvaliacao()?.circunferenciaPernas ? '#c8ff00' : '#3f3f46'">{{ ultimaAvaliacao()?.circunferenciaPernas ?? '--' }} cm</span>
          </div>
        </div>
      </div>

      <div class="evolution-section">
        <h2>Evolucao Mensal</h2>
        @if (avaliacoes().length > 0) {
          <div class="evolution-list">
            @for (av of avaliacoes(); track av.id) {
              <div class="evolution-item">
                <div class="evol-data">{{ av.data | date:'dd/MM/yyyy' }}</div>
                <div class="evol-info">
                  <span>Peso: {{ av.peso }}kg</span>
                  <span>IMC: {{ av.imc.toFixed(1) }}</span>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            <span class="empty-icon">◇</span>
            <p>Nenhum dado de evolucao ainda</p>
            <span>Seus dados aparecero apos suas avaliacoes</span>
          </div>
        }
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
    .metric-card { background: #111113; border: 1px solid #1e1e22; border-radius: 12px; padding: 1.25rem; transition: border-color 0.2s; }
    .metric-card:hover { border-color: #3f3f46; }
    .metric-header { margin-bottom: 0.75rem; }
    .metric-title { font-size: 12px; font-weight: 600; color: #52525b; }
    .metric-value { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
    .metric-value .unit { font-size: 0.875rem; font-weight: 500; }
    .metric-change { font-size: 11px; color: #52525b; }
    .measurements-section { margin-bottom: 2rem; }
    .measurements-section h2 { font-size: 14px; font-weight: 600; color: #fafafa; margin: 0 0 1rem; }
    .measurements-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
    .measurement-item { background: #111113; border: 1px solid #1e1e22; border-radius: 10px; padding: 1rem; text-align: center; }
    .measurement-label { display: block; font-size: 11px; color: #52525b; margin-bottom: 0.5rem; }
    .measurement-value { font-size: 1rem; font-weight: 700; }
    .evolution-section h2 { font-size: 14px; font-weight: 600; color: #fafafa; margin: 0 0 1rem; }
    .evolution-list { display: flex; flex-direction: column; gap: 4px; }
    .evolution-item { display: flex; align-items: center; gap: 1rem; padding: 12px 16px; background: #111113; border: 1px solid #1e1e22; border-radius: 10px; }
    .evol-data { font-size: 12px; font-weight: 600; color: #c8ff00; min-width: 80px; }
    .evol-info { display: flex; gap: 1rem; font-size: 13px; color: #a1a1aa; }
    .empty-state { text-align: center; padding: 3rem; background: #111113; border: 1px solid #1e1e22; border-radius: 12px; }
    .empty-state .empty-icon { font-size: 2rem; color: #1e1e22; display: block; margin-bottom: 0.5rem; }
    .empty-state p { font-size: 13px; color: #52525b; margin: 0 0 0.25rem; }
    .empty-state span { font-size: 11px; color: #3f3f46; }
    @media (max-width: 768px) { .metrics-grid { grid-template-columns: repeat(2, 1fr); } .measurements-grid { grid-template-columns: repeat(2, 1fr); } }
  `]
})
export class HistoricoComponent implements OnInit {
  private avaliacoesService = inject(AvaliacoesService);
  private authService = inject(AuthService);
  private alunosService = inject(AlunosService);

  loading = signal(false);
  avaliacoes = signal<AvaliacaoDto[]>([]);
  ultimaAvaliacao = signal<AvaliacaoDto | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    const user = this.authService.user();
    if (!user) { this.loading.set(false); return; }

    this.alunosService.getByUsuarioId(user.id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const alunoId = res.data.id;
          this.avaliacoesService.getByAlunoId(alunoId).subscribe({
            next: (r) => {
              if (r.success && r.data) {
                this.avaliacoes.set(r.data);
                if (r.data.length > 0) {
                  this.ultimaAvaliacao.set(r.data[r.data.length - 1]);
                }
              }
              this.loading.set(false);
            },
            error: () => this.loading.set(false)
          });
        } else {
          this.loading.set(false);
        }
      },
      error: () => this.loading.set(false)
    });
  }

  getImcClassificacao(): string {
    const av = this.ultimaAvaliacao();
    if (!av) return 'Aguardando avaliacao';
    const imc = av.imc;
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidade';
  }
}