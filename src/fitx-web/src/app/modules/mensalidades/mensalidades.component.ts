import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MensalidadesService } from '../../core/services/mensalidades.service';
import { AlunosService } from '../../core/services/alunos.service';
import { PlanosService } from '../../core/services/planos.service';
import { ToastService } from '../../shared/services/toast.service';
import { MensalidadeDto, CreateMensalidadeDto, AlunoDto, PlanoDto, CreatePagamentoDto } from '../../core/models/models';

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
        <button (click)="showForm.set(!showForm())"
          style="padding: 0.625rem 1.25rem; background: #c8ff00; color: #09090b; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer;">
          {{ showForm() ? 'Cancelar' : '+ Nova Mensalidade' }}
        </button>
      </div>

      @if (loading()) {
        <div style="text-align:center;padding:3rem;color:#52525b;">Carregando...</div>
      }

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem;">
          <div style="color: #a1a1aa; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Recebido</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: #c8ff00;">R$ {{ getTotalRecebido() }}</div>
        </div>
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem;">
          <div style="color: #a1a1aa; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Pendente</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: #fafafa;">R$ {{ getTotalPendente() }}</div>
        </div>
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem;">
          <div style="color: #a1a1aa; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Atrasadas</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: #fafafa;">{{ getAtrasadas() }}</div>
        </div>
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.25rem;">
          <div style="color: #a1a1aa; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Pagas</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: #fafafa;">{{ getPagas() }}</div>
        </div>
      </div>

      @if (showForm()) {
        <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem;">
          <h3 style="color: #fafafa; margin: 0 0 1.25rem 0; font-size: 1rem; font-weight: 600;">Nova Mensalidade</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.75rem; color: #a1a1aa; margin-bottom: 0.5rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Aluno</label>
              <select [(ngModel)]="form.alunoId"
                style="width: 100%; padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; box-sizing: border-box;">
                <option value="">Selecione...</option>
                @for (a of alunos(); track a.id) {
                  <option [value]="a.id">{{ a.nome }}</option>
                }
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 0.75rem; color: #a1a1aa; margin-bottom: 0.5rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Plano</label>
              <select [(ngModel)]="form.planoId"
                style="width: 100%; padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; box-sizing: border-box;">
                <option value="">Selecione...</option>
                @for (p of planos(); track p.id) {
                  <option [value]="p.id">{{ p.nome }} - R$ {{ p.preco.toFixed(2) }}</option>
                }
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 0.75rem; color: #a1a1aa; margin-bottom: 0.5rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Valor (R$)</label>
              <input type="number" [(ngModel)]="form.valor"
                style="width: 100%; padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; box-sizing: border-box;">
            </div>
            <div>
              <label style="display: block; font-size: 0.75rem; color: #a1a1aa; margin-bottom: 0.5rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Vencimento</label>
              <input type="date" [(ngModel)]="form.dataVencimento"
                style="width: 100%; padding: 0.625rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.875rem; box-sizing: border-box;">
            </div>
          </div>
          <div style="margin-top: 1.25rem;">
            <button (click)="salvar()"
              style="padding: 0.625rem 1.5rem; background: #c8ff00; color: #09090b; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer;">
              Salvar Mensalidade
            </button>
          </div>
        </div>
      }

      <div style="background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; overflow: hidden;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid #1e1e22;">
          <h2 style="font-size: 1rem; color: #fafafa; margin: 0; font-weight: 600;">Mensalidades</h2>
          <select [(ngModel)]="filtroStatus" (ngModelChange)="aplicarFiltro()"
            style="padding: 0.5rem 0.75rem; background: #18181b; border: 1px solid #1e1e22; border-radius: 0.5rem; color: #fafafa; font-size: 0.8125rem; cursor: pointer;">
            <option value="">Todas</option>
            <option value="Paga">Pagas</option>
            <option value="Aberta">Pendentes</option>
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
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Status</th>
              <th style="padding: 0.875rem 1.5rem; text-align: left; color: #a1a1aa; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #18181b; border-bottom: 1px solid #1e1e22;">Acao</th>
            </tr>
          </thead>
          <tbody>
            @for (m of filtradas(); track m.id) {
              <tr style="border-bottom: 1px solid #1e1e22;">
                <td style="padding: 1rem 1.5rem; color: #fafafa; font-size: 0.875rem; font-weight: 500;">{{ m.alunoNome }}</td>
                <td style="padding: 1rem 1.5rem; color: #a1a1aa; font-size: 0.875rem;">{{ m.planoNome }}</td>
                <td style="padding: 1rem 1.5rem; font-weight: 600; color: #c8ff00; font-size: 0.875rem;">R$ {{ m.valor.toFixed(2) }}</td>
                <td style="padding: 1rem 1.5rem; color: #a1a1aa; font-size: 0.875rem;">{{ m.dataVencimento | date:'dd/MM/yyyy' }}</td>
                <td style="padding: 1rem 1.5rem;">
                  @if (m.status === 'Paga') {
                    <span style="padding: 0.25rem 0.625rem; background: rgba(200, 255, 0, 0.1); border-radius: 1rem; font-size: 0.75rem; font-weight: 500; color: #c8ff00;">Paga</span>
                  } @else if (m.status === 'Aberta') {
                    <span style="padding: 0.25rem 0.625rem; background: rgba(161, 161, 170, 0.15); border-radius: 1rem; font-size: 0.75rem; font-weight: 500; color: #a1a1aa;">Pendente</span>
                  } @else {
                    <span style="padding: 0.25rem 0.625rem; background: rgba(250, 250, 250, 0.08); border-radius: 1rem; font-size: 0.75rem; font-weight: 500; color: #fafafa;">{{ m.status }}</span>
                  }
                </td>
                <td style="padding: 1rem 1.5rem;">
                  @if (m.status !== 'Paga') {
                    <button (click)="marcarPago(m)"
                      style="padding: 0.375rem 0.75rem; background: rgba(200, 255, 0, 0.1); border: 1px solid rgba(200, 255, 0, 0.2); border-radius: 0.375rem; color: #c8ff00; cursor: pointer; font-weight: 500; font-size: 0.75rem;">
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
    :host { display: block; }
    * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
  `]
})
export class MensalidadesComponent implements OnInit {
  private mensalidadesService = inject(MensalidadesService);
  private alunosService = inject(AlunosService);
  private planosService = inject(PlanosService);
  private toast = inject(ToastService);

  showForm = signal(false);
  loading = signal(false);
  filtroStatus = '';
  form = { alunoId: '', planoId: '', valor: 0, dataVencimento: '' };

  mensalidades = signal<MensalidadeDto[]>([]);
  alunos = signal<AlunoDto[]>([]);
  planos = signal<PlanoDto[]>([]);
  filtradas = signal<MensalidadeDto[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.alunosService.getAll().subscribe({
      next: (res) => { if (res.success && res.data) this.alunos.set(res.data); },
      error: () => this.toast.error('Erro ao carregar alunos')
    });
    this.planosService.getAll().subscribe({
      next: (res) => { if (res.success && res.data) this.planos.set(res.data); },
      error: () => this.toast.error('Erro ao carregar planos')
    });
    this.loadMensalidades();
  }

  loadMensalidades(): void {
    this.alunosService.getAll().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const all: MensalidadeDto[] = [];
          let completed = 0;
          for (const aluno of res.data) {
            this.mensalidadesService.getByAlunoId(aluno.id).subscribe({
              next: (r) => {
                if (r.success && r.data) all.push(...r.data);
                completed++;
                if (completed === res.data!.length) {
                  this.mensalidades.set(all);
                  this.aplicarFiltro();
                }
              },
              error: () => completed++
            });
          }
          if (res.data.length === 0) this.loading.set(false);
        }
      },
      error: () => { this.loading.set(false); this.toast.error('Erro ao carregar mensalidades'); }
    });
  }

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
    if (!this.form.alunoId || !this.form.planoId) return;
    const dto: CreateMensalidadeDto = {
      alunoId: this.form.alunoId, planoId: this.form.planoId,
      valor: this.form.valor, dataVencimento: this.form.dataVencimento
    };
    this.mensalidadesService.create(dto).subscribe({
      next: () => { this.toast.success('Mensalidade criada'); this.loadMensalidades(); },
      error: () => this.toast.error('Erro ao criar mensalidade')
    });
    this.showForm.set(false);
    this.form = { alunoId: '', planoId: '', valor: 0, dataVencimento: '' };
  }

  marcarPago(m: MensalidadeDto): void {
    this.mensalidadesService.registrarPagamento({
      mensalidadeId: m.id, metodo: 'PIX', valor: m.valor
    }).subscribe({
      next: () => { this.toast.success('Pagamento registrado'); this.loadMensalidades(); },
      error: () => this.toast.error('Erro ao registrar pagamento')
    });
  }
}
