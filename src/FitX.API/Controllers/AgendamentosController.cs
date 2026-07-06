using FitX.Application.DTOs;
using FitX.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AgendamentosController : ControllerBase
{
    private readonly AgendamentoService _agendamentoService;

    public AgendamentosController(AgendamentoService agendamentoService)
    {
        _agendamentoService = agendamentoService;
    }

    [HttpGet("aluno/{alunoId:guid}")]
    public async Task<ActionResult<ResponseDto<IEnumerable<AgendamentoDto>>>> GetByAlunoId(Guid alunoId)
    {
        var result = await _agendamentoService.GetByAlunoIdAsync(alunoId);
        return Ok(result);
    }

    [HttpGet("aula/{aulaId:guid}")]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<ActionResult<ResponseDto<IEnumerable<AgendamentoDto>>>> GetByAulaId(Guid aulaId)
    {
        var result = await _agendamentoService.GetByAulaIdAsync(aulaId);
        return Ok(result);
    }

    [HttpGet("data/{data:datetime}")]
    [Authorize(Roles = "Admin,Professor,Recepcionista")]
    public async Task<ActionResult<ResponseDto<IEnumerable<AgendamentoDto>>>> GetByData(DateTime data)
    {
        var result = await _agendamentoService.GetByDataAsync(data);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ResponseDto<AgendamentoDto>>> GetById(Guid id)
    {
        var result = await _agendamentoService.GetByIdAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ResponseDto<AgendamentoDto>>> Create([FromBody] CreateAgendamentoDto dto)
    {
        var result = await _agendamentoService.CreateAsync(dto);
        if (!result.Success) return BadRequest(result);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [HttpPut("{id:guid}/cancelar")]
    public async Task<ActionResult<ResponseDto<bool>>> Cancelar(Guid id)
    {
        var result = await _agendamentoService.CancelarAsync(id);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }
}
