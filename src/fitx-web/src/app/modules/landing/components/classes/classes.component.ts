import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimateDirective } from '../../../../shared/directives/scroll-animate.directive';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, ScrollAnimateDirective],
  template: `
    <section id="aulas" class="classes-section">
      <div class="classes-container">
        <div class="section-layout">
          <div class="watermark">03</div>

          <div class="section-content">
            <div class="section-header">
              <div class="tag-row">
                <span class="section-tag" scrollAnimate animationType="fadeUp" [delay]="0">AULAS</span>
                <span class="tag-line"></span>
              </div>
              <h2 class="section-title" scrollAnimate animationType="fadeUp" [delay]="0.1">
                <span class="line-white">AULAS PARA</span>
                <span class="line-white">TODOS OS</span>
                <span class="line-green">OBJETIVOS</span>
              </h2>
              <p class="section-subtitle" scrollAnimate animationType="fadeUp" [delay]="0.2">
                Variedade de modalidades para deixar seu treino mais motivante e eficiente.
              </p>
            </div>

            <div class="carousel-wrapper">
              <button class="carousel-arrow left" (click)="prev()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>

              <div class="carousel" #carousel>
                @for (item of classes; track item.name; let i = $index) {
                  <div class="class-card" scrollAnimate animationType="fadeUp" [delay]="i * 0.1">
                    <div class="card-image" [style.backgroundImage]="'url(' + item.image + ')'">
                      <div class="card-overlay"></div>
                    </div>
                    <div class="card-content">
                      <h3 class="card-name">{{ item.name }}</h3>
                      <p class="card-description">{{ item.description }}</p>
                    </div>
                  </div>
                }
              </div>

              <button class="carousel-arrow right" (click)="next()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
            <div class="carousel-dots">
              @for (dot of classes; track dot.name; let i = $index) {
                <span class="dot" [class.active]="i === activeIndex()"></span>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .classes-section {
      padding: 8rem 2rem;
      background: var(--color-bg);
      position: relative;
      overflow: hidden;
    }

    .classes-container {
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
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .section-link:hover {
      opacity: 0.8;
      transform: translateX(4px);
    }

    .carousel-wrapper {
      margin-top: 3rem;
      position: relative;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .carousel-arrow {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      color: var(--color-text);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      z-index: 10;
    }

    .carousel-arrow:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
    }

    .carousel {
      display: flex;
      gap: 1.5rem;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
      padding-bottom: 1.5rem;
      scroll-behavior: smooth;
    }

    .carousel::-webkit-scrollbar {
      display: none;
    }

    .class-card {
      flex: 0 0 280px;
      scroll-snap-align: start;
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: 1rem;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .class-card:hover {
      border-color: color-mix(in srgb, var(--color-primary) 40%, transparent);
      transform: translateY(-4px);
      box-shadow: 0 12px 40px color-mix(in srgb, #000 30%, transparent);
    }

    .card-image {
      width: 100%;
      height: 180px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, var(--color-bg-elevated) 0%, transparent 60%);
    }

    .card-content {
      padding: 1.25rem 1.5rem 1.5rem;
    }

    .card-name {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--color-text);
      margin: 0 0 0.5rem 0;
    }

    .card-description {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin: 0;
      line-height: 1.5;
    }

    .carousel-dots {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--color-text) 20%, transparent);
      transition: all 0.3s ease;
    }

    .dot.active {
      background: var(--color-primary);
      width: 24px;
      border-radius: 4px;
    }

    @media (max-width: 768px) {
      .watermark {
        font-size: 5rem;
        left: -1rem;
      }

      .section-content {
        padding-left: 3rem;
      }

      .class-card {
        flex: 0 0 240px;
      }

      .card-image {
        height: 150px;
      }
    }
  `]
})
export class ClassesComponent {
  @ViewChild('carousel') carouselRef!: ElementRef<HTMLDivElement>;
  activeIndex = signal(0);

  classes = [
    {
      name: 'HIIT',
      description: 'Alta intensidade que queima calorias',
      image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&q=80'
    },
    {
      name: 'SPINNING',
      description: 'Mais energia e condicionamento',
      image: 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=600&q=80'
    },
    {
      name: 'YOGA',
      description: 'Equilíbrio entre corpo e mente',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80'
    },
    {
      name: 'FUNCIONAL',
      description: 'Movimentos para o dia a dia',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80'
    },
    {
      name: 'PILATES',
      description: 'Força, alongamento e postura',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80'
    }
  ];

  scrollCarousel(): void {
    this.next();
  }

  next(): void {
    if (!this.carouselRef) return;
    const el = this.carouselRef.nativeElement;
    const cardWidth = 296;
    const nextIndex = this.activeIndex() >= this.classes.length - 1 ? 0 : this.activeIndex() + 1;
    el.scrollTo({ left: nextIndex * cardWidth, behavior: 'smooth' });
    this.activeIndex.set(nextIndex);
  }

  prev(): void {
    if (!this.carouselRef) return;
    const el = this.carouselRef.nativeElement;
    const cardWidth = 296;
    const prevIndex = this.activeIndex() <= 0 ? this.classes.length - 1 : this.activeIndex() - 1;
    el.scrollTo({ left: prevIndex * cardWidth, behavior: 'smooth' });
    this.activeIndex.set(prevIndex);
  }
}
