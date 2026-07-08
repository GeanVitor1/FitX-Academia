import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckinsService } from '../../core/services/checkins.service';
import { AlunosService } from '../../core/services/alunos.service';
import { ToastService } from '../../shared/services/toast.service';
import { CheckinDto, AlunoDto } from '../../core/models/models';

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding:2.5rem;max-width:1400px;margin:0 auto;font-family:'Inter',system-ui,-apple-system,sans-serif;">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:2.5rem;">
        <div>
          <h1 style="font-size:1.875rem;font-weight:700;color:#fff;margin:0 0 0.375rem 0;letter-spacing:-0.025em;">
            <span style="color:#c8ff00;">Check-in</span>
          </h1>
          <p style="color:#a1a1aa;margin:0;font-size:0.875rem;">Controle de presenca da academia</p>
        </div>
        <button (click)="showForm.set(!showForm())"
                style="padding:0.625rem 1.25rem;background:#c8ff00;color:#09090b;border:none;border-radius:8px;font-weight:600;font-size:0.8125rem;cursor:pointer;font-family:inherit;">
          {{ showForm() ? 'Cancelar' : '+ Novo Check-in' }}
        </button>
      </div>

      @if (loading()) {
        <div style="text-align:center;padding:3rem;color:#52525b;">Carregando...</div>
      }

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem;">
        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
          <span style="font-size:0.75rem;font-weight:500;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.05em;">Presentes agora</span>
          <span style="font-size:1.75rem;font-weight:700;color:#fff;letter-spacing:-0.03em;">{{ getPresentes() }}</span>
        </div>
        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
          <span style="font-size:0.75rem;font-weight:500;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.05em;">Saidas hoje</span>
          <span style="font-size:1.75rem;font-weight:700;color:#fff;letter-spacing:-0.03em;">{{ getSaidas() }}</span>
        </div>
        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
          <span style="font-size:0.75rem;font-weight:500;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.05em;">Total hoje</span>
          <span style="font-size:1.75rem;font-weight:700;color:#fff;letter-spacing:-0.03em;">{{ checkins().length }}</span>
        </div>
      </div>

      @if (showForm()) {
        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.5rem;margin-bottom:2rem;">
          <h3 style="font-size:0.9375rem;font-weight:600;color:#fff;margin:0 0 1.25rem 0;">Registrar Check-in</h3>
          <div style="display:flex;gap:1rem;align-items:flex-end;">
            <div style="flex:1;display:flex;flex-direction:column;gap:0.375rem;">
              <label style="font-size:0.75rem;color:#a1a1aa;font-weight:500;">Selecionar Aluno</label>
              <select [(ngModel)]="selectedAlunoId"
                style="padding:0.625rem 0.875rem;background:#09090b;border:1px solid #1e1e22;border-radius:8px;color:#fff;font-size:0.8125rem;font-family:inherit;">
                <option value="">Selecione...</option>
                @for (a of alunos(); track a.id) {
                  <option [value]="a.id">{{ a.nome }}</option>
                }
              </select>
            </div>
            <button (click)="registrar()"
                    style="padding:0.625rem 1.5rem;background:#c8ff00;color:#09090b;border:none;border-radius:8px;font-weight:600;font-size:0.8125rem;cursor:pointer;font-family:inherit;white-space:nowrap;">
              Registrar Entrada
            </button>
          </div>
        </div>
      }

      <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;overflow:hidden;">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem;border-bottom:1px solid #1e1e22;">
          <h2 style="font-size:0.9375rem;font-weight:600;color:#fff;margin:0;">Check-ins de Hoje</h2>
        </div>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr>
              <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Aluno</th>
              <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Entrada</th>
              <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Saida</th>
              <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Status</th>
              <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Acao</th>
            </tr>
          </thead>
          <tbody>
            @for (checkin of checkins(); track checkin.id) {
              <tr style="border-bottom:1px solid #1e1e22;">
                <td style="padding:0.875rem 1.5rem;font-size:0.8125rem;color:#fff;font-weight:500;">{{ checkin.alunoNome }}</td>
                <td style="padding:0.875rem 1.5rem;font-size:0.8125rem;color:#a1a1aa;">{{ checkin.dataEntrada | date:'HH:mm' }}</td>
                <td style="padding:0.875rem 1.5rem;font-size:0.8125rem;color:#a1a1aa;">{{ checkin.dataSaida ? (checkin.dataSaida | date:'HH:mm') : '---' }}</td>
                <td style="padding:0.875rem 1.5rem;">
                  @if (checkin.status === 'Presente') {
                    <span style="display:inline-block;padding:0.2rem 0.625rem;border-radius:100px;font-size:0.6875rem;font-weight:600;background:rgba(200,255,0,0.08);color:#c8ff00;">Presente</span>
                  } @else {
                    <span style="display:inline-block;padding:0.2rem 0.625rem;border-radius:100px;font-size:0.6875rem;font-weight:600;background:rgba(161,161,170,0.08);color:#a1a1aa;">Saiu</span>
                  }
                </td>
                <td style="padding:0.875rem 1.5rem;">
                  @if (checkin.status === 'Presente') {
                    <button (click)="checkout(checkin)"
                            style="padding:0.375rem 0.875rem;background:transparent;border:1px solid #52525b;border-radius:6px;color:#fff;cursor:pointer;font-weight:500;font-size:0.75rem;font-family:inherit;">
                      Check-out
                    </button>
                  } @else {
                    <span style="color:#52525b;font-size:0.75rem;">Finalizado</span>
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
    :host { display: block; background: #09090b; min-height: 100vh; }
  `]
})
export class CheckinComponent implements OnInit {
  private checkinsService = inject(CheckinsService);
  private alunosService = inject(AlunosService);
  private toast = inject(ToastService);

  showForm = signal(false);
  loading = signal(false);
  selectedAlunoId = '';
  checkins = signal<CheckinDto[]>([]);
  alunos = signal<AlunoDto[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.alunosService.getAll().subscribe({
      next: (res) => { if (res.success && res.data) this.alunos.set(res.data); },
      error: () => { this.toast.error('Erro ao carregar alunos'); }
    });
    this.checkinsService.getActive().subscribe({
      next: (res) => { if (res.success && res.data) this.checkins.set(res.data); this.loading.set(false); },
      error: () => { this.loading.set(false); this.toast.error('Erro ao carregar check-ins'); }
    });
  }

  getPresentes(): number { return this.checkins().filter(c => c.status === 'Presente').length; }
  getSaidas(): number { return this.checkins().filter(c => c.status === 'Saiu').length; }

  registrar(): void {
    if (!this.selectedAlunoId) return;
    this.checkinsService.checkin(this.selectedAlunoId).subscribe({
      next: () => { this.toast.success('Check-in registrado'); this.loadData(); },
      error: () => this.toast.error('Erro ao registrar check-in')
    });
    this.selectedAlunoId = '';
    this.showForm.set(false);
  }

  checkout(checkin: CheckinDto): void {
    this.checkinsService.checkout(checkin.alunoId).subscribe({
      next: () => { this.toast.success('Check-out registrado'); this.loadData(); },
      error: () => this.toast.error('Erro ao registrar check-out')
    });
  }
}
