import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      @for (toast of toastService.toasts$(); track toast.id) {
        <div class="toast" [class]="'toast-' + toast.type" role="alert">
          <span class="toast-icon">{{ iconFor(toast.type) }}</span>
          <span class="toast-message">{{ toast.message }}</span>
          <button type="button" class="toast-close" (click)="toastService.dismiss(toast.id)" aria-label="Fechar">&times;</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: min(420px, calc(100vw - 2rem));
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-radius: 10px;
      border: 1px solid transparent;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      animation: toast-in 0.28s ease forwards;
      min-width: 280px;
      pointer-events: auto;
    }

    .toast-success {
      background: #14532d;
      border-color: rgba(34, 197, 94, 0.45);
      color: #f0fdf4;
    }

    .toast-error {
      background: #7f1d1d;
      border-color: rgba(239, 68, 68, 0.5);
      color: #fef2f2;
    }

    .toast-warning {
      background: #78350f;
      border-color: rgba(234, 179, 8, 0.45);
      color: #fffbeb;
    }

    .toast-info {
      background: #1e3a5f;
      border-color: rgba(59, 130, 246, 0.45);
      color: #eff6ff;
    }

    .toast-icon {
      flex-shrink: 0;
      font-size: 1rem;
      line-height: 1.4;
    }

    .toast-message {
      flex: 1;
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      color: inherit;
      font-size: 1.25rem;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      opacity: 0.75;
      flex-shrink: 0;
    }

    .toast-close:hover {
      opacity: 1;
    }

    @keyframes toast-in {
      from {
        transform: translateX(120%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);

  iconFor(type: string): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '!';
      default: return 'i';
    }
  }
}
