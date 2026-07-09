import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NotificacoesService } from '../core/services/notificacoes.service';
import { ThemeService } from '../theme/theme.service';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  template: `
    <div class="layout" [class.sidebar-collapsed]="sidebarCollapsed()">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo">
            <span class="logo-icon">F</span>
            @if (!sidebarCollapsed()) {
              <span class="logo-text">FitX</span>
            }
          </div>
          <button class="collapse-toggle" (click)="toggleSidebar()" [attr.aria-label]="sidebarCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'">
            @if (sidebarCollapsed()) {
              <span class="toggle-icon">›</span>
            } @else {
              <span class="toggle-icon">‹</span>
            }
          </button>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" [title]="sidebarCollapsed() ? 'Dashboard' : ''">
            <span class="nav-icon">◈</span>
            @if (!sidebarCollapsed()) {
              <span class="nav-text">Dashboard</span>
            }
          </a>

          @if (authService.isAdmin() || authService.isProfessor()) {
            <a routerLink="/alunos" routerLinkActive="active" class="nav-item" [title]="sidebarCollapsed() ? 'Alunos' : ''">
              <span class="nav-icon">◉</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-text">Alunos</span>
              }
            </a>
          }

          @if (authService.isProfessor()) {
            <a routerLink="/professor" routerLinkActive="active" class="nav-item" [title]="sidebarCollapsed() ? 'Professor' : ''">
              <span class="nav-icon">◎</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-text">Professor</span>
              }
            </a>
          }

          @if (authService.isAdmin()) {
            <a routerLink="/professores" routerLinkActive="active" class="nav-item" [title]="sidebarCollapsed() ? 'Professores' : ''">
              <span class="nav-icon">◎</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-text">Professores</span>
              }
            </a>
          }

          @if (authService.isAluno()) {
            <a routerLink="/treinos" routerLinkActive="active" class="nav-item" [title]="sidebarCollapsed() ? 'Treinos' : ''">
              <span class="nav-icon">◆</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-text">Treinos</span>
              }
            </a>
          }

          @if (authService.isAdmin() || authService.isProfessor() || authService.isRecepcionista() || authService.isAluno()) {
            <a routerLink="/checkin" routerLinkActive="active" class="nav-item" [title]="sidebarCollapsed() ? 'Check-in' : ''">
              <span class="nav-icon">◇</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-text">Check-in</span>
              }
            </a>
          }

          @if (authService.isProfessor()) {
            <a routerLink="/agenda" routerLinkActive="active" class="nav-item" [title]="sidebarCollapsed() ? 'Agenda' : ''">
              <span class="nav-icon">▣</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-text">Agenda</span>
              }
            </a>
          }

          @if (authService.isAluno()) {
            <a routerLink="/historico" routerLinkActive="active" class="nav-item" [title]="sidebarCollapsed() ? 'Histórico' : ''">
              <span class="nav-icon">▤</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-text">Histórico</span>
              }
            </a>
          }

          @if (authService.isAdmin()) {
            <div class="nav-divider"></div>
            <span class="nav-section">Administração</span>

            <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-item" [title]="sidebarCollapsed() ? 'Admin' : ''">
              <span class="nav-icon">⚙</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-text">Administração</span>
              }
            </a>

            <a routerLink="/admin/planos" routerLinkActive="active" class="nav-item" [title]="sidebarCollapsed() ? 'Planos' : ''">
              <span class="nav-icon">▥</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-text">Planos</span>
              }
            </a>

            <a routerLink="/financeiro" routerLinkActive="active" class="nav-item" [title]="sidebarCollapsed() ? 'Financeiro' : ''">
              <span class="nav-icon">▦</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-text">Financeiro</span>
              }
            </a>

            <a routerLink="/equipamentos" routerLinkActive="active" class="nav-item" [title]="sidebarCollapsed() ? 'Equipamentos' : ''">
              <span class="nav-icon">▧</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-text">Equipamentos</span>
              }
            </a>
          }

          @if (authService.isAdmin() || authService.isFinanceiro()) {
            <div class="nav-divider"></div>
            <span class="nav-section">Financeiro</span>

            <a routerLink="/mensalidades" routerLinkActive="active" class="nav-item" [title]="sidebarCollapsed() ? 'Mensalidades' : ''">
              <span class="nav-icon">▨</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-text">Mensalidades</span>
              }
            </a>
          }

          @if (authService.isAluno()) {
            <a routerLink="/pagamento" routerLinkActive="active" class="nav-item" [title]="sidebarCollapsed() ? 'Pagamento' : ''">
              <span class="nav-icon">▩</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-text">Pagamento</span>
              }
            </a>
          }

          @if (authService.isAdmin() || authService.isRecepcionista()) {
            <a routerLink="/recepcao" routerLinkActive="active" class="nav-item" [title]="sidebarCollapsed() ? 'Recepção' : ''">
              <span class="nav-icon">➪</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-text">Recepção</span>
              }
            </a>
          }

          <div class="nav-divider"></div>

          <a routerLink="/notificacoes" routerLinkActive="active" class="nav-item" [title]="sidebarCollapsed() ? 'Notificações' : ''">
            <span class="nav-icon">⊛</span>
            @if (!sidebarCollapsed()) {
              <span class="nav-text">Notificações</span>
            }
            @if (unreadCount() > 0) {
              <span class="nav-badge">{{ unreadCount() > 99 ? '99+' : unreadCount() }}</span>
            }
          </a>

          <a routerLink="/perfil" routerLinkActive="active" class="nav-item" [title]="sidebarCollapsed() ? 'Perfil' : ''">
            <span class="nav-icon">◎</span>
            @if (!sidebarCollapsed()) {
              <span class="nav-text">Perfil</span>
            }
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="theme-toggle">
            <button class="theme-toggle-btn" (click)="themeService.toggleTheme()" [title]="themeService.isDark() ? 'Modo claro' : 'Modo escuro'">
              <span class="theme-icon">{{ themeService.isDark() ? '☀' : '☾' }}</span>
              @if (!sidebarCollapsed()) {
                <span class="theme-text">{{ themeService.isDark() ? 'Modo Claro' : 'Modo Escuro' }}</span>
              }
            </button>
          </div>
          <div class="user-section">
            <div class="user-avatar">
              {{ getInitials() }}
            </div>
            @if (!sidebarCollapsed()) {
              <div class="user-details">
                <span class="user-name">{{ authService.user()?.name }}</span>
                <span class="user-role">{{ formatRole() }}</span>
              </div>
            }
            <button class="logout-btn" (click)="authService.logout()" [title]="sidebarCollapsed() ? 'Sair' : 'Sair'">
              <span class="logout-icon">⏻</span>
            </button>
          </div>
        </div>
      </aside>

      <main class="main-content">
        <header class="header">
          <div class="header-left">
            <button class="mobile-menu-btn" (click)="toggleSidebar()">
              <span class="menu-icon">☰</span>
            </button>
            <div class="breadcrumb">
              <span class="breadcrumb-root">FitX</span>
            </div>
          </div>
          <div class="header-right">
            <div class="header-user">
              <div class="header-avatar">
                {{ getInitials() }}
              </div>
              <div class="header-user-info">
                <span class="header-user-name">{{ authService.user()?.name }}</span>
                <span class="header-user-role">{{ formatRole() }}</span>
              </div>
            </div>
            <button class="header-logout" (click)="authService.logout()" title="Sair">
              <span class="logout-symbol">⏻</span>
            </button>
          </div>
        </header>

        <div class="content">
          <router-outlet />
        </div>
        <app-footer />
      </main>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :host {
      --black-900: #09090b;
      --black-800: #111113;
      --black-700: #18181b;
      --black-600: #1e1e22;
      --black-500: #27272a;
      --gray-400: #3f3f46;
      --gray-500: #52525b;
      --gray-600: #71717a;
      --gray-700: #a1a1aa;
      --gray-800: #d4d4d8;
      --gray-900: #e4e4e7;
      --green: #c8ff00;
      --green-dim: rgba(200, 255, 0, 0.08);
      --green-hover: rgba(200, 255, 0, 0.12);
      --white: #fafafa;
      --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .layout {
      display: flex;
      min-height: 100vh;
      background: var(--black-900);
      color: var(--gray-700);
      font-family: var(--font);
      font-size: 14px;
      line-height: 1.5;
    }

    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 240px;
      background: var(--black-900);
      border-right: 1px solid var(--black-600);
      display: flex;
      flex-direction: column;
      z-index: 40;
      transition: width 200ms ease;
      overflow: hidden;
    }

    .sidebar-collapsed .sidebar {
      width: 64px;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      padding: 0 16px;
      border-bottom: 1px solid var(--black-600);
      flex-shrink: 0;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--green);
      color: var(--black-900);
      font-weight: 700;
      font-size: 14px;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 700;
      color: var(--white);
      letter-spacing: -0.5px;
    }

    .collapse-toggle {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid var(--black-600);
      border-radius: 6px;
      color: var(--gray-600);
      cursor: pointer;
      transition: all 200ms ease;
      font-size: 16px;
      flex-shrink: 0;
    }

    .collapse-toggle:hover {
      background: var(--black-800);
      color: var(--gray-700);
      border-color: var(--gray-400);
    }

    .toggle-icon {
      font-size: 14px;
      line-height: 1;
    }

    .sidebar-nav {
      flex: 1;
      padding: 12px 8px;
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .sidebar-nav::-webkit-scrollbar {
      width: 4px;
    }

    .sidebar-nav::-webkit-scrollbar-track {
      background: transparent;
    }

    .sidebar-nav::-webkit-scrollbar-thumb {
      background: var(--gray-400);
      border-radius: 2px;
    }

    .nav-section {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 12px 12px 4px;
      white-space: nowrap;
    }

    .nav-divider {
      height: 1px;
      background: var(--black-600);
      margin: 8px 0;
    }

    .nav-item {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      height: 36px;
      padding: 0 12px;
      border-radius: 8px;
      color: var(--gray-600);
      text-decoration: none;
      transition: all 200ms ease;
      cursor: pointer;
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
      white-space: nowrap;
      overflow: visible;
    }

    .nav-item:hover {
      background: var(--black-800);
      color: var(--gray-700);
    }

    .nav-item.active {
      background: var(--green-dim);
      color: var(--green);
    }

    .nav-item.active:hover {
      background: var(--green-hover);
    }

    .nav-icon {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }

    .nav-text {
      font-size: 13px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nav-badge {
      margin-left: auto;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--green);
      color: var(--black-900);
      font-size: 10px;
      font-weight: 700;
      border-radius: 9px;
      line-height: 1;
    }

    .sidebar-collapsed .nav-badge {
      position: absolute;
      top: 4px;
      right: 8px;
      min-width: 14px;
      height: 14px;
      font-size: 9px;
      padding: 0 3px;
    }

    .sidebar-footer {
      padding: 8px;
      border-top: 1px solid var(--black-600);
      flex-shrink: 0;
    }

    .theme-toggle {
      margin-bottom: 8px;
    }

    .theme-toggle-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      height: 36px;
      padding: 0 12px;
      border-radius: 8px;
      border: 1px solid var(--black-600);
      background: transparent;
      color: var(--gray-600);
      cursor: pointer;
      transition: all 200ms ease;
      font-family: var(--font);
    }

    .theme-toggle-btn:hover {
      background: var(--black-800);
      color: var(--gray-700);
      border-color: var(--gray-400);
    }

    .theme-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .theme-text {
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      background: var(--black-800);
      min-height: 56px;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #c8ff00;
      color: #000;
      font-size: 12px;
      font-weight: 700;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .user-details {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--white);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .user-role {
      font-size: 11px;
      color: var(--gray-600);
      text-transform: capitalize;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .logout-btn {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: 6px;
      color: var(--gray-500);
      cursor: pointer;
      transition: all 200ms ease;
      flex-shrink: 0;
    }

    .logout-btn:hover {
      background: var(--black-600);
      color: var(--white);
    }

    .logout-icon {
      font-size: 14px;
    }

    .main-content {
      flex: 1;
      margin-left: 240px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      transition: margin-left 200ms ease;
    }

    .sidebar-collapsed .main-content {
      margin-left: 64px;
    }

    .header {
      position: sticky;
      top: 0;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      background: rgba(9, 9, 11, 0.8);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--black-600);
      z-index: 30;
      flex-shrink: 0;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .mobile-menu-btn {
      display: none;
      width: 36px;
      height: 36px;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid var(--black-600);
      border-radius: 8px;
      color: var(--gray-600);
      cursor: pointer;
      transition: all 200ms ease;
    }

    .mobile-menu-btn:hover {
      background: var(--black-800);
      color: var(--white);
    }

    .menu-icon {
      font-size: 16px;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .breadcrumb-root {
      font-size: 14px;
      font-weight: 600;
      color: var(--white);
      letter-spacing: -0.3px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-action {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid var(--black-600);
      border-radius: 8px;
      color: var(--gray-600);
      cursor: pointer;
      transition: all 200ms ease;
    }

    .header-action:hover {
      background: var(--black-800);
      color: var(--white);
      border-color: var(--gray-400);
    }

    .action-icon {
      font-size: 16px;
    }

    .header-user {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 4px 12px 4px 4px;
      border-radius: 8px;
      border: 1px solid var(--black-600);
      transition: all 200ms ease;
    }

    .header-user:hover {
      background: var(--black-800);
      border-color: var(--gray-400);
    }

    .header-avatar {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #c8ff00;
      color: #000;
      font-size: 12px;
      font-weight: 700;
      border-radius: 6px;
      flex-shrink: 0;
    }

    .header-user-info {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .header-user-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--white);
      line-height: 1.2;
    }

    .header-user-role {
      font-size: 11px;
      color: var(--gray-600);
      text-transform: capitalize;
      line-height: 1.2;
    }

    .header-logout {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid var(--black-600);
      border-radius: 8px;
      color: var(--gray-500);
      cursor: pointer;
      transition: all 200ms ease;
    }

    .header-logout:hover {
      background: var(--black-800);
      color: var(--white);
      border-color: var(--gray-400);
    }

    .logout-symbol {
      font-size: 16px;
    }

    .content {
      flex: 1;
      padding: 32px;
    }

    @media (max-width: 1024px) {
      .sidebar {
        transform: translateX(-100%);
        z-index: 50;
      }

      .sidebar-collapsed .sidebar {
        transform: translateX(0);
        width: 240px;
      }

      .main-content {
        margin-left: 0 !important;
      }

      .mobile-menu-btn {
        display: flex;
      }

      .header-user-info {
        display: none;
      }

      .content {
        padding: 24px 16px;
      }
    }

    @media (max-width: 640px) {
      .sidebar-collapsed .sidebar {
        width: 100%;
      }

      .header {
        padding: 0 16px;
      }

      .header-logout {
        display: none;
      }

      .content {
        padding: 16px;
      }
    }
  `]
})
export class LayoutComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private notificacoesService = inject(NotificacoesService);

  sidebarCollapsed = signal(false);
  unreadCount = signal(0);

  private pollTimer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.loadUnreadCount();
    this.pollTimer = setInterval(() => this.loadUnreadCount(), 60_000);
  }

  ngOnDestroy(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  private loadUnreadCount(): void {
    // silent: badge de fundo não deve spammar toast se falhar
    this.notificacoesService.countNaoLidas({ silent: true }).subscribe({
      next: res => {
        if (res.success && typeof res.data === 'number') {
          this.unreadCount.set(res.data);
        }
      },
      error: () => {
        /* silent: badge is non-critical */
      }
    });
  }

  getInitials(): string {
    const name = this.authService.user()?.name || '';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .filter((_, i, arr) => i === 0 || i === arr.length - 1)
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatRole(): string {
    const role = this.authService.user()?.role || '';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }
}