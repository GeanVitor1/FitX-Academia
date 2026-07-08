import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-professores',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="professor-dashboard">
      <div class="welcome-section">
        <h1>Painel do <span class="highlight">Professor</span></h1>
        <p>Gerencie seus alunos e treinos</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <span class="stat-value">0</span>
            <span class="stat-label">Alunos Ativos</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-info">
            <span class="stat-value">0</span>
            <span class="stat-label">Treinos Criados</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <span class="stat-value">0</span>
            <span class="stat-label">Avaliações Pendentes</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💬</div>
          <div class="stat-info">
            <span class="stat-value">0</span>
            <span class="stat-label">Mensagens Não Lidas</span>
          </div>
        </div>
      </div>

      <div class="main-content">
        <div class="students-section">
          <div class="section-header">
            <h2>Meus Alunos</h2>
            <a routerLink="/alunos" class="view-all">Ver todos →</a>
          </div>
          <div class="students-list">
            @for (student of students; track student.id) {
              <div class="student-card">
                <div class="student-avatar">
                  <span>{{ student.name.charAt(0) }}</span>
                </div>
                <div class="student-info">
                  <h4>{{ student.name }}</h4>
                  <p>{{ student.plan }}</p>
                </div>
                <div class="student-status">
                  <span class="status" [class]="student.status">
                    {{ student.status === 'active' ? 'Ativo' : 'Inativo' }}
                  </span>
                </div>
                <div class="student-actions">
                  <button class="action-btn" title="Ver treino">📋</button>
                  <button class="action-btn" title="Avaliação">📊</button>
                </div>
              </div>
            }
          </div>
        </div>

        <div class="schedule-section">
          <div class="section-header">
            <h2>Próximas Aulas</h2>
          </div>
          <div class="schedule-list">
            @for (schedule of schedules; track schedule.id) {
              <div class="schedule-item">
                <div class="schedule-time">
                  <span class="time">{{ schedule.time }}</span>
                  <span class="day">{{ schedule.day }}</span>
                </div>
                <div class="schedule-info">
                  <h4>{{ schedule.name }}</h4>
                  <p>{{ schedule.students }} alunos</p>
                </div>
                <span class="schedule-status" [class]="schedule.status">
                  {{ schedule.status === 'confirmed' ? 'Confirmado' : 'Pendente' }}
                </span>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h3>Ações Rápidas</h3>
        <div class="actions-grid">
          <a routerLink="/professores/treinos/criar" class="action-card">
            <span class="action-icon">📝</span>
            <span class="action-text">Criar Treino</span>
          </a>
          <a routerLink="/professores/avaliacoes/criar" class="action-card">
            <span class="action-icon">📊</span>
            <span class="action-text">Nova Avaliação</span>
          </a>
          <a routerLink="/professores/mensagens" class="action-card">
            <span class="action-icon">💬</span>
            <span class="action-text">Mensagens</span>
          </a>
          <a routerLink="/alunos" class="action-card">
            <span class="action-icon">👥</span>
            <span class="action-text">Ver Alunos</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .professor-dashboard {
      padding: 2rem;
    }

    .welcome-section {
      margin-bottom: 2rem;
    }

    .welcome-section h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 0.5rem 0;
    }

    .highlight {
      color: var(--color-primary);
    }

    .welcome-section p {
      color: var(--color-text-secondary);
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-3px);
      border-color: var(--color-primary);
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
    }

    .main-content {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .section-header h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0;
    }

    .view-all {
      font-size: 0.875rem;
      color: var(--color-primary);
      text-decoration: none;
    }

    .view-all:hover {
      text-decoration: underline;
    }

    .students-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .student-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      padding: 1rem;
      transition: all 0.2s;
    }

    .student-card:hover {
      border-color: var(--color-primary);
    }

    .student-avatar {
      width: 45px;
      height: 45px;
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
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 0.25rem 0;
    }

    .student-info p {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      margin: 0;
    }

    .status.active {
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .status.inactive {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .student-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      width: 32px;
      height: 32px;
      background: var(--color-glass);
      border: 1px solid var(--color-glass-border);
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: var(--color-primary);
      color: var(--color-bg-dark);
    }

    .schedule-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .schedule-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      padding: 1rem;
    }

    .schedule-time {
      text-align: center;
      min-width: 60px;
    }

    .schedule-time .time {
      display: block;
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-primary);
    }

    .schedule-time .day {
      display: block;
      font-size: 0.7rem;
      color: var(--color-text-secondary);
    }

    .schedule-info {
      flex: 1;
    }

    .schedule-info h4 {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 0.25rem 0;
    }

    .schedule-info p {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      margin: 0;
    }

    .schedule-status {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
    }

    .schedule-status.confirmed {
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
    }

    .schedule-status.pending {
      background: rgba(234, 179, 8, 0.1);
      color: #eab308;
    }

    .quick-actions h3 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 1rem 0;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .action-card {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      transition: all 0.3s;
    }

    .action-card:hover {
      transform: translateY(-3px);
      border-color: var(--color-primary);
      box-shadow: 0 10px 30px rgba(200, 255, 0, 0.1);
    }

    .action-icon {
      font-size: 2rem;
    }

    .action-text {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-primary);
    }

    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .main-content {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class ProfessoresComponent {
  students: { id: string; name: string; plan: string; status: string }[] = [];

  schedules: { id: string; name: string; time: string; day: string; students: number; status: string }[] = [];
}
