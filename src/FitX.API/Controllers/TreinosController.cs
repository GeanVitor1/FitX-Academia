using System.Security.Claims;
using FitX.Application.DTOs;
using FitX.Application.Services;
using FitX.Domain.Interfaces;
using FitX.Persistence.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TreinosController : ControllerBase
{
    private readonly TreinoService _treinoService;

    public TreinosController(TreinoService treinoService)
    {
        _treinoService = treinoService;
    }

    [HttpGet("aluno/{alunoId:guid}")]
    public async Task<ActionResult<ResponseDto<IEnumerable<TreinoDto>>>> GetByAlunoId(Guid alunoId)
    {
        var result = await _treinoService.GetByAlunoIdAsync(alunoId);
        return Ok(result);
    }

    [HttpGet("professor/{professorId:guid}")]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<ActionResult<ResponseDto<IEnumerable<TreinoDto>>>> GetByProfessorId(Guid professorId)
    {
        var result = await _treinoService.GetByProfessorIdAsync(professorId);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ResponseDto<TreinoDto>>> GetById(Guid id)
    {
        var result = await _treinoService.GetByIdAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<ActionResult<ResponseDto<TreinoDto>>> Create([FromBody] CreateTreinoDto dto)
    {
        var professorId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var result = await _treinoService.CreateAsync(dto, professorId);
        if (!result.Success) return BadRequest(result);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<ActionResult<ResponseDto<TreinoDto>>> Update(Guid id, [FromBody] UpdateTreinoDto dto)
    {
        var result = await _treinoService.UpdateAsync(id, dto);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{treinoId:guid}/series")]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<ActionResult<ResponseDto<bool>>> AddSerie(Guid treinoId, [FromBody] CreateSerieDto dto)
    {
        var result = await _treinoService.AddSerieAsync(treinoId, dto);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<ActionResult<ResponseDto<bool>>> Delete(Guid id)
    {
        var result = await _treinoService.DeleteAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
