# FitX Web

Front-end Angular 21 do **FitX — Smart Gym Management**.

Monorepo pai: [FitX-Academia](https://github.com/GeanVitor1/FitX-Academia)

## Desenvolvimento

```bash
# Na raiz do monorepo, suba a API primeiro:
#   dotnet run --project src/FitX.API
#   → http://localhost:5169

npm install
npm start
# → http://localhost:4200
```

API configurada em `src/environments/environment.ts`:

```ts
apiUrl: 'http://localhost:5169/api'
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm start` | Dev server |
| `npm run build` | Build de produção |
| `npm test` | Vitest |
| `npm run format` | Prettier |

## Estrutura

```text
src/app/
├── core/       # Auth, guards, interceptors, services HTTP, models
├── shared/     # Toast, diretivas, dados
├── layout/     # Shell com sidebar
├── modules/    # Features (landing, treinos, check-in, admin...)
└── theme/      # Dark / light
```

## Contas demo

Use a seção **Demo** na landing ou faça login com:

| E-mail | Senha | Role |
|--------|-------|------|
| admin@fitx.com | 1234 | Admin |
| prof@fitx.com | 1234 | Professor |
| aluno@fitx.com | 1234 | Aluno |
| recepcao@fitx.com | 1234 | Recepcionista |
| financeiro@fitx.com | 1234 | Financeiro |

## Docker

```bash
docker build -t fitx-web .
# Ou via compose na raiz do monorepo
```

Documentação completa do produto: [README raiz](../../README.md) · [Arquitetura](../../docs/ARCHITECTURE.md)
