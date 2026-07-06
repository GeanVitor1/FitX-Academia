import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScrollAnimateDirective } from '../../../../shared/directives/scroll-animate.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, ScrollAnimateDirective],
  template: `
    <section id="inicio" class="hero">
      <div class="hero-bg">
        <div class="hero-image"></div>
        <div class="hero-overlay"></div>
      </div>

      <div class="hero-content">
        <div class="hero-grid">
          <div class="hero-left">
            <div class="badge" scrollAnimate animationType="fadeUp" [delay]="0">
              <span class="badge-line"></span>
              SEU MELHOR COMEÇA AQUI
            </div>

            <h1 class="hero-title" scrollAnimate animationType="fadeUp" [delay]="0.1">
              <span class="title-white">TRANSFORME</span>
              <span class="title-white">SEU CORPO.</span>
              <span class="title-green">TRANSFORME</span>
              <span class="title-green">SUA VIDA.</span>
            </h1>

            <p class="hero-subtitle" scrollAnimate animationType="fadeUp" [delay]="0.2">
              Estrutura completa, treinos personalizados e acompanhamento
              profissional para você alcançar seus objetivos de verdade.
            </p>

            <div class="hero-actions" scrollAnimate animationType="fadeUp" [delay]="0.3">
              <a routerLink="/auth/register" class="btn-primary">
                <span>EU QUERO COMEÇAR</span>
                <span class="arrow">→</span>
              </a>
              <a href="#planos" class="btn-secondary">
                <span class="play-icon">▶</span>
                <span>CONHEÇA A ACADEMIA</span>
              </a>
            </div>
          </div>

          <div class="hero-right" scrollAnimate animationType="fadeUp" [delay]="0.4">
            <div class="stats-card">
              <div class="stats-header">— ÚLTIMOS 30 DIAS</div>
              <div class="stats-row">
                <div class="stat">
                  <span class="stat-number">+523</span>
                  <span class="stat-label">ALUNOS ATIVOS</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat">
                  <span class="stat-number">+1.245</span>
                  <span class="stat-label">TREINOS REALIZADOS</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat">
                  <span class="stat-number">98%</span>
                  <span class="stat-label">SATISFAÇÃO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="scroll-indicator">
        <div class="mouse">
          <div class="wheel"></div>
        </div>
        <span>Role para baixo</span>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      overflow: hidden;
    }

    .hero-bg {
      position: absolute;
      inset: 0;
    }

    .hero-image {
      position: absolute;
      inset: 0;
      background: url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80') center/cover no-repeat;
      opacity: 0.4;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to right,
        color-mix(in srgb, var(--color-bg) 95%, transparent) 0%,
        color-mix(in srgb, var(--color-bg) 70%, transparent) 50%,
        color-mix(in srgb, var(--color-bg) 40%, transparent) 100%
      );
    }

    .hero-content {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 8rem 2rem 4rem;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: end;
    }

    .hero-left {
      padding-bottom: 4rem;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      letter-spacing: 3px;
      margin-bottom: 2rem;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    .badge-line {
      width: 32px;
      height: 1px;
      background: var(--color-primary);
    }

    .hero-title {
      margin: 0 0 1.5rem 0;
    }

    .title-white,
    .title-green {
      display: block;
      font-size: clamp(3rem, 7vw, 5.5rem);
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -2px;
    }

    .title-white {
      color: var(--color-text);
    }

    .title-green {
      color: var(--color-primary);
      text-shadow: 0 0 60px color-mix(in srgb, var(--color-primary) 20%, transparent);
    }

    .title-white:nth-child(1) { animation: fadeInUp 0.8s ease-out 0.4s both; }
    .title-white:nth-child(2) { animation: fadeInUp 0.8s ease-out 0.55s both; }
    .title-green:nth-child(3) { animation: fadeInUp 0.8s ease-out 0.7s both; }
    .title-green:nth-child(4) { animation: fadeInUp 0.8s ease-out 0.85s both; }

    .hero-subtitle {
      max-width: 480px;
      font-size: 1.125rem;
      color: var(--color-text-secondary);
      line-height: 1.7;
      margin: 0 0 2.5rem 0;
      animation: fadeInUp 0.8s ease-out 1s both;
    }

    .hero-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      animation: fadeInUp 0.8s ease-out 1.2s both;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      background: var(--color-primary);
      color: var(--color-bg);
      text-decoration: none;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      font-weight: 700;
      font-size: 0.875rem;
      letter-spacing: 1px;
      transition: all 0.3s ease;
    }

    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 40px color-mix(in srgb, var(--color-primary) 40%, transparent);
    }

    .btn-primary .arrow {
      transition: transform 0.3s ease;
    }

    .btn-primary:hover .arrow {
      transform: translateX(4px);
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      background: transparent;
      border: 1px solid var(--color-border);
      color: var(--color-text);
      text-decoration: none;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      letter-spacing: 1px;
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      border-color: var(--color-text-secondary);
      background: color-mix(in srgb, var(--color-text) 5%, transparent);
    }

    .play-icon {
      width: 32px;
      height: 32px;
      background: var(--color-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.625rem;
      color: var(--color-bg);
    }

    .hero-right {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      animation: fadeInUp 0.8s ease-out 1.4s both;
    }

    .stats-card {
      background: color-mix(in srgb, var(--color-bg-elevated) 80%, transparent);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--color-border);
      border-radius: 1rem;
      padding: 2rem;
      width: 100%;
      max-width: 520px;
    }

    .stats-header {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      letter-spacing: 2px;
      margin-bottom: 1.5rem;
    }

    .stats-row {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .stat {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--color-primary);
      line-height: 1;
      margin-bottom: 0.375rem;
    }

    .stat-label {
      font-size: 0.625rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      letter-spacing: 1px;
      line-height: 1.2;
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: var(--color-border);
      flex-shrink: 0;
    }

    .scroll-indicator {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-text-secondary);
      font-size: 0.75rem;
      letter-spacing: 1px;
      animation: fadeInUp 0.8s ease-out 1.8s both;
    }

    .mouse {
      width: 24px;
      height: 36px;
      border: 2px solid var(--color-text-secondary);
      border-radius: 12px;
      position: relative;
    }

    .wheel {
      width: 4px;
      height: 8px;
      background: var(--color-primary);
      border-radius: 2px;
      position: absolute;
      top: 6px;
      left: 50%;
      transform: translateX(-50%);
      animation: scroll 1.5s infinite;
    }

    @keyframes scroll {
      0% { transform: translateX(-50%) translateY(0); opacity: 1; }
      100% { transform: translateX(-50%) translateY(12px); opacity: 0; }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 1024px) {
      .hero-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
      }

      .hero-left {
        padding-bottom: 2rem;
      }

      .hero-right {
        justify-content: flex-start;
      }
    }

    @media (max-width: 768px) {
      .hero-content {
        padding: 7rem 1.5rem 3rem;
      }

      .hero-actions {
        flex-direction: column;
        align-items: flex-start;
      }

      .stats-row {
        flex-direction: column;
        gap: 1.5rem;
        align-items: flex-start;
      }

      .stat-divider {
        width: 100%;
        height: 1px;
      }
    }
  `]
})
export class HeroComponent {}
