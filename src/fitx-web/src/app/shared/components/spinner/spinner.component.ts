import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner" [class]="'spinner-' + size()"></div>
  `,
  styles: [`
    .spinner {
      border: 3px solid var(--color-border);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: fitx-spin 0.6s linear infinite;
    }

    .spinner-sm {
      width: 1rem;
      height: 1rem;
      border-width: 2px;
    }

    .spinner-md {
      width: 1.5rem;
      height: 1.5rem;
    }

    .spinner-lg {
      width: 2.5rem;
      height: 2.5rem;
      border-width: 4px;
    }

    @keyframes fitx-spin {
      to { transform: rotate(360deg); }
    }

    @media (prefers-reduced-motion: reduce) {
      .spinner {
        animation-duration: 1.2s;
      }
    }
  `]
})
export class SpinnerComponent {
  size = input<'sm' | 'md' | 'lg'>('md');
}
