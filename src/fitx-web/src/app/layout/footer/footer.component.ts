import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-left">
          <span class="footer-logo">💪 FitX</span>
          <span class="footer-copyright">© 2026 FitX - Smart Gym Management</span>
        </div>
        <div class="footer-right">
          <a routerLink="/dashboard" class="footer-link">Dashboard</a>
          <a routerLink="/treinos" class="footer-link">Treinos</a>
          <a routerLink="/checkin" class="footer-link">Check-in</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      border-top: 1px solid var(--color-border);
      background: var(--color-bg-elevated);
      padding: 1.5rem 2rem;
    }

    .footer-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .footer-logo {
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-primary);
    }

    .footer-copyright {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
    }

    .footer-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .footer-link {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .footer-link:hover {
      color: var(--color-primary);
    }

    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .footer-left {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class FooterComponent {}
