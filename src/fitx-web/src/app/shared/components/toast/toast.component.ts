import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts$(); track toast.id) {
        <div class="toast" [class]="'toast-' + toast.type">
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" (click)="toastService.dismiss(toast.id)">&times;</button>
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
    }

    .toast {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-radius: var(--radius-md);
      backdrop-filter: blur(10px);
      animation: fitx-slide-in 0.3s ease, fitx-slide-out 0.3s ease forwards;
      min-width: 300px;
    }

    .toast-success {
      background: color-mix(in srgb, var(--color-success) 90%, transparent);
      color: var(--color-text);
    }

    .toast-error {
      background: color-mix(in srgb, var(--color-danger) 90%, transparent);
      color: var(--color-text);
    }

    .toast-warning {
      background: color-mix(in srgb, var(--color-warning) 90%, transparent);
      color: var(--color-text);
    }

    .toast-info {
      background: color-mix(in srgb, var(--color-info) 90%, transparent);
      color: var(--color-text);
    }

    .toast-message {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .toast-close {
      background: none;
      border: none;
      color: inherit;
      font-size: 1.25rem;
      cursor: pointer;
      padding: 0;
      margin-left: 1rem;
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }

    .toast-close:hover {
      opacity: 1;
    }

    @keyframes fitx-slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes fitx-slide-out {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
