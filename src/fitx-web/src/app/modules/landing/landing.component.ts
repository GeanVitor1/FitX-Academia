import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
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
            <span class="demo-tag">DEMO</span>
            <h2>Acesse o <span class="highlight">Sistema</span></h2>
            <p>Explore todas as funcionalidades com acesso rapido</p>
          </div>
          <div class="demo-grid">
            @for (account of accounts; track account.role) {
              <button class="demo-card" (click)="quickLogin(account)">
                <span class="demo-icon">{{ account.icon }}</span>
                <span class="demo-role">{{ account.label }}</span>
                <span class="demo-email">{{ account.email }}</span>
                <span class="demo-desc">{{ account.desc }}</span>
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
    @media (max-width: 1024px) { .demo-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px) { .demo-grid { grid-template-columns: 1fr; } .demo-header h2 { font-size: 1.75rem; } }
  `]
})
export class LandingComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  accounts = [
    { role: 'Admin', email: 'admin@fitx.com', password: 'Admin@123', icon: '⚙️', label: 'Admin', desc: 'Painel administrativo completo' },
    { role: 'Professor', email: 'professor@fitx.com', password: 'Professor@123', icon: '🏋️', label: 'Professor', desc: 'Gerenciar alunos e treinos' },
    { role: 'Recepcionista', email: 'recepcionista@fitx.com', password: 'Recepcao@123', icon: '🏢', label: 'Recepcionista', desc: 'Check-in e cadastros' },
    { role: 'Aluno', email: 'aluno@fitx.com', password: 'Aluno@123', icon: '💪', label: 'Aluno', desc: 'Treinos e acompanhamento' }
  ];

  quickLogin(account: { role: string; email: string; password: string }): void {
    this.authService.login({ email: account.email, password: account.password })
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastService.success('Acesso demo: ' + account.role);
            const routes: Record<string, string> = {
              'Admin': '/admin',
              'Professor': '/alunos',
              'Recepcionista': '/recepcao',
              'Aluno': '/dashboard'
            };
            this.router.navigate([routes[account.role] || '/dashboard']);
          } else {
            this.toastService.error('Erro ao acessar demo');
          }
        },
        error: () => {
          this.toastService.error('Erro ao conectar com o servidor');
        }
      });
  }
}
