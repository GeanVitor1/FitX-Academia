using FitX.Application.DTOs;
using FitX.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FitX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificacoesController : ControllerBase
{
    private readonly NotificacaoService _notificacaoService;

    public NotificacoesController(NotificacaoService notificacaoService)
    {
        _notificacaoService = notificacaoService;
    }

    [HttpGet]
    public async Task<ActionResult<ResponseDto<IEnumerable<NotificacaoDto>>>> GetByUsuarioId()
    {
        var usuarioId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _notificacaoService.GetByUsuarioIdAsync(usuarioId);
        return Ok(result);
    }

    [HttpGet("nao-lidas")]
    public async Task<ActionResult<ResponseDto<IEnumerable<NotificacaoDto>>>> GetNaoLidas()
    {
        var usuarioId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _notificacaoService.GetNaoLidasAsync(usuarioId);
        return Ok(result);
    }

    [HttpGet("count-nao-lidas")]
    public async Task<ActionResult<ResponseDto<int>>> CountNaoLidas()
    {
        var usuarioId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var count = await _notificacaoService.CountNaoLidasAsync(usuarioId);
        return Ok(count);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResponseDto<NotificacaoDto>>> Create([FromBody] CreateNotificacaoDto dto)
    {
        var result = await _notificacaoService.CreateAsync(dto);
        if (!result.Success) return BadRequest(result);
        return CreatedAtAction(nameof(GetByUsuarioId), result);
    }

    [HttpPut("{id:guid}/lida")]
    public async Task<ActionResult<ResponseDto<bool>>> MarcarComoLida(Guid id)
    {
        var result = await _notificacaoService.MarcarComoLidaAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPut("lidas")]
    public async Task<ActionResult<ResponseDto<bool>>> MarcarTodasComoLida()
    {
        var usuarioId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _notificacaoService.MarcarTodasComoLidaAsync(usuarioId);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ResponseDto<bool>>> Delete(Guid id)
    {
        var result = await _notificacaoService.DeleteAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
