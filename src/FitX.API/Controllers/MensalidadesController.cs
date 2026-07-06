using FitX.Application.DTOs;
using FitX.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MensalidadesController : ControllerBase
{
    private readonly MensalidadeService _mensalidadeService;

    public MensalidadesController(MensalidadeService mensalidadeService)
    {
        _mensalidadeService = mensalidadeService;
    }

    [HttpGet("aluno/{alunoId:guid}")]
    public async Task<ActionResult<ResponseDto<IEnumerable<MensalidadeDto>>>> GetByAlunoId(Guid alunoId)
    {
        var result = await _mensalidadeService.GetByAlunoIdAsync(alunoId);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ResponseDto<MensalidadeDto>>> GetById(Guid id)
    {
        var result = await _mensalidadeService.GetByIdAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Financeiro,Recepcionista")]
    public async Task<ActionResult<ResponseDto<MensalidadeDto>>> Create([FromBody] CreateMensalidadeDto dto)
    {
        var result = await _mensalidadeService.CreateAsync(dto);
        if (!result.Success) return BadRequest(result);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [HttpPost("pagamento")]
    [Authorize(Roles = "Admin,Financeiro,Recepcionista")]
    public async Task<ActionResult<ResponseDto<PagamentoDto>>> RegisterPayment([FromBody] CreatePagamentoDto dto)
    {
        var result = await _mensalidadeService.RegisterPaymentAsync(dto);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }
}
