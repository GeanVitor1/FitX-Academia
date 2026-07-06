using FitX.Application.DTOs;
using FitX.Domain.Entities;
using FitX.Domain.Enums;
using FitX.Domain.Interfaces;

namespace FitX.Application.Services;

public class RelatorioService
{
    private readonly IMensalidadeRepository _mensalidadeRepository;
    private readonly IPagamentoRepository _pagamentoRepository;
    private readonly IAlunoRepository _alunoRepository;
    private readonly IRepository<Plano> _planoRepository;

    public RelatorioService(
        IMensalidadeRepository mensalidadeRepository,
        IPagamentoRepository pagamentoRepository,
        IAlunoRepository alunoRepository,
        IRepository<Plano> planoRepository)
    {
        _mensalidadeRepository = mensalidadeRepository;
        _pagamentoRepository = pagamentoRepository;
        _alunoRepository = alunoRepository;
        _planoRepository = planoRepository;
    }

    public async Task<ResponseDto<RelatorioFinanceiroDto>> GetRelatorioFinanceiroAsync(DateTime inicio, DateTime fim)
    {
        var todosPagamentos = await _pagamentoRepository.GetAllWithDetailsAsync();
        var pagamentos = todosPagamentos.Where(p => p.Data >= inicio && p.Data <= fim).ToList();

        var todasMensalidades = await _mensalidadeRepository.GetByStatusAsync(StatusMensalidade.Paga);
        var mensalidadesPagas = todasMensalidades.Where(m => m.PagoEm.HasValue && m.PagoEm.Value >= inicio && m.PagoEm.Value <= fim).ToList();

        var mensalidadesAbertas = await _mensalidadeRepository.GetByStatusAsync(StatusMensalidade.Aberta);
        var mensalidadesAtrasadas = await _mensalidadeRepository.GetByStatusAsync(StatusMensalidade.Atrasada);

        var receitaPorMes = pagamentos
            .GroupBy(p => new { p.Data.Year, p.Data.Month })
            .Select(g => new MensalidadePorMesDto
            {
                Mes = $"{g.Key.Month:D2}/{g.Key.Year}",
                Valor = g.Sum(p => p.Valor)
            })
            .OrderBy(m => m.Mes)
            .ToList();

        var alunos = await _alunoRepository.GetAllAsync();
        var alunosList = alunos.ToList();

        var planos = await _planoRepository.GetAllAsync();
        var planosList = planos.ToList();

        var planosMaisVendidos = planosList
            .Select(p => new PlanoMaisVendidoDto
            {
                PlanoNome = p.Nome,
                TotalMatriculas = alunosList.Count(a => a.PlanoId == p.Id),
                Receita = mensalidadesPagas
                    .Where(m => m.PlanoId == p.Id)
                    .Sum(m => m.Valor)
            })
            .Where(p => p.TotalMatriculas > 0)
            .OrderByDescending(p => p.TotalMatriculas)
            .ToList();

        var relatorio = new RelatorioFinanceiroDto
        {
            ReceitaTotal = pagamentos.Sum(p => p.Valor),
            ReceitaMensal = pagamentos.Where(p => p.Data >= inicio && p.Data <= fim).Sum(p => p.Valor),
            TotalPagamentos = pagamentos.Count,
            PagamentosPendentes = mensalidadesAbertas.Count() + mensalidadesAtrasadas.Count(),
            ReceitaPorMes = receitaPorMes,
            PlanosMaisVendidos = planosMaisVendidos
        };

        return ResponseDto<RelatorioFinanceiroDto>.SuccessResult(relatorio);
    }

    public async Task<ResponseDto<object>> GetRelatorioAlunosAsync()
    {
        var todosAlunos = await _alunoRepository.GetAllAsync();
        var alunos = todosAlunos.ToList();

        var relatorio = new
        {
            TotalAlunos = alunos.Count,
            AlunosAtivos = alunos.Count(a => a.Status == StatusAluno.Ativo),
            AlunosInativos = alunos.Count(a => a.Status == StatusAluno.Inativo),
            AlunosSuspenso = alunos.Count(a => a.Status == StatusAluno.Suspenso),
            AlunosPendentes = alunos.Count(a => a.Status == StatusAluno.Pendente),
            MatriculasPorMes = alunos
                .GroupBy(a => new { a.DataMatricula.Year, a.DataMatricula.Month })
                .Select(g => new { Mes = $"{g.Key.Month:D2}/{g.Key.Year}", Total = g.Count() })
                .OrderBy(m => m.Mes)
                .ToList()
        };

        return ResponseDto<object>.SuccessResult(relatorio);
    }

    public async Task<ResponseDto<object>> GetRelatorioPagamentosAsync()
    {
        var todosPagamentos = await _pagamentoRepository.GetAllWithDetailsAsync();
        var pagamentos = todosPagamentos.ToList();

        var relatorio = new
        {
            TotalPagamentos = pagamentos.Count,
            ValorTotal = pagamentos.Sum(p => p.Valor),
            PagamentosPorMetodo = pagamentos
                .GroupBy(p => p.Metodo)
                .Select(g => new { Metodo = g.Key.ToString(), Total = g.Count(), Valor = g.Sum(p => p.Valor) })
                .ToList(),
            PagamentosPorStatus = pagamentos
                .GroupBy(p => p.Status)
                .Select(g => new { Status = g.Key.ToString(), Total = g.Count() })
                .ToList()
        };

        return ResponseDto<object>.SuccessResult(relatorio);
    }
}
