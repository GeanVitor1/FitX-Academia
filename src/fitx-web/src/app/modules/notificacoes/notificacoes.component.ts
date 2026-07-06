import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacoesService } from '../../core/services/notificacoes.service';
import { ToastService } from '../../shared/services/toast.service';
import { NotificacaoDto } from '../../core/models/models';

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:2rem;max-width:800px;margin:0 auto;font-family:'Inter',system-ui,-apple-system,sans-serif;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem;">
        <div>
          <h1 style="font-size:1.75rem;font-weight:700;color:#fafafa;margin:0 0 0.25rem 0;letter-spacing:-0.02em;">
            <span style="color:#c8ff00;">Notificacoes</span>
          </h1>
          <p style="color:#a1a1aa;margin:0;font-size:0.875rem;">Central de notificacoes</p>
        </div>
        @if (notificacoes().length > 0) {
          <button (click)="marcarTodasLidas()"
            style="padding:0.5rem 1rem;background:rgba(200,255,0,0.08);border:1px solid rgba(200,255,0,0.15);border-radius:8px;color:#c8ff00;cursor:pointer;font-weight:500;font-size:0.8125rem;font-family:inherit;">
            Marcar todas como lidas
          </button>
        }
      </div>

      @if (loading()) {
        <div style="text-align:center;padding:3rem;color:#52525b;">Carregando...</div>
      }

      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        @for (notif of notificacoes(); track notif.id) {
          <div style="display:flex;align-items:flex-start;gap:1rem;padding:1rem 1.25rem;background:#111113;border:1px solid #1e1e22;border-radius:10px;transition:all 0.2s ease;"
               [style.border-left]="notif.lida ? '3px solid transparent' : '3px solid #c8ff00'"
               [style.opacity]="notif.lida ? '0.6' : '1'">
            <div style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;
                        background:rgba(200,255,0,0.08);color:#c8ff00;font-size:0.85rem;">
              {{ notif.lida ? '✓' : '!' }}
            </div>
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.25rem;">
                <span style="font-size:0.875rem;font-weight:600;color:#fafafa;">{{ notif.titulo }}</span>
                <span style="font-size:0.6875rem;color:#52525b;">{{ notif.criadaEm | date:'dd/MM HH:mm' }}</span>
              </div>
              <p style="font-size:0.8125rem;color:#a1a1aa;margin:0 0 0.5rem 0;line-height:1.4;">{{ notif.mensagem }}</p>
              <div style="display:flex;gap:0.5rem;">
                @if (!notif.lida) {
                  <button (click)="marcarLida(notif.id)"
                    style="padding:0.25rem 0.75rem;background:transparent;border:1px solid #1e1e22;border-radius:5px;color:#a1a1aa;cursor:pointer;font-size:0.7rem;font-family:inherit;">
                    Marcar lida
                  </button>
                }
                <button (click)="excluir(notif.id)"
                  style="padding:0.25rem 0.75rem;background:transparent;border:1px solid #1e1e22;border-radius:5px;color:#52525b;cursor:pointer;font-size:0.7rem;font-family:inherit;">
                  Excluir
                </button>
              </div>
            </div>
          </div>
        } @empty {
          <div style="text-align:center;padding:3rem;color:#52525b;">
            <p>Nenhuma notificacao encontrada</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; background: #09090b; min-height: 100vh; }
  `]
})
export class NotificacoesComponent implements OnInit {
  private notificacoesService = inject(NotificacoesService);
  private toast = inject(ToastService);

  loading = signal(false);
  notificacoes = signal<NotificacaoDto[]>([]);

  ngOnInit(): void {
    this.loadNotificacoes();
  }

  loadNotificacoes(): void {
    this.loading.set(true);
    this.notificacoesService.getAll().subscribe({
      next: (res) => { if (res.success && res.data) this.notificacoes.set(res.data); this.loading.set(false); },
      error: () => { this.loading.set(false); this.toast.error('Erro ao carregar notificações'); }
    });
  }

  marcarLida(id: string): void {
    this.notificacoesService.marcarComoLida(id).subscribe({
      next: () => this.loadNotificacoes(),
      error: () => this.toast.error('Erro ao marcar como lida')
    });
  }

  marcarTodasLidas(): void {
    this.notificacoesService.marcarTodasComoLida().subscribe({
      next: () => this.loadNotificacoes(),
      error: () => this.toast.error('Erro ao marcar notificações')
    });
  }

  excluir(id: string): void {
    this.notificacoesService.delete(id).subscribe({
      next: () => { this.toast.success('Notificação excluída'); this.loadNotificacoes(); },
      error: () => this.toast.error('Erro ao excluir notificação')
    });
  }
}
