import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckinsService } from '../../core/services/checkins.service';
import { AlunosService } from '../../core/services/alunos.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { CheckinDto, CheckinRequestDto, AlunoDto } from '../../core/models/models';

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
        @if (!authService.isAluno()) {
          <button (click)="showForm.set(!showForm())"
                  style="padding:0.625rem 1.25rem;background:#c8ff00;color:#09090b;border:none;border-radius:8px;font-weight:600;font-size:0.8125rem;cursor:pointer;font-family:inherit;">
            {{ showForm() ? 'Cancelar' : '+ Novo Check-in' }}
          </button>
        }
      </div>

      @if (loading()) {
        <div style="text-align:center;padding:3rem;color:#52525b;">Carregando...</div>
      }

      <!-- ==================== VISAO ALUNO ==================== -->
      @if (authService.isAluno()) {
        <!-- Card de solicitacao -->
        <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.5rem;margin-bottom:2rem;text-align:center;">
          @if (!myRequest()) {
            <!-- Sem solicitacao: botao para pedir -->
            <p style="color:#a1a1aa;margin:0 0 1rem 0;font-size:0.875rem;">Pronto para treinar? Solicite seu check-in</p>
            <button (click)="solicitarCheckin()"
                    [disabled]="requestLoading()"
                    style="padding:1rem 2.5rem;background:#c8ff00;color:#09090b;border:none;border-radius:12px;font-weight:700;font-size:1rem;cursor:pointer;font-family:inherit;transition:all 0.2s;letter-spacing:-0.01em;">
              @if (requestLoading()) {
                Enviando...
              } @else {
                SOLICITAR CHECK-IN
              }
            </button>
          } @else if (myRequest()!.status === 'Pendente') {
            <!-- Pendente: timer -->
            <div style="margin-bottom:1rem;">
              <div style="font-size:2.5rem;font-weight:800;color:#c8ff00;font-variant-numeric:tabular-nums;letter-spacing:2px;margin-bottom:0.5rem;">
                {{ formatTime(timeRemaining()) }}
              </div>
              <p style="color:#a1a1aa;margin:0;font-size:0.875rem;">Aguardando aprovacao do staff...</p>
            </div>
            <div style="height:4px;background:#1e1e22;border-radius:2px;overflow:hidden;margin-bottom:1rem;">
              <div [style.width.%]="progressPct()" style="height:100%;background:#c8ff00;border-radius:2px;transition:width 1s linear;"></div>
            </div>
            <button (click)="cancelarSolicitacao()"
                    style="padding:0.5rem 1.25rem;background:transparent;border:1px solid #52525b;border-radius:8px;color:#a1a1aa;cursor:pointer;font-weight:500;font-size:0.8125rem;font-family:inherit;">
              Cancelar solicitacao
            </button>
          } @else if (myRequest()!.status === 'Aprovado') {
            <!-- Aprovado -->
            <div style="width:56px;height:56px;background:rgba(34,197,94,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem auto;">
              <span style="font-size:1.5rem;">&#10003;</span>
            </div>
            <p style="color:#22c55e;font-weight:600;font-size:1rem;margin:0 0 0.375rem 0;">Check-in aprovado!</p>
            <p style="color:#a1a1aa;margin:0 0 1rem 0;font-size:0.875rem;">Bem-vindo a academia. Bom treino!</p>
            <button (click)="fazerCheckout()"
                    [disabled]="checkoutLoading()"
                    style="padding:0.75rem 2rem;background:transparent;border:1px solid #52525b;border-radius:8px;color:#fff;cursor:pointer;font-weight:600;font-size:0.875rem;font-family:inherit;transition:all 0.2s;">
              @if (checkoutLoading()) {
                Saindo...
              } @else {
                Fazer Check-out
              }
            </button>
          } @else if (myRequest()!.status === 'Negado') {
            <!-- Negado -->
            <div style="width:56px;height:56px;background:rgba(239,68,68,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem auto;">
              <span style="font-size:1.5rem;color:#ef4444;">&#10007;</span>
            </div>
            <p style="color:#ef4444;font-weight:600;font-size:1rem;margin:0 0 0.375rem 0;">Solicitacao negada</p>
            <p style="color:#a1a1aa;margin:0 0 1rem 0;font-size:0.875rem;">Fale com a recepcao para mais informacoes</p>
            <button (click)="myRequest.set(null)"
                    style="padding:0.5rem 1.25rem;background:#c8ff00;color:#09090b;border:none;border-radius:8px;font-weight:600;font-size:0.8125rem;cursor:pointer;font-family:inherit;">
              Tentar novamente
            </button>
          } @else if (myRequest()!.status === 'Expirado') {
            <!-- Expirado -->
            <div style="width:56px;height:56px;background:rgba(234,179,8,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem auto;">
              <span style="font-size:1.5rem;color:#eab308;">&#8987;</span>
            </div>
            <p style="color:#eab308;font-weight:600;font-size:1rem;margin:0 0 0.375rem 0;">Solicitacao expirada</p>
            <p style="color:#a1a1aa;margin:0 0 1rem 0;font-size:0.875rem;">Tempo esgotado (15 min). Solicite novamente.</p>
            <button (click)="myRequest.set(null)"
                    style="padding:0.5rem 1.25rem;background:#c8ff00;color:#09090b;border:none;border-radius:8px;font-weight:600;font-size:0.8125rem;cursor:pointer;font-family:inherit;">
              Solicitar novamente
            </button>
          } @else if (myRequest()!.status === 'Cancelado') {
            <!-- Cancelado -->
            <div style="width:56px;height:56px;background:rgba(161,161,170,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem auto;">
              <span style="font-size:1.5rem;color:#a1a1aa;">&#8987;</span>
            </div>
            <p style="color:#a1a1aa;font-weight:600;font-size:1rem;margin:0 0 0.375rem 0;">Solicitacao cancelada</p>
            <p style="color:#a1a1aa;margin:0 0 1rem 0;font-size:0.875rem;">Voce cancelou a solicitacao.</p>
            <button (click)="myRequest.set(null)"
                    style="padding:0.5rem 1.25rem;background:#c8ff00;color:#09090b;border:none;border-radius:8px;font-weight:600;font-size:0.8125rem;cursor:pointer;font-family:inherit;">
              Solicitar novamente
            </button>
          }
        </div>

        <!-- Historico do aluno -->
        @if (checkins().length) {
          <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;overflow:hidden;">
            <div style="padding:1.25rem 1.5rem;border-bottom:1px solid #1e1e22;">
              <h2 style="font-size:0.9375rem;font-weight:600;color:#fff;margin:0;">Meus Check-ins</h2>
            </div>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr>
                  <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Data</th>
                  <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Entrada</th>
                  <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Saida</th>
                  <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.6875rem;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.05em;background:#09090b;border-bottom:1px solid #1e1e22;">Status</th>
                </tr>
              </thead>
              <tbody>
                @for (checkin of checkins(); track checkin.id) {
                  <tr style="border-bottom:1px solid #1e1e22;">
                    <td style="padding:0.875rem 1.5rem;font-size:0.8125rem;color:#a1a1aa;">{{ checkin.dataEntrada | date:'dd/MM/yyyy' }}</td>
                    <td style="padding:0.875rem 1.5rem;font-size:0.8125rem;color:#a1a1aa;">{{ checkin.dataEntrada | date:'HH:mm' }}</td>
                    <td style="padding:0.875rem 1.5rem;font-size:0.8125rem;color:#a1a1aa;">{{ checkin.dataSaida ? (checkin.dataSaida | date:'HH:mm') : '---' }}</td>
                    <td style="padding:0.875rem 1.5rem;">
                      @if (checkin.status === 'Presente') {
                        <span style="display:inline-block;padding:0.2rem 0.625rem;border-radius:100px;font-size:0.6875rem;font-weight:600;background:rgba(200,255,0,0.08);color:#c8ff00;">Presente</span>
                      } @else {
                        <span style="display:inline-block;padding:0.2rem 0.625rem;border-radius:100px;font-size:0.6875rem;font-weight:600;background:rgba(161,161,170,0.08);color:#a1a1aa;">Saiu</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      }

      <!-- ==================== VISAO STAFF ==================== -->
      @if (!authService.isAluno()) {
        <!-- Stats -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem;">
          <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
            <span style="font-size:0.75rem;font-weight:500;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.05em;">Pendentes</span>
            <span style="font-size:1.75rem;font-weight:700;color:#eab308;letter-spacing:-0.03em;">{{ getPendingCount() }}</span>
          </div>
          <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
            <span style="font-size:0.75rem;font-weight:500;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.05em;">Presentes agora</span>
            <span style="font-size:1.75rem;font-weight:700;color:#fff;letter-spacing:-0.03em;">{{ getPresentes() }}</span>
          </div>
          <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
            <span style="font-size:0.75rem;font-weight:500;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.05em;">Total hoje</span>
            <span style="font-size:1.75rem;font-weight:700;color:#fff;letter-spacing:-0.03em;">{{ checkins().length }}</span>
          </div>
        </div>

        <!-- Formulario de check-in direto (existente) -->
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

        <!-- Solicitacoes Pendentes -->
        @if (pendingRequests().length) {
          <div style="background:#111113;border:1px solid #1e1e22;border-radius:12px;overflow:hidden;margin-bottom:2rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem;border-bottom:1px solid #1e1e22;">
              <h2 style="font-size:0.9375rem;font-weight:600;color:#fff;margin:0;">Solicitacoes Pendentes</h2>
              <span style="background:rgba(234,179,8,0.1);color:#eab308;padding:0.2rem 0.625rem;border-radius:100px;font-size:0.6875rem;font-weight:600;">{{ getPendingCount() }}</span>
            </div>
            <div style="padding:0.5rem;">
              @for (req of pendingRequests(); track req.id) {
                <div style="display:flex;align-items:center;gap:1rem;padding:0.875rem 1rem;border-radius:8px;transition:background 0.2s;margin-bottom:0.25rem;"
                     [style.background]="'rgba(255,255,255,0.02)'">
                  <div style="flex:1;min-width:0;">
                    <div style="font-size:0.875rem;font-weight:600;color:#fff;margin-bottom:0.125rem;">{{ req.alunoNome }}</div>
                    <div style="font-size:0.75rem;color:#a1a1aa;">{{ req.criadaEm | date:'HH:mm' }}</div>
                  </div>
                  <div style="font-size:0.8125rem;font-weight:600;color:#eab308;font-variant-numeric:tabular-nums;min-width:48px;text-align:center;">
                    {{ getRequestTimeRemaining(req) }}
                  </div>
                  <button (click)="aprovarSolicitacao(req)"
                          [disabled]="processingId() === req.id"
                          style="padding:0.5rem 1rem;background:#22c55e;color:#fff;border:none;border-radius:6px;font-weight:600;font-size:0.75rem;cursor:pointer;font-family:inherit;white-space:nowrap;">
                    @if (processingId() === req.id) { ... } @else { &#10003; Aprovar }
                  </button>
                  <button (click)="negarSolicitacao(req)"
                          [disabled]="processingId() === req.id"
                          style="padding:0.5rem 1rem;background:transparent;border:1px solid #52525b;border-radius:6px;color:#a1a1aa;cursor:pointer;font-weight:500;font-size:0.75rem;font-family:inherit;white-space:nowrap;">
                    &#10007; Negar
                  </button>
                </div>
              }
            </div>
          </div>
        }

        <!-- Check-ins de Hoje (tabela existente) -->
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
              @if (!checkins().length) {
                <tr>
                  <td colspan="5" style="padding:2rem;text-align:center;color:#52525b;font-size:0.8125rem;">Nenhum check-in registrado hoje</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; background: #09090b; min-height: 100vh; }
  `]
})
export class CheckinComponent implements OnInit, OnDestroy {
  private checkinsService = inject(CheckinsService);
  private alunosService = inject(AlunosService);
  private toast = inject(ToastService);
  protected authService = inject(AuthService);

  showForm = signal(false);
  loading = signal(false);
  requestLoading = signal(false);
  checkoutLoading = signal(false);
  processingId = signal<string | null>(null);
  selectedAlunoId = '';
  checkins = signal<CheckinDto[]>([]);
  alunos = signal<AlunoDto[]>([]);
  pendingRequests = signal<CheckinRequestDto[]>([]);
  myRequest = signal<CheckinRequestDto | null>(null);

  timeRemaining = signal(0);
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private pollTimer: ReturnType<typeof setTimeout> | null = null;
  private staffActiveTimer: ReturnType<typeof setTimeout> | null = null;
  private alunoId: string | null = null;
  private pollInFlight = false;
  private staffActiveInFlight = false;
  private autoCheckoutInFlight = false;
  private destroyed = false;
  /** Intervalo atual do loop principal (para reiniciar se o modo mudar). */
  private activePollIntervalMs: number | null = null;

  /**
   * Polling adaptativo:
   * - Aluno Pendente: 2s (precisa ver aprovação rápido)
   * - Aluno Aprovado: 30s (só monitora checkout remoto / auto)
   * - Staff fila: 3s (só pending — endpoint leve)
   * - Staff presentes: 20s (menos crítico)
   * - Idle / aba oculta: 0 requisições
   */
  private readonly ALUNO_WAITING_MS = 2_000;
  private readonly ALUNO_PRESENT_MS = 30_000;
  private readonly STAFF_PENDING_MS = 3_000;
  private readonly STAFF_ACTIVE_MS = 20_000;

  private onVisibilityChange = () => {
    if (document.hidden) {
      this.stopPolling();
    } else {
      this.syncPolling(true);
    }
  };

  progressPct = computed(() => {
    const total = 15 * 60;
    return Math.max(0, Math.min(100, (this.timeRemaining() / total) * 100));
  });

  ngOnInit(): void {
    this.loadData();
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.stopAllTimers();
  }

  loadData(): void {
    this.loading.set(true);
    if (this.authService.isAluno()) {
      this.loadAlunoData();
    } else {
      this.loadStaffData();
    }
  }

  private loadAlunoData(): void {
    const user = this.authService.user();
    if (!user) { this.loading.set(false); return; }

    this.alunosService.getByUsuarioId(user.id).subscribe({
      next: (alunoRes) => {
        if (alunoRes.success && alunoRes.data) {
          this.alunoId = alunoRes.data.id;

          this.checkinsService.getByAlunoId(this.alunoId).subscribe({
            next: (res) => { if (res.success && res.data) this.checkins.set(res.data); },
            error: () => { /* toast via interceptor */ }
          });

          this.checkinsService.getRequestsByAlunoId(this.alunoId).subscribe({
            next: (res) => {
              if (res.success && res.data) {
                const latest = this.pickLatestRequest(res.data);
                if (latest && this.isActiveRequestStatus(latest.status)) {
                  this.applyRequestUpdate(latest);
                } else {
                  this.myRequest.set(null);
                }
              }
              this.loading.set(false);
              this.syncPolling(true);
            },
            error: () => {
              this.loading.set(false);
              this.syncPolling(true);
            }
          });
        } else {
          this.loading.set(false);
          this.toast.error('Não foi possível carregar os dados do aluno.');
        }
      },
      error: () => { this.loading.set(false); }
    });
  }

  private loadStaffData(): void {
    this.alunosService.getAll().subscribe({
      next: (res) => { if (res.success && res.data) this.alunos.set(res.data); },
      error: () => {}
    });

    this.checkinsService.getActive().subscribe({
      next: (res) => {
        if (res.success && res.data) this.checkins.set(res.data);
        this.loading.set(false);
        this.syncPolling(true);
      },
      error: () => {
        this.loading.set(false);
        this.syncPolling(true);
      }
    });

    this.loadPendingRequests();
  }

  private loadPendingRequests(): void {
    this.checkinsService.getPendingRequests().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.pendingRequests.set(this.filterValidPending(res.data));
        }
      },
      error: () => {}
    });
  }

  // ==================== ALUNO ====================

  solicitarCheckin(): void {
    const user = this.authService.user();
    if (!user) return;

    this.requestLoading.set(true);
    const create = (alunoId: string) => {
      this.alunoId = alunoId;
      this.checkinsService.createRequest(alunoId).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.applyRequestUpdate(res.data);
            this.toast.success('Solicitação enviada! Aguardando aprovação...');
            this.syncPolling(true);
          } else {
            this.toast.error(res.message || 'Não foi possível solicitar o check-in.');
          }
          this.requestLoading.set(false);
        },
        error: () => { this.requestLoading.set(false); }
      });
    };

    if (this.alunoId) {
      create(this.alunoId);
      return;
    }

    this.alunosService.getByUsuarioId(user.id).subscribe({
      next: (alunoRes) => {
        if (alunoRes.success && alunoRes.data) {
          create(alunoRes.data.id);
        } else {
          this.requestLoading.set(false);
          this.toast.error('Não foi possível carregar os dados do aluno.');
        }
      },
      error: () => { this.requestLoading.set(false); }
    });
  }

  cancelarSolicitacao(): void {
    const request = this.myRequest();
    if (!request || !this.alunoId) return;

    this.checkinsService.cancelRequest(request.id, this.alunoId).subscribe({
      next: (res) => {
        if (res.success) {
          this.stopCountdown();
          this.myRequest.set(null);
          this.timeRemaining.set(0);
          this.toast.success('Solicitação cancelada.');
          this.syncPolling(true);
        } else {
          this.toast.error(res.message || 'Não foi possível cancelar a solicitação.');
        }
      },
      error: () => {}
    });
  }

  fazerCheckout(): void {
    if (!this.alunoId || this.checkoutLoading()) return;
    this.checkoutLoading.set(true);
    this.checkinsService.checkout(this.alunoId).subscribe({
      next: (res) => {
        this.stopCountdown();
        this.myRequest.set(null);
        this.timeRemaining.set(0);
        this.checkoutLoading.set(false);
        this.autoCheckoutInFlight = false;
        if (res.success !== false) {
          this.toast.success('Check-out realizado! Você pode solicitar novamente.');
        }
        if (this.alunoId) {
          this.checkinsService.getByAlunoId(this.alunoId).subscribe({
            next: (listRes) => { if (listRes.success && listRes.data) this.checkins.set(listRes.data); },
            error: () => {}
          });
        }
        this.syncPolling(true);
      },
      error: () => {
        this.checkoutLoading.set(false);
        this.autoCheckoutInFlight = false;
      }
    });
  }

  private startCountdown(criadaEm: string): void {
    this.stopCountdown();
    if (!criadaEm) { this.timeRemaining.set(0); return; }
    const parsed = this.parseDateMs(criadaEm);
    if (!parsed) { this.timeRemaining.set(0); return; }
    const expiraEm = parsed + 15 * 60 * 1000;

    const update = () => {
      const restante = Math.max(0, Math.floor((expiraEm - Date.now()) / 1000));
      this.timeRemaining.set(restante);
      if (restante <= 0) {
        this.stopCountdown();
        this.myRequest.update(r => r ? { ...r, status: 'Expirado' } : r);
        this.syncPolling();
      }
    };

    update();
    this.timerInterval = setInterval(update, 1000);
  }

  // ==================== STAFF ====================

  getPresentes(): number { return this.checkins().filter(c => c.status === 'Presente').length; }
  getPendingCount(): number { return this.pendingRequests().length; }

  aprovarSolicitacao(req: CheckinRequestDto): void {
    const user = this.authService.user();
    if (!user) return;

    this.processingId.set(req.id);
    this.checkinsService.approveRequest(req.id, user.id).subscribe({
      next: () => {
        this.toast.success(`${req.alunoNome} aprovado!`);
        this.pendingRequests.update(list => list.filter(r => r.id !== req.id));
        this.processingId.set(null);
        // Atualiza presentes na hora (sem esperar o loop lento)
        this.pollStaffActive();
        this.syncPolling(true);
      },
      error: () => { this.processingId.set(null); }
    });
  }

  negarSolicitacao(req: CheckinRequestDto): void {
    const user = this.authService.user();
    if (!user) return;

    this.processingId.set(req.id);
    this.checkinsService.denyRequest(req.id, user.id).subscribe({
      next: () => {
        this.toast.success(`${req.alunoNome} negado.`);
        this.pendingRequests.update(list => list.filter(r => r.id !== req.id));
        this.processingId.set(null);
        this.syncPolling(true);
      },
      error: () => { this.processingId.set(null); }
    });
  }

  getRequestTimeRemaining(req: CheckinRequestDto): string {
    if (!req.criadaEm) return '15:00';
    const parsed = this.parseDateMs(req.criadaEm);
    if (!parsed) return '15:00';
    const restante = Math.max(0, Math.floor((parsed + 15 * 60 * 1000 - Date.now()) / 1000));
    return this.formatTime(restante);
  }

  registrar(): void {
    if (!this.selectedAlunoId) return;
    const alunoId = this.selectedAlunoId;
    this.selectedAlunoId = '';
    this.showForm.set(false);
    this.checkinsService.checkin(alunoId).subscribe({
      next: () => { this.toast.success('Check-in registrado'); this.loadData(); },
      error: () => {}
    });
  }

  checkout(checkin: CheckinDto): void {
    this.checkinsService.checkout(checkin.alunoId).subscribe({
      next: () => { this.toast.success('Check-out registrado'); this.loadData(); },
      error: () => {}
    });
  }

  // ==================== TIMER / POLLING ====================

  formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  /**
   * Ajusta o loop de polling ao estado atual.
   * @param immediate se true, dispara um ciclo agora (entrada na tela, nova solicitação, aba focada)
   */
  private syncPolling(immediate = false): void {
    if (this.destroyed) return;

    if (document.hidden) {
      this.stopPolling();
      return;
    }

    const intervalMs = this.resolvePollIntervalMs();
    if (intervalMs == null) {
      this.stopPolling();
      return;
    }

    const modeChanged = this.activePollIntervalMs !== intervalMs;
    if (modeChanged) {
      this.clearPollTimer();
      this.activePollIntervalMs = intervalMs;
    }

    if (immediate || modeChanged || !this.pollTimer) {
      if (immediate || modeChanged) {
        this.runMainPoll();
      }
      this.scheduleMainPoll(intervalMs);
    }

    // Staff: loop separado e mais lento para lista de presentes
    if (!this.authService.isAluno()) {
      this.ensureStaffActiveLoop(immediate || modeChanged);
    } else {
      this.clearStaffActiveTimer();
    }
  }

  private resolvePollIntervalMs(): number | null {
    if (this.authService.isAluno()) {
      const status = this.myRequest()?.status;
      if (status === 'Pendente') return this.ALUNO_WAITING_MS;
      if (status === 'Aprovado') return this.ALUNO_PRESENT_MS;
      return null;
    }
    // Staff na tela de check-in: sempre acompanha a fila
    return this.STAFF_PENDING_MS;
  }

  private scheduleMainPoll(intervalMs: number): void {
    this.clearPollTimer();
    this.pollTimer = setTimeout(() => {
      this.pollTimer = null;
      this.runMainPoll(() => {
        if (this.destroyed) return;
        const next = this.resolvePollIntervalMs();
        if (next == null || document.hidden) {
          this.stopPolling();
          return;
        }
        this.activePollIntervalMs = next;
        this.scheduleMainPoll(next);
      });
    }, intervalMs);
  }

  private runMainPoll(onDone?: () => void): void {
    if (this.destroyed || document.hidden) {
      onDone?.();
      return;
    }
    if (this.pollInFlight) {
      onDone?.();
      return;
    }

    if (this.authService.isAluno()) {
      this.pollAlunoRequest(onDone);
    } else {
      this.pollStaffPending(onDone);
    }
  }

  private pollAlunoRequest(onDone?: () => void): void {
    if (!this.alunoId) {
      onDone?.();
      return;
    }
    this.pollInFlight = true;

    this.checkinsService.getRequestsByAlunoId(this.alunoId, { silent: true }).subscribe({
      next: (res) => {
        this.pollInFlight = false;
        if (res.success && res.data) {
          const latest = this.pickLatestRequest(res.data);
          this.handleAlunoRequestSnapshot(latest);
        }
        onDone?.();
      },
      error: () => {
        this.pollInFlight = false;
        onDone?.();
      }
    });
  }

  /** Escolhe a solicitação mais relevante (pendente/aprovada recente, senão a mais nova). */
  private pickLatestRequest(list: CheckinRequestDto[]): CheckinRequestDto | null {
    if (!list.length) return null;

    const pending = list.find(r => r.status === 'Pendente');
    if (pending) return pending;

    const approved = list.find(r => r.status === 'Aprovado');
    if (approved) return approved;

    // Mais recente por data de criação
    return [...list].sort((a, b) => {
      const ta = this.parseDateMs(a.criadaEm) ?? 0;
      const tb = this.parseDateMs(b.criadaEm) ?? 0;
      return tb - ta;
    })[0] ?? null;
  }

  private handleAlunoRequestSnapshot(latest: CheckinRequestDto | null): void {
    if (!latest) {
      if (this.myRequest()?.status === 'Aprovado' || this.myRequest()?.status === 'Pendente') {
        this.stopCountdown();
        this.myRequest.set(null);
        this.timeRemaining.set(0);
        this.refreshAlunoCheckinsSilent();
      }
      return;
    }

    if (latest.status === 'Aprovado' && this.shouldAutoCheckout(latest)) {
      this.applyRequestUpdate(latest);
      this.tryAutoCheckout();
      return;
    }

    this.applyRequestUpdate(latest);
  }

  private refreshAlunoCheckinsSilent(): void {
    if (!this.alunoId) return;
    this.checkinsService.getByAlunoId(this.alunoId, { silent: true }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.checkins.set(res.data);
          const hasActive = res.data.some(c => c.status === 'Presente');
          if (!hasActive && this.myRequest()?.status === 'Aprovado') {
            this.stopCountdown();
            this.myRequest.set(null);
            this.timeRemaining.set(0);
            this.syncPolling();
          }
        }
      },
      error: () => {}
    });
  }

  private pollStaffPending(onDone?: () => void): void {
    this.pollInFlight = true;
    this.checkinsService.getPendingRequests({ silent: true }).subscribe({
      next: (res) => {
        this.pollInFlight = false;
        if (res.success && res.data) {
          this.pendingRequests.set(this.filterValidPending(res.data));
        }
        onDone?.();
      },
      error: () => {
        this.pollInFlight = false;
        onDone?.();
      }
    });
  }

  private ensureStaffActiveLoop(immediate: boolean): void {
    if (this.staffActiveTimer && !immediate) return;

    this.clearStaffActiveTimer();
    if (immediate) {
      this.pollStaffActive();
    }
    this.scheduleStaffActive();
  }

  private scheduleStaffActive(): void {
    this.clearStaffActiveTimer();
    this.staffActiveTimer = setTimeout(() => {
      this.staffActiveTimer = null;
      this.pollStaffActive(() => {
        if (!this.destroyed && !document.hidden && !this.authService.isAluno()) {
          this.scheduleStaffActive();
        }
      });
    }, this.STAFF_ACTIVE_MS);
  }

  private pollStaffActive(onDone?: () => void): void {
    if (this.staffActiveInFlight) {
      onDone?.();
      return;
    }
    this.staffActiveInFlight = true;
    this.checkinsService.getActive({ silent: true }).subscribe({
      next: (res) => {
        this.staffActiveInFlight = false;
        if (res.success && res.data) this.checkins.set(res.data);
        onDone?.();
      },
      error: () => {
        this.staffActiveInFlight = false;
        onDone?.();
      }
    });
  }

  private applyRequestUpdate(latest: CheckinRequestDto): void {
    const current = this.myRequest();
    const statusChanged = !current || current.id !== latest.id || current.status !== latest.status;

    this.myRequest.set(latest);

    if (latest.status === 'Pendente' && (!current || current.status !== 'Pendente' || current.id !== latest.id)) {
      this.startCountdown(latest.criadaEm);
    }

    if (latest.status === 'Aprovado' && statusChanged) {
      this.stopCountdown();
      if (current?.status === 'Pendente') {
        this.toast.success('Check-in aprovado! Bom treino.');
      }
      this.refreshAlunoCheckinsSilent();
      // Troca intervalo (2s → 30s)
      this.syncPolling();
    }

    if (latest.status === 'Negado' && statusChanged && current?.status === 'Pendente') {
      this.stopCountdown();
      this.toast.warning('Sua solicitação de check-in foi negada.');
      this.syncPolling();
    }

    if ((latest.status === 'Expirado' || latest.status === 'Cancelado') && statusChanged) {
      this.stopCountdown();
      this.syncPolling();
    }
  }

  private isActiveRequestStatus(status: string): boolean {
    return status === 'Pendente' || status === 'Aprovado' || status === 'Negado' || status === 'Expirado' || status === 'Cancelado';
  }

  private shouldAutoCheckout(req: CheckinRequestDto): boolean {
    if (!req.respondidaEm) return false;
    const aprovadoEm = this.parseDateMs(req.respondidaEm);
    if (!aprovadoEm) return false;
    return Date.now() - aprovadoEm >= 2 * 60 * 60 * 1000;
  }

  private tryAutoCheckout(): void {
    if (this.autoCheckoutInFlight || this.checkoutLoading()) return;
    this.autoCheckoutInFlight = true;
    this.fazerCheckout();
  }

  private filterValidPending(list: CheckinRequestDto[]): CheckinRequestDto[] {
    const now = Date.now();
    return list.filter(r => {
      if (!r.criadaEm) return false;
      const parsed = this.parseDateMs(r.criadaEm);
      if (!parsed) return false;
      return now < parsed + 15 * 60 * 1000;
    });
  }

  private parseDateMs(value: string): number | null {
    if (!value) return null;
    const hasTz = value.endsWith('Z') || /[+-]\d{2}:?\d{2}$/.test(value);
    const normalized = hasTz ? value : `${value}Z`;
    const ms = new Date(normalized).getTime();
    return isNaN(ms) ? null : ms;
  }

  private stopCountdown(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private clearPollTimer(): void {
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private clearStaffActiveTimer(): void {
    if (this.staffActiveTimer) {
      clearTimeout(this.staffActiveTimer);
      this.staffActiveTimer = null;
    }
  }

  private stopPolling(): void {
    this.clearPollTimer();
    this.clearStaffActiveTimer();
    this.activePollIntervalMs = null;
    this.pollInFlight = false;
    this.staffActiveInFlight = false;
  }

  private stopAllTimers(): void {
    this.stopCountdown();
    this.stopPolling();
  }
}
