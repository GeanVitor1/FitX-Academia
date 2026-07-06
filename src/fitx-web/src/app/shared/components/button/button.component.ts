import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="onClick.emit($event)">
      @if (loading()) {
        <span class="spinner"></span>
      }
      <ng-content />
    </button>
  `,
  styles: [`
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    button:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
    }

    .btn-lg {
      padding: 1rem 2rem;
      font-size: 1rem;
    }

    .btn-full {
      width: 100%;
    }
  `]
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'danger' | 'ghost'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  fullWidth = input(false);
  disabled = input(false);
  loading = input(false);

  onClick = output<Event>();

  buttonClasses(): string {
    return [
      `btn-${this.variant()}`,
      `btn-${this.size()}`,
      this.fullWidth() ? 'btn-full' : ''
    ].filter(Boolean).join(' ');
  }
}
