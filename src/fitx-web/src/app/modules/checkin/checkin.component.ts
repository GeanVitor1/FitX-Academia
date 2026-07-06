import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Checkin {
  id: string;
  aluno: string;
  plano: string;
  entrada: string;
  saida: string | null;
  status: 'Presente' | 'Saiu';
}

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
                style="padding:0.625rem 1.25rem;background:#c8ff00;color:#09090b;border:none;border-radius:8px;font-weight:600;font-size:0.8125rem;cursor:pointer;transition:all 0.2s ease;font-family:inherit;"
                onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
          {{ showForm() ? 'Cancelar' : '+ Novo Check-in' }}
        </button>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem;">

        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;transition:all 0.2s ease;"
             onmouseover="this.style.borderColor='#2a2a2e'" onmouseout="this.style.borderColor='#1e1e22'">
          <span style="font-size:0.75rem;font-weight:500;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.05em;">Presentes agora</span>
          <span style="font-size:1.75rem;font-weight:700;color:#fff;letter-spacing:-0.03em;">{{ getPresentes() }}</span>
        </div>

        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;transition:all 0.2s ease;"
             onmouseover="this.style.borderColor='#2a2a2e'" onmouseout="this.style.borderColor='#1e1e22'">
          <span style="font-size:0.75rem;font-weight:500;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.05em;">Saidas hoje</span>
          <span style="font-size:1.75rem;font-weight:700;color:#fff;letter-spacing:-0.03em;">{{ getSaidas() }}</span>
        </div>

        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;transition:all 0.2s ease;"
             onmouseover="this.style.borderColor='#2a2a2e'" onmouseout="this.style.borderColor='#1e1e22'">
          <span style="font-size:0.75rem;font-weight:500;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.05em;">Total hoje</span>
          <span style="font-size:1.75rem;font-weight:700;color:#fff;letter-spacing:-0.03em;">{{ checkins().length }}</span>
        </div>

      </div>

      @if (showForm()) {
        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.5rem;margin-bottom:2rem;">
          <h3 style="font-size:0.9375rem;font-weight:600;color:#fff;margin:0 0 1.25rem 0;">Registrar Check-in</h3>
          <div style="display:flex;gap:1rem;align-items:flex-end;">
            <div style="flex:1;display:flex;flex-direction:column;gap:0.375rem;">
              <label style="font-size:0.75rem;color:#a1a1aa;font-weight:500;">Aluno</label>
              <input type="text" [(ngModel)]="formAluno" placeholder="Nome do aluno"
                     style="padding:0.625rem 0.875rem;background:#09090b;border:1px solid #1e1e22;border-radius:8px;color:#fff;font-size:0.8125rem;font-family:inherit;transition:border-color 0.2s ease;outline:none;"
                     onfocus="this.style.borderColor='#c8ff00'" onblur="this.style.borderColor='#1e1e22'">
            </div>
            <div style="flex:1;display:flex;flex-direction:column;gap:0.375rem;">
              <label style="font-size:0.75rem;color:#a1a1aa;font-weight:500;">Plano</label>
              <input type="text" [(ngModel)]="formPlano" placeholder="Plano do aluno"
                     style="padding:0.625rem 0.875rem;background:#09090b;border:1px solid #1e1e22;border-radius:8px;color:#fff;font-size:0.8125rem;font-family:inherit;transition:border-color 0.2s ease;outline:none;"
                     onfocus="this.style.borderColor='#c8ff00'" onblur="this.style.borderColor='#1e1e22'">
            </div>
            <button (click)="registrar()"
                    style="padding:0.625rem 1.5rem;background:#c8ff00;color:#09090b;border:none;border-radius:8px;font-weight:600;font-size:0.8125rem;cursor:pointer;transition:all 0.2s ease;font-family:inherit;white-space:nowrap;"
                    onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
              Registrar Entrada
            </button>
          </div>
        </div>
      }

      <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;overflow:hidden;">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem;border-bottom:1px solid #1e1e22;">
          <h2 style="font-size:0.9375rem;font-weight:600;color:#fff;margin:0;">Check-ins de Hoje</h2>
          <input type="text" [(ngModel)]="filtro" (ngModelChange)="atualizarFiltro()" placeholder="Filtrar por nome..."
                 style="padding:0.5rem 0.875rem;background:#09090b;border:1px solid #1e1e22;border-radius:8px;color:#fff;font-size:0.8125rem;width:220px;font-family:inherit;transition:border-color 0.2s ease;outline:none;"
                 onfocus="this.style.borderColor='#c8ff00'" onblur="this.style.borderColor='#1e1e22'">
        </div>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr>
              <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Aluno</th>
              <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Plano</th>
              <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Entrada</th>
              <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Saida</th>
              <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Status</th>
              <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Acao</th>
            </tr>
          </thead>
          <tbody>
            @for (checkin of checkinsFiltrados(); track checkin.id) {
              <tr style="transition:background 0.15s ease;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                <td style="padding:0.875rem 1.5rem;font-size:0.8125rem;color:#fff;border-bottom:1px solid #1e1e22;font-weight:500;">{{ checkin.aluno }}</td>
                <td style="padding:0.875rem 1.5rem;font-size:0.8125rem;color:#a1a1aa;border-bottom:1px solid #1e1e22;">{{ checkin.plano }}</td>
                <td style="padding:0.875rem 1.5rem;font-size:0.8125rem;color:#a1a1aa;border-bottom:1px solid #1e1e22;">{{ checkin.entrada }}</td>
                <td style="padding:0.875rem 1.5rem;font-size:0.8125rem;color:#a1a1aa;border-bottom:1px solid #1e1e22;">{{ checkin.saida || '---' }}</td>
                <td style="padding:0.875rem 1.5rem;border-bottom:1px solid #1e1e22;">
                  @if (checkin.status === 'Presente') {
                    <span style="display:inline-block;padding:0.2rem 0.625rem;border-radius:100px;font-size:0.6875rem;font-weight:600;background:rgba(200,255,0,0.08);color:#c8ff00;">
                      Presente
                    </span>
                  } @else {
                    <span style="display:inline-block;padding:0.2rem 0.625rem;border-radius:100px;font-size:0.6875rem;font-weight:600;background:rgba(161,161,170,0.08);color:#a1a1aa;">
                      Saiu
                    </span>
                  }
                </td>
                <td style="padding:0.875rem 1.5rem;border-bottom:1px solid #1e1e22;">
                  @if (checkin.status === 'Presente') {
                    <button (click)="checkout(checkin.id)"
                            style="padding:0.375rem 0.875rem;background:transparent;border:1px solid #52525b;border-radius:6px;color:#fff;cursor:pointer;font-weight:500;font-size:0.75rem;transition:all 0.2s ease;font-family:inherit;"
                            onmouseover="this.style.borderColor='#c8ff00';this.style.color='#c8ff00'" onmouseout="this.style.borderColor='#52525b';this.style.color='#fff'">
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
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :host {
      display: block;
      background: #09090b;
      min-height: 100vh;
    }
  `]
})
export class CheckinComponent {
  showForm = signal(false);
  formAluno = '';
  formPlano = '';
  filtro = '';

  checkins = signal<Checkin[]>([]);

  checkinsFiltrados = signal<Checkin[]>([]);

  constructor() {
    this.atualizarFiltro();
  }

  getPresentes(): number {
    return this.checkins().filter(c => c.status === 'Presente').length;
  }

  getSaidas(): number {
    return this.checkins().filter(c => c.status === 'Saiu').length;
  }

  registrar(): void {
    if (!this.formAluno) return;
    const now = new Date();
    const hora = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const novo: Checkin = {
      id: Date.now().toString(),
      aluno: this.formAluno,
      plano: this.formPlano || 'Nao informado',
      entrada: hora,
      saida: null,
      status: 'Presente'
    };
    this.checkins.update(list => [novo, ...list]);
    this.formAluno = '';
    this.formPlano = '';
    this.showForm.set(false);
    this.atualizarFiltro();
  }

  checkout(id: string): void {
    const now = new Date();
    const hora = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    this.checkins.update(list => list.map(c =>
      c.id === id ? { ...c, saida: hora, status: 'Saiu' as const } : c
    ));
    this.atualizarFiltro();
  }

  atualizarFiltro(): void {
    const f = this.filtro.toLowerCase();
    const filtered = f ? this.checkins().filter(c => c.aluno.toLowerCase().includes(f)) : this.checkins();
    this.checkinsFiltrados.set(filtered);
  }
}
