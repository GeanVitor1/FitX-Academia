import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimateDirective } from '../../../../shared/directives/scroll-animate.directive';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, ScrollAnimateDirective],
  template: `
    <section id="resultados" class="results-section">
      <div class="results-container">
        <div class="section-layout">
          <div class="watermark">05</div>

          <div class="section-content">
            <div class="section-header">
              <div class="tag-row">
                <span class="section-tag" scrollAnimate animationType="fadeUp" [delay]="0">RESULTADOS</span>
                <span class="tag-line"></span>
              </div>
              <h2 class="section-title" scrollAnimate animationType="fadeUp" [delay]="0.1">
                <span class="line-white">HISTÓRIAS</span>
                <span class="line-white">QUE</span>
                <span class="line-green">INSPIRAM</span>
              </h2>
              <p class="section-subtitle" scrollAnimate animationType="fadeUp" [delay]="0.2">
                Pessoas reais, resultados reais. Se eles conseguiram, você também pode!
              </p>
              <a href="#resultados" class="section-link" scrollAnimate animationType="fadeUp" [delay]="0.3">VER MAIS HISTÓRIAS &rarr;</a>
            </div>

            <div class="carousel-wrapper">
              <div class="carousel">
                @for (item of results; track item.name; let i = $index) {
                  <div class="result-card" [class.active]="i === 1" scrollAnimate animationType="fadeUp" [delay]="i * 0.15">
                    <div class="card-images">
                      <img [src]="item.image" [alt]="item.name + ' transformação'" loading="lazy">
                    </div>
                    <div class="card-content">
                      <span class="card-name">{{ item.name }}</span>
                      <div class="card-result">
                        <span class="result-number">{{ item.result }}</span>
                        <span class="result-detail">{{ item.detail }}</span>
                      </div>
                    </div>
                  </div>
                }
              </div>
              <div class="carousel-dots">
                @for (dot of results; track dot.name; let i = $index) {
                  <span class="dot" [class.active]="i === 1"></span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .results-section {
      padding: 8rem 2rem;
      background: #0a0a0a;
      position: relative;
      overflow: hidden;
    }

    .results-container {
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
      background: rgba(200, 255, 0, 0.1);
      color: #c8ff00;
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 2px;
    }

    .tag-line {
      flex: 1;
      height: 1px;
      background: #333;
    }

    .section-title {
      margin: 0 0 1rem 0;
    }

    .line-white {
      display: block;
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 800;
      color: #fff;
      line-height: 1.1;
      letter-spacing: -1px;
    }

    .line-green {
      display: block;
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 800;
      color: #c8ff00;
      line-height: 1.1;
      letter-spacing: -1px;
    }

    .section-subtitle {
      font-size: 1.125rem;
      color: #999;
      margin: 1rem 0 1.5rem 0;
      max-width: 500px;
    }

    .section-link {
      display: inline-block;
      color: #c8ff00;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 700;
      letter-spacing: 1px;
      transition: opacity 0.2s ease;
    }

    .section-link:hover {
      opacity: 0.8;
    }

    .carousel-wrapper {
      margin-top: 3rem;
    }

    .carousel {
      display: flex;
      gap: 1.5rem;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
      padding-bottom: 1.5rem;
    }

    .carousel::-webkit-scrollbar {
      display: none;
    }

    .result-card {
      flex: 0 0 340px;
      scroll-snap-align: start;
      background: #1a1a1a;
      border: 2px solid #333;
      border-radius: 1rem;
      overflow: hidden;
      transition: all 0.3s ease;
      position: relative;
    }

    .result-card.active {
      border-color: #c8ff00;
      box-shadow: 0 0 20px rgba(200, 255, 0, 0.3);
    }

    .card-images {
      width: 100%;
      height: 380px;
      overflow: hidden;
    }

    .card-images img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      transition: transform 0.3s ease;
    }

    .result-card:hover .card-images img {
      transform: scale(1.05);
    }

    .card-content {
      padding: 1.25rem 1.5rem 1.5rem;
      background: linear-gradient(to top, #0a0a0a, #1a1a1a);
    }

    .result-card:hover {
      border-color: #c8ff00;
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
    }

    .card-name {
      display: block;
      font-size: 1rem;
      font-weight: 600;
      color: #fff;
      margin-bottom: 0.5rem;
    }

    .card-result {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .result-number {
      font-size: 2.25rem;
      font-weight: 900;
      color: #c8ff00;
      line-height: 1;
    }

    .result-detail {
      font-size: 0.7rem;
      font-weight: 700;
      color: #999;
      letter-spacing: 1px;
      margin-top: 0.25rem;
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
      background: #444;
      transition: all 0.3s ease;
    }

    .dot.active {
      background: #c8ff00;
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

      .result-card {
        flex: 0 0 280px;
      }
    }
  `]
})
export class ResultsComponent {
  results = [
    { 
      name: 'Juliana M.', 
      result: '-12kg', 
      detail: 'EM 4 MESES',
      image: 'assets/images/results/juliana.jpg'
    },
    { 
      name: 'Carlos A.', 
      result: '+8kg', 
      detail: 'MASSA MUSCULAR EM 5 MESES',
      image: 'assets/images/results/carlos.jpg'
    },
    { 
      name: 'Fernanda L.', 
      result: '-15kg', 
      detail: 'EM 6 MESES',
      image: 'assets/images/results/fernanda.jpg'
    }
  ];
}
