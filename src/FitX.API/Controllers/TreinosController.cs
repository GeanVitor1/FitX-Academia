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

    [HttpGet]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<ActionResult<ResponseDto<IEnumerable<TreinoDto>>>> GetAll()
    {
        var usuarioId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role);

        if (role == "Admin")
        {
            var all = await _treinoService.GetAllAsync();
            return Ok(all);
        }

        var result = await _treinoService.GetByUsuarioIdAsync(usuarioId);
        return Ok(result);
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
    public async Task<ActionResult<ResponseDto<bool>>> AddSerie(Guid treinoId, [FromBody] CreateSerieDto? dto)
    {
        if (dto is null)
        {
            Console.WriteLine($"[AddSerie] dto is null for treinoId={treinoId}");
            return BadRequest(ResponseDto<bool>.FailureResult("Dados da série inválidos"));
        }
        Console.WriteLine($"[AddSerie] exercicioId={dto.ExercicioId}, rep={dto.Repeticoes}, ordem={dto.Ordem}");
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
