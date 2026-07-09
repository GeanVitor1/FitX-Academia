import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  current: number;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="stats-section">
      <div class="stats-container">
        <div class="section-header">
          <span class="section-tag">RESULTADOS</span>
          <h2 class="section-title">
            Números que <span class="highlight">falam por si</span>
          </h2>
        </div>

        <div class="stats-grid">
          @for (stat of stats; track stat.label) {
            <div class="stat-card">
              <div class="stat-top">
                <span class="stat-icon">{{ getIcon(stat.label) }}</span>
                <span class="stat-value">{{ displayValue(stat) }}{{ stat.suffix }}</span>
              </div>
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-bar">
                <div class="stat-bar-fill" [style.width]="getProgress(stat) + '%'"></div>
              </div>
            </div>
          }
        </div>

        <div class="stats-visual">
          <div class="visual-card">
            <span class="visual-icon">🏋️</span>
            <div class="visual-text">
              <h3>Transformação Real</h3>
              <p>Veja os resultados dos nossos alunos</p>
            </div>
          </div>

          <div class="visual-card featured">
            <span class="visual-icon">💪</span>
            <div class="visual-text">
              <h3>Alunos Ativos</h3>
              <p>Junte-se a eles</p>
            </div>
          </div>

          <div class="visual-card">
            <span class="visual-icon">🎯</span>
            <div class="visual-text">
              <h3>Metas Alcançadas</h3>
              <p>Sua vez de conquistar</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .stats-section {
      padding: 3.5rem 1.25rem;
      background: var(--color-bg);
      position: relative;
    }

    .stats-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .section-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .section-tag {
      display: inline-block;
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
      color: var(--color-primary);
      padding: 0.3rem 0.75rem;
      border-radius: 2rem;
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 1.5px;
      margin-bottom: 0.5rem;
    }

    .section-title {
      font-size: clamp(1.35rem, 3vw, 1.85rem);
      font-weight: 800;
      color: var(--color-text);
      margin: 0;
      line-height: 1.2;
    }

    .highlight {
      color: var(--color-primary);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .stat-card {
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: 0.625rem;
      padding: 0.875rem 0.75rem;
      text-align: left;
      transition: border-color 0.2s ease, transform 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      border-color: var(--color-primary);
    }

    .stat-top {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.35rem;
    }

    .stat-icon {
      font-size: 1rem;
      line-height: 1;
      flex-shrink: 0;
    }

    .stat-value {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--color-primary);
      line-height: 1;
    }

    .stat-label {
      font-size: 0.6rem;
      color: var(--color-text-secondary);
      letter-spacing: 1px;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .stat-bar {
      height: 2px;
      background: var(--color-border);
      border-radius: 2px;
      overflow: hidden;
    }

    .stat-bar-fill {
      height: 100%;
      background: var(--color-primary);
      border-radius: 2px;
      transition: width 1.5s ease-out;
    }

    .stats-visual {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }

    .visual-card {
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: 0.625rem;
      padding: 0.75rem 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.625rem;
      transition: border-color 0.2s ease, transform 0.2s ease;
      min-height: 0;
    }

    .visual-card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--color-primary) 40%, var(--color-border));
    }

    .visual-card.featured {
      border-color: var(--color-primary);
      box-shadow: 0 0 12px color-mix(in srgb, var(--color-primary) 8%, transparent);
    }

    .visual-icon {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: color-mix(in srgb, var(--color-primary) 12%, transparent);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      line-height: 1;
      flex-shrink: 0;
    }

    .visual-text {
      min-width: 0;
    }

    .visual-text h3 {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-text);
      margin: 0 0 0.15rem 0;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .visual-text p {
      font-size: 0.68rem;
      color: var(--color-text-secondary);
      margin: 0;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    @media (max-width: 720px) {
      .stats-section {
        padding: 2.5rem 1rem;
      }

      .stats-grid,
      .stats-visual {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .stat-card,
      .visual-card {
        padding: 0.75rem;
      }

      .stat-value {
        font-size: 1.25rem;
      }

      .visual-text h3 {
        white-space: normal;
      }
    }
  `]
})
export class StatsComponent implements AfterViewInit, OnDestroy {
  stats: StatItem[] = [
    { value: 523, suffix: '+', label: 'ALUNOS ATIVOS', current: 0 },
    { value: 1245, suffix: '+', label: 'TREINOS REALIZADOS', current: 0 },
    { value: 98, suffix: '%', label: 'SATISFAÇÃO', current: 0 }
  ];

  ngAfterViewInit(): void {
    this.initScrollAnimation();
  }

  ngOnDestroy(): void {}

  getIcon(label: string): string {
    const icons: Record<string, string> = {
      'ALUNOS ATIVOS': '👥',
      'TREINOS REALIZADOS': '💪',
      'SATISFAÇÃO': '⭐'
    };
    return icons[label] || '📊';
  }

  displayValue(stat: StatItem): number {
    return Math.round(stat.current);
  }

  getProgress(stat: StatItem): number {
    if (!stat.value) return 0;
    return (stat.current / stat.value) * 100;
  }

  private initScrollAnimation(): void {
    ScrollTrigger.create({
      trigger: '.stats-section',
      start: 'top 80%',
      onEnter: () => this.animateCounters(),
      once: true
    });
  }

  private animateCounters(): void {
    this.stats.forEach((stat, index) => {
      gsap.to(stat, {
        current: stat.value,
        duration: 2,
        delay: index * 0.2,
        ease: 'power2.out',
        onUpdate: () => {
          this.stats = [...this.stats];
        }
      });
    });
  }
}
