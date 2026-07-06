using FitX.Application.DTOs;
using FitX.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PlanosController : ControllerBase
{
    private readonly PlanoService _planoService;

    public PlanosController(PlanoService planoService)
    {
        _planoService = planoService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ResponseDto<IEnumerable<PlanoDto>>>> GetAll()
    {
        var result = await _planoService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<ResponseDto<PlanoDto>>> GetById(Guid id)
    {
        var result = await _planoService.GetByIdAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResponseDto<PlanoDto>>> Create([FromBody] CreatePlanoDto dto)
    {
        var result = await _planoService.CreateAsync(dto);
        if (!result.Success) return BadRequest(result);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResponseDto<PlanoDto>>> Update(Guid id, [FromBody] UpdatePlanoDto dto)
    {
        var result = await _planoService.UpdateAsync(id, dto);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResponseDto<bool>>> Delete(Guid id)
    {
        var result = await _planoService.DeleteAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
