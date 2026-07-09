# Contribuindo para o FitX

Obrigado por considerar contribuir com o FitX! Este guia vai ajudar você a começar.

## Código de Conduta

Este projeto adota um Código de Conduta. Ao participar, você concorda em manter um ambiente respeitoso e colaborativo.

## Como Contribuir

### Reportando Bugs

1. Verifique se o bug já não foi reportado nas [Issues](https://github.com/GeanVitor1/FitX-Academia/issues)
2. Abra uma nova issue com um título claro e descrição detalhada
3. Inclua passos para reproduzir, comportamento esperado vs atual, e screenshots se possível

### Sugerindo Features

1. Abra uma issue com o título começando por "Feature:"
2. Descreva a funcionalidade desejada e o caso de uso
3. Se possível, inclua exemplos de como a funcionalidade funcionaria

### Pull Requests

1. Fork o repositório
2. Crie uma branch descritiva (`git checkout -b feature/minha-feature`)
3. Faça commits atômicos e com mensagens claras
4. Mantenha seu branch atualizado com a `main`
5. Execute os testes localmente antes de abrir o PR
6. Abra o Pull Request para a branch `main`

### Padrões de Código

- **C#**: Siga as convenções do .NET (PascalCase para métodos/classes, camelCase para parâmetros)
- **TypeScript**: Siga o estilo do Angular (prettier + eslint configurados)
- **Commits**: Use mensagens claras no imperativo ("Adiciona funcionalidade X" e não "Adicionado funcionalidade X")
- **Testes**: Inclua testes para novas funcionalidades quando aplicável

## Ambiente de Desenvolvimento

```bash
# Back-end (terminal 1) — http://localhost:5169
dotnet restore FitX.sln
dotnet run --project src/FitX.API

# Front-end (terminal 2) — http://localhost:4200
cd src/fitx-web
npm install
npm start
```

Contas demo e roteiro de demonstração: [docs/DEMO.md](docs/DEMO.md) · arquitetura: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Dúvidas?

Abra uma issue ou entre em contato através do [GitHub](https://github.com/GeanVitor1/FitX-Academia).
