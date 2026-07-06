import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimateDirective } from '../../../../shared/directives/scroll-animate.directive';

@Component({
  selector: 'app-tech',
  standalone: true,
  imports: [CommonModule, ScrollAnimateDirective],
  template: `
    <section class="tech-section">
      <div class="tech-container">
        <div class="tech-left">
          <span class="watermark">06</span>
          <div class="section-tag" scrollAnimate animationType="fadeLeft" [delay]="0">
            <span class="tag-text">TECNOLOGIA</span>
            <span class="tag-line"></span>
          </div>
          <h2 class="headline" scrollAnimate animationType="fadeLeft" [delay]="0.1">
            SUA ACADEMIA
            <span class="accent">NO SEU BOLSO</span>
          </h2>
          <p class="subtitle" scrollAnimate animationType="fadeLeft" [delay]="0.2">
            Nosso app exclusivo para acompanhar seus treinos, evolução e muito mais, onde estiver.
          </p>
          <div class="download-buttons" scrollAnimate animationType="fadeLeft" [delay]="0.3">
            <a href="javascript:void(0)" class="download-btn">
              <svg class="store-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div class="btn-text">
                <span class="btn-label">Aplicativo BAIXAR</span>
                <span class="btn-store">App Store</span>
              </div>
            </a>
            <a href="javascript:void(0)" class="download-btn">
              <svg class="store-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 1.33a1 1 0 010 1.722l-2.302 1.33-2.536-2.19 2.536-2.192zM5.864 3.458L16.8 9.79l-2.302 2.303L5.864 3.458z"/>
              </svg>
              <div class="btn-text">
                <span class="btn-label">Aplicativo BAIXAR</span>
                <span class="btn-store">Google Play</span>
              </div>
            </a>
          </div>
        </div>

        <div class="tech-right">
          <div class="phone-mockup" scrollAnimate animationType="fadeRight" [delay]="0.1">
            <div class="phone-frame">
              <div class="phone-notch"></div>
              <div class="phone-screen">
                <div class="screen-header">
                  <div class="greeting">
                    <span class="greeting-text">Olá, Pedro!</span>
                    <span class="greeting-sub">Vamos treinar hoje?</span>
                  </div>
                  <div class="avatar"></div>
                </div>

                <div class="screen-tabs">
                  <span class="tab active">Treino progresso</span>
                  <span class="tab">Rotinas</span>
                </div>

                <div class="progress-ring-container">
                  <div class="progress-ring">
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-border)" stroke-width="8"/>
                      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-primary)" stroke-width="8" stroke-dasharray="264" stroke-dashoffset="74" stroke-linecap="round" transform="rotate(-90 50 50)"/>
                    </svg>
                    <div class="ring-text">
                      <span class="ring-value">75</span>
                      <span class="ring-unit">%</span>
                    </div>
                  </div>
                </div>

                <div class="exercises-label">Exercícios</div>

                <div class="exercise-item">
                  <div class="exercise-icon"></div>
                  <div class="exercise-info">
                    <span class="exercise-name">Supino Reto</span>
                    <span class="exercise-detail">4 séries x 12 repetições</span>
                  </div>
                </div>

                <div class="exercise-item">
                  <div class="exercise-icon"></div>
                  <div class="exercise-info">
                    <span class="exercise-name">Crucifixo</span>
                    <span class="exercise-detail">3 séries x 15 repetições</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="feature-cards">
            <div class="feature-card" scrollAnimate animationType="scaleIn" [delay]="0">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="5" y="2" width="14" height="20" rx="2"/>
                  <line x1="9" y1="7" x2="15" y2="7"/>
                  <line x1="9" y1="11" x2="15" y2="11"/>
                  <line x1="9" y1="15" x2="13" y2="15"/>
                </svg>
              </div>
              <span class="feature-label">TREINOS<br>PERSONALIZADOS</span>
            </div>
            <div class="feature-card" scrollAnimate animationType="scaleIn" [delay]="0.1">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                </svg>
              </div>
              <span class="feature-label">ACOMPANHE<br>SUA EVOLUÇÃO</span>
            </div>
            <div class="feature-card" scrollAnimate animationType="scaleIn" [delay]="0.2">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
              </div>
              <span class="feature-label">AVALIAÇÕES<br>PERIÓDICAS</span>
            </div>
            <div class="feature-card" scrollAnimate animationType="scaleIn" [delay]="0.3">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
              </div>
              <span class="feature-label">LEMBRETES<br>INTELIGENTES</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .tech-section {
      padding: 8rem 2rem;
      background: var(--color-bg);
      overflow: hidden;
    }

    .tech-container {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 2rem;
      align-items: center;
    }

    .tech-left {
      position: relative;
    }

    .watermark {
      position: absolute;
      top: -4rem;
      left: -2rem;
      font-size: 12rem;
      font-weight: 900;
      color: color-mix(in srgb, var(--color-primary) 5%, transparent);
      line-height: 1;
      pointer-events: none;
      user-select: none;
    }

    .section-tag {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .tag-text {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-primary);
      letter-spacing: 3px;
    }

    .tag-line {
      flex: 1;
      height: 1px;
      background: var(--color-border);
      max-width: 120px;
    }

    .headline {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 900;
      color: var(--color-text);
      line-height: 1.1;
      margin: 0 0 1.5rem 0;
    }

    .accent {
      display: block;
      color: var(--color-primary);
    }

    .subtitle {
      font-size: 1.125rem;
      color: var(--color-text-secondary);
      line-height: 1.7;
      margin: 0 0 2.5rem 0;
      max-width: 450px;
    }

    .download-buttons {
      display: flex;
      gap: 1rem;
    }

    .download-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      padding: 0.875rem 1.5rem;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .download-btn:hover {
      border-color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary) 10%, var(--color-bg-elevated));
      transform: translateY(-2px);
    }

    .store-icon {
      width: 24px;
      height: 24px;
      color: var(--color-text);
    }

    .btn-text {
      display: flex;
      flex-direction: column;
    }

    .btn-label {
      font-size: 0.625rem;
      color: var(--color-text-secondary);
      letter-spacing: 0.5px;
    }

    .btn-store {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text);
    }

    .tech-right {
      display: flex;
      align-items: center;
      gap: 2rem;
      justify-content: center;
    }

    .phone-mockup {
      position: relative;
      perspective: 1000px;
    }

    .phone-frame {
      width: 260px;
      height: 520px;
      background: #1a1a1a;
      border-radius: 2.5rem;
      border: 3px solid #333;
      padding: 0.5rem;
      position: relative;
      overflow: hidden;
      transform: rotateY(-8deg) rotateX(3deg);
      transform-style: preserve-3d;
      box-shadow: 20px 20px 60px rgba(0, 0, 0, 0.5), -5px -5px 20px rgba(0, 0, 0, 0.2);
    }

    .phone-notch {
      position: absolute;
      top: 0.5rem;
      left: 50%;
      transform: translateX(-50%);
      width: 90px;
      height: 22px;
      background: #1a1a1a;
      border-radius: 0 0 1rem 1rem;
      z-index: 10;
    }

    .phone-screen {
      width: 100%;
      height: 100%;
      background: #0d0d0d;
      border-radius: 2rem;
      padding: 2.5rem 1rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .screen-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .greeting {
      display: flex;
      flex-direction: column;
    }

    .greeting-text {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-text);
    }

    .greeting-sub {
      font-size: 0.7rem;
      color: var(--color-text-secondary);
    }

    .avatar {
      width: 32px;
      height: 32px;
      background: var(--color-primary);
      border-radius: 50%;
    }

    .screen-tabs {
      display: flex;
      gap: 1rem;
      border-bottom: 1px solid #222;
      padding-bottom: 0.5rem;
    }

    .tab {
      font-size: 0.7rem;
      color: var(--color-text-secondary);
      padding-bottom: 0.25rem;
    }

    .tab.active {
      color: var(--color-primary);
      border-bottom: 2px solid var(--color-primary);
    }

    .progress-ring-container {
      display: flex;
      justify-content: center;
      padding: 0.5rem 0;
    }

    .progress-ring {
      position: relative;
      width: 100px;
      height: 100px;
    }

    .progress-ring svg {
      width: 100%;
      height: 100%;
    }

    .ring-text {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ring-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-text);
    }

    .ring-unit {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
    }

    .exercises-label {
      font-size: 0.7rem;
      color: var(--color-text-secondary);
      margin-top: 0.25rem;
    }

    .exercise-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #161616;
      border-radius: 0.75rem;
      padding: 0.75rem;
    }

    .exercise-icon {
      width: 36px;
      height: 36px;
      background: color-mix(in srgb, var(--color-primary) 20%, transparent);
      border-radius: 0.5rem;
      flex-shrink: 0;
    }

    .exercise-info {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .exercise-name {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-text);
    }

    .exercise-detail {
      font-size: 0.6rem;
      color: var(--color-text-secondary);
    }

    .feature-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .feature-card {
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      transition: all 0.3s ease;
      min-width: 130px;
    }

    .feature-card:hover {
      border-color: color-mix(in srgb, var(--color-primary) 50%, transparent);
      transform: translateY(-2px);
    }

    .feature-icon {
      width: 36px;
      height: 36px;
      background: color-mix(in srgb, var(--color-primary) 15%, transparent);
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-primary);
    }

    .feature-icon svg {
      width: 18px;
      height: 18px;
    }

    .feature-label {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--color-text);
      letter-spacing: 0.5px;
      line-height: 1.3;
    }

    @media (max-width: 968px) {
      .tech-container {
        grid-template-columns: 1fr;
        gap: 4rem;
      }

      .tech-left {
        order: 2;
        text-align: center;
      }

      .section-tag {
        justify-content: center;
      }

      .subtitle {
        margin-left: auto;
        margin-right: auto;
      }

      .download-buttons {
        justify-content: center;
      }

      .tech-right {
        order: 1;
        flex-direction: column;
      }

      .phone-frame {
        transform: none;
      }

      .watermark {
        font-size: 8rem;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    @media (max-width: 480px) {
      .download-buttons {
        flex-direction: column;
        align-items: center;
      }

      .feature-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TechComponent {}
