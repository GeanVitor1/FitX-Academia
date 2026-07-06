import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton" [style.width]="width()" [style.height]="height()"></div>
  `,
  styles: [`
    .skeleton {
      background: linear-gradient(90deg, var(--color-border) 25%, var(--color-bg-surface) 50%, var(--color-border) 75%);
      background-size: 200% 100%;
      animation: fitx-shimmer 1.5s infinite;
      border-radius: var(--radius-md);
    }

    @keyframes fitx-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    @media (prefers-reduced-motion: reduce) {
      .skeleton {
        animation: none;
      }
    }
  `]
})
export class SkeletonComponent {
  width = input('100%');
  height = input('1rem');
}
