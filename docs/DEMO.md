# Guia rápido de demonstração — FitX

Use este roteiro em entrevistas, gravação de vídeo ou apresentação do portfólio.

## Preparação (2 min)

1. Suba a API: `dotnet run --project src/FitX.API`
2. Suba o front: `cd src/fitx-web && npm start`
3. Abra [http://localhost:4200](http://localhost:4200)

## Roteiro sugerido (5–8 min)

### 1. Landing (público)
- Mostre a proposta visual e seções (planos, resultados, depoimentos)
- Destaque a área **Demo / acesso rápido**

### 2. Multi-perfil em um clique
- Entre como **Admin** → sidebar e módulos administrativos
- Logout / quick login como **Professor**

### 3. Professor cria valor
- Criar treino para o aluno demo
- (Opcional) criar avaliação física

### 4. Aluno treina
- Login `aluno@fitx.com` / `1234`
- **Meus treinos** → iniciar → marcar séries → **Concluir treino**
- Badge / botão **Treino concluído**

### 5. Check-in (fluxo em tempo quase real)
- Aluno: **Check-in** → Solicitar  
- Nova aba: `recepcao@fitx.com` → aprovar na fila  
- Voltar no aluno: status **aprovado** sem recarregar (polling adaptativo)

### 6. Financeiro / recepção (opcional)
- Mensalidades, pagamento na recepção, dashboard financeiro

## Mensagens-chave para falar

- “Monorepo full stack: Clean Architecture no .NET + Angular multi-role”
- “Guards por role, JWT, interceptors, seed automático”
- “Check-in com polling inteligente: rápido só quando o usuário está esperando”
- “Projeto de portfólio focado em fluxos reais de academia, não só CRUD”

## Contas

| Role | E-mail | Senha |
|------|--------|-------|
| Admin | admin@fitx.com | 1234 |
| Professor | prof@fitx.com | 1234 |
| Aluno | aluno@fitx.com | 1234 |
| Recepção | recepcao@fitx.com | 1234 |
| Financeiro | financeiro@fitx.com | 1234 |
