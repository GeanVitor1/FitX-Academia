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
            <div class="phone-body">
              <div class="phone-side-left">
                <div class="side-button volume-up"></div>
                <div class="side-button volume-down"></div>
              </div>
              <div class="phone-side-right">
                <div class="side-button power-button"></div>
              </div>
              <div class="phone-frame">
                <div class="phone-camera-module">
                  <div class="camera-lens large">
                    <div class="lens-ring"></div>
                    <div class="lens-center"></div>
                    <div class="lens-reflection"></div>
                  </div>
                  <div class="camera-lens small">
                    <div class="lens-ring"></div>
                    <div class="lens-center"></div>
                    <div class="lens-reflection"></div>
                  </div>
                  <div class="camera-flash"></div>
                </div>
                <div class="phone-notch-area">
                  <div class="phone-notch">
                    <div class="notch-camera">
                      <div class="notch-camera-lens"></div>
                    </div>
                    <div class="notch-speaker">
                      <div class="speaker-grille"></div>
                    </div>
                  </div>
                </div>
                <div class="phone-screen">
                  <div class="screen-glass-reflection"></div>
                  <div class="screen-glow"></div>

                  <div class="screen-header">
                    <div class="greeting">
                      <span class="greeting-text">Olá, Pedro!</span>
                      <span class="greeting-sub">Vamos treinar hoje?</span>
                    </div>
                    <div class="avatar">
                      <div class="avatar-initials">P</div>
                    </div>
                  </div>

                  <div class="screen-tabs">
                    <span class="tab active">Treino progresso</span>
                    <span class="tab">Rotinas</span>
                  </div>

                  <div class="progress-ring-container">
                    <div class="progress-ring">
                      <svg viewBox="0 0 100 100">
                        <defs>
                          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#00f5a0"/>
                            <stop offset="100%" style="stop-color:#00d9f5"/>
                          </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="7"/>
                        <circle cx="50" cy="50" r="42" fill="none" stroke="url(#ringGrad)" stroke-width="7" stroke-dasharray="264" stroke-dashoffset="74" stroke-linecap="round" transform="rotate(-90 50 50)"/>
                      </svg>
                      <div class="ring-text">
                        <span class="ring-value">75</span>
                        <span class="ring-unit">%</span>
                      </div>
                    </div>
                  </div>

                  <div class="exercises-label">Exercícios</div>

                  <div class="exercise-item">
                    <div class="exercise-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6.5 6.5h11M6.5 17.5h11M4 12h16M2 9v6M22 9v6"/>
                      </svg>
                    </div>
                    <div class="exercise-info">
                      <span class="exercise-name">Supino Reto</span>
                      <span class="exercise-detail">4 séries x 12 repetições</span>
                    </div>
                    <div class="exercise-check">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  </div>

                  <div class="exercise-item">
                    <div class="exercise-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6.5 6.5h11M6.5 17.5h11M4 12h16M2 9v6M22 9v6"/>
                      </svg>
                    </div>
                    <div class="exercise-info">
                      <span class="exercise-name">Crucifixo</span>
                      <span class="exercise-detail">3 séries x 15 repetições</span>
                    </div>
                    <div class="exercise-check">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  </div>

                  <div class="gesture-bar"></div>
                </div>
              </div>
              <div class="phone-bottom">
                <div class="charging-port"></div>
                <div class="speaker-holes">
                  <div class="speaker-hole"></div>
                  <div class="speaker-hole"></div>
                  <div class="speaker-hole"></div>
                  <div class="speaker-hole"></div>
                  <div class="speaker-hole"></div>
                  <div class="speaker-hole"></div>
                </div>
              </div>
              <div class="phone-antenna-line top-left"></div>
              <div class="phone-antenna-line top-right"></div>
              <div class="phone-antenna-line bottom-left"></div>
              <div class="phone-antenna-line bottom-right"></div>
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
      perspective: 1200px;
      filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.6));
    }

    .phone-body {
      position: relative;
      transform: rotateY(-12deg) rotateX(4deg) rotateZ(1deg);
      transform-style: preserve-3d;
      transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .phone-body:hover {
      transform: rotateY(-4deg) rotateX(1deg) rotateZ(0deg);
    }

    .phone-frame {
      width: 280px;
      height: 570px;
      background: linear-gradient(145deg, #2a2a2a 0%, #0f0f0f 30%, #1a1a1a 50%, #0a0a0a 70%, #1e1e1e 100%);
      border-radius: 3rem;
      padding: 0.6rem;
      position: relative;
      overflow: hidden;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        inset 0 -1px 0 rgba(0, 0, 0, 0.5),
        inset 1px 0 0 rgba(255, 255, 255, 0.04),
        inset -1px 0 0 rgba(255, 255, 255, 0.04),
        0 0 0 1px rgba(255, 255, 255, 0.05),
        0 2px 4px rgba(0, 0, 0, 0.3),
        0 8px 16px rgba(0, 0, 0, 0.3),
        0 20px 40px rgba(0, 0, 0, 0.4),
        0 40px 80px rgba(0, 0, 0, 0.3);
    }

    .phone-frame::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 3rem;
      background: linear-gradient(
        165deg,
        rgba(255, 255, 255, 0.12) 0%,
        rgba(255, 255, 255, 0.03) 20%,
        transparent 40%,
        transparent 80%,
        rgba(255, 255, 255, 0.02) 100%
      );
      pointer-events: none;
      z-index: 5;
    }

    .phone-frame::after {
      content: '';
      position: absolute;
      top: -1px;
      left: 10%;
      right: 10%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      z-index: 5;
    }

    /* Side Buttons */
    .phone-side-left {
      position: absolute;
      left: -3px;
      top: 120px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      z-index: 1;
    }

    .phone-side-right {
      position: absolute;
      right: -3px;
      top: 140px;
      z-index: 1;
    }

    .side-button {
      width: 3px;
      background: linear-gradient(180deg, #444 0%, #222 50%, #444 100%);
      border-radius: 1px;
      box-shadow: 1px 0 2px rgba(0, 0, 0, 0.5), -1px 0 1px rgba(0, 0, 0, 0.3);
    }

    .volume-up { height: 30px; }
    .volume-down { height: 30px; }
    .power-button { height: 40px; }

    .side-button::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.15), transparent, rgba(255, 255, 255, 0.1));
    }

    /* Camera Module (back) */
    .phone-camera-module {
      position: absolute;
      top: 15px;
      left: 15px;
      width: 80px;
      height: 80px;
      background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
      border-radius: 1.2rem;
      z-index: -1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 4px;
      padding: 8px;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.05),
        0 2px 8px rgba(0, 0, 0, 0.5);
    }

    .camera-lens {
      position: relative;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .camera-lens.large {
      width: 28px;
      height: 28px;
      background: radial-gradient(circle at 35% 35%, #1a2a3a, #0a0f14 60%, #050810);
      grid-column: 1;
      grid-row: 1;
    }

    .camera-lens.small {
      width: 20px;
      height: 20px;
      background: radial-gradient(circle at 35% 35%, #1a2a3a, #0a0f14 60%, #050810);
      grid-column: 2;
      grid-row: 1;
      align-self: center;
      justify-self: center;
    }

    .lens-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 1.5px solid rgba(100, 120, 140, 0.4);
      box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.8);
    }

    .lens-center {
      width: 40%;
      height: 40%;
      border-radius: 50%;
      background: radial-gradient(circle, #1a3050, #0a1520);
      box-shadow: 0 0 4px rgba(0, 100, 200, 0.2);
    }

    .lens-reflection {
      position: absolute;
      top: 15%;
      left: 20%;
      width: 30%;
      height: 20%;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.35), transparent);
      border-radius: 50%;
      transform: rotate(-20deg);
    }

    .camera-flash {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: radial-gradient(circle, #f5e6b8, #d4a843);
      grid-column: 2;
      grid-row: 2;
      align-self: center;
      justify-self: center;
      box-shadow: 0 0 6px rgba(245, 230, 184, 0.3);
    }

    /* Notch */
    .phone-notch-area {
      position: absolute;
      top: 0.6rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
    }

    .phone-notch {
      width: 100px;
      height: 26px;
      background: #000;
      border-radius: 0 0 1.2rem 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      position: relative;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }

    .phone-notch::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
    }

    .notch-camera {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #1a2535, #080c12);
      border: 1.5px solid #222;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.8);
    }

    .notch-camera-lens {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: radial-gradient(circle, #1a3050, #0a1020);
      box-shadow: 0 0 2px rgba(0, 80, 160, 0.3);
    }

    .notch-speaker {
      width: 30px;
      height: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .speaker-grille {
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(
        90deg,
        #222 0px,
        #222 1px,
        #111 1px,
        #111 2.5px
      );
      border-radius: 2px;
    }

    /* Screen */
    .phone-screen {
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, #0c0c0e 0%, #0a0a0c 50%, #080808 100%);
      border-radius: 2.4rem;
      padding: 2.8rem 1rem 1.2rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      position: relative;
      overflow: hidden;
    }

    .screen-glass-reflection {
      position: absolute;
      inset: 0;
      border-radius: 2.4rem;
      background: linear-gradient(
        155deg,
        rgba(255, 255, 255, 0.06) 0%,
        rgba(255, 255, 255, 0.02) 15%,
        transparent 35%,
        transparent 65%,
        rgba(255, 255, 255, 0.01) 85%,
        rgba(255, 255, 255, 0.03) 100%
      );
      pointer-events: none;
      z-index: 20;
    }

    .screen-glow {
      position: absolute;
      top: -30%;
      left: -20%;
      width: 140%;
      height: 60%;
      background: radial-gradient(ellipse, rgba(0, 245, 160, 0.03), transparent 60%);
      pointer-events: none;
      z-index: 1;
    }

    .screen-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 5;
    }

    .greeting {
      display: flex;
      flex-direction: column;
    }

    .greeting-text {
      font-size: 0.95rem;
      font-weight: 700;
      color: #f0f0f0;
      letter-spacing: -0.2px;
    }

    .greeting-sub {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.45);
      margin-top: 1px;
    }

    .avatar {
      width: 34px;
      height: 34px;
      background: linear-gradient(135deg, #00f5a0, #00d9f5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 10px rgba(0, 245, 160, 0.3);
      position: relative;
      overflow: hidden;
    }

    .avatar::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), transparent 50%);
      pointer-events: none;
    }

    .avatar-initials {
      font-size: 0.8rem;
      font-weight: 700;
      color: #000;
      z-index: 1;
    }

    .screen-tabs {
      display: flex;
      gap: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 0.5rem;
      position: relative;
      z-index: 5;
    }

    .tab {
      font-size: 0.72rem;
      color: rgba(255, 255, 255, 0.35);
      padding-bottom: 0.25rem;
      font-weight: 500;
      letter-spacing: 0.2px;
      transition: color 0.3s ease;
    }

    .tab.active {
      color: #00f5a0;
      border-bottom: 2px solid #00f5a0;
      text-shadow: 0 0 12px rgba(0, 245, 160, 0.3);
    }

    .progress-ring-container {
      display: flex;
      justify-content: center;
      padding: 0.4rem 0;
      position: relative;
      z-index: 5;
    }

    .progress-ring {
      position: relative;
      width: 105px;
      height: 105px;
    }

    .progress-ring svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 0 8px rgba(0, 245, 160, 0.15));
    }

    .ring-text {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ring-value {
      font-size: 1.6rem;
      font-weight: 800;
      color: #f0f0f0;
      letter-spacing: -1px;
    }

    .ring-unit {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.4);
      margin-left: 1px;
      font-weight: 500;
    }

    .exercises-label {
      font-size: 0.72rem;
      color: rgba(255, 255, 255, 0.35);
      margin-top: 0.15rem;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      position: relative;
      z-index: 5;
    }

    .exercise-item {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 0.85rem;
      padding: 0.7rem 0.75rem;
      position: relative;
      z-index: 5;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .exercise-item::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 0.85rem;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), transparent);
      pointer-events: none;
    }

    .exercise-icon {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, rgba(0, 245, 160, 0.15), rgba(0, 217, 245, 0.08));
      border-radius: 0.6rem;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(0, 245, 160, 0.7);
      box-shadow: 0 2px 8px rgba(0, 245, 160, 0.08);
    }

    .exercise-icon svg {
      width: 18px;
      height: 18px;
    }

    .exercise-info {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      flex: 1;
    }

    .exercise-name {
      font-size: 0.78rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      letter-spacing: -0.1px;
    }

    .exercise-detail {
      font-size: 0.62rem;
      color: rgba(255, 255, 255, 0.35);
      font-weight: 400;
    }

    .exercise-check {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(0, 245, 160, 0.2), rgba(0, 217, 245, 0.1));
      border: 1px solid rgba(0, 245, 160, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #00f5a0;
      flex-shrink: 0;
    }

    .exercise-check svg {
      width: 12px;
      height: 12px;
    }

    /* Gesture Bar */
    .gesture-bar {
      width: 35%;
      height: 4px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      margin: auto auto 0.2rem;
      position: relative;
      z-index: 5;
    }

    /* Bottom Area */
    .phone-bottom {
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 2;
    }

    .charging-port {
      width: 18px;
      height: 5px;
      background: #0a0a0a;
      border-radius: 2px;
      border: 1px solid #222;
    }

    .speaker-holes {
      display: flex;
      gap: 4px;
    }

    .speaker-hole {
      width: 2.5px;
      height: 2.5px;
      border-radius: 50%;
      background: #111;
      border: 0.5px solid #222;
    }

    /* Antenna Lines */
    .phone-antenna-line {
      position: absolute;
      background: rgba(255, 255, 255, 0.03);
      z-index: 1;
    }

    .phone-antenna-line.top-left {
      top: 40px;
      left: -1px;
      width: 2px;
      height: 12px;
      border-radius: 1px;
    }

    .phone-antenna-line.top-right {
      top: 40px;
      right: -1px;
      width: 2px;
      height: 12px;
      border-radius: 1px;
    }

    .phone-antenna-line.bottom-left {
      bottom: 50px;
      left: -1px;
      width: 2px;
      height: 12px;
      border-radius: 1px;
    }

    .phone-antenna-line.bottom-right {
      bottom: 50px;
      right: -1px;
      width: 2px;
      height: 12px;
      border-radius: 1px;
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

      .phone-body {
        transform: none;
      }

      .phone-body:hover {
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
