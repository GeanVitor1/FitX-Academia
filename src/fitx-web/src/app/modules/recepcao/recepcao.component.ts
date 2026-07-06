import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CheckinsService } from '../../core/services/checkins.service';
import { AlunosService } from '../../core/services/alunos.service';
import { ToastService } from '../../shared/services/toast.service';
import { AlunoDto, CheckinDto } from '../../core/models/models';

@Component({
  selector: 'app-recepcao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="recepcao-dashboard">
      <div class="welcome-section">
        <h1>Painel da <span class="highlight">Recepção</span></h1>
        <p>Controle de acesso e recepção</p>
      </div>

      @if (loading()) {
        <div style="text-align:center;padding:3rem;color:#52525b;">Carregando...</div>
      }

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <span class="stat-value">{{ checkinsHoje() }}</span>
            <span class="stat-label">Check-ins Hoje</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <span class="stat-value">{{ presentes() }}</span>
            <span class="stat-label">Presentes Agora</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <span class="stat-value">{{ alunos().length }}</span>
            <span class="stat-label">Total Alunos</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-info">
            <span class="stat-value">{{ activeCheckins().length }}</span>
            <span class="stat-label">Check-ins Ativos</span>
          </div>
        </div>
      </div>

      <div class="main-content">
        <div class="checkin-section">
          <div class="section-header">
            <h2>Check-in Rápido</h2>
          </div>
          <div class="quick-checkin">
            <div class="search-box">
              <input type="text" placeholder="Buscar aluno por nome..." class="search-input" [(ngModel)]="searchTerm" />
              <button class="search-btn" (click)="searchStudent()">🔍</button>
            </div>
            @if (foundStudent()) {
              <div class="found-student">
                <div class="student-avatar">
                  <span>{{ foundStudent()!.nome.charAt(0) }}</span>
                </div>
                <div class="student-info">
                  <h4>{{ foundStudent()!.nome }}</h4>
                  <p>{{ foundStudent()!.email }}</p>
                </div>
                <button class="checkin-btn" (click)="doCheckin(foundStudent()!.id)">
                  Check-in
                </button>
              </div>
            }
          </div>
        </div>

        <div class="present-section">
          <div class="section-header">
            <h2>Presentes Agora</h2>
            <span class="count">{{ activeCheckins().length }} alunos</span>
          </div>
          <div class="present-list">
            @for (checkin of activeCheckins(); track checkin.id) {
              <div class="present-item">
                <div class="student-avatar small">
                  <span>{{ checkin.alunoNome.charAt(0) }}</span>
                </div>
                <div class="student-info">
                  <h4>{{ checkin.alunoNome }}</h4>
                  <p>Entrou às {{ checkin.dataEntrada | date:'HH:mm' }}</p>
                </div>
                <button class="checkout-btn" (click)="doCheckout(checkin.alunoId)">Saída</button>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="recent-section">
        <div class="section-header">
          <h2>Últimos Check-ins</h2>
        </div>
        <div class="recent-list">
          @for (checkin of activeCheckins().slice(0, 10); track checkin.id) {
            <div class="recent-item">
              <div class="checkin-status">
                {{ checkin.status === 'Presente' ? '✅' : '🚪' }}
              </div>
              <div class="checkin-info">
                <h4>{{ checkin.alunoNome }}</h4>
                <p>{{ checkin.dataEntrada | date:'HH:mm' }}</p>
              </div>
              <span class="status-badge">
                {{ checkin.status === 'Presente' ? 'Entrada' : 'Saída' }}
              </span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recepcao-dashboard { padding: 2rem; }
    .welcome-section { margin-bottom: 2rem; }
    .welcome-section h1 { font-size: 2rem; font-weight: 700; color: var(--color-text-primary); margin: 0 0 0.5rem 0; }
    .highlight { color: var(--color-primary); }
    .welcome-section p { color: var(--color-text-secondary); margin: 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
    .stat-card { background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: 1rem; padding: 1.5rem; display: flex; align-items: center; gap: 1rem; }
    .stat-card:hover { transform: translateY(-3px); border-color: var(--color-primary); }
    .stat-icon { font-size: 2rem; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--color-text-primary); }
    .stat-label { font-size: 0.75rem; color: var(--color-text-secondary); }
    .main-content { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .section-header h2 { font-size: 1.25rem; font-weight: 600; color: var(--color-text-primary); margin: 0; }
    .count { font-size: 0.875rem; color: var(--color-text-secondary); }
    .quick-checkin { background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: 1rem; padding: 1.5rem; }
    .search-box { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
    .search-input { flex: 1; padding: 0.875rem 1rem; background: var(--color-glass); border: 1px solid var(--color-glass-border); border-radius: 0.5rem; color: var(--color-text-primary); font-size: 0.9rem; }
    .search-input:focus { outline: none; border-color: var(--color-primary); }
    .search-btn { padding: 0.875rem 1.25rem; background: var(--color-primary); color: var(--color-bg-dark); border: none; border-radius: 0.5rem; font-size: 1.125rem; cursor: pointer; }
    .found-student { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(200, 255, 0, 0.05); border: 1px solid rgba(200, 255, 0, 0.2); border-radius: 0.75rem; }
    .student-avatar { width: 50px; height: 50px; background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--color-bg-dark); }
    .student-avatar.small { width: 40px; height: 40px; font-size: 0.875rem; }
    .student-info { flex: 1; }
    .student-info h4 { font-size: 1rem; font-weight: 600; color: var(--color-text-primary); margin: 0 0 0.25rem 0; }
    .student-info p { font-size: 0.75rem; color: var(--color-text-secondary); margin: 0; }
    .checkin-btn { padding: 0.75rem 1.5rem; background: var(--color-primary); color: var(--color-bg-dark); border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
    .present-list { background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: 1rem; padding: 1rem; max-height: 300px; overflow-y: auto; }
    .present-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-bottom: 1px solid var(--color-border); }
    .present-item:last-child { border-bottom: none; }
    .checkout-btn { padding: 0.5rem 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 0.5rem; color: #ef4444; font-size: 0.75rem; font-weight: 600; cursor: pointer; }
    .recent-section { background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: 1rem; padding: 1.5rem; }
    .recent-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .recent-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: var(--color-glass); border-radius: 0.5rem; }
    .checkin-status { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; }
    .checkin-info { flex: 1; }
    .checkin-info h4 { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); margin: 0; }
    .checkin-info p { font-size: 0.7rem; color: var(--color-text-secondary); margin: 0; }
    .status-badge { font-size: 0.7rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 1rem; background: rgba(34, 197, 94, 0.1); color: #22c55e; }
    @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .main-content { grid-template-columns: 1fr; } }
    @media (max-width: 768px) { .stats-grid { grid-template-columns: 1fr; } }
  `]
})
export class RecepcaoComponent implements OnInit {
  private checkinsService = inject(CheckinsService);
  private alunosService = inject(AlunosService);
  private toast = inject(ToastService);

  searchTerm = '';
  loading = signal(false);
  checkinsHoje = signal(0);
  presentes = signal(0);
  alunos = signal<AlunoDto[]>([]);
  activeCheckins = signal<CheckinDto[]>([]);
  foundStudent = signal<AlunoDto | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.alunosService.getAll().subscribe(res => { if (res.success && res.data) this.alunos.set(res.data); });
    this.checkinsService.getActive().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.activeCheckins.set(res.data);
          this.checkinsHoje.set(res.data.length);
          this.presentes.set(res.data.filter(c => c.status === 'Presente').length);
        }
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); }
    });
  }

  searchStudent(): void {
    if (this.searchTerm.trim()) {
      const found = this.alunos().find(a =>
        a.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.foundStudent.set(found || null);
      if (!found) this.toast.info('Aluno nao encontrado');
    }
  }

  doCheckin(alunoId: string): void {
    this.checkinsService.checkin(alunoId).subscribe({
      next: () => { this.toast.success('Check-in realizado!'); this.loadData(); this.foundStudent.set(null); },
      error: () => this.toast.error('Erro ao fazer check-in')
    });
  }

  doCheckout(alunoId: string): void {
    this.checkinsService.checkout(alunoId).subscribe({
      next: () => { this.toast.success('Check-out realizado!'); this.loadData(); },
      error: () => this.toast.error('Erro ao fazer check-out')
    });
  }
}
