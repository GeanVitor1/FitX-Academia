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
    [Authorize(Roles = "Admin,Recepcionista,Aluno")]
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

    [HttpPost("request/{alunoId:guid}")]
    [Authorize(Roles = "Aluno")]
    public async Task<ActionResult<ResponseDto<CheckinRequestDto>>> CreateRequest(Guid alunoId)
    {
        var result = await _checkinService.CreateRequestAsync(alunoId);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("requests/pending")]
    [Authorize(Roles = "Admin,Recepcionista,Professor")]
    public async Task<ActionResult<ResponseDto<IEnumerable<CheckinRequestDto>>>> GetPendingRequests()
    {
        var result = await _checkinService.GetPendingRequestsAsync();
        return Ok(result);
    }

    [HttpGet("requests/aluno/{alunoId:guid}")]
    public async Task<ActionResult<ResponseDto<IEnumerable<CheckinRequestDto>>>> GetRequestsByAlunoId(Guid alunoId)
    {
        var result = await _checkinService.GetRequestsByAlunoIdAsync(alunoId);
        return Ok(result);
    }

    [HttpPost("requests/{requestId:guid}/approve")]
    [Authorize(Roles = "Admin,Recepcionista,Professor")]
    public async Task<ActionResult<ResponseDto<CheckinRequestDto>>> ApproveRequest(Guid requestId, [FromBody] ApproveRequestDto dto)
    {
        var result = await _checkinService.ApproveRequestAsync(requestId, dto.StaffUserId);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("requests/{requestId:guid}/deny")]
    [Authorize(Roles = "Admin,Recepcionista,Professor")]
    public async Task<ActionResult<ResponseDto<CheckinRequestDto>>> DenyRequest(Guid requestId, [FromBody] ApproveRequestDto dto)
    {
        var result = await _checkinService.DenyRequestAsync(requestId, dto.StaffUserId);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("requests/{requestId:guid}/cancel")]
    [Authorize(Roles = "Aluno")]
    public async Task<ActionResult<ResponseDto<CheckinRequestDto>>> CancelRequest(Guid requestId, [FromBody] CancelRequestDto dto)
    {
        var result = await _checkinService.CancelRequestAsync(requestId, dto.AlunoId);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }
}

public class ApproveRequestDto
{
    public Guid StaffUserId { get; set; }
}

public class CancelRequestDto
{
    public Guid AlunoId { get; set; }
}
