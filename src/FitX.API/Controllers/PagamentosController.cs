using FitX.Application.DTOs;
using FitX.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PagamentosController : ControllerBase
{
    private readonly PagamentoService _pagamentoService;

    public PagamentosController(PagamentoService pagamentoService)
    {
        _pagamentoService = pagamentoService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Financeiro")]
    public async Task<ActionResult<ResponseDto<IEnumerable<PagamentoDto>>>> GetAll()
    {
        var result = await _pagamentoService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("mensalidade/{mensalidadeId:guid}")]
    public async Task<ActionResult<ResponseDto<IEnumerable<PagamentoDto>>>> GetByMensalidadeId(Guid mensalidadeId)
    {
        var result = await _pagamentoService.GetByMensalidadeIdAsync(mensalidadeId);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ResponseDto<PagamentoDto>>> GetById(Guid id)
    {
        var result = await _pagamentoService.GetByIdAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Financeiro,Recepcionista")]
    public async Task<ActionResult<ResponseDto<PagamentoDto>>> Create([FromBody] CreatePagamentoDto dto)
    {
        var result = await _pagamentoService.CreateAsync(dto);
        if (!result.Success) return BadRequest(result);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }
}
