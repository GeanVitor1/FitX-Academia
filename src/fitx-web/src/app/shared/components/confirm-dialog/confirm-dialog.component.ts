import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="dialog-backdrop" (click)="cancel()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2 class="dialog-title">{{ title() }}</h2>
          </div>
          <div class="dialog-body">
            <p class="dialog-message">{{ message() }}</p>
          </div>
          <div class="dialog-actions">
            <button class="btn-cancel" (click)="cancel()">{{ cancelText() }}</button>
            <button class="btn-confirm" [class]="'btn-' + variant()" (click)="confirm()">
              {{ confirmText() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .dialog-backdrop {
      position: fixed;
      inset: 0;
      background: color-mix(in srgb, #000 60%, transparent);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fitx-dialog-fade-in 0.2s ease-out;
    }

    .dialog-content {
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 28rem;
      animation: fitx-dialog-slide-up 0.3s ease-out;
    }

    .dialog-header {
      padding: 1.5rem 1.5rem 0;
    }

    .dialog-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-text);
      margin: 0;
    }

    .dialog-body {
      padding: 1rem 1.5rem;
    }

    .dialog-message {
      color: var(--color-text-secondary);
      font-size: 0.875rem;
      margin: 0;
      line-height: 1.5;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem 1.5rem;
    }

    .btn-cancel {
      padding: 0.625rem 1.25rem;
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-cancel:hover {
      background: var(--color-bg-elevated);
      color: var(--color-text);
    }

    .btn-confirm {
      padding: 0.625rem 1.25rem;
      border: none;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-danger {
      background: var(--color-danger);
      color: var(--color-text);
    }

    .btn-danger:hover {
      opacity: 0.9;
    }

    .btn-warning {
      background: var(--color-warning);
      color: var(--color-text);
    }

    .btn-warning:hover {
      opacity: 0.9;
    }

    .btn-info {
      background: var(--color-primary);
      color: var(--color-bg);
    }

    .btn-info:hover {
      opacity: 0.9;
    }

    @keyframes fitx-dialog-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fitx-dialog-slide-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ConfirmDialogComponent {
  isOpen = input<boolean>(false);
  title = input<string>('Confirmar');
  message = input<string>('');
  confirmText = input<string>('Confirmar');
  cancelText = input<string>('Cancelar');
  variant = input<'danger' | 'warning' | 'info'>('danger');

  confirmed = output<void>();
  cancelled = output<void>();

  confirm(): void {
    this.confirmed.emit();
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
