namespace FitX.Domain.Enums;

public enum UserRole
{
    Admin = 0,
    Professor = 1,
    Aluno = 2,
    Recepcionista = 3,
    Financeiro = 4
}

public enum StatusAluno
{
    Ativo = 0,
    Inativo = 1,
    Suspenso = 2,
    Pendente = 3
}

public enum StatusPagamento
{
    Pendente = 0,
    Pago = 1,
    Atrasado = 2,
    Cancelado = 3
}

public enum StatusMensalidade
{
    Aberta = 0,
    Paga = 1,
    Atrasada = 2,
    Cancelada = 3
}

public enum MetodoPagamento
{
    PIX = 0,
    CartaoCredito = 1,
    CartaoDebito = 2,
    Boleto = 3,
    Dinheiro = 4
}

public enum StatusCheckin
{
    Presente = 0,
    Saiu = 1
}

public enum StatusAula
{
    Agendada = 0,
    EmAndamento = 1,
    Concluida = 2,
    Cancelada = 3
}

public enum StatusAgendamento
{
    Confirmado = 0,
    Pendente = 1,
    Cancelado = 2,
    Presente = 3
}

public enum TipoHistorico
{
    Matricula = 0,
    Avaliacao = 1,
    Treino = 2,
    Pagamento = 3,
    Checkin = 4,
    Evolucao = 5
}

public enum TipoLog
{
    Create = 0,
    Update = 1,
    Delete = 2,
    Login = 3,
    Logout = 4,
    Access = 5
}

public enum GrupoMuscular
{
    Peito = 0,
    Costas = 1,
    Ombros = 2,
    Biceps = 3,
    Triceps = 4,
    Antebracos = 5,
    Abdomen = 6,
    Gluteos = 7,
    Quadriceps = 8,
    Posterior = 9,
    Panturrilhas = 10,
    FullBody = 11
}
