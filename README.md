<div align="center">
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/.NET-9.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET 9">
  <img src="https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 21">
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="MIT License">
  <br>
  <img src="https://img.shields.io/badge/SQL%20Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white" alt="SQL Server">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
</div>

<br>

<div align="center">
  <h1>🏋️ FitX - Smart Gym Management</h1>
  <p><strong>Sistema completo de gestão para academias</strong></p>
  <p>Landing page cinematográfica • Área do aluno • Painel administrativo • Financeiro</p>
</div>

---

## 📋 Sobre

O **FitX** é uma plataforma full stack para gestão completa de academias, desenvolvida com as tecnologias mais modernas do mercado. Oferece desde uma landing page impactante com animações de alta performance até módulos completos de administração, finanças, treinos e muito mais.

## ✨ Funcionalidades

### 🎬 Landing Page
- Hero section com vídeo em 4K e overlay dinâmico
- Cursor personalizado com animações GSAP
- Estatísticas animadas em tempo real
- Planos em cards 3D com perspectiva
- Carrossel de depoimentos com autoplay
- CTA com partículas interativas
- Timeline de história da academia

### 👤 Área do Aluno
- Dashboard personalizado com treino do dia
- Cronômetro de treino com histórico de séries
- Evolução física com gráficos de progresso
- Agenda de aulas com notificações
- Histórico de pagamentos e mensalidades
- Chat com professores

### 👨‍🏫 Área do Professor
- Dashboard com visão geral dos alunos
- Criação e edição de treinos personalizados
- Avaliações físicas com fotos e medidas
- Chat em tempo real com alunos
- Controle de presença por turma

### 🏢 Área do Recepcionista
- Check-in rápido com leitor de QR Code
- Cadastro ágil de novos alunos
- Renovação e recebimento de mensalidades
- Emissão de carteirinha digital
- Relatório diário de movimentação

### 💰 Área Financeira
- Dashboard financeiro com indicadores-chave
- Gráficos interativos de receita x despesa
- Controle de inadimplência
- Fluxo de caixa diário/mensal/anual
- DRE (Demonstração do Resultado do Exercício)
- Exportação de relatórios (PDF/Excel)

### 🔐 Área Administrativa
- Gestão completa de usuários e permissões
- Logs de auditoria com filtros avançados
- Configurações do sistema (tema, notificações)
- Backup e restore do banco de dados
- Monitoramento de desempenho

## 🚀 Tecnologias

### Front-end
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| Angular | 21 | Framework SPA |
| TailwindCSS | 4 | Estilização utility-first |
| GSAP | 3 | Animações de alta performance |
| Lenis | 1 | Scroll suave |
| ApexCharts | 4 | Gráficos interativos |
| Lucide Icons | — | Iconografia |
| Angular Material | 19 | Componentes de UI |

### Back-end
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| ASP.NET Core | 9 | Web API RESTful |
| Entity Framework Core | 9 | ORM |
| SQL Server | 2022 | Banco de dados relacional |
| Redis | 7 | Cache distribuído |
| SignalR | — | Comunicação em tempo real |
| JWT Bearer | — | Autenticação |
| Swashbuckle | 7 | Documentação OpenAPI |

### Infraestrutura
| Tecnologia | Finalidade |
|------------|------------|
| Docker | Containerização |
| Docker Compose | Orquestração local |
| GitHub Actions | CI/CD |
| Nginx | Proxy reverso |
| Let's Encrypt | SSL/TLS |

## 📁 Estrutura do Projeto

```
FitX/
├── src/
│   ├── FitX.API/                 # Web API (Controllers, Middleware)
│   ├── FitX.Application/         # Camada de aplicação (Services, DTOs)
│   ├── FitX.Domain/              # Camada de domínio (Entities, Interfaces)
│   ├── FitX.Infrastructure/      # Infraestrutura (Upload, Cache, QR Code)
│   ├── FitX.Persistence/         # Persistência (EF Core, Repositories)
│   ├── FitX.Identity/            # Identidade (JWT, Auth, Roles)
│   └── fitx-web/                 # Front-end Angular
│       └── src/app/
│           ├── core/             # Core (Auth, Guards, Interceptors)
│           ├── shared/           # Componentes reutilizáveis
│           ├── layout/           # Layout (Sidebar, Header, Footer)
│           ├── modules/          # Módulos funcionais
│           └── theme/            # Tema (Dark/Light mode)
├── .github/workflows/            # CI/CD pipelines
├── docker-compose.yml            # Orquestração desenvolvimento
├── docker-compose.prod.yml       # Orquestração produção
├── Dockerfile                    # Container back-end
└── Dockerfile.optimized          # Container otimizado
```

## 🛠️ Instalação

### Pré-requisitos

- **Node.js** 20+ ([download](https://nodejs.org/))
- **.NET 9 SDK** ([download](https://dotnet.microsoft.com/download/dotnet/9.0))
- **Docker** (opcional, para containerização)
- **SQL Server** (local ou container)

### Desenvolvimento

```bash
# 1. Clone o repositório
git clone https://github.com/GeanVitor1/FitX-Academia.git
cd FitX-Academia

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 3. Front-end
cd src/fitx-web
npm install
npm start

# 4. Back-end (em outro terminal)
dotnet restore
dotnet run --project src/FitX.API

# Acesse:
# - Front-end: http://localhost:4200
# - API: http://localhost:5000
# - Swagger: http://localhost:5000/swagger
```

### Docker (recomendado)

```bash
# Desenvolvimento
docker-compose up

# Produção
docker-compose -f docker-compose.prod.yml --env-file .env up -d
```

## 🗺️ Rotas

| Rota | Módulo | Descrição |
|------|--------|-----------|
| `/` | Landing | Página inicial |
| `/auth/login` | Auth | Login |
| `/auth/register` | Auth | Cadastro |
| `/dashboard` | Aluno | Dashboard |
| `/treinos` | Aluno | Treinos |
| `/historico` | Aluno | Histórico |
| `/agenda` | Aluno | Agenda |
| `/pagamento` | Aluno | Pagamentos |
| `/professores` | Professor | Painel |
| `/recepcao` | Recepção | Check-in |
| `/financeiro` | Financeiro | Dashboard |
| `/admin` | Admin | Administração |

## 🧪 Testes

```bash
# Back-end
dotnet test

# Front-end
cd src/fitx-web
npm test
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja o [Guia de Contribuição](CONTRIBUTING.md) para detalhes sobre como contribuir.

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Distribuído sob licença MIT. Veja [LICENSE](LICENSE) para mais informações.

## 📬 Contato

Gean Vitor — [geandk36@gmail.com](mailto:geandk36@gmail.com)

---

<div align="center">
  <sub>Feito com ❤️ por <a href="https://github.com/GeanVitor1">Gean Vitor</a></sub>
</div>
