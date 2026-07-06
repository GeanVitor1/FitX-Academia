import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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
              <div class="stat-icon">{{ getIcon(stat.label) }}</div>
              <div class="stat-value">
                {{ stat.current }}{{ stat.suffix }}
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
            <div class="card-image">
              <div class="image-placeholder">
                <span class="placeholder-icon">🏋️</span>
              </div>
            </div>
            <div class="card-content">
              <h3>Transformação Real</h3>
              <p>Veja os resultados dos nossos alunos</p>
            </div>
          </div>

          <div class="visual-card featured">
            <div class="card-image">
              <div class="image-placeholder">
                <span class="placeholder-icon">💪</span>
              </div>
            </div>
            <div class="card-content">
              <h3>Alunos Ativos</h3>
              <p>Junte-se a eles</p>
            </div>
          </div>

          <div class="visual-card">
            <div class="card-image">
              <div class="image-placeholder">
                <span class="placeholder-icon">🎯</span>
              </div>
            </div>
            <div class="card-content">
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
      padding: 8rem 2rem;
      background: var(--color-bg);
      position: relative;
    }

    .stats-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .section-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .section-tag {
      display: inline-block;
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
      color: var(--color-primary);
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 2px;
      margin-bottom: 1rem;
    }

    .section-title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 800;
      color: var(--color-text);
      margin: 0;
    }

    .highlight {
      color: var(--color-primary);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .stat-card {
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: 1rem;
      padding: 2rem;
      text-align: center;
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      border-color: var(--color-primary);
      box-shadow: 0 20px 40px color-mix(in srgb, var(--color-primary) 10%, transparent);
    }

    .stat-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .stat-value {
      font-size: 3rem;
      font-weight: 900;
      color: var(--color-primary);
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      letter-spacing: 2px;
      margin-bottom: 1rem;
    }

    .stat-bar {
      height: 4px;
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
      gap: 2rem;
    }

    .visual-card {
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: 1rem;
      overflow: hidden;
      transition: all 0.2s ease;
    }

    .visual-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px color-mix(in srgb, #000 30%, transparent);
    }

    .visual-card.featured {
      border-color: var(--color-primary);
      box-shadow: 0 0 30px color-mix(in srgb, var(--color-primary) 10%, transparent);
    }

    .card-image {
      height: 200px;
      background: linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .image-placeholder {
      width: 80px;
      height: 80px;
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .placeholder-icon {
      font-size: 2rem;
    }

    .card-content {
      padding: 1.5rem;
    }

    .card-content h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-text);
      margin: 0 0 0.5rem 0;
    }

    .card-content p {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin: 0;
    }

    @media (max-width: 768px) {
      .stats-grid,
      .stats-visual {
        grid-template-columns: 1fr;
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

  getProgress(stat: StatItem): number {
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
