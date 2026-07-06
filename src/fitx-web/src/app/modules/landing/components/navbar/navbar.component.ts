import { Component, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled()">
      <div class="navbar-container">
        <a class="logo" href="/">
          <svg class="logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6.5 6.5h11M6.5 17.5h11M4 6.5v11M20 6.5v11M2 8v8M22 8v8"/>
          </svg>
          <div class="logo-text">
            <span class="logo-main">FITNESS</span>
            <span class="logo-sub">ACADEMIA</span>
          </div>
        </a>

        <div class="nav-links" [class.active]="menuOpen()">
          <a href="#inicio" class="nav-link">INICIO</a>
          <a href="#planos" class="nav-link">PLANOS</a>
          <a href="#aulas" class="nav-link">AULAS</a>
          <a href="#estrutura" class="nav-link">ESTRUTURA</a>
          <a href="#depoimentos" class="nav-link">DEPOIMENTOS</a>
          <a href="#contato" class="nav-link">CONTATO</a>
        </div>

        <div class="nav-actions">
          <div class="demo-buttons">
            <button class="demo-btn admin" (click)="quickLogin('Admin')" title="Acesso Admin">
              <span>⚙️</span>
            </button>
            <button class="demo-btn professor" (click)="quickLogin('Professor')" title="Acesso Professor">
              <span>🏋️</span>
            </button>
            <button class="demo-btn recepcionista" (click)="quickLogin('Recepcionista')" title="Acesso Recepcionista">
              <span>🏢</span>
            </button>
            <button class="demo-btn aluno" (click)="quickLogin('Aluno')" title="Acesso Aluno">
              <span>💪</span>
            </button>
          </div>
          <a routerLink="/auth/login" class="btn-cta">FACA SEU TESTE →</a>
        </div>

        <button class="menu-toggle" (click)="toggleMenu()" [class.active]="menuOpen()">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </nav>

    @if (menuOpen()) {
      <div class="mobile-menu">
        <div class="mobile-menu-content">
          <a href="#inicio" class="mobile-link" (click)="toggleMenu()">INICIO</a>
          <a href="#planos" class="mobile-link" (click)="toggleMenu()">PLANOS</a>
          <a href="#aulas" class="mobile-link" (click)="toggleMenu()">AULAS</a>
          <a href="#estrutura" class="mobile-link" (click)="toggleMenu()">ESTRUTURA</a>
          <a href="#depoimentos" class="mobile-link" (click)="toggleMenu()">DEPOIMENTOS</a>
          <a href="#contato" class="mobile-link" (click)="toggleMenu()">CONTATO</a>
          <div class="mobile-demo-buttons">
            <button class="mobile-demo-btn" (click)="quickLogin('Admin'); toggleMenu()">⚙️ Admin</button>
            <button class="mobile-demo-btn" (click)="quickLogin('Professor'); toggleMenu()">🏋️ Professor</button>
            <button class="mobile-demo-btn" (click)="quickLogin('Recepcionista'); toggleMenu()">🏢 Recepcionista</button>
            <button class="mobile-demo-btn" (click)="quickLogin('Aluno'); toggleMenu()">💪 Aluno</button>
          </div>
          <a routerLink="/auth/login" class="mobile-cta" (click)="toggleMenu()">FACA SEU TESTE →</a>
        </div>
      </div>
    }
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 1.25rem 2rem;
      transition: all 0.3s ease;
    }
    .navbar.scrolled {
      background: color-mix(in srgb, var(--color-bg) 85%, transparent);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
      padding: 0.75rem 2rem;
    }
    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; }
    .logo-icon { color: var(--color-primary); }
    .logo-text { display: flex; flex-direction: column; }
    .logo-main { font-size: 1.125rem; font-weight: 800; color: var(--color-text); letter-spacing: 3px; line-height: 1; }
    .logo-sub { font-size: 0.625rem; font-weight: 500; color: var(--color-text-secondary); letter-spacing: 4px; line-height: 1; }
    .nav-links { display: flex; align-items: center; gap: 2rem; }
    .nav-link { color: var(--color-text-secondary); text-decoration: none; font-size: 0.75rem; font-weight: 600; letter-spacing: 1.5px; transition: color 0.2s ease; }
    .nav-link:hover { color: var(--color-text); }
    .nav-actions { display: flex; align-items: center; gap: 0.75rem; }
    .demo-buttons { display: flex; gap: 0.5rem; }
    .demo-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid #333;
      background: #111;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.9rem;
    }
    .demo-btn:hover { border-color: #c8ff00; transform: scale(1.1); }
    .demo-btn.admin:hover { box-shadow: 0 0 12px rgba(200, 255, 0, 0.4); }
    .demo-btn.professor:hover { box-shadow: 0 0 12px rgba(59, 130, 246, 0.4); }
    .demo-btn.recepcionista:hover { box-shadow: 0 0 12px rgba(168, 85, 247, 0.4); }
    .demo-btn.aluno:hover { box-shadow: 0 0 12px rgba(34, 197, 94, 0.4); }
    .btn-cta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--color-primary);
      color: var(--color-bg);
      text-decoration: none;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 1px;
      padding: 0.75rem 1.5rem;
      border-radius: 0.375rem;
      transition: all 0.2s ease;
    }
    .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 4px 20px color-mix(in srgb, var(--color-primary) 30%, transparent); }
    .menu-toggle { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 0.5rem; }
    .hamburger-line { display: block; width: 24px; height: 2px; background: var(--color-text); transition: all 0.3s ease; }
    .menu-toggle.active .hamburger-line:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .menu-toggle.active .hamburger-line:nth-child(2) { opacity: 0; }
    .menu-toggle.active .hamburger-line:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
    .mobile-menu {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999;
      background: color-mix(in srgb, var(--color-bg) 98%, transparent);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      display: flex; align-items: center; justify-content: center;
    }
    .mobile-menu-content { display: flex; flex-direction: column; align-items: center; gap: 2rem; }
    .mobile-link { color: var(--color-text); text-decoration: none; font-size: 1.5rem; font-weight: 700; letter-spacing: 3px; transition: color 0.2s ease; }
    .mobile-link:hover { color: var(--color-primary); }
    .mobile-demo-buttons { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }
    .mobile-demo-btn {
      padding: 0.75rem 1.25rem;
      background: #111;
      border: 1px solid #333;
      border-radius: 0.5rem;
      color: #c8ff00;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .mobile-demo-btn:hover { border-color: #c8ff00; background: #1a1a1a; }
    .mobile-cta {
      margin-top: 1rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--color-primary);
      color: var(--color-bg);
      text-decoration: none;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 2px;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
    }
    .mobile-cta:hover { transform: translateY(-2px); box-shadow: 0 4px 20px color-mix(in srgb, var(--color-primary) 30%, transparent); }
    @media (max-width: 1024px) {
      .nav-links, .nav-actions { display: none; }
      .menu-toggle { display: flex; }
    }
  `]
})
export class NavbarComponent {
  isScrolled = signal(false);
  menuOpen = signal(false);

  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  private accounts: Record<string, { email: string; password: string; route: string }> = {
    'Admin': { email: 'admin@fitx.com', password: 'Admin@123', route: '/admin' },
    'Professor': { email: 'professor@fitx.com', password: 'Professor@123', route: '/alunos' },
    'Recepcionista': { email: 'recepcionista@fitx.com', password: 'Recepcao@123', route: '/recepcao' },
    'Aluno': { email: 'aluno@fitx.com', password: 'Aluno@123', route: '/dashboard' }
  };

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 50);
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  quickLogin(role: string): void {
    const account = this.accounts[role];
    if (!account) return;

    this.authService.login({ email: account.email, password: account.password })
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastService.success('Acesso demo: ' + role);
            this.router.navigate([account.route]);
          }
        },
        error: () => {
          this.toastService.error('Erro ao acessar demo');
        }
      });
  }
}
