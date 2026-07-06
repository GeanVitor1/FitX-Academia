using FitX.Application.DTOs;
using FitX.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfessoresController : ControllerBase
{
    private readonly ProfessorService _professorService;

    public ProfessoresController(ProfessorService professorService)
    {
        _professorService = professorService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Recepcionista")]
    public async Task<ActionResult<ResponseDto<IEnumerable<ProfessorDto>>>> GetAll()
    {
        var result = await _professorService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ResponseDto<ProfessorDto>>> GetById(Guid id)
    {
        var result = await _professorService.GetByIdAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResponseDto<ProfessorDto>>> Create([FromBody] CreateProfessorDto dto)
    {
        var result = await _professorService.CreateAsync(dto);
        if (!result.Success) return BadRequest(result);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResponseDto<ProfessorDto>>> Update(Guid id, [FromBody] UpdateProfessorDto dto)
    {
        var result = await _professorService.UpdateAsync(id, dto);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResponseDto<bool>>> Delete(Guid id)
    {
        var result = await _professorService.DeleteAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
