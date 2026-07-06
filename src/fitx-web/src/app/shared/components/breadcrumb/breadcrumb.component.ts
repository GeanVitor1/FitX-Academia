import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  link?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="breadcrumb">
      @for (item of items(); track item.label; let last = $last) {
        @if (!last && item.link) {
          <a [routerLink]="item.link" class="breadcrumb-link">{{ item.label }}</a>
          <span class="breadcrumb-separator">/</span>
        } @else {
          <span class="breadcrumb-current">{{ item.label }}</span>
        }
      }
    </nav>
  `,
  styles: [`
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .breadcrumb-link {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .breadcrumb-link:hover {
      color: var(--color-primary);
    }

    .breadcrumb-separator {
      font-size: 0.875rem;
      color: var(--color-text-tertiary);
    }

    .breadcrumb-current {
      font-size: 0.875rem;
      color: var(--color-text);
      font-weight: 500;
    }
  `]
})
export class BreadcrumbComponent {
  items = input<BreadcrumbItem[]>([]);
}
