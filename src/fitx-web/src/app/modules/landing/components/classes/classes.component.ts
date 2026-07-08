import { Component, OnDestroy, AfterViewInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ClassItem {
  name: string;
  tagline: string;
  description: string;
  benefits: string[];
  image: string;
  icon: string;
}

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="aulas" class="classes-section">
      <!-- Fixed Background Layer (crossfade) -->
      <div class="bg-layer hidden">
        @for (item of classes; track item.name; let i = $index) {
          <div class="bg-image" [attr.data-bg]="i" [style.backgroundImage]="'url(' + item.image + ')'"></div>
        }
        <div class="bg-overlay"></div>
        <div class="bg-vignette"></div>
      </div>

      <!-- Hero Intro -->
      <div class="classes-hero">
        <div class="hero-content">
          <span class="hero-tag">AULAS</span>
          <h1 class="hero-title">
            <span class="hero-line">AULAS PARA</span>
            <span class="hero-line">TODOS OS</span>
            <span class="hero-line accent">OBJETIVOS</span>
          </h1>
          <p class="hero-subtitle">
            Variedade de modalidades para deixar seu treino mais motivante e eficiente.
          </p>
          <div class="scroll-indicator">
            <div class="scroll-line"></div>
            <span class="scroll-text">Role para explorar</span>
          </div>
        </div>
      </div>

      <!-- Class Sections (content only, no background) -->
      @for (item of classes; track item.name; let i = $index) {
        <div class="class-section" [attr.data-index]="i">
          <div class="class-content">
            <div class="class-content-inner">
              <div class="class-number">
                <span class="number-hash">#</span>
                <span class="number-value">{{ (i + 1).toString().padStart(2, '0') }}</span>
              </div>

              <span class="class-tag">{{ item.name }}</span>

              <h2 class="class-title">{{ item.tagline }}</h2>

              <p class="class-description">{{ item.description }}</p>

              <div class="class-benefits">
                @for (benefit of item.benefits; track benefit) {
                  <div class="benefit-item">
                    <div class="benefit-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <span class="benefit-text">{{ benefit }}</span>
                  </div>
                }
              </div>

              <a href="javascript:void(0)" class="class-cta">
                <span class="cta-text">Começar Agora</span>
                <div class="cta-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      }

      <!-- Progress Indicator -->
      <div class="progress-rail" [class.visible]="showProgress()">
        <div class="progress-track">
          <div class="progress-fill" [style.height]="progressPct() + '%'"></div>
        </div>
        @for (item of classes; track item.name; let i = $index) {
          <div class="progress-dot" [class.active]="i === activeSection()" (click)="scrollToSection(i)">
            <span class="dot-label">{{ item.name }}</span>
          </div>
        }
      </div>

      <!-- Section Counter -->
      <div class="section-counter" [class.visible]="showProgress()">
        <span class="counter-current">{{ (activeSection() + 1).toString().padStart(2, '0') }}</span>
        <span class="counter-sep">/</span>
        <span class="counter-total">{{ classes.length.toString().padStart(2, '0') }}</span>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .classes-section {
      position: relative;
      background: var(--color-bg, #09090b);
    }

    /* ========================
       FIXED BACKGROUND LAYER
    ======================== */
    .bg-layer {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      z-index: 0;
      pointer-events: none;
      opacity: 1;
      transition: opacity 0.5s ease;
    }

    .bg-layer.hidden {
      opacity: 0;
      visibility: hidden;
    }

    .bg-image {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      opacity: 0;
      will-change: opacity, transform;
      transform: scale(1);
    }

    .bg-image:first-child {
      opacity: 1;
    }

    .bg-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(9, 9, 11, 0.7) 0%,
        rgba(9, 9, 11, 0.5) 40%,
        rgba(9, 9, 11, 0.75) 100%
      );
      z-index: 1;
    }

    .bg-vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(
        ellipse at center,
        transparent 40%,
        rgba(9, 9, 11, 0.6) 100%
      );
      z-index: 2;
    }

    /* ========================
       HERO INTRO
    ======================== */
    .classes-hero {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 5;
    }

    .hero-content {
      text-align: center;
      padding: 2rem;
      max-width: 900px;
    }

    .hero-tag {
      display: inline-block;
      background: var(--color-primary-subtle, rgba(200, 255, 0, 0.08));
      border: 1px solid color-mix(in srgb, var(--color-primary, #c8ff00) 25%, transparent);
      color: var(--color-primary, #c8ff00);
      padding: 0.5rem 1.5rem;
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 3px;
      margin-bottom: 2rem;
      opacity: 0;
      transform: translateY(20px);
    }

    .hero-title {
      margin: 0 0 1.5rem 0;
    }

    .hero-line {
      display: block;
      font-size: clamp(3rem, 8vw, 6.5rem);
      font-weight: 900;
      color: var(--color-text, #fafafa);
      line-height: 1;
      letter-spacing: -3px;
      opacity: 0;
      transform: translateY(40px);
    }

    .hero-line.accent {
      color: var(--color-primary, #c8ff00);
    }

    .hero-subtitle {
      font-size: clamp(1rem, 2vw, 1.25rem);
      color: var(--color-text-secondary, #a1a1aa);
      line-height: 1.7;
      margin: 0 auto 3rem;
      max-width: 500px;
      opacity: 0;
      transform: translateY(20px);
    }

    .scroll-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      opacity: 0;
    }

    .scroll-line {
      width: 1px;
      height: 60px;
      background: linear-gradient(180deg, var(--color-primary, #c8ff00), transparent);
      animation: scrollPulse 2s ease-in-out infinite;
    }

    @keyframes scrollPulse {
      0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
      50% { opacity: 1; transform: scaleY(1); }
    }

    .scroll-text {
      font-size: 0.7rem;
      color: var(--color-text-tertiary, #52525b);
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    /* ========================
       CLASS SECTIONS (content only)
    ======================== */
    .class-section {
      position: relative;
      height: 100vh;
      z-index: 5;
      display: flex;
      align-items: center;
    }

    .class-content {
      width: 100%;
      padding: 0 clamp(2rem, 6vw, 8rem);
    }

    .class-content-inner {
      max-width: 640px;
    }

    .class-number {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
      margin-bottom: 1.5rem;
      opacity: 0;
      transform: translateX(-30px);
    }

    .number-hash {
      font-size: 1.5rem;
      font-weight: 300;
      color: color-mix(in srgb, var(--color-primary, #c8ff00) 40%, transparent);
    }

    .number-value {
      font-size: 4rem;
      font-weight: 900;
      color: color-mix(in srgb, var(--color-text, #fafafa) 6%, transparent);
      line-height: 1;
      letter-spacing: -2px;
    }

    .class-tag {
      display: inline-block;
      background: var(--color-primary-subtle, rgba(200, 255, 0, 0.08));
      border: 1px solid color-mix(in srgb, var(--color-primary, #c8ff00) 25%, transparent);
      color: var(--color-primary, #c8ff00);
      padding: 0.4rem 1rem;
      border-radius: 100px;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 3px;
      margin-bottom: 1.5rem;
      opacity: 0;
      transform: translateY(20px);
    }

    .class-title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 800;
      color: var(--color-text, #fafafa);
      line-height: 1.1;
      margin: 0 0 1.25rem 0;
      letter-spacing: -1px;
      opacity: 0;
      transform: translateY(30px);
    }

    .class-description {
      font-size: clamp(0.95rem, 1.5vw, 1.1rem);
      color: var(--color-text-secondary, #a1a1aa);
      line-height: 1.7;
      margin: 0 0 2rem 0;
      max-width: 480px;
      opacity: 0;
      transform: translateY(20px);
    }

    .class-benefits {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 2.5rem;
    }

    .benefit-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      opacity: 0;
      transform: translateX(-20px);
    }

    .benefit-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--color-primary-subtle, rgba(200, 255, 0, 0.08));
      border: 1px solid color-mix(in srgb, var(--color-primary, #c8ff00) 20%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: var(--color-primary, #c8ff00);
    }

    .benefit-icon svg {
      width: 14px;
      height: 14px;
    }

    .benefit-text {
      font-size: 0.9rem;
      color: color-mix(in srgb, var(--color-text, #fafafa) 70%, transparent);
      font-weight: 500;
    }

    .class-cta {
      display: inline-flex;
      align-items: center;
      gap: 1rem;
      background: var(--color-primary, #c8ff00);
      color: var(--color-bg, #09090b);
      padding: 1rem 2rem;
      border-radius: 100px;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.5px;
      transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
      position: relative;
      overflow: hidden;
      opacity: 0;
      transform: translateY(20px);
    }

    .class-cta::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--color-primary-hover, #b3e600);
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .class-cta:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 10px 40px color-mix(in srgb, var(--color-primary, #c8ff00) 30%, transparent);
    }

    .class-cta:hover::before {
      opacity: 1;
    }

    .class-cta:hover .cta-arrow {
      transform: translateX(4px);
    }

    .cta-text {
      position: relative;
      z-index: 1;
    }

    .cta-arrow {
      position: relative;
      z-index: 1;
      width: 20px;
      height: 20px;
      transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .cta-arrow svg {
      width: 100%;
      height: 100%;
    }

    /* ========================
       PROGRESS RAIL
    ======================== */
    .progress-rail {
      position: fixed;
      right: 2rem;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 1.5rem;
      z-index: 100;
      opacity: 0;
      transition: opacity 0.5s ease;
      pointer-events: none;
    }

    .progress-rail.visible {
      opacity: 1;
      pointer-events: all;
    }

    .progress-track {
      position: absolute;
      right: 5px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: color-mix(in srgb, var(--color-text, #fafafa) 8%, transparent);
      border-radius: 1px;
    }

    .progress-fill {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      background: var(--color-primary, #c8ff00);
      border-radius: 1px;
      transition: height 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .progress-dot {
      position: relative;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--color-text, #fafafa) 10%, transparent);
      border: 2px solid color-mix(in srgb, var(--color-text, #fafafa) 15%, transparent);
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
      z-index: 2;
    }

    .progress-dot.active {
      background: var(--color-primary, #c8ff00);
      border-color: var(--color-primary, #c8ff00);
      box-shadow: 0 0 12px color-mix(in srgb, var(--color-primary, #c8ff00) 40%, transparent);
      transform: scale(1.3);
    }

    .dot-label {
      position: absolute;
      right: 24px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.65rem;
      font-weight: 600;
      color: var(--color-text-tertiary, #52525b);
      letter-spacing: 1px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease;
    }

    .progress-dot:hover .dot-label,
    .progress-dot.active .dot-label {
      opacity: 1;
      color: var(--color-primary, #c8ff00);
    }

    /* ========================
       SECTION COUNTER
    ======================== */
    .section-counter {
      position: fixed;
      bottom: 2rem;
      left: 2rem;
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
      z-index: 100;
      opacity: 0;
      transition: opacity 0.5s ease;
      pointer-events: none;
    }

    .section-counter.visible {
      opacity: 1;
    }

    .counter-current {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--color-primary, #c8ff00);
      letter-spacing: -1px;
    }

    .counter-sep {
      font-size: 1rem;
      color: var(--color-text-muted, #3f3f46);
      margin: 0 0.25rem;
    }

    .counter-total {
      font-size: 1rem;
      font-weight: 500;
      color: var(--color-text-tertiary, #52525b);
    }

    /* ========================
       RESPONSIVE
    ======================== */
    @media (max-width: 1024px) {
      .progress-rail {
        right: 1rem;
      }

      .class-content {
        padding: 0 clamp(1.5rem, 4vw, 4rem);
      }
    }

    @media (max-width: 768px) {
      .hero-line {
        letter-spacing: -1px;
      }

      .class-content {
        padding: 0 1.5rem;
      }

      .class-content-inner {
        max-width: 100%;
      }

      .number-value {
        font-size: 3rem;
      }

      .progress-rail {
        right: 0.75rem;
        gap: 1rem;
      }

      .progress-dot {
        width: 8px;
        height: 8px;
      }

      .dot-label {
        display: none;
      }

      .section-counter {
        bottom: 1rem;
        left: 1.5rem;
      }

      .counter-current {
        font-size: 1.2rem;
      }

      .class-benefits {
        gap: 0.5rem;
        margin-bottom: 2rem;
      }

      .benefit-text {
        font-size: 0.8rem;
      }
    }

    @media (max-width: 480px) {
      .class-title {
        font-size: 1.75rem;
      }

      .class-description {
        font-size: 0.9rem;
      }

      .class-cta {
        padding: 0.875rem 1.5rem;
        font-size: 0.85rem;
      }
    }

    /* ========================
       PERFORMANCE
    ======================== */
    @media (prefers-reduced-motion: reduce) {
      .scroll-line {
        animation: none;
      }
    }
  `]
})
export class ClassesComponent implements AfterViewInit, OnDestroy {
  activeSection = signal(0);
  showProgress = signal(false);
  progressPct = computed(() => {
    const total = this.classes.length;
    const current = this.activeSection();
    return ((current + 1) / total) * 100;
  });

  private scrollTriggers: ScrollTrigger[] = [];
  private heroTimeline: gsap.core.Timeline | null = null;

  classes: ClassItem[] = [
    {
      name: 'HIIT',
      tagline: 'QUEIME CALORIAS COM INTENSIDADE',
      description: 'Treinos de alta intensidade que desafiam seus limites, aceleram o metabolismo e transformam seu corpo em menos tempo.',
      benefits: [
        'Queima acelerada de calorias',
        'Melhora cardiovascular extrema',
        'Resultados visíveis em semanas',
        'Treinos dinâmicos e desafiadores'
      ],
      image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=1920&q=80',
      icon: '🔥'
    },
    {
      name: 'SPINNING',
      tagline: 'ENERGIA QUE MOVE SEU CORPO',
      description: 'Aulas coletivas de ciclismo indoor que combinam música envolvente com resistência para queimar gordura e construir resistência.',
      benefits: [
        'Condicionamento cardiovascular',
        'Fortalecimento de pernas',
        'Alta queima de gordura',
        'Experiência imersiva com música'
      ],
      image: 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=1920&q=80',
      icon: '🚴'
    },
    {
      name: 'YOGA',
      tagline: 'EQUILÍBRIO DENTRO E FORA',
      description: 'Conecte corpo e mente através de posturas, respiração e meditação. Encontre paz interior enquanto fortalece seu corpo.',
      benefits: [
        'Flexibilidade e mobilidade',
        'Redução do estresse e ansiedade',
        'Fortalecimento muscular profundo',
        'Conexão mente-corpo'
      ],
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&q=80',
      icon: '🧘'
    },
    {
      name: 'FUNCIONAL',
      tagline: 'MOVIMENTO PARA A VIDA',
      description: 'Exercícios que simulam movimentos do dia a dia, melhorando coordenação, força prática e prevenindo lesões no cotidiano.',
      benefits: [
        'Melhora funcionalidade diária',
        'Prevenção de lesões',
        'Força e coordenação',
        'Adaptação para todos os níveis'
      ],
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&q=80',
      icon: '💪'
    },
    {
      name: 'PILATES',
      tagline: 'FORÇA E CONSCIÊNCIA CORPORAL',
      description: 'Método que desenvolve força, flexibilidade e postura através de movimentos controlados e conscientes, fortalecendo o core.',
      benefits: [
        'Fortalecimento do core',
        'Melhora postural',
        'Controle e precisão de movimento',
        'Reabilitação e prevenção'
      ],
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&q=80',
      icon: '🎯'
    }
  ];

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initHeroAnimation();
      this.initBackgroundCrossfade();
      this.initContentAnimations();
      this.initProgressRail();
    }, 100);
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach(st => st.kill());
    this.heroTimeline?.kill();
    ScrollTrigger.getAll().forEach(st => st.kill());
  }

  scrollToSection(index: number): void {
    const sections = document.querySelectorAll('.class-section');
    if (sections[index]) {
      sections[index].scrollIntoView({ behavior: 'smooth' });
    }
  }

  private initHeroAnimation(): void {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero-tag', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.3
    })
    .to('.hero-line', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12
    }, '-=0.4')
    .to('.hero-subtitle', {
      opacity: 1,
      y: 0,
      duration: 0.7
    }, '-=0.4')
    .to('.scroll-indicator', {
      opacity: 1,
      duration: 0.6
    }, '-=0.2');

    this.heroTimeline = tl;
  }

  private initBackgroundCrossfade(): void {
    const bgImages = document.querySelectorAll('.bg-image');
    const bgLayer = document.querySelector('.bg-layer');
    const sections = document.querySelectorAll('.class-section');

    if (!bgImages.length || !sections.length) return;

    // Start ALL backgrounds hidden - HIIT only appears when first class-section enters
    bgImages.forEach((img) => {
      gsap.set(img, { opacity: 0, scale: 1 });
    });

    // Show bg-layer and HIIT when first class-section enters viewport
    const firstSectionTrigger = ScrollTrigger.create({
      trigger: sections[0],
      start: 'top 85%',
      onEnter: () => {
        if (bgLayer) bgLayer.classList.remove('hidden');
        gsap.to(bgImages[0], { opacity: 1, duration: 0.6, ease: 'power2.inOut' });
      },
      onLeaveBack: () => {
        gsap.to(bgImages[0], { opacity: 0, duration: 0.4, ease: 'power2.inOut' });
        if (bgLayer) bgLayer.classList.add('hidden');
      }
    });
    this.scrollTriggers.push(firstSectionTrigger);

    // Track which bg should be active (prevents overlapping)
    let currentActiveBg = -1;

    const setActiveBg = (index: number) => {
      if (index === currentActiveBg || index < 0 || index >= bgImages.length) return;
      currentActiveBg = index;

      if (bgLayer) bgLayer.classList.remove('hidden');

      bgImages.forEach((img, i) => {
        if (i === index) {
          gsap.to(img, { opacity: 1, duration: 0.5, ease: 'power2.inOut' });
        } else {
          gsap.to(img, { opacity: 0, duration: 0.3, ease: 'power2.inOut' });
        }
      });
    };

    // Set up each section to control its corresponding background
    sections.forEach((section, index) => {
      // When this section is centered, its bg is active
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setActiveBg(index),
        onEnterBack: () => setActiveBg(index)
      });

      // Ken Burns zoom effect on current bg
      const zoomTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });

      zoomTl.fromTo(bgImages[index],
        { scale: 1 },
        { scale: 1.08, ease: 'none' }
      );

      this.scrollTriggers.push(zoomTl.scrollTrigger!);
    });

    // Robust reset: when scroll stops, force correct bg state
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const forceCorrectState = () => {
      const viewportHeight = window.innerHeight;
      let activeIdx = -1;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < viewportHeight * 0.6 && rect.bottom > viewportHeight * 0.4) {
          activeIdx = index;
        }
      });

      if (activeIdx >= 0) {
        setActiveBg(activeIdx);
      } else {
        // If no section is in view, hide all bgs and bg-layer
        bgImages.forEach((img) => {
          gsap.to(img, { opacity: 0, duration: 0.3, ease: 'power2.inOut' });
        });
        if (bgLayer) bgLayer.classList.add('hidden');
        currentActiveBg = -1;
      }
    };

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(forceCorrectState, 100);
    });
  }

  private initContentAnimations(): void {
    const sections = document.querySelectorAll('.class-section');

    sections.forEach((section) => {
      const content = section.querySelector('.class-content-inner') as HTMLElement;
      if (!content) return;

      const number = content.querySelector('.class-number');
      const tag = content.querySelector('.class-tag');
      const title = content.querySelector('.class-title');
      const desc = content.querySelector('.class-description');
      const benefits = content.querySelectorAll('.benefit-item');
      const cta = content.querySelector('.class-cta');

      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
          end: 'top 25%',
          toggleActions: 'play none none reverse'
        }
      });

      if (number) {
        contentTl.to(number, {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power3.out'
        });
      }

      if (tag) {
        contentTl.to(tag, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out'
        }, '-=0.3');
      }

      if (title) {
        contentTl.to(title, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out'
        }, '-=0.3');
      }

      if (desc) {
        contentTl.to(desc, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out'
        }, '-=0.3');
      }

      if (benefits.length) {
        contentTl.to(benefits, {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power3.out'
        }, '-=0.2');
      }

      if (cta) {
        contentTl.to(cta, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out'
        }, '-=0.2');
      }

      this.scrollTriggers.push(contentTl.scrollTrigger!);
    });
  }

  private initProgressRail(): void {
    const firstSection = document.querySelector('.class-section');
    if (!firstSection) return;

    ScrollTrigger.create({
      trigger: firstSection,
      start: 'top 80%',
      onEnter: () => this.showProgress.set(true),
      onLeaveBack: () => this.showProgress.set(false)
    });
  }
}
