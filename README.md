<div align="center">

<img src="https://img.shields.io/badge/.NET-9%2F10-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET">
<img src="https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 21">
<img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
<img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="MIT License">

# FitX — Smart Gym Management

**Sistema full stack de gestão para academias**

Landing page · Multi-perfil · Treinos · Check-in · Financeiro · Admin

[Visão geral](#-visão-geral) · [Funcionalidades](#-funcionalidades) · [Stack](#-stack) · [Como rodar](#-como-rodar) · [Demo](#-contas-demo) · [Arquitetura](docs/ARCHITECTURE.md)

</div>

---

## Visão geral

O **FitX** é um monorepo full stack que simula um produto real de academia: do marketing (landing) ao dia a dia operacional (aluno, professor, recepção, financeiro e administração).

Foi construído como **projeto de portfólio** — foco em arquitetura limpa no back-end, SPA Angular moderna no front e fluxos de negócio completos o suficiente para demonstrar domínio e organização de código.

| Camada | O que entrega |
|--------|----------------|
| **Landing** | Página de marketing + acesso demo por perfil |
| **API** | REST + JWT + seed automático de usuários |
| **Web** | SPA multi-role com lazy loading e guards |
| **Dados** | EF Core + SQLite (dev simples, sem setup pesado) |

---

## Funcionalidades

### Landing & auth
- Landing com seções de planos, estrutura, resultados, depoimentos e CTA
- Login, cadastro, esqueci/redefinir senha
- **Quick login** na landing (entra como Admin, Professor, Aluno, etc.)
- JWT + refresh token

### Aluno
- Dashboard e perfil
- **Meus treinos** com modo de execução (timer, contagem de séries, conclusão)
- Agenda / histórico de evolução
- Mensalidades e pagamentos
- **Check-in**: solicita presença e aguarda aprovação da recepção

### Professor
- Painel do professor
- Criação de treinos e avaliações físicas
- Gestão de alunos vinculados

### Recepção
- Fila de **solicitações de check-in** (aprovar / negar)
- Check-in e check-out
- Cadastro de alunos e recebimento de pagamentos

### Financeiro & admin
- Dashboard financeiro e mensalidades
- Gestão de planos, equipamentos e usuários
- Notificações no app

---

## Stack

### Front-end (`src/fitx-web`)
| Tecnologia | Uso |
|------------|-----|
| **Angular 21** | SPA standalone + lazy routes |
| **TypeScript** | Tipagem forte |
| **RxJS** | HTTP e fluxos assíncronos |
| **GSAP** | Animações da landing |
| **ApexCharts** | Gráficos |
| **Nginx** | Serve do build em Docker |

### Back-end (`src/FitX.*`)
| Tecnologia | Uso |
|------------|-----|
| **ASP.NET Core** | Web API |
| **EF Core** | ORM + migrations |
| **SQLite** | Banco em desenvolvimento (arquivo `FitX.db`) |
| **JWT / Identity** | Auth e roles |
| **FluentValidation** | Validação de DTOs |
| **Swagger** | Documentação da API |

### Arquitetura back-end (camadas)
```
FitX.API            → Controllers, middlewares, seed
FitX.Application    → Services, DTOs, validators
FitX.Domain         → Entities, enums, interfaces
FitX.Persistence    → DbContext, repositories, migrations
FitX.Identity       → Login, tokens, JWT
FitX.Infrastructure → Integrações / hubs
```

Detalhes: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## Estrutura do repositório

```text
FitX-Academia/
├── src/
│   ├── FitX.API/              # Host da API
│   ├── FitX.Application/      # Casos de uso
│   ├── FitX.Domain/           # Domínio
│   ├── FitX.Identity/         # Auth
│   ├── FitX.Infrastructure/   # Infra
│   ├── FitX.Persistence/      # EF Core
│   └── fitx-web/              # Angular
│       └── src/app/
│           ├── core/          # Guards, interceptors, services, models
│           ├── shared/        # Toast, diretivas, dados
│           ├── layout/        # Shell autenticado
│           ├── modules/       # Landing, treinos, check-in, admin...
│           └── theme/         # Tema claro/escuro
├── docs/                      # Documentação
├── .github/                   # Issues, PR template, CI
├── docker-compose.yml
├── FitX.sln
└── README.md
```

---

## Como rodar

### Pré-requisitos
- **Node.js** 20+
- **.NET 9 SDK** (ou superior compatível com a solution)
- **npm**
- (Opcional) **Docker** / Docker Compose

### 1. Clone

```bash
git clone https://github.com/GeanVitor1/FitX-Academia.git
cd FitX-Academia
```

### 2. API (terminal 1)

```bash
dotnet restore FitX.sln
dotnet run --project src/FitX.API
```

- API: [http://localhost:5169](http://localhost:5169)
- Swagger: [http://localhost:5169/swagger](http://localhost:5169/swagger)  
- Em Development a connection string usa **SQLite** (`Data Source=FitX.db`).
- Usuários demo são **criados automaticamente** no startup se ainda não existirem.

### 3. Front-end (terminal 2)

```bash
cd src/fitx-web
npm install
npm start
```

- App: [http://localhost:4200](http://localhost:4200)  
- `environment.ts` aponta para `http://localhost:5169/api`

### Docker (opcional)

```bash
# Stack completa (SQL Server + Redis + API + Web) — ver docker-compose.yml
docker-compose up --build
```

> Em desenvolvimento local o caminho mais simples é **API + SQLite + `ng serve`**, sem precisar de SQL Server.

---

## Contas demo

Senha de todos: **`1234`**

| Perfil | E-mail | O que explorar |
|--------|--------|----------------|
| Admin | `admin@fitx.com` | Administração, planos, equipamentos |
| Professor | `prof@fitx.com` | Treinos, avaliações, alunos |
| Aluno | `aluno@fitx.com` | Treinos, check-in, agenda, pagamentos |
| Recepção | `recepcao@fitx.com` | Aprovar check-in, cadastro, caixa |
| Financeiro | `financeiro@fitx.com` | Mensalidades e dashboard financeiro |

Na **landing** (`/`) use a seção **Demo / Acesso rápido** para entrar em um clique.

### Fluxo recomendado para demonstração
1. Entre como **Aluno** → **Check-in** → solicite presença  
2. Em outra aba/janela, entre como **Recepção** → aprove a solicitação  
3. Volte no aluno e veja o status atualizado  
4. Entre como **Professor** → crie um treino  
5. Como **Aluno** → inicie o treino, marque séries e conclua  

---

## Módulos (rotas principais)

| Rota | Perfis | Descrição |
|------|--------|-----------|
| `/` | Público | Landing + quick login |
| `/auth/login` | Público | Login |
| `/dashboard` | Todos autenticados | Início |
| `/treinos` | Aluno, Professor, Admin | Treinos |
| `/checkin` | Aluno, Recepção, Admin | Check-in / fila |
| `/agenda` | Aluno, Professor | Agenda |
| `/historico` | Aluno | Evolução física |
| `/pagamento` / `/mensalidades` | Aluno / Financeiro | Financeiro do aluno |
| `/professor` | Professor | Painel |
| `/professores/treinos/criar` | Professor, Admin | Montar treino |
| `/recepcao` | Recepção, Admin | Operação de balcão |
| `/financeiro` | Financeiro, Admin | Dashboard financeiro |
| `/admin` | Admin | Administração |
| `/equipamentos` | Admin, Professor | Equipamentos |

---

## Scripts úteis

```bash
# Front-end
cd src/fitx-web
npm start                 # dev server
npm run build             # build produção
npm test                  # Vitest

# Back-end
dotnet build FitX.sln
dotnet run --project src/FitX.API
```

---

## Destaques técnicos (portfólio)

- **Clean Architecture** no .NET (Domain → Application → API/Persistence)
- **Multi-role** com `AuthGuard` + `data.roles` nas rotas Angular
- Interceptors de **JWT** e de **erro com toast** amigável
- Check-in com **polling adaptativo** (rápido só enquanto aguarda aprovação)
- Seed de usuários e dados demo no startup
- Dockerfiles (API e Angular) + compose
- Templates de issue/PR e workflow em `.github/`

---

## Status do projeto

Este repositório é um **exemplo de portfólio em evolução**. Nem todo item de um SaaS de academia em produção está implementado (ex.: pagamentos reais, app mobile, realtime em todos os fluxos). O objetivo é demonstrar:

- organização full stack  
- fluxos multi-perfil reais  
- UI moderna e API tipada  

Sugestões e PRs são bem-vindos — veja [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Segurança

Relatos de vulnerabilidade: [SECURITY.md](SECURITY.md).  
**Não use as senhas demo em produção.**

---

## Licença

Distribuído sob a licença **MIT**. Veja [LICENSE](LICENSE).

---

## Autor

**Gean Vitor**  
- GitHub: [GeanVitor1](https://github.com/GeanVitor1)  
- E-mail: [geandk36@gmail.com](mailto:geandk36@gmail.com)  
- Repositório: [FitX-Academia](https://github.com/GeanVitor1/FitX-Academia)

---

<div align="center">
  <sub>Feito para demonstrar engenharia full stack — Angular + .NET</sub>
</div>
