import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimateDirective } from '../../../../shared/directives/scroll-animate.directive';

@Component({
  selector: 'app-structure',
  standalone: true,
  imports: [CommonModule, ScrollAnimateDirective],
  template: `
    <section id="estrutura" class="structure-section">
      <div class="structure-container">
        <div class="section-layout">
          <div class="watermark">04</div>

          <div class="section-content">
            <div class="section-header">
              <div class="tag-row">
                <span class="section-tag" scrollAnimate animationType="fadeLeft" [delay]="0">ESTRUTURA</span>
                <span class="tag-line"></span>
              </div>
              <h2 class="section-title" scrollAnimate animationType="fadeLeft" [delay]="0.1">
                <span class="line-white">ESTRUTURA</span>
                <span class="line-white">COMPLETA E</span>
                <span class="line-green">MODERNA</span>
              </h2>
              <p class="section-subtitle" scrollAnimate animationType="fadeLeft" [delay]="0.2">
                Ambientes pensados para seu conforto, segurança e melhor performance.
              </p>
              <a href="javascript:void(0)" class="section-link" scrollAnimate animationType="fadeLeft" [delay]="0.3">CONHEÇA A ESTRUTURA &rarr;</a>
            </div>

            <div class="media-area">
              <div class="image-placeholder" (click)="openVideo()" scrollAnimate animationType="fadeRight" [delay]="0.2">
                <div class="play-button">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5v14l11-7L8 5z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="features-row">
              @for (feature of features; track feature.label; let i = $index) {
                <div class="feature-item" scrollAnimate animationType="scaleIn" [delay]="i * 0.1">
                  <div class="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      @switch (feature.icon) {
                        @case ('dumbbell') {
                          <path d="M6.5 6.5h11M6.5 17.5h11M3 10v4M21 10v4M5 8v8M19 8v8"/>
                        }
                        @case ('locker') {
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <path d="M12 3v18"/>
                          <circle cx="8" cy="12" r="1"/>
                          <circle cx="16" cy="12" r="1"/>
                        }
                        @case ('snowflake') {
                          <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/>
                        }
                        @case ('car') {
                          <path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M7 17a2 2 0 104 0M13 17a2 2 0 104 0"/>
                        }
                        @case ('wifi') {
                          <path d="M5 12.55a11 11 0 0114 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/>
                        }
                      }
                    </svg>
                  </div>
                  <span class="feature-label">{{ feature.label }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      @if (videoOpen()) {
        <div class="video-modal" (click)="closeVideo()">
          <div class="video-container" (click)="$event.stopPropagation()">
            <button class="video-close" (click)="closeVideo()">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/ml6cT4AZdqI?autoplay=1&mute=1"
              title="FitX Estrutura"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
            </iframe>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .structure-section {
      padding: 8rem 2rem;
      background: var(--color-bg);
      position: relative;
      overflow: hidden;
    }

    .structure-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .section-layout {
      position: relative;
    }

    .watermark {
      position: absolute;
      top: 50%;
      left: -2rem;
      transform: translateY(-50%);
      font-size: 8rem;
      font-weight: 900;
      color: var(--color-text);
      opacity: 0.1;
      line-height: 1;
      pointer-events: none;
      user-select: none;
    }

    .section-content {
      padding-left: 6rem;
    }

    .section-header {
      margin-bottom: 3rem;
    }

    .tag-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
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
    }

    .tag-line {
      flex: 1;
      height: 1px;
      background: var(--color-border);
    }

    .section-title {
      margin: 0 0 1rem 0;
    }

    .line-white {
      display: block;
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 800;
      color: var(--color-text);
      line-height: 1.1;
      letter-spacing: -1px;
    }

    .line-green {
      display: block;
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 800;
      color: var(--color-primary);
      line-height: 1.1;
      letter-spacing: -1px;
    }

    .section-subtitle {
      font-size: 1.125rem;
      color: var(--color-text-secondary);
      margin: 1rem 0 1.5rem 0;
      max-width: 500px;
    }

    .section-link {
      display: inline-block;
      color: var(--color-primary);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 700;
      letter-spacing: 1px;
      transition: opacity 0.2s ease;
    }

    .section-link:hover {
      opacity: 0.8;
    }

    .media-area {
      margin-top: 3rem;
      margin-bottom: 3rem;
    }

    .image-placeholder {
      width: 100%;
      aspect-ratio: 16 / 9;
      background: url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80') center/cover no-repeat;
      border: 1px solid var(--color-border);
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .play-button {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--color-primary) 90%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-bg);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .play-button:hover {
      transform: scale(1.1);
      box-shadow: 0 0 40px color-mix(in srgb, var(--color-primary) 40%, transparent);
    }

    .features-row {
      display: flex;
      justify-content: space-between;
      gap: 2rem;
    }

    .feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
    }

    .feature-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-primary);
    }

    .feature-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      text-align: center;
      letter-spacing: 0.5px;
    }

    @media (max-width: 768px) {
      .watermark {
        font-size: 5rem;
        left: -1rem;
      }

      .section-content {
        padding-left: 3rem;
      }

      .features-row {
        flex-wrap: wrap;
        justify-content: center;
      }

      .feature-item {
        flex: 0 0 calc(50% - 1rem);
      }
    }

    .video-modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 2rem;
      animation: fadeIn 0.3s ease;
    }

    .video-container {
      width: 100%;
      max-width: 900px;
      aspect-ratio: 16 / 9;
      position: relative;
      border-radius: 1rem;
      overflow: hidden;
    }

    .video-close {
      position: absolute;
      top: -3rem;
      right: 0;
      background: none;
      border: none;
      color: var(--color-text);
      cursor: pointer;
      padding: 0.5rem;
      transition: color 0.2s ease;
    }

    .video-close:hover {
      color: var(--color-primary);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class StructureComponent {
  videoOpen = signal(false);

  features = [
    { icon: 'dumbbell', label: 'APARELHOS MODERNOS' },
    { icon: 'locker', label: 'VESTIÁRIOS COMPLETOS' },
    { icon: 'snowflake', label: 'AMBIENTE CLIMATIZADO' },
    { icon: 'car', label: 'ESTACIONAMENTO GRATUITO' },
    { icon: 'wifi', label: 'WI-FI LIBERADO' }
  ];

  openVideo(): void {
    this.videoOpen.set(true);
  }

  closeVideo(): void {
    this.videoOpen.set(false);
  }
}
