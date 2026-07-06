import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimateDirective } from '../../../../shared/directives/scroll-animate.directive';

interface Testimonial {
  name: string;
  role: string;
  image: string;
  rating: number;
  comment: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, ScrollAnimateDirective],
  template: `
    <section id="depoimentos" class="testimonials-section">
      <div class="testimonials-container">
        <div class="section-header">
          <span class="section-tag" scrollAnimate animationType="fadeUp" [delay]="0">DEPOIMENTOS</span>
          <h2 class="section-title" scrollAnimate animationType="fadeUp" [delay]="0.1">
            Histórias que <span class="highlight">inspiram</span>
          </h2>
          <p class="section-subtitle" scrollAnimate animationType="fadeUp" [delay]="0.2">
            Pessoas reais, resultados reais. Se eles conseguiram, você também pode!
          </p>
        </div>

        <div class="testimonials-grid">
          @for (testimonial of testimonials; track testimonial.name; let i = $index) {
            <div class="testimonial-card" scrollAnimate animationType="fadeUp" [delay]="i * 0.15">
              <div class="card-header">
                <div class="avatar">
                  <span class="avatar-icon">{{ testimonial.name.charAt(0) }}</span>
                </div>
                <div class="user-info">
                  <h4 class="user-name">{{ testimonial.name }}</h4>
                  <p class="user-role">{{ testimonial.role }}</p>
                </div>
                <div class="rating">
                  @for (star of getStars(testimonial.rating); track $index) {
                    <span class="star">⭐</span>
                  }
                </div>
              </div>
              <p class="comment">"{{ testimonial.comment }}"</p>
            </div>
          }
        </div>

        <div class="stats-banner">
          <div class="banner-content">
            <h3>+5.000 Alunos Transformados</h3>
            <p>Junte-se a quem já mudou de vida</p>
          </div>
          <a href="#planos" class="banner-cta">
            Começar Agora
            <span class="arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .testimonials-section {
      padding: 8rem 2rem;
      background: linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-elevated) 100%);
    }

    .testimonials-container {
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
      margin: 0 0 1rem 0;
    }

    .highlight {
      color: var(--color-primary);
    }

    .section-subtitle {
      font-size: 1.125rem;
      color: var(--color-text-secondary);
      margin: 0;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .testimonial-card {
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: 1rem;
      padding: 2rem;
      transition: all 0.2s ease;
    }

    .testimonial-card:hover {
      transform: translateY(-5px);
      border-color: var(--color-primary);
      box-shadow: 0 20px 40px color-mix(in srgb, var(--color-primary) 10%, transparent);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .avatar {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-icon {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-bg);
    }

    .user-info {
      flex: 1;
    }

    .user-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text);
      margin: 0;
    }

    .user-role {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      margin: 0;
    }

    .rating {
      display: flex;
      gap: 0.25rem;
    }

    .star {
      font-size: 0.875rem;
    }

    .comment {
      font-size: 0.9rem;
      color: var(--color-text-secondary);
      line-height: 1.7;
      margin: 0;
      font-style: italic;
    }

    .stats-banner {
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
      border-radius: 1.5rem;
      padding: 3rem 4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .banner-content h3 {
      font-size: 2rem;
      font-weight: 800;
      color: var(--color-bg);
      margin: 0 0 0.5rem 0;
    }

    .banner-content p {
      font-size: 1rem;
      color: color-mix(in srgb, var(--color-bg) 70%, transparent);
      margin: 0;
    }

    .banner-cta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--color-bg);
      color: var(--color-primary);
      text-decoration: none;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      font-weight: 700;
      transition: all 0.2s ease;
    }

    .banner-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px color-mix(in srgb, #000 30%, transparent);
    }

    .arrow {
      transition: transform 0.2s ease;
    }

    .banner-cta:hover .arrow {
      transform: translateX(4px);
    }

    @media (max-width: 968px) {
      .testimonials-grid {
        grid-template-columns: 1fr;
      }

      .stats-banner {
        flex-direction: column;
        text-align: center;
        gap: 2rem;
      }
    }
  `]
})
export class TestimonialsComponent implements OnInit {
  testimonials: Testimonial[] = [
    {
      name: 'Ana Silva',
      role: 'Aluna há 2 anos',
      image: '',
      rating: 5,
      comment: 'A FitX mudou minha vida! Perdi 15kg em 6 meses e conquistei uma disposição que nunca tive. Os professores são incríveis!'
    },
    {
      name: 'Carlos Santos',
      role: 'Aluno há 1 ano',
      image: '',
      rating: 5,
      comment: 'Melhor academia que já fui. Estrutura top, equipamentos novos e o tratamento é muito personalizado. Super recomendo!'
    },
    {
      name: 'Maria Oliveira',
      role: 'Aluna há 3 anos',
      image: '',
      rating: 5,
      comment: 'Já trago toda minha família para treinar aqui. O ambiente é motivador e os resultados falam por si. Não troco por nada!'
    }
  ];

  ngOnInit(): void {}

  getStars(count: number): number[] {
    return Array(count).fill(0);
  }
}
