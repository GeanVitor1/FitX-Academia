import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScrollAnimateDirective } from '../../../../shared/directives/scroll-animate.directive';
interface Plan {
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
}

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, RouterModule, ScrollAnimateDirective],
  template: `
    <section id="planos" class="plans-section">
      <div class="plans-container">
        <div class="plans-layout">
          <div class="plans-left">
            <span class="watermark">02</span>
            <div class="plans-info">
              <div class="section-tag" scrollAnimate animationType="fadeLeft">
                <span class="tag-line"></span>
                PLANOS
              </div>
              <h2 class="section-title" scrollAnimate animationType="fadeUp" [delay]="0.05">
                O PLANO IDEAL PARA<br>
                <span class="highlight">VOCÊ</span>
              </h2>
              <p class="section-subtitle" scrollAnimate animationType="fadeUp" [delay]="0.1">
                Planos flexíveis que se adaptam à sua rotina e aos seus objetivos
              </p>
              <a href="#planos" class="section-link" scrollAnimate animationType="fadeUp" [delay]="0.15">VER TODOS OS PLANOS →</a>
            </div>
          </div>

          <div class="plans-right">
            <div class="plans-grid">
              @for (plan of plans; track plan.name; let i = $index) {
                <div class="plan-card" [class.popular]="plan.popular" scrollAnimate animationType="fadeUp" [delay]="0.2 + i * 0.1">
                  @if (plan.popular) {
                    <div class="popular-badge">MAIS ESCOLHIDO</div>
                  }
                  <div class="plan-header">
                    <h3 class="plan-name">{{ plan.name }}</h3>
                    <div class="plan-price">
                      <span class="currency">R$</span>
                      <span class="amount">{{ plan.price }}</span>
                      <span class="period">/mês</span>
                    </div>
                  </div>
                  <ul class="plan-features">
                    @for (feature of plan.features; track feature) {
                      <li class="feature">
                        <svg class="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {{ feature }}
                      </li>
                    }
                  </ul>
                  <a routerLink="/auth/register" class="plan-cta" [class.primary]="plan.popular">
                    ESCOLHER PLANO
                    @if (plan.popular) {
                      <span>→</span>
                    }
                  </a>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .plans-section {
      padding: 8rem 2rem;
      background: var(--color-bg);
      position: relative;
    }

    .plans-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .plans-layout {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 4rem;
      align-items: start;
    }

    .plans-left {
      position: relative;
      padding-top: 1rem;
    }

    .watermark {
      position: absolute;
      top: -2rem;
      left: -1rem;
      font-size: 8rem;
      font-weight: 900;
      color: color-mix(in srgb, var(--color-text) 5%, transparent);
      line-height: 1;
      pointer-events: none;
      user-select: none;
    }

    .plans-info {
      position: relative;
      z-index: 1;
    }

    .section-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      letter-spacing: 3px;
      margin-bottom: 1.5rem;
    }

    .tag-line {
      width: 32px;
      height: 1px;
      background: var(--color-primary);
    }

    .section-title {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 800;
      color: var(--color-text);
      line-height: 1.15;
      margin: 0 0 1.25rem 0;
      letter-spacing: -1px;
    }

    .highlight {
      color: var(--color-primary);
    }

    .section-subtitle {
      font-size: 1rem;
      color: var(--color-text-secondary);
      line-height: 1.7;
      margin: 0 0 2rem 0;
      max-width: 360px;
    }

    .section-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-primary);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 700;
      letter-spacing: 1px;
      transition: gap 0.2s ease;
    }

    .section-link:hover {
      gap: 0.75rem;
    }

    .plans-right {
      width: 100%;
    }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .plan-card {
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: 1rem;
      padding: 2rem;
      position: relative;
      transition: all 0.3s ease;
    }

    .plan-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px color-mix(in srgb, #000 30%, transparent);
    }

    .plan-card.popular {
      border-color: var(--color-primary);
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--color-primary) 5%, transparent) 0%,
        color-mix(in srgb, var(--color-primary) 2%, transparent) 100%
      );
      transform: scale(1.03);
      box-shadow: 0 0 40px color-mix(in srgb, var(--color-primary) 10%, transparent);
    }

    .plan-card.popular:hover {
      transform: scale(1.03) translateY(-5px);
    }

    .popular-badge {
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--color-primary);
      color: var(--color-bg);
      padding: 0.375rem 1.25rem;
      border-radius: 2rem;
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 1.5px;
      white-space: nowrap;
    }

    .plan-header {
      text-align: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--color-border);
    }

    .plan-name {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--color-text);
      margin: 0 0 1rem 0;
      letter-spacing: 1px;
    }

    .plan-price {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 0.25rem;
    }

    .currency {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text-secondary);
    }

    .amount {
      font-size: 2.5rem;
      font-weight: 900;
      color: var(--color-text);
      line-height: 1;
    }

    .period {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }

    .plan-features {
      list-style: none;
      padding: 0;
      margin: 0 0 2rem 0;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0;
      color: var(--color-text-secondary);
      font-size: 0.875rem;
    }

    .check-icon {
      color: var(--color-primary);
      flex-shrink: 0;
    }

    .plan-cta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.875rem;
      text-align: center;
      background: transparent;
      border: 1px solid var(--color-border);
      border-radius: 0.5rem;
      color: var(--color-text);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.8125rem;
      letter-spacing: 1px;
      transition: all 0.2s ease;
    }

    .plan-cta:hover {
      border-color: var(--color-text-secondary);
      background: color-mix(in srgb, var(--color-text) 5%, transparent);
    }

    .plan-cta.primary {
      background: var(--color-primary);
      color: var(--color-bg);
      border-color: var(--color-primary);
    }

    .plan-cta.primary:hover {
      background: color-mix(in srgb, var(--color-primary) 90%, transparent);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px color-mix(in srgb, var(--color-primary) 30%, transparent);
    }

    @media (max-width: 1200px) {
      .plans-layout {
        grid-template-columns: 1fr;
        gap: 3rem;
      }

      .plans-left {
        text-align: center;
      }

      .section-subtitle {
        margin-left: auto;
        margin-right: auto;
      }

      .watermark {
        position: static;
        font-size: 5rem;
        display: block;
        margin-bottom: -1rem;
      }
    }

    @media (max-width: 968px) {
      .plans-grid {
        grid-template-columns: 1fr;
        max-width: 400px;
        margin: 0 auto;
      }

      .plan-card.popular {
        transform: none;
      }

      .plan-card.popular:hover {
        transform: translateY(-5px);
      }
    }
  `]
})
export class PlansComponent {
  plans: Plan[] = [
    {
      name: 'Básico',
      price: '89,90',
      features: [
        'Musculação ilimitada',
        'Avaliação física inicial',
        'Treinos livres',
        'Suporte básico'
      ]
    },
    {
      name: 'Completo',
      price: '129,90',
      features: [
        'Musculação ilimitada',
        'Avaliação física completa',
        'Aulas coletivas',
        'Treinos personalizados',
        'Suporte prioritário'
      ],
      popular: true
    },
    {
      name: 'Premium',
      price: '199,90',
      features: [
        'Tudo do plano Completo',
        'Consultoria exclusiva',
        'Check-ups mensais',
        'App personalizado',
        'Acesso total 24h'
      ]
    }
  ];
}
