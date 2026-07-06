using FitX.Application.DTOs;
using FitX.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FitX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AvaliacoesController : ControllerBase
{
    private readonly AvaliacaoService _avaliacaoService;

    public AvaliacoesController(AvaliacaoService avaliacaoService)
    {
        _avaliacaoService = avaliacaoService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<ActionResult<ResponseDto<IEnumerable<AvaliacaoDto>>>> GetAll()
    {
        var result = await _avaliacaoService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("aluno/{alunoId:guid}")]
    public async Task<ActionResult<ResponseDto<IEnumerable<AvaliacaoDto>>>> GetByAlunoId(Guid alunoId)
    {
        var result = await _avaliacaoService.GetByAlunoIdAsync(alunoId);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ResponseDto<AvaliacaoDto>>> GetById(Guid id)
    {
        var result = await _avaliacaoService.GetByIdAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<ActionResult<ResponseDto<AvaliacaoDto>>> Create([FromBody] CreateAvaliacaoDto dto)
    {
        var professorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _avaliacaoService.CreateAsync(dto, professorId);
        if (!result.Success) return BadRequest(result);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResponseDto<bool>>> Delete(Guid id)
    {
        var result = await _avaliacaoService.DeleteAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
