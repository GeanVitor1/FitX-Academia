using FitX.Application.DTOs;
using FitX.Domain.Entities;
using FitX.Domain.Interfaces;

namespace FitX.Application.Services;

public class NotificacaoService
{
    private readonly INotificacaoRepository _notificacaoRepository;
    private readonly IUnitOfWork _unitOfWork;

    public NotificacaoService(
        INotificacaoRepository notificacaoRepository,
        IUnitOfWork unitOfWork)
    {
        _notificacaoRepository = notificacaoRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ResponseDto<IEnumerable<NotificacaoDto>>> GetByUsuarioIdAsync(Guid usuarioId)
    {
        var notificacoes = await _notificacaoRepository.GetByUsuarioIdAsync(usuarioId);
        var dtos = notificacoes.Select(MapToDto);
        return ResponseDto<IEnumerable<NotificacaoDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<IEnumerable<NotificacaoDto>>> GetNaoLidasAsync(Guid usuarioId)
    {
        var notificacoes = await _notificacaoRepository.GetNaoLidasAsync(usuarioId);
        var dtos = notificacoes.Select(MapToDto);
        return ResponseDto<IEnumerable<NotificacaoDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<int>> CountNaoLidasAsync(Guid usuarioId)
    {
        var count = await _notificacaoRepository.CountNaoLidasAsync(usuarioId);
        return ResponseDto<int>.SuccessResult(count);
    }

    public async Task<ResponseDto<NotificacaoDto>> CreateAsync(CreateNotificacaoDto dto)
    {
        var notificacao = new Notificacao
        {
            UsuarioId = dto.UsuarioId,
            Titulo = dto.Titulo,
            Mensagem = dto.Mensagem,
            Link = dto.Link,
            Lida = false
        };

        await _notificacaoRepository.AddAsync(notificacao);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<NotificacaoDto>.SuccessResult(MapToDto(notificacao), "Notificação criada com sucesso");
    }

    public async Task<ResponseDto<NotificacaoDto>> MarcarComoLidaAsync(Guid id)
    {
        var notificacao = await _notificacaoRepository.GetByIdAsync(id);
        if (notificacao is null)
            return ResponseDto<NotificacaoDto>.FailureResult("Notificação não encontrada");

        notificacao.Lida = true;
        _notificacaoRepository.Update(notificacao);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<NotificacaoDto>.SuccessResult(MapToDto(notificacao), "Notificação marcada como lida");
    }

    public async Task<ResponseDto<bool>> MarcarTodasComoLidaAsync(Guid usuarioId)
    {
        var notificacoes = await _notificacaoRepository.GetNaoLidasAsync(usuarioId);
        foreach (var notificacao in notificacoes)
        {
            notificacao.Lida = true;
            _notificacaoRepository.Update(notificacao);
        }

        await _unitOfWork.SaveChangesAsync();
        return ResponseDto<bool>.SuccessResult(true, "Todas as notificações foram marcadas como lidas");
    }

    public async Task<ResponseDto<bool>> DeleteAsync(Guid id)
    {
        var notificacao = await _notificacaoRepository.GetByIdAsync(id);
        if (notificacao is null)
            return ResponseDto<bool>.FailureResult("Notificação não encontrada");

        _notificacaoRepository.Remove(notificacao);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<bool>.SuccessResult(true, "Notificação removida com sucesso");
    }

    private static NotificacaoDto MapToDto(Notificacao notificacao)
    {
        return new NotificacaoDto
        {
            Id = notificacao.Id,
            Titulo = notificacao.Titulo,
            Mensagem = notificacao.Mensagem,
            Lida = notificacao.Lida,
            Link = notificacao.Link,
            CriadaEm = notificacao.CriadoEm
        };
    }
}
