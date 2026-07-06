import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      @if (icon()) {
        <span class="empty-icon">{{ icon() }}</span>
      }
      <h3 class="empty-title">{{ title() }}</h3>
      @if (description()) {
        <p class="empty-description">{{ description() }}</p>
      }
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem;
      text-align: center;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-text);
      margin: 0 0 0.5rem 0;
    }

    .empty-description {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin: 0;
      max-width: 24rem;
    }
  `]
})
export class EmptyStateComponent {
  icon = input<string>('');
  title = input<string>('');
  description = input<string>('');
}
