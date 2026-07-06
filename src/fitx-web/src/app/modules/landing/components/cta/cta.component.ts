import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScrollAnimateDirective } from '../../../../shared/directives/scroll-animate.directive';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [CommonModule, RouterModule, ScrollAnimateDirective],
  template: `
    <section id="contato" class="cta-wrapper">
      <section class="cta-section">
        <div class="cta-container">
          <h2 class="cta-title" scrollAnimate animationType="fadeUp" [delay]="0">
            PRONTO PARA SUA
            <span class="accent">MELHOR VERSÃO?</span>
          </h2>
          <p class="cta-subtitle" scrollAnimate animationType="fadeUp" [delay]="0.1">
            Faça seu teste grátis de 7 dias e descubra como é treinar na Fitness Academia!
          </p>
          <a routerLink="/auth/register" class="cta-button" scrollAnimate animationType="scaleIn" [delay]="0.2">
            <span>QUERO MEU TESTE GRÁTIS</span>
            <span class="arrow">→</span>
          </a>
        </div>
      </section>

      <footer class="footer">
        <div class="footer-container">
          <div class="footer-content">
            <div class="footer-brand" scrollAnimate animationType="fadeUp" [delay]="0">
              <div class="logo">
                <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6.5 6.5h-2a1 1 0 00-1 1v9a1 1 0 001 1h2"/>
                  <path d="M17.5 6.5h2a1 1 0 011 1v9a1 1 0 01-1 1h-2"/>
                  <rect x="6.5" y="4" width="11" height="16" rx="1"/>
                  <line x1="12" y1="4" x2="12" y2="20"/>
                </svg>
                <div class="logo-text">
                  <span class="logo-main">FITNESS</span>
                  <span class="logo-sub">ACADEMIA</span>
                </div>
              </div>
              <p class="brand-description">
                Mais que uma academia, um estilo de vida. Aqui você encontra tudo para transformar seu corpo e sua mente.
              </p>
              <div class="social-links">
                <a href="javascript:void(0)" class="social-link" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="javascript:void(0)" class="social-link" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="javascript:void(0)" class="social-link" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div class="footer-links" scrollAnimate animationType="fadeUp" [delay]="0.15">
              <div class="link-group">
                <h4>LINKS RÁPIDOS</h4>
                <a href="#inicio">Início</a>
                <a href="#planos">Planos</a>
                <a href="#aulas">Aulas</a>
                <a href="#estrutura">Estrutura</a>
                <a href="#contato">Contato</a>
              </div>

              <div class="link-group">
                <h4>INFORMAÇÕES</h4>
                <a href="javascript:void(0)">Sobre nós</a>
                <a href="javascript:void(0)">Blog</a>
                <a href="javascript:void(0)">Trabalhe conosco</a>
                <a href="javascript:void(0)">Política de privacidade</a>
                <a href="javascript:void(0)">Termos de uso</a>
              </div>

              <div class="link-group">
                <h4>FALE CONOSCO</h4>
                <div class="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  <span>(11) 99999-9999</span>
                </div>
                <div class="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span>contato&#64;fitness.com.br</span>
                </div>
                <div class="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>Av. das Nações Unidas, 1234<br/>São Paulo - SP</span>
                </div>
              </div>

              <div class="link-group">
                <h4>HORÁRIOS</h4>
                <div class="schedule-item">
                  <span class="day">Seg a Sex</span>
                  <span class="time">06h às 23h</span>
                </div>
                <div class="schedule-item">
                  <span class="day">Sáb</span>
                  <span class="time">09h às 18h</span>
                </div>
                <div class="schedule-item">
                  <span class="day">Dom</span>
                  <span class="time">09h às 14h</span>
                </div>
              </div>
            </div>
          </div>

          <div class="footer-bottom">
            <p>© 2024 FITNESS. Todos os direitos reservados.</p>
            <button class="back-to-top" (click)="scrollToTop()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </section>
  `,
  styles: [`
    .cta-wrapper {
      overflow: hidden;
    }

    .cta-section {
      background: var(--color-primary);
      padding: 6rem 2rem;
    }

    .cta-container {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }

    .cta-title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 900;
      color: var(--color-bg);
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .accent {
      display: block;
    }

    .cta-subtitle {
      font-size: 1.125rem;
      color: color-mix(in srgb, var(--color-bg) 80%, transparent);
      margin: 0 0 2.5rem 0;
    }

    .cta-button {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      background: var(--color-bg);
      color: var(--color-primary);
      text-decoration: none;
      padding: 1.25rem 2.5rem;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 1px;
      transition: all 0.3s ease;
    }

    .cta-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px color-mix(in srgb, var(--color-bg) 30%, transparent);
    }

    .arrow {
      transition: transform 0.3s ease;
    }

    .cta-button:hover .arrow {
      transform: translateX(4px);
    }

    .footer {
      background: var(--color-bg);
      border-top: 1px solid var(--color-border);
      padding: 4rem 2rem 2rem;
    }

    .footer-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .footer-content {
      display: grid;
      grid-template-columns: 1.2fr 2fr;
      gap: 4rem;
      margin-bottom: 3rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      color: var(--color-primary);
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .logo-main {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--color-text);
      letter-spacing: 2px;
      line-height: 1.2;
    }

    .logo-sub {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-primary);
      letter-spacing: 3px;
    }

    .brand-description {
      font-size: 0.9rem;
      color: var(--color-text-secondary);
      line-height: 1.7;
      margin: 0 0 1.5rem 0;
      max-width: 320px;
    }

    .social-links {
      display: flex;
      gap: 0.75rem;
    }

    .social-link {
      width: 40px;
      height: 40px;
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .social-link svg {
      width: 18px;
      height: 18px;
    }

    .social-link:hover {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: var(--color-bg);
      transform: translateY(-3px);
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }

    .link-group h4 {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-text);
      margin: 0 0 1.25rem 0;
      letter-spacing: 1px;
    }

    .link-group a {
      display: block;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      text-decoration: none;
      margin-bottom: 0.625rem;
      transition: color 0.2s ease;
    }

    .link-group a:hover {
      color: var(--color-primary);
    }

    .contact-item {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }

    .contact-item svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      margin-top: 2px;
      color: var(--color-primary);
    }

    .schedule-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.625rem;
      font-size: 0.875rem;
    }

    .day {
      color: var(--color-text-secondary);
    }

    .time {
      color: var(--color-text);
      font-weight: 500;
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 2rem;
      border-top: 1px solid var(--color-border);
    }

    .footer-bottom p {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin: 0;
    }

    .back-to-top {
      width: 40px;
      height: 40px;
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--color-text-secondary);
      transition: all 0.3s ease;
    }

    .back-to-top svg {
      width: 18px;
      height: 18px;
    }

    .back-to-top:hover {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: var(--color-bg);
    }

    @media (max-width: 968px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 3rem;
      }

      .footer-links {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 576px) {
      .cta-section {
        padding: 4rem 1.5rem;
      }

      .cta-button {
        width: 100%;
        justify-content: center;
      }

      .footer-links {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CtaComponent {
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
