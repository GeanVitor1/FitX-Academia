using FitX.Domain.Enums;

namespace FitX.Application.DTOs;

public class MensalidadeDto
{
    public Guid Id { get; set; }
    public Guid AlunoId { get; set; }
    public string AlunoNome { get; set; } = string.Empty;
    public Guid PlanoId { get; set; }
    public string PlanoNome { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public DateTime DataVencimento { get; set; }
    public DateTime? PagoEm { get; set; }
    public StatusMensalidade Status { get; set; }
    public string? Observacao { get; set; }
    public decimal TotalPago { get; set; }
    public decimal Saldo { get; set; }
}

public class CreateMensalidadeDto
{
    public Guid AlunoId { get; set; }
    public Guid PlanoId { get; set; }
    public decimal Valor { get; set; }
    public DateTime DataVencimento { get; set; }
    public string? Observacao { get; set; }
}

public class PagamentoDto
{
    public Guid Id { get; set; }
    public Guid MensalidadeId { get; set; }
    public MetodoPagamento Metodo { get; set; }
    public decimal Valor { get; set; }
    public DateTime Data { get; set; }
    public string? Comprovante { get; set; }
    public StatusPagamento Status { get; set; }
}

public class CreatePagamentoDto
{
    public Guid MensalidadeId { get; set; }
    public MetodoPagamento Metodo { get; set; }
    public decimal Valor { get; set; }
    public string? Comprovante { get; set; }
}

public class CheckinDto
{
    public Guid Id { get; set; }
    public Guid AlunoId { get; set; }
    public string AlunoNome { get; set; } = string.Empty;
    public DateTime DataEntrada { get; set; }
    public DateTime? DataSaida { get; set; }
    public StatusCheckin Status { get; set; }
}

public class AulaDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public Guid ProfessorId { get; set; }
    public string ProfessorNome { get; set; } = string.Empty;
    public TimeSpan Horario { get; set; }
    public string DiasSemana { get; set; } = string.Empty;
    public int Vagas { get; set; }
    public int VagasOcupadas { get; set; }
    public bool Ativa { get; set; }
    public string? Descricao { get; set; }
}

public class CreateAulaDto
{
    public string Nome { get; set; } = string.Empty;
    public Guid ProfessorId { get; set; }
    public TimeSpan Horario { get; set; }
    public string DiasSemana { get; set; } = string.Empty;
    public int Vagas { get; set; }
    public string? Descricao { get; set; }
}

public class AgendamentoDto
{
    public Guid Id { get; set; }
    public Guid AlunoId { get; set; }
    public string AlunoNome { get; set; } = string.Empty;
    public Guid AulaId { get; set; }
    public string AulaNome { get; set; } = string.Empty;
    public DateTime Data { get; set; }
    public StatusAgendamento Status { get; set; }
}

public class CreateAgendamentoDto
{
    public Guid AlunoId { get; set; }
    public Guid AulaId { get; set; }
    public DateTime Data { get; set; }
}

public class NotificacaoDto
{
    public Guid Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Mensagem { get; set; } = string.Empty;
    public bool Lida { get; set; }
    public string? Link { get; set; }
    public DateTime CriadaEm { get; set; }
}

public class CreateNotificacaoDto
{
    public Guid UsuarioId { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Mensagem { get; set; } = string.Empty;
    public string? Link { get; set; }
}

public class DashboardDto
{
    public int TotalAlunos { get; set; }
    public int AlunosAtivos { get; set; }
    public int NovasMatriculasMes { get; set; }
    public decimal ReceitaMensal { get; set; }
    public int TotalCheckinsHoje { get; set; }
    public int AulasHoje { get; set; }
    public int MensalidadesPendentes { get; set; }
    public int NotificacoesNaoLidas { get; set; }
    public IEnumerable<RecenteAtividadeDto> AtividadesRecentes { get; set; } = new List<RecenteAtividadeDto>();
}

public class RecenteAtividadeDto
{
    public string Tipo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public DateTime Data { get; set; }
}

public class RelatorioFinanceiroDto
{
    public decimal ReceitaTotal { get; set; }
    public decimal ReceitaMensal { get; set; }
    public int TotalPagamentos { get; set; }
    public int PagamentosPendentes { get; set; }
    public IEnumerable<MensalidadePorMesDto> ReceitaPorMes { get; set; } = new List<MensalidadePorMesDto>();
    public IEnumerable<PlanoMaisVendidoDto> PlanosMaisVendidos { get; set; } = new List<PlanoMaisVendidoDto>();
}

public class MensalidadePorMesDto
{
    public string Mes { get; set; } = string.Empty;
    public decimal Valor { get; set; }
}

public class PlanoMaisVendidoDto
{
    public string PlanoNome { get; set; } = string.Empty;
    public int TotalMatriculas { get; set; }
    public decimal Receita { get; set; }
}
