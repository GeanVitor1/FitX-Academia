using FitX.Application.DTOs;
using FitX.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CheckinsController : ControllerBase
{
    private readonly CheckinService _checkinService;

    public CheckinsController(CheckinService checkinService)
    {
        _checkinService = checkinService;
    }

    [HttpPost("checkin/{alunoId:guid}")]
    [Authorize(Roles = "Admin,Recepcionista")]
    public async Task<ActionResult<ResponseDto<CheckinDto>>> Checkin(Guid alunoId)
    {
        var result = await _checkinService.CheckinAsync(alunoId);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("checkout/{alunoId:guid}")]
    [Authorize(Roles = "Admin,Recepcionista")]
    public async Task<ActionResult<ResponseDto<CheckinDto>>> Checkout(Guid alunoId)
    {
        var result = await _checkinService.CheckoutAsync(alunoId);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("active")]
    [Authorize(Roles = "Admin,Recepcionista")]
    public async Task<ActionResult<ResponseDto<IEnumerable<CheckinDto>>>> GetActiveCheckins()
    {
        var result = await _checkinService.GetActiveCheckinsAsync();
        return Ok(result);
    }

    [HttpGet("aluno/{alunoId:guid}")]
    public async Task<ActionResult<ResponseDto<IEnumerable<CheckinDto>>>> GetByAlunoId(Guid alunoId)
    {
        var result = await _checkinService.GetByAlunoIdAsync(alunoId);
        return Ok(result);
    }
}
