import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.glass]="glass()">
      @if (title()) {
        <div class="card-header">
          <h3 class="card-title">{{ title() }}</h3>
          <ng-content select="[header]" />
        </div>
      }
      <div class="card-body">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      transition: all 0.2s ease;
    }

    .card.glass {
      background: color-mix(in srgb, var(--color-bg-elevated) 70%, transparent);
      backdrop-filter: blur(20px);
      border: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px color-mix(in srgb, #000 30%, transparent);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--color-border);
    }

    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text);
      margin: 0;
    }

    .card-body {
      color: var(--color-text-secondary);
    }
  `]
})
export class CardComponent {
  title = input<string>('');
  glass = input(false);
}
