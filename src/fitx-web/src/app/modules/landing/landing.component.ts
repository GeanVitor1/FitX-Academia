import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ScrollAnimateDirective } from '../../shared/directives/scroll-animate.directive';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { PlansComponent } from './components/plans/plans.component';
import { ClassesComponent } from './components/classes/classes.component';
import { StructureComponent } from './components/structure/structure.component';
import { ResultsComponent } from './components/results/results.component';
import { TechComponent } from './components/tech/tech.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { CtaComponent } from './components/cta/cta.component';
import { AuthService } from '../../core/services/auth.service';
import { QuickLoginAccount } from '../../core/models/auth.models';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    ScrollAnimateDirective,
    NavbarComponent,
    HeroComponent,
    PlansComponent,
    ClassesComponent,
    StructureComponent,
    ResultsComponent,
    TechComponent,
    TestimonialsComponent,
    CtaComponent
  ],
  template: `
    <div class="landing-page">
      <app-navbar />
      <app-hero />
      <app-plans />
      <app-classes />
      <app-structure />
      <app-results />
      <app-testimonials />
      <app-tech />
      <app-cta />

      <section class="demo-section">
        <div class="demo-container">
          <div class="demo-header">
            <span class="demo-tag" scrollAnimate animationType="fadeUp">DEMO</span>
            <h2 scrollAnimate animationType="fadeUp" [delay]="0.05">Acesse o <span class="highlight">Sistema</span></h2>
            <p scrollAnimate animationType="fadeUp" [delay]="0.1">Explore todas as funcionalidades com acesso rapido</p>
          </div>
          @if (loading) {
            <div class="demo-loading">Carregando...</div>
          }
          <div class="demo-grid">
            @for (account of accounts; track account.email; let i = $index) {
              <button class="demo-card" (click)="quickLogin(account)" scrollAnimate animationType="fadeUp" [delay]="0.15 + i * 0.08">
                <span class="demo-icon">{{ account.icon }}</span>
                <span class="demo-role">{{ account.role }}</span>
                <span class="demo-email">{{ account.email }}</span>
                <span class="demo-desc">{{ account.nome }}</span>
              </button>
            }
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .landing-page { overflow-x: hidden; }
    .demo-section {
      padding: 6rem 2rem;
      background: #0a0a0a;
      border-top: 1px solid #222;
    }
    .demo-container { max-width: 1200px; margin: 0 auto; }
    .demo-header { text-align: center; margin-bottom: 3rem; }
    .demo-tag {
      display: inline-block;
      background: rgba(200, 255, 0, 0.1);
      color: #c8ff00;
      padding: 0.5rem 1.5rem;
      border-radius: 2rem;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 2px;
      margin-bottom: 1rem;
    }
    .demo-header h2 {
      font-size: 2.5rem;
      font-weight: 800;
      color: #fff;
      margin: 0 0 0.75rem 0;
    }
    .highlight { color: #c8ff00; }
    .demo-header p { color: #666; margin: 0; font-size: 1.125rem; }
    .demo-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
    .demo-card {
      background: #111;
      border: 2px solid #222;
      border-radius: 1rem;
      padding: 2rem 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
    }
    .demo-card:hover {
      border-color: #c8ff00;
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(200, 255, 0, 0.1);
    }
    .demo-icon { font-size: 3rem; }
    .demo-role {
      font-size: 1.125rem;
      font-weight: 700;
      color: #c8ff00;
    }
    .demo-email {
      font-size: 0.8rem;
      color: #555;
      font-family: monospace;
    }
    .demo-desc {
      font-size: 0.8rem;
      color: #666;
      line-height: 1.4;
    }
    .demo-loading {
      text-align: center; color: #666; padding: 3rem; font-size: 1.125rem;
    }
    @media (max-width: 1024px) { .demo-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px) { .demo-grid { grid-template-columns: 1fr; } .demo-header h2 { font-size: 1.75rem; } }
  `]
})
export class LandingComponent implements OnInit {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  accounts: QuickLoginAccount[] = [];
  loading = true;

  ngOnInit(): void {
    this.authService.getQuickLogins().subscribe({
      next: (response) => {
        if (response.success) {
          this.accounts = response.accounts;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  quickLogin(account: QuickLoginAccount): void {
    this.authService.quickLogin(account.email)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastService.success('Acesso: ' + account.nome);
            const routes: Record<string, string> = {
              'Admin': '/admin',
              'Professor': '/alunos',
              'Recepcionista': '/recepcao',
              'Aluno': '/dashboard',
              'Financeiro': '/financeiro'
            };
            this.router.navigate([routes[account.role] || '/dashboard']);
          } else {
            this.toastService.error('Erro ao acessar');
          }
        },
        error: () => {
          this.toastService.error('Erro ao conectar com o servidor');
        }
      });
  }
}
