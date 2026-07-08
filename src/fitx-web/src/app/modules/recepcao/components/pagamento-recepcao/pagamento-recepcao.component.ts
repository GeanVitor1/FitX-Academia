import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../shared/services/toast.service';
import { AlunosService } from '../../../../core/services/alunos.service';
import { PagamentosService } from '../../../../core/services/pagamentos.service';
import { CreatePagamentoDto, AlunoDto } from '../../../../core/models/models';

@Component({
  selector: 'app-pagamento-recepcao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pagamento-recepcao-page">
      <div class="page-header">
        <h1>Pagamento na <span class="highlight">Recepção</span></h1>
        <p>Registre pagamentos presenciais</p>
      </div>

      <div class="search-section">
        <div class="search-box">
          <input type="text" placeholder="Buscar aluno por nome ou matrícula..." class="search-input" [(ngModel)]="searchTerm" (keypress)="onSearchKeyPress($event)" />
          <button class="search-btn" (click)="searchStudent()">🔍</button>
        </div>

        @if (foundStudent()) {
          <div class="student-card">
            <div class="student-avatar">
              <span>{{ foundStudent()!.name.charAt(0) }}</span>
            </div>
            <div class="student-info">
              <h4>{{ foundStudent()!.name }}</h4>
              <p>{{ foundStudent()!.plan }}</p>
            </div>
            <div class="student-status">
              <span class="status" [class]="foundStudent()!.status">
                {{ foundStudent()!.status === 'active' ? 'Ativo' : 'Inadimplente' }}
              </span>
            </div>
          </div>
        }
      </div>

      @if (foundStudent()) {
        <div class="payment-form">
          <div class="form-section">
            <h2>Dados do Pagamento</h2>

            <div class="form-row">
              <div class="form-group">
                <label>Valor (R$) *</label>
                <input type="number" class="form-input" [(ngModel)]="paymentAmount" step="0.01" min="0" />
              </div>
              <div class="form-group">
                <label>Referência</label>
                <input type="text" class="form-input" placeholder="Ex: Mensalidade Julho" [(ngModel)]="paymentReference" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Forma de Pagamento *</label>
                <div class="payment-methods">
                  <button class="method-btn" [class.active]="paymentMethod === 'pix'" (click)="paymentMethod = 'pix'">
                    <span class="method-icon">📱</span>
                    <span class="method-text">PIX</span>
                  </button>
                  <button class="method-btn" [class.active]="paymentMethod === 'card'" (click)="paymentMethod = 'card'">
                    <span class="method-icon">💳</span>
                    <span class="method-text">Cartão</span>
                  </button>
                  <button class="method-btn" [class.active]="paymentMethod === 'cash'" (click)="paymentMethod = 'cash'">
                    <span class="method-icon">💵</span>
                    <span class="method-text">Dinheiro</span>
                  </button>
                  <button class="method-btn" [class.active]="paymentMethod === 'boleto'" (click)="paymentMethod = 'boleto'">
                    <span class="method-icon">📄</span>
                    <span class="method-text">Boleto</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Observações</label>
              <textarea class="form-textarea" rows="2" placeholder="Observações sobre o pagamento..." [(ngModel)]="paymentNotes"></textarea>
            </div>
          </div>

          <div class="payment-summary">
            <div class="summary-row">
              <span>Aluno:</span>
              <span>{{ foundStudent()!.name }}</span>
            </div>
            <div class="summary-row">
              <span>Plano:</span>
              <span>{{ foundStudent()!.plan }}</span>
            </div>
            <div class="summary-row">
              <span>Forma:</span>
              <span>{{ getMethodName() }}</span>
            </div>
            <div class="summary-row total">
              <span>Total:</span>
              <span>R$ {{ paymentAmount.toFixed(2) }}</span>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-secondary" (click)="cancel()">Cancelar</button>
            <button class="btn-primary" (click)="confirmPayment()" [disabled]="!canConfirm()">
              Confirmar Pagamento
            </button>
          </div>
        </div>
      }

      <div class="recent-payments">
        <h2>Últimos Pagamentos</h2>
        <div class="payments-list">
          @for (payment of recentPayments; track payment.id) {
            <div class="payment-item">
              <div class="payment-icon" [class]="payment.status">
                {{ payment.status === 'confirmed' ? '✓' : '⏳' }}
              </div>
              <div class="payment-info">
                <h4>{{ payment.student }}</h4>
                <p>{{ payment.reference }}</p>
              </div>
              <div class="payment-details">
                <span class="amount">R$ {{ payment.amount }}</span>
                <span class="method">{{ payment.method }}</span>
              </div>
              <span class="status-badge" [class]="payment.status">
                {{ payment.status === 'confirmed' ? 'Confirmado' : 'Pendente' }}
              </span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pagamento-recepcao-page {
      padding: 2rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 0.5rem 0;
    }

    .highlight {
      color: var(--color-primary);
    }

    .page-header p {
      color: var(--color-text-secondary);
      margin: 0;
    }

    .search-section {
      margin-bottom: 2rem;
    }

    .search-box {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .search-input {
      flex: 1;
      padding: 0.875rem 1rem;
      background: var(--color-glass);
      border: 1px solid var(--color-glass-border);
      border-radius: 0.5rem;
      color: var(--color-text-primary);
      font-size: 0.9rem;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .search-btn {
      padding: 0.875rem 1.25rem;
      background: var(--color-primary);
      color: var(--color-bg-dark);
      border: none;
      border-radius: 0.5rem;
      font-size: 1.125rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .search-btn:hover {
      background: var(--color-primary-dark);
    }

    .student-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: 1rem;
      padding: 1.5rem;
    }

    .student-avatar {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: var(--color-bg-dark);
    }

    .student-info {
      flex: 1;
    }

    .student-info h4 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 0.25rem 0;
    }

    .student-info p {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin: 0;
    }

    .status.active {
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status.inactive {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .payment-form {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .form-section {
      margin-bottom: 1.5rem;
    }

    .form-section h2 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 1.5rem 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-primary);
    }

    .form-input, .form-textarea {
      padding: 0.75rem 1rem;
      background: var(--color-glass);
      border: 1px solid var(--color-glass-border);
      border-radius: 0.5rem;
      color: var(--color-text-primary);
      font-size: 0.875rem;
    }

    .form-input:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .form-textarea {
      resize: vertical;
      font-family: inherit;
    }

    .payment-methods {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
    }

    .method-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: var(--color-glass);
      border: 1px solid var(--color-glass-border);
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .method-btn:hover {
      border-color: var(--color-primary);
    }

    .method-btn.active {
      background: rgba(200, 255, 0, 0.1);
      border-color: var(--color-primary);
    }

    .method-icon {
      font-size: 1.5rem;
    }

    .method-text {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .payment-summary {
      background: var(--color-glass);
      border-radius: 0.75rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }

    .summary-row.total {
      border-top: 1px solid var(--color-border);
      margin-top: 0.5rem;
      padding-top: 1rem;
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .btn-secondary {
      padding: 0.75rem 2rem;
      background: var(--color-glass);
      border: 1px solid var(--color-glass-border);
      border-radius: 0.5rem;
      color: var(--color-text-primary);
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .btn-primary {
      padding: 0.75rem 2rem;
      background: var(--color-primary);
      color: var(--color-bg-dark);
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--color-primary-dark);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .recent-payments {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: 1rem;
      padding: 1.5rem;
    }

    .recent-payments h2 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 1.5rem 0;
    }

    .payments-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .payment-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--color-glass);
      border-radius: 0.75rem;
    }

    .payment-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .payment-icon.confirmed {
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
    }

    .payment-icon.pending {
      background: rgba(234, 179, 8, 0.1);
      color: #eab308;
    }

    .payment-info {
      flex: 1;
    }

    .payment-info h4 {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 0.25rem 0;
    }

    .payment-info p {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      margin: 0;
    }

    .payment-details {
      text-align: right;
    }

    .amount {
      display: block;
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .method {
      font-size: 0.7rem;
      color: var(--color-text-secondary);
    }

    .status-badge {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
    }

    .status-badge.confirmed {
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
    }

    .status-badge.pending {
      background: rgba(234, 179, 8, 0.1);
      color: #eab308;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .payment-methods {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class PagamentoRecepcaoComponent implements OnInit {
  private toast = inject(ToastService);
  private alunosService = inject(AlunosService);
  private pagamentosService = inject(PagamentosService);

  searchTerm = '';
  paymentAmount = 0;
  paymentReference = '';
  paymentMethod = 'pix';
  paymentNotes = '';
  saving = signal(false);

  foundStudent = signal<{ id: string; name: string; plan: string; status: string } | null>(null);

  recentPayments: { id: string; student: string; reference: string; amount: string; method: string; status: string }[] = [];

  private allStudents: { id: string; name: string; plan: string; status: string }[] = [];

  ngOnInit(): void {
    this.alunosService.getAll().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.allStudents = res.data.map(a => ({
            id: a.id, name: a.nome, plan: a.planoNome || 'Sem plano',
            status: a.status === 'Ativo' ? 'active' : 'inactive'
          }));
        }
      },
      error: () => this.toast.error('Erro ao carregar alunos')
    });
  }

  searchStudent(): void {
    if (this.searchTerm.trim()) {
      const found = this.allStudents.find(s =>
        s.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.foundStudent.set(found || null);
      if (found) {
        const price = found.plan.includes('129,90') ? 129.90 :
                     found.plan.includes('199,90') ? 199.90 : 89.90;
        this.paymentAmount = price;
      }
    }
  }

  onSearchKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.searchStudent();
    }
  }

  getMethodName(): string {
    const methods: Record<string, string> = {
      pix: 'PIX',
      card: 'Cartão',
      cash: 'Dinheiro',
      boleto: 'Boleto'
    };
    return methods[this.paymentMethod] || this.paymentMethod;
  }

  canConfirm(): boolean {
    return !!this.foundStudent() && this.paymentAmount > 0 && !!this.paymentMethod;
  }

  confirmPayment(): void {
    if (!this.canConfirm()) return;
    this.saving.set(true);
    const metodoMap: Record<string, 'PIX' | 'CartaoCredito' | 'Dinheiro' | 'Boleto'> = {
      pix: 'PIX', card: 'CartaoCredito', cash: 'Dinheiro', boleto: 'Boleto'
    };
    const dto: CreatePagamentoDto = {
      mensalidadeId: '',
      metodo: metodoMap[this.paymentMethod] || 'PIX',
      valor: this.paymentAmount
    };
    this.pagamentosService.create(dto).subscribe({
      next: () => { this.saving.set(false); this.toast.success('Pagamento confirmado com sucesso!'); this.cancel(); },
      error: () => { this.saving.set(false); this.toast.error('Erro ao registrar pagamento'); }
    });
  }

  cancel(): void {
    this.foundStudent.set(null);
    this.paymentAmount = 0;
    this.paymentReference = '';
    this.paymentMethod = 'pix';
    this.paymentNotes = '';
    this.searchTerm = '';
  }
}
