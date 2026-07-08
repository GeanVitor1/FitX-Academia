using FitX.Application.DTOs;
using FitX.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitX.API.Controllers;

[ApiController]
[Route("api/relatorios")]
[Authorize(Roles = "Admin,Financeiro")]
public class RelatoriosController : ControllerBase
{
    private readonly RelatorioService _relatorioService;

    public RelatoriosController(RelatorioService relatorioService)
    {
        _relatorioService = relatorioService;
    }

    [HttpGet("financeiro")]
    public async Task<ActionResult<ResponseDto<RelatorioFinanceiroDto>>> GetRelatorioFinanceiro(
        [FromQuery] DateTime inicio, [FromQuery] DateTime fim)
    {
        var result = await _relatorioService.GetRelatorioFinanceiroAsync(inicio, fim);
        return Ok(result);
    }

    [HttpGet("alunos")]
    public async Task<ActionResult<ResponseDto<object>>> GetRelatorioAlunos()
    {
        var result = await _relatorioService.GetRelatorioAlunosAsync();
        return Ok(result);
    }

    [HttpGet("pagamentos")]
    public async Task<ActionResult<ResponseDto<object>>> GetRelatorioPagamentos()
    {
        var result = await _relatorioService.GetRelatorioPagamentosAsync();
        return Ok(result);
    }
}
