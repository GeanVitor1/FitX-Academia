using FitX.Application.DTOs;
using FitX.Domain.Entities;
using FitX.Domain.Enums;
using FitX.Domain.Interfaces;

namespace FitX.Application.Services;

public class DashboardService
{
    private readonly IAlunoRepository _alunoRepository;
    private readonly ICheckinRepository _checkinRepository;
    private readonly IMensalidadeRepository _mensalidadeRepository;
    private readonly IAulaRepository _aulaRepository;
    private readonly INotificacaoRepository _notificacaoRepository;
    private readonly IRepository<Pagamento> _pagamentoRepository;

    public DashboardService(
        IAlunoRepository alunoRepository,
        ICheckinRepository checkinRepository,
        IMensalidadeRepository mensalidadeRepository,
        IAulaRepository aulaRepository,
        INotificacaoRepository notificacaoRepository,
        IRepository<Pagamento> pagamentoRepository)
    {
        _alunoRepository = alunoRepository;
        _checkinRepository = checkinRepository;
        _mensalidadeRepository = mensalidadeRepository;
        _aulaRepository = aulaRepository;
        _notificacaoRepository = notificacaoRepository;
        _pagamentoRepository = pagamentoRepository;
    }

    public async Task<ResponseDto<DashboardDto>> GetDashboardAsync(Guid? usuarioId = null, string? role = null)
    {
        var dashboard = new DashboardDto();

        if (role == UserRole.Admin.ToString() || role == UserRole.Financeiro.ToString() || role == UserRole.Recepcionista.ToString())
        {
            var todosAlunos = await _alunoRepository.GetAllAsync();
            var alunos = todosAlunos.ToList();
            dashboard.TotalAlunos = alunos.Count;
            dashboard.AlunosAtivos = alunos.Count(a => a.Status == StatusAluno.Ativo);

            var inicioMes = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
            dashboard.NovasMatriculasMes = alunos.Count(a => a.DataMatricula >= inicioMes);

            var mensalidades = await _mensalidadeRepository.GetByStatusAsync(StatusMensalidade.Paga);
            dashboard.ReceitaMensal = mensalidades
                .Where(m => m.PagoEm.HasValue && m.PagoEm.Value >= inicioMes)
                .Sum(m => m.Valor);

            var checkinsHoje = await _checkinRepository.GetActiveCheckinsAsync();
            dashboard.TotalCheckinsHoje = checkinsHoje.Count();

            var aulas = await _aulaRepository.GetAllWithProfessorAsync();
            dashboard.AulasHoje = aulas.Count();

            var mensalidadesAbertas = await _mensalidadeRepository.GetByStatusAsync(StatusMensalidade.Aberta);
            var mensalidadesAtrasadas = await _mensalidadeRepository.GetByStatusAsync(StatusMensalidade.Atrasada);
            dashboard.MensalidadesPendentes = mensalidadesAbertas.Count() + mensalidadesAtrasadas.Count();

            if (usuarioId.HasValue)
                dashboard.NotificacoesNaoLidas = await _notificacaoRepository.CountNaoLidasAsync(usuarioId.Value);

            var pagamentos = await _pagamentoRepository.GetAllAsync();
            dashboard.AtividadesRecentes = pagamentos
                .OrderByDescending(p => p.Data)
                .Take(10)
                .Select(p => new RecenteAtividadeDto
                {
                    Tipo = "Pagamento",
                    Descricao = $"Pagamento de {p.Valor:C} registrado",
                    Data = p.Data
                });
        }
        else if (role == UserRole.Professor.ToString() && usuarioId.HasValue)
        {
            var alunos = await _alunoRepository.GetByProfessorIdAsync(usuarioId.Value);
            var alunosList = alunos.ToList();
            dashboard.TotalAlunos = alunosList.Count;
            dashboard.AlunosAtivos = alunosList.Count;

            var checkinsHoje = await _checkinRepository.GetActiveCheckinsAsync();
            dashboard.TotalCheckinsHoje = checkinsHoje.Count();

            var aulas = await _aulaRepository.GetAllWithProfessorAsync();
            dashboard.AulasHoje = aulas.Count(a => a.ProfessorId == usuarioId);

            dashboard.NotificacoesNaoLidas = await _notificacaoRepository.CountNaoLidasAsync(usuarioId.Value);
        }
        else if (role == UserRole.Aluno.ToString() && usuarioId.HasValue)
        {
            var checkins = await _checkinRepository.GetByAlunoIdAsync(usuarioId.Value);
            dashboard.TotalCheckinsHoje = checkins.Count(c => c.DataEntrada.Date == DateTime.UtcNow.Date);

            dashboard.NotificacoesNaoLidas = await _notificacaoRepository.CountNaoLidasAsync(usuarioId.Value);
        }

        return ResponseDto<DashboardDto>.SuccessResult(dashboard);
    }
}
