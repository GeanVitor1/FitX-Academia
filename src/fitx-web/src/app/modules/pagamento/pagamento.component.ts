import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagamento-page">
      <header class="page-header">
        <h1>Meus <span class="accent">Pagamentos</span></h1>
        <p class="subtitle">Gerencie suas mensalidades e pagamentos</p>
      </header>

      <div class="current-plan">
        <div class="plan-badge">PLANO ATUAL</div>
        <div class="plan-info">
          <h2>Plano Completo</h2>
          <p class="plan-price">R$ 129,90/mes</p>
        </div>
        <div class="plan-status">
          <span class="status-badge active">Ativo</span>
          <p>Proximo vencimento: 15/07/2026</p>
        </div>
      </div>

      <div class="payment-methods">
        <button class="method-btn" [class.active]="selectedMethod() === 'pix'" (click)="selectedMethod.set('pix')">
          <span class="method-icon">◇</span>
          <span class="method-label">PIX</span>
        </button>
        <button class="method-btn" [class.active]="selectedMethod() === 'card'" (click)="selectedMethod.set('card')">
          <span class="method-icon">▣</span>
          <span class="method-label">Cartao</span>
        </button>
        <button class="method-btn" [class.active]="selectedMethod() === 'boleto'" (click)="selectedMethod.set('boleto')">
          <span class="method-icon">▧</span>
          <span class="method-label">Boleto</span>
        </button>
      </div>

      @if (selectedMethod() === 'pix') {
        <div class="payment-section">
          <h3>Pagamento via PIX</h3>
          @if (!qrGenerated()) {
            <div class="pix-content">
              <div class="pix-info">
                <div class="info-row">
                  <span class="info-label">Chave PIX</span>
                  <span class="info-value">pagamento&#64;fitx.com.br</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Valor</span>
                  <span class="info-value highlight">R$ 129,90</span>
                </div>
              </div>
              <button class="btn-primary" (click)="generateQR()">Gerar QR Code</button>
            </div>
          } @else {
            <div class="qr-result">
              <div class="qr-code">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  @for (cell of qrCells; track cell.i) {
                    <rect [attr.x]="cell.x" [attr.y]="cell.y" width="8" height="8" fill="#fafafa"/>
                  }
                </svg>
              </div>
              <p class="qr-text">Escaneie o QR Code para pagar</p>
              <div class="pix-copy">
                <span class="pix-code">00020126580014BR.GOV.PIX0136pagamento&#64;fitx.com.br5204000053039865404129905802BR5913FITX ACADEMIA6009SAO PAULO62070503***6304ABCD</span>
                <button class="copy-btn" (click)="copyPix()">Copiar</button>
              </div>
              <button class="btn-secondary" (click)="qrGenerated.set(false)">Voltar</button>
            </div>
          }
        </div>
      }

      @if (selectedMethod() === 'card') {
        <div class="payment-section">
          <h3>Pagamento via Cartao</h3>
          <div class="card-form">
            <div class="form-group">
              <label>Numero do Cartao</label>
              <input type="text" placeholder="0000 0000 0000 0000" class="form-input" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Validade</label>
                <input type="text" placeholder="MM/AA" class="form-input" />
              </div>
              <div class="form-group">
                <label>CVV</label>
                <input type="text" placeholder="000" class="form-input" />
              </div>
            </div>
            <div class="form-group">
              <label>Nome no Cartao</label>
              <input type="text" placeholder="Nome como esta no cartao" class="form-input" />
            </div>
            <button class="btn-primary">Pagar com Cartao</button>
          </div>
        </div>
      }

      @if (selectedMethod() === 'boleto') {
        <div class="payment-section">
          <h3>Boleto Bancario</h3>
          <div class="boleto-content">
            <p>O boleto sera gerado e enviado para seu e-mail.</p>
            <p>Prazo de pagamento: 3 dias uteis</p>
          </div>
          <button class="btn-primary">Gerar Boleto</button>
        </div>
      }

      <div class="history-section">
        <h2>Historico de Pagamentos</h2>
        <div class="history-list">
          @for (payment of paymentHistory; track payment.id) {
            <div class="history-item">
              <div class="payment-status" [class]="payment.status">
                {{ payment.status === 'paid' ? 'OK' : '...' }}
              </div>
              <div class="payment-info">
                <span class="payment-desc">{{ payment.description }}</span>
                <span class="payment-date">{{ payment.date }}</span>
              </div>
              <div class="payment-amount">
                <span class="amount">R$ {{ payment.amount }}</span>
                <span class="status-text" [class]="payment.status">
                  {{ payment.status === 'paid' ? 'Pago' : 'Pendente' }}
                </span>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pagamento-page { padding: 2rem; max-width: 800px; margin: 0 auto; }

    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #fafafa; margin: 0; }
    .accent { color: #c8ff00; }
    .subtitle { font-size: 13px; color: #52525b; margin: 4px 0 0; }

    .current-plan {
      display: flex; align-items: center; gap: 1.5rem; padding: 1.25rem;
      background: #111113; border: 1px solid #1e1e22; border-radius: 12px;
      margin-bottom: 1.5rem;
    }
    .plan-badge {
      padding: 4px 10px; background: rgba(200, 255, 0, 0.1); color: #c8ff00;
      border-radius: 4px; font-size: 10px; font-weight: 700; letter-spacing: 0.05em;
    }
    .plan-info { flex: 1; }
    .plan-info h2 { font-size: 1rem; font-weight: 600; color: #fafafa; margin: 0; }
    .plan-price { font-size: 13px; color: #a1a1aa; margin: 2px 0 0; }
    .plan-status { text-align: right; }
    .status-badge {
      display: inline-block; padding: 3px 10px; border-radius: 4px;
      font-size: 11px; font-weight: 600;
    }
    .status-badge.active { background: rgba(22, 163, 74, 0.12); color: #4ade80; }
    .plan-status p { font-size: 11px; color: #52525b; margin: 4px 0 0; }

    .payment-methods { display: flex; gap: 8px; margin-bottom: 1.5rem; }
    .method-btn {
      flex: 1; display: flex; flex-direction: column; align-items: center;
      gap: 6px; padding: 1rem; background: #111113; border: 1px solid #1e1e22;
      border-radius: 10px; cursor: pointer; transition: all 0.2s;
    }
    .method-btn:hover { border-color: #3f3f46; }
    .method-btn.active { border-color: #c8ff00; background: rgba(200, 255, 0, 0.04); }
    .method-icon { font-size: 1.25rem; color: #52525b; }
    .method-btn.active .method-icon { color: #c8ff00; }
    .method-label { font-size: 12px; font-weight: 600; color: #a1a1aa; }
    .method-btn.active .method-label { color: #fafafa; }

    .payment-section {
      background: #111113; border: 1px solid #1e1e22; border-radius: 12px;
      padding: 1.5rem; margin-bottom: 1.5rem;
    }
    .payment-section h3 { font-size: 14px; font-weight: 600; color: #fafafa; margin: 0 0 1rem; }

    .pix-content { display: flex; flex-direction: column; gap: 1rem; }
    .pix-info { display: flex; flex-direction: column; gap: 0.5rem; }
    .info-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #1e1e22; }
    .info-label { font-size: 12px; color: #52525b; }
    .info-value { font-size: 13px; font-weight: 600; color: #fafafa; }
    .info-value.highlight { color: #c8ff00; font-size: 1.25rem; }

    .qr-result { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .qr-code {
      width: 200px; height: 200px; background: #0a0a0a; border: 1px solid #1e1e22;
      border-radius: 12px; padding: 16px; display: flex; align-items: center; justify-content: center;
    }
    .qr-code svg { width: 100%; height: 100%; }
    .qr-text { font-size: 12px; color: #52525b; margin: 0; }
    .pix-copy {
      display: flex; align-items: center; gap: 8px; width: 100%;
      padding: 8px 12px; background: #18181b; border: 1px solid #1e1e22;
      border-radius: 8px;
    }
    .pix-code { flex: 1; font-size: 9px; color: #52525b; word-break: break-all; font-family: monospace; }
    .copy-btn {
      padding: 4px 12px; background: #18181b; border: 1px solid #1e1e22;
      border-radius: 4px; color: #c8ff00; font-size: 11px; font-weight: 600;
      cursor: pointer; transition: all 0.15s; white-space: nowrap;
    }
    .copy-btn:hover { border-color: #c8ff00; }

    .card-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 4px; }
    .form-group label { font-size: 11px; color: #52525b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .form-input {
      width: 100%; padding: 10px 12px; background: #18181b; border: 1px solid #1e1e22;
      border-radius: 8px; color: #fafafa; font-size: 13px;
    }
    .form-input:focus { border-color: #c8ff00; outline: none; }
    .form-input::placeholder { color: #3f3f46; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

    .boleto-content { padding: 1rem 0; }
    .boleto-content p { font-size: 13px; color: #a1a1aa; margin: 0 0 0.5rem; }

    .btn-primary {
      width: 100%; padding: 10px; background: #c8ff00; color: #000;
      border: none; border-radius: 8px; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
    }
    .btn-primary:hover { background: #d4ff33; }
    .btn-secondary {
      width: 100%; padding: 10px; background: #18181b; border: 1px solid #1e1e22;
      border-radius: 8px; color: #a1a1aa; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
    }
    .btn-secondary:hover { color: #fafafa; border-color: #3f3f46; }

    .history-section { margin-top: 2rem; }
    .history-section h2 { font-size: 14px; font-weight: 600; color: #fafafa; margin: 0 0 1rem; }
    .history-list { display: flex; flex-direction: column; gap: 4px; }
    .history-item {
      display: flex; align-items: center; gap: 1rem; padding: 12px 16px;
      background: #111113; border: 1px solid #1e1e22; border-radius: 10px;
      transition: border-color 0.2s;
    }
    .history-item:hover { border-color: #3f3f46; }
    .payment-status {
      width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
      border-radius: 6px; font-size: 10px; font-weight: 700;
    }
    .payment-status.paid { background: rgba(22, 163, 74, 0.12); color: #4ade80; }
    .payment-status.pending { background: rgba(234, 179, 8, 0.12); color: #fbbf24; }
    .payment-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .payment-desc { font-size: 13px; font-weight: 500; color: #fafafa; }
    .payment-date { font-size: 11px; color: #52525b; }
    .payment-amount { text-align: right; }
    .amount { display: block; font-size: 13px; font-weight: 600; color: #fafafa; }
    .status-text { font-size: 11px; }
    .status-text.paid { color: #4ade80; }
    .status-text.pending { color: #fbbf24; }
  `]
})
export class PagamentoComponent {
  selectedMethod = signal<'pix' | 'card' | 'boleto' | null>(null);
  qrGenerated = signal(false);
  qrCells: { x: number; y: number; i: number }[] = [];

  paymentHistory: { id: string; description: string; date: string; amount: string; status: string }[] = [];

  generateQR(): void {
    const size = 25;
    const cells: { x: number; y: number; i: number }[] = [];
    let idx = 0;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const isCorner = (row < 7 && col < 7) || (row < 7 && col >= size - 7) || (row >= size - 7 && col < 7);
        const isBorder = isCorner && (row === 0 || row === 6 || col === 0 || col === 6 || (row >= 2 && row <= 4 && col >= 2 && col <= 4) || (row >= 2 && row <= 4 && col >= size - 5 && col <= size - 3) || (row >= size - 5 && row <= size - 3 && col >= 2 && col <= 4));
        const isRandom = !isCorner && Math.random() > 0.5;
        if (isBorder || isRandom) {
          cells.push({ x: col * 8, y: row * 8, i: idx++ });
        }
      }
    }
    this.qrCells = cells;
    this.qrGenerated.set(true);
  }

  copyPix(): void {
    navigator.clipboard.writeText('pagamento@fitx.com.br');
  }
}
