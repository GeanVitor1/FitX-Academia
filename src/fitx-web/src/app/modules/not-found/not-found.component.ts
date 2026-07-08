import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found">
      <div class="content">
        <div class="code">404</div>
        <h1>Pagina nao encontrada</h1>
        <p>A pagina que voce procura nao existe ou foi movida.</p>
        <a routerLink="/" class="btn-home">Voltar para o inicio</a>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: #09090b;
      min-height: 100vh;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    .not-found {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
    }

    .content {
      text-align: center;
      max-width: 480px;
    }

    .code {
      font-size: 7rem;
      font-weight: 800;
      color: #c8ff00;
      line-height: 1;
      letter-spacing: -0.04em;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fafafa;
      margin: 0 0 0.5rem 0;
    }

    p {
      font-size: 0.9375rem;
      color: #a1a1aa;
      margin: 0 0 2rem 0;
      line-height: 1.5;
    }

    .btn-home {
      display: inline-flex;
      padding: 0.75rem 2rem;
      background: #c8ff00;
      color: #000;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      font-family: inherit;
      transition: opacity 0.2s ease;
    }

    .btn-home:hover {
      opacity: 0.9;
    }
  `]
})
export class NotFoundComponent {}
