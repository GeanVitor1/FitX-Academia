import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 2rem; min-height: 100vh; background: #09090b; color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">

      <div style="margin-bottom: 2.5rem; max-width: 720px; margin-left: auto; margin-right: auto;">
        <h1 style="font-size: 1.875rem; font-weight: 700; color: #fafafa; margin: 0 0 0.375rem 0; letter-spacing: -0.02em;">Notificações</h1>
        <p style="color: #a1a1aa; margin: 0; font-size: 0.875rem;">Suas notificações e alertas recentes</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.5rem; max-width: 720px; margin-left: auto; margin-right: auto;">
        @for (noti of notificacoes(); track noti.id) {
          <div style="display: flex; align-items: flex-start; gap: 1rem; padding: 1.125rem 1.25rem; background: #111113; border: 1px solid #1e1e22; border-radius: 0.75rem; transition: all 0.2s ease; cursor: pointer;"
               [style.border-left]="!noti.lida ? '2px solid #c8ff00' : '2px solid transparent'"
               onmouseover="this.style.borderColor='#27272a'; this.style.background='#141416'"
               onmouseout="this.style.borderColor='#1e1e22'; this.style.background='#111113'">

            <div style="width: 40px; height: 40px; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; background: rgba(200, 255, 0, 0.06);">
              {{ getIcon(noti.tipo) }}
            </div>

            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.25rem;">
                <h4 style="font-size: 0.875rem; font-weight: 600; color: #fafafa; margin: 0; letter-spacing: -0.01em;">{{ noti.titulo }}</h4>
                @if (!noti.lida) {
                  <span style="width: 7px; height: 7px; background: #c8ff00; border-radius: 50%; flex-shrink: 0; margin-top: 0.375rem;"></span>
                }
              </div>
              <p style="font-size: 0.8125rem; color: #a1a1aa; margin: 0 0 0.375rem 0; line-height: 1.5;">{{ noti.mensagem }}</p>
              <span style="font-size: 0.75rem; color: #52525b;">{{ noti.data }}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @media (max-width: 768px) {
      div[style*="max-width: 720px"] { padding-left: 0.5rem; padding-right: 0.5rem; }
    }
  `]
})
export class NotificacoesComponent {
  notificacoes = signal([
    { id: '1', titulo: 'Bem-vindo a FitX!', mensagem: 'Sua conta foi criada com sucesso. Comece sua transformacao agora!', tipo: 'sistema', data: 'Agora', lida: false }
  ]);

  getIcon(tipo: string): string {
    const icons: Record<string, string> = {
      'pagamento': '💰',
      'treino': '💪',
      'aviso': '📋',
      'sistema': '🔔'
    };
    return icons[tipo] || '🔔';
  }
}
