using FitX.Application.DTOs;
using FitX.Application.Services;
using FitX.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExerciciosController : ControllerBase
{
    private readonly ExercicioService _exercicioService;

    public ExerciciosController(ExercicioService exercicioService)
    {
        _exercicioService = exercicioService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ResponseDto<IEnumerable<ExercicioDto>>>> GetAll()
    {
        var result = await _exercicioService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<ResponseDto<ExercicioDto>>> GetById(Guid id)
    {
        var result = await _exercicioService.GetByIdAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpGet("grupo-muscular/{grupo}")]
    [AllowAnonymous]
    public async Task<ActionResult<ResponseDto<IEnumerable<ExercicioDto>>>> GetByGrupoMuscular(GrupoMuscular grupo)
    {
        var result = await _exercicioService.GetByGrupoMuscularAsync(grupo);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResponseDto<ExercicioDto>>> Create([FromBody] CreateExercicioDto dto)
    {
        var result = await _exercicioService.CreateAsync(dto);
        if (!result.Success) return BadRequest(result);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResponseDto<ExercicioDto>>> Update(Guid id, [FromBody] UpdateExercicioDto dto)
    {
        var result = await _exercicioService.UpdateAsync(id, dto);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResponseDto<bool>>> Delete(Guid id)
    {
        var result = await _exercicioService.DeleteAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
