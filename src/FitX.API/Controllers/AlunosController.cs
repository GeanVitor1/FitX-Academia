using FitX.Application.DTOs;
using FitX.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AlunosController : ControllerBase
{
    private readonly AlunoService _alunoService;

    public AlunosController(AlunoService alunoService)
    {
        _alunoService = alunoService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Professor,Recepcionista")]
    public async Task<ActionResult<ResponseDto<IEnumerable<AlunoDto>>>> GetAll()
    {
        var result = await _alunoService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ResponseDto<AlunoDto>>> GetById(Guid id)
    {
        var result = await _alunoService.GetByIdAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpGet("usuario/{usuarioId:guid}")]
    public async Task<ActionResult<ResponseDto<AlunoDto>>> GetByUsuarioId(Guid usuarioId)
    {
        var result = await _alunoService.GetByUsuarioIdAsync(usuarioId);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Recepcionista")]
    public async Task<ActionResult<ResponseDto<AlunoDto>>> Create([FromBody] CreateAlunoDto dto)
    {
        var result = await _alunoService.CreateAsync(dto);
        if (!result.Success) return BadRequest(result);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Professor,Recepcionista")]
    public async Task<ActionResult<ResponseDto<AlunoDto>>> Update(Guid id, [FromBody] UpdateAlunoDto dto)
    {
        var result = await _alunoService.UpdateAsync(id, dto);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResponseDto<bool>>> Delete(Guid id)
    {
        var result = await _alunoService.DeleteAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
