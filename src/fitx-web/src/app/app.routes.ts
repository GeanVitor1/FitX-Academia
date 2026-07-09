import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./modules/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./modules/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./modules/auth/forgot-password/forgot-password.component').then(
            m => m.ForgotPasswordComponent
          )
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./modules/auth/reset-password/reset-password.component').then(
            m => m.ResetPasswordComponent
          )
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      // Dashboard - todas as roles
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },

      // Aluno
      {
        path: 'treinos',
        loadComponent: () => import('./modules/treinos/treinos.component').then(m => m.TreinosComponent),
        data: { roles: ['Aluno', 'Professor', 'Admin'] }
      },
      {
        path: 'historico',
        loadComponent: () => import('./modules/historico/historico.component').then(m => m.HistoricoComponent),
        data: { roles: ['Aluno'] }
      },
      {
        path: 'agenda',
        loadComponent: () => import('./modules/agenda/agenda.component').then(m => m.AgendaComponent),
        data: { roles: ['Aluno', 'Professor'] }
      },
      {
        path: 'pagamento',
        loadComponent: () => import('./modules/pagamento/pagamento.component').then(m => m.PagamentoComponent),
        data: { roles: ['Aluno'] }
      },
      {
        path: 'checkin',
        loadComponent: () => import('./modules/checkin/checkin.component').then(m => m.CheckinComponent),
        data: { roles: ['Aluno', 'Recepcionista', 'Admin'] }
      },
      {
        path: 'mensalidades',
        loadComponent: () => import('./modules/mensalidades/mensalidades.component').then(m => m.MensalidadesComponent),
        data: { roles: ['Aluno', 'Financeiro', 'Admin'] }
      },

      // Professor
      {
        path: 'professor',
        loadComponent: () => import('./modules/professores/professores.component').then(m => m.ProfessoresComponent),
        data: { roles: ['Professor'] }
      },
      {
        path: 'alunos',
        loadComponent: () => import('./modules/alunos/alunos.component').then(m => m.AlunosComponent),
        data: { roles: ['Professor', 'Admin'] }
      },
      {
        path: 'professores',
        loadComponent: () => import('./modules/professores/professores-admin.component').then(m => m.ProfessoresAdminComponent),
        data: { roles: ['Admin'] }
      },
      {
        path: 'professores/treinos/criar',
        loadComponent: () => import('./modules/professores/components/criar-treino/criar-treino.component').then(m => m.CriarTreinoComponent),
        data: { roles: ['Professor', 'Admin'] }
      },
      {
        path: 'professores/avaliacoes/criar',
        loadComponent: () => import('./modules/professores/components/criar-avaliacao/criar-avaliacao.component').then(m => m.CriarAvaliacaoComponent),
        data: { roles: ['Professor', 'Admin'] }
      },

      // Recepcao
      {
        path: 'recepcao',
        loadComponent: () => import('./modules/recepcao/recepcao.component').then(m => m.RecepcaoComponent),
        data: { roles: ['Recepcionista', 'Admin'] }
      },
      {
        path: 'recepcao/cadastro',
        loadComponent: () => import('./modules/recepcao/components/cadastro-aluno/cadastro-aluno.component').then(m => m.CadastroAlunoComponent),
        data: { roles: ['Recepcionista', 'Admin'] }
      },
      {
        path: 'recepcao/pagamento',
        loadComponent: () => import('./modules/recepcao/components/pagamento-recepcao/pagamento-recepcao.component').then(m => m.PagamentoRecepcaoComponent),
        data: { roles: ['Recepcionista', 'Admin'] }
      },

      // Financeiro
      {
        path: 'financeiro',
        loadComponent: () => import('./modules/financeiro/financeiro.component').then(m => m.FinanceiroComponent),
        data: { roles: ['Financeiro', 'Admin'] }
      },

      // Equipamentos
      {
        path: 'equipamentos',
        loadComponent: () => import('./modules/equipamentos/equipamentos.component').then(m => m.EquipamentosComponent),
        data: { roles: ['Admin', 'Professor'] }
      },

      // Notificacoes
      {
        path: 'notificacoes',
        loadComponent: () => import('./modules/notificacoes/notificacoes.component').then(m => m.NotificacoesComponent),
        data: { roles: ['Aluno', 'Professor', 'Admin', 'Recepcionista', 'Financeiro'] }
      },

      // Perfil
      {
        path: 'perfil',
        loadComponent: () => import('./modules/perfil/perfil.component').then(m => m.PerfilComponent),
        data: { roles: ['Aluno', 'Professor', 'Admin', 'Recepcionista', 'Financeiro'] }
      },

      // Admin
      {
        path: 'admin',
        loadComponent: () => import('./modules/administracao/administracao.component').then(m => m.AdministracaoComponent),
        data: { roles: ['Admin'] }
      },
      {
        path: 'admin/planos',
        loadComponent: () => import('./modules/planos/planos.component').then(m => m.PlanosComponent),
        data: { roles: ['Admin'] }
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./modules/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
