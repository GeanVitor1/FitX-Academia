# Política de Segurança

## Versões Suportadas

| Versão | Suportada |
|--------|-----------|
| 1.x    | ✅        |

## Reportando Vulnerabilidades

Valorizamos a segurança do FitX. Se você descobrir uma vulnerabilidade de segurança, por favor:

1. **Não abra uma issue pública** para evitar exposição indevida
2. Envie um email para [geandk36@gmail.com](mailto:geandk36@gmail.com)
3. Inclua uma descrição detalhada do problema e passos para reproduzir

Responderemos em até 48 horas com um plano de ação.

## Práticas de Segurança

- Autenticação via JWT com refresh tokens
- Senhas hasheadas com BCrypt
- HTTPS obrigatório em produção
- Headers de segurança configurados no Nginx
- Validação de entrada em todas as APIs
- Rate limiting em endpoints sensíveis
