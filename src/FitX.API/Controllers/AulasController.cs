using FitX.Application.DTOs;
using FitX.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AulasController : ControllerBase
{
    private readonly AulaService _aulaService;

    public AulasController(AulaService aulaService)
    {
        _aulaService = aulaService;
    }

    [HttpGet]
    public async Task<ActionResult<ResponseDto<IEnumerable<AulaDto>>>> GetAll()
    {
        var result = await _aulaService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ResponseDto<AulaDto>>> GetById(Guid id)
    {
        var result = await _aulaService.GetByIdAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpGet("professor/{professorId:guid}")]
    public async Task<ActionResult<ResponseDto<IEnumerable<AulaDto>>>> GetByProfessorId(Guid professorId)
    {
        var result = await _aulaService.GetByProfessorIdAsync(professorId);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<ActionResult<ResponseDto<AulaDto>>> Create([FromBody] CreateAulaDto dto)
    {
        var result = await _aulaService.CreateAsync(dto);
        if (!result.Success) return BadRequest(result);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<ActionResult<ResponseDto<AulaDto>>> Update(Guid id, [FromBody] CreateAulaDto dto)
    {
        var result = await _aulaService.UpdateAsync(id, dto);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResponseDto<bool>>> Delete(Guid id)
    {
        var result = await _aulaService.DeleteAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
