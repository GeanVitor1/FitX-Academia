# Arquitetura — FitX Academia

Documento resumido para quem clona o repositório ou avalia o projeto em portfólio.

## Visão em camadas (back-end)

```text
┌─────────────────────────────────────────────┐
│                 FitX.API                    │  HTTP, Swagger, middlewares, seed
├─────────────────────────────────────────────┤
│              FitX.Application               │  Services, DTOs, validators
├──────────────────────┬──────────────────────┤
│   FitX.Identity      │ FitX.Infrastructure  │  Auth JWT · hubs/integrações
├──────────────────────┴──────────────────────┤
│              FitX.Persistence               │  EF Core, repositórios, migrations
├─────────────────────────────────────────────┤
│                FitX.Domain                  │  Entities, enums, interfaces
└─────────────────────────────────────────────┘
```

### Responsabilidades

| Projeto | Responsabilidade |
|---------|------------------|
| **Domain** | Regras e modelos de negócio; sem dependência de framework web |
| **Application** | Orquestra casos de uso; DTOs de entrada/saída |
| **Persistence** | Implementa repositórios; `FitXDbContext`; migrations |
| **Identity** | Login, registro, refresh token, claims/roles |
| **API** | Controllers REST; pipeline HTTP; seed de demo |
| **Infrastructure** | Serviços transversais (ex.: SignalR hub) |

### Fluxo típico de uma requisição

1. Cliente Angular chama `http://localhost:5169/api/...` com `Authorization: Bearer`
2. Middleware/JWT valida o token
3. Controller recebe o DTO e chama um **Service** da Application
4. Service usa **repositórios / DbContext** e retorna `ResponseDto<T>`
5. Front trata sucesso no componente e erros no **error interceptor** (toast)

## Front-end (Angular)

```text
src/fitx-web/src/app/
├── core/           # auth, guards, interceptors, models, HTTP services
├── shared/         # toast, diretivas, dados estáticos
├── layout/         # sidebar + shell autenticado
├── modules/        # features por área (landing, treinos, check-in...)
└── theme/          # tema claro/escuro
```

### Padrões usados

- **Standalone components** + **lazy loading** por rota
- **AuthGuard** + `data: { roles: [...] }` por rota
- **Signals** em vários componentes de UI
- **Interceptors**: anexa JWT; exibe erros amigáveis; refresh em 401
- Landing pública separada do shell autenticado

### Perfis (roles)

| Role | Exemplos de acesso |
|------|--------------------|
| `Aluno` | Treinos, check-in (solicitar), agenda, pagamentos |
| `Professor` | Painel, criar treino/avaliação, alunos |
| `Recepcionista` | Fila de check-in, cadastro, pagamentos balcão |
| `Financeiro` | Mensalidades, dashboard financeiro |
| `Admin` | Administração, planos, equipamentos, visão ampla |

## Check-in (fluxo de negócio)

```text
Aluno                  API                   Recepção
  │                     │                       │
  │── POST request ────►│                       │
  │   (Pendente)        │                       │
  │◄── status ──────────│                       │
  │  poll ~2s           │                       │
  │                     │◄── GET pending ───────│  poll ~3s
  │                     │── approve/deny ───────│
  │◄── Aprovado ────────│                       │
  │  (UI atualiza)      │                       │
```

- Aluno **sem** solicitação: sem polling
- Aluno **pendente**: polling rápido só do status
- Staff: polling da fila de pendentes; lista de presentes em intervalo maior
- Aba em segundo plano: polling pausado

## Persistência

- **Development**: SQLite (`Data Source=FitX.db`) para zero fricção
- **Docker compose**: opção com SQL Server (e Redis no compose legado)
- Migrations em `FitX.Persistence/Migrations`
- Seed de usuários demo no `Program.cs` da API

## Segurança (resumo)

- Senhas via Identity (hash)
- JWT de acesso + refresh
- Rotas Angular protegidas por role (front) — API também deve validar claims
- Contas `*@fitx.com` / senha `1234` são **apenas demo**

## Como evoluir

Sugestões naturais para o portfólio:

1. Testes de integração na API (auth + check-in)
2. Testes unitários no guard Angular e nos services críticos
3. Deploy público (API + front) com variáveis de ambiente
4. WebSocket/SignalR no check-in no lugar do polling
5. CI green em todo PR (build API + build Angular)
