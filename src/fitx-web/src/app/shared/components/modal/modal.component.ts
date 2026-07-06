import { Component, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="modal-backdrop" (click)="close()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">{{ title() }}</h2>
            <button class="modal-close" (click)="close()">&times;</button>
          </div>
          <div class="modal-body">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: color-mix(in srgb, #000 60%, transparent);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fitx-fade-in 0.2s ease-out;
    }

    .modal-content {
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 32rem;
      max-height: 85vh;
      overflow-y: auto;
      animation: fitx-slide-up 0.3s ease-out;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid var(--color-border);
    }

    .modal-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-text);
      margin: 0;
    }

    .modal-close {
      background: none;
      border: none;
      color: var(--color-text-secondary);
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      transition: color 0.2s ease;
    }

    .modal-close:hover {
      color: var(--color-text);
    }

    .modal-body {
      padding: 1.5rem;
    }

    @keyframes fitx-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fitx-slide-up {
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
export class ModalComponent {
  isOpen = input<boolean>(false);
  title = input<string>('');

  closed = output<void>();

  close(): void {
    this.closed.emit();
  }
}
