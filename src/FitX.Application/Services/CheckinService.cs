using FitX.Application.DTOs;
using FitX.Domain.Entities;
using FitX.Domain.Enums;
using FitX.Domain.Interfaces;

namespace FitX.Application.Services;

public class CheckinService
{
    private readonly ICheckinRepository _checkinRepository;
    private readonly ICheckinRequestRepository _checkinRequestRepository;
    private readonly IAlunoRepository _alunoRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CheckinService(
        ICheckinRepository checkinRepository,
        ICheckinRequestRepository checkinRequestRepository,
        IAlunoRepository alunoRepository,
        IUnitOfWork unitOfWork)
    {
        _checkinRepository = checkinRepository;
        _checkinRequestRepository = checkinRequestRepository;
        _alunoRepository = alunoRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ResponseDto<CheckinDto>> CheckinAsync(Guid alunoId)
    {
        var activeCheckin = await _checkinRepository.GetActiveCheckinAsync(alunoId);
        if (activeCheckin is not null)
            return ResponseDto<CheckinDto>.FailureResult("Aluno já está presente");

        var checkin = new Checkin
        {
            AlunoId = alunoId,
            DataEntrada = DateTime.UtcNow,
            Status = StatusCheckin.Presente
        };

        await _checkinRepository.AddAsync(checkin);
        await _unitOfWork.SaveChangesAsync();

        var aluno = await _alunoRepository.GetByIdAsync(alunoId);
        return ResponseDto<CheckinDto>.SuccessResult(new CheckinDto
        {
            Id = checkin.Id,
            AlunoId = checkin.AlunoId,
            AlunoNome = aluno?.Usuario?.Nome ?? string.Empty,
            DataEntrada = checkin.DataEntrada,
            Status = checkin.Status
        }, "Check-in realizado com sucesso");
    }

    public async Task<ResponseDto<CheckinDto>> CheckoutAsync(Guid alunoId)
    {
        var activeCheckin = await _checkinRepository.GetActiveCheckinAsync(alunoId);
        if (activeCheckin is null)
            return ResponseDto<CheckinDto>.FailureResult("Aluno não está presente");

        activeCheckin.DataSaida = DateTime.UtcNow;
        activeCheckin.Status = StatusCheckin.Saiu;

        _checkinRepository.Update(activeCheckin);
        await _unitOfWork.SaveChangesAsync();

        var aluno = await _alunoRepository.GetByIdAsync(alunoId);
        return ResponseDto<CheckinDto>.SuccessResult(new CheckinDto
        {
            Id = activeCheckin.Id,
            AlunoId = activeCheckin.AlunoId,
            AlunoNome = aluno?.Usuario?.Nome ?? string.Empty,
            DataEntrada = activeCheckin.DataEntrada,
            DataSaida = activeCheckin.DataSaida,
            Status = activeCheckin.Status
        }, "Check-out realizado com sucesso");
    }

    public async Task<ResponseDto<IEnumerable<CheckinDto>>> GetActiveCheckinsAsync()
    {
        var checkins = await _checkinRepository.GetActiveCheckinsAsync();
        var dtos = checkins.Select(c => new CheckinDto
        {
            Id = c.Id,
            AlunoId = c.AlunoId,
            AlunoNome = c.Aluno?.Usuario?.Nome ?? string.Empty,
            DataEntrada = c.DataEntrada,
            Status = c.Status
        });
        return ResponseDto<IEnumerable<CheckinDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<IEnumerable<CheckinDto>>> GetByAlunoIdAsync(Guid alunoId)
    {
        var checkins = await _checkinRepository.GetByAlunoIdAsync(alunoId);
        var dtos = checkins.Select(c => new CheckinDto
        {
            Id = c.Id,
            AlunoId = c.AlunoId,
            AlunoNome = c.Aluno?.Usuario?.Nome ?? string.Empty,
            DataEntrada = c.DataEntrada,
            DataSaida = c.DataSaida,
            Status = c.Status
        });
        return ResponseDto<IEnumerable<CheckinDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<CheckinRequestDto>> CreateRequestAsync(Guid alunoId)
    {
        var activeRequest = await _checkinRequestRepository.GetActiveRequestAsync(alunoId);
        if (activeRequest is not null)
            return ResponseDto<CheckinRequestDto>.FailureResult("Ja existe uma solicitacao pendente");

        var activeCheckin = await _checkinRepository.GetActiveCheckinAsync(alunoId);
        if (activeCheckin is not null)
            return ResponseDto<CheckinRequestDto>.FailureResult("Aluno ja esta presente na academia");

        var request = new CheckinRequest
        {
            AlunoId = alunoId,
            Status = StatusCheckinRequest.Pendente
        };

        await _checkinRequestRepository.AddAsync(request);
        await _unitOfWork.SaveChangesAsync();

        var aluno = await _alunoRepository.GetByIdAsync(alunoId);
        return ResponseDto<CheckinRequestDto>.SuccessResult(MapToDto(request, aluno), "Solicitacao criada com sucesso");
    }

    public async Task<ResponseDto<IEnumerable<CheckinRequestDto>>> GetPendingRequestsAsync()
    {
        var requests = await _checkinRequestRepository.GetPendingAsync();
        var dtos = requests.Select(r => MapToDto(r, r.Aluno));
        return ResponseDto<IEnumerable<CheckinRequestDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<IEnumerable<CheckinRequestDto>>> GetRequestsByAlunoIdAsync(Guid alunoId)
    {
        var requests = await _checkinRequestRepository.GetByAlunoIdAsync(alunoId);
        var dtos = requests.Select(r => MapToDto(r, r.Aluno));
        return ResponseDto<IEnumerable<CheckinRequestDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<CheckinRequestDto>> ApproveRequestAsync(Guid requestId, Guid staffUserId)
    {
        var request = await _checkinRequestRepository.GetByIdAsync(requestId);
        if (request is null)
            return ResponseDto<CheckinRequestDto>.FailureResult("Solicitacao nao encontrada");

        if (request.Status != StatusCheckinRequest.Pendente)
            return ResponseDto<CheckinRequestDto>.FailureResult("Solicitacao nao esta pendente");

        request.Status = StatusCheckinRequest.Aprovado;
        request.RespondidaEm = DateTime.UtcNow;
        request.RespondidaPorId = staffUserId;
        _checkinRequestRepository.Update(request);

        var checkin = new Checkin
        {
            AlunoId = request.AlunoId,
            DataEntrada = DateTime.UtcNow,
            Status = StatusCheckin.Presente
        };
        await _checkinRepository.AddAsync(checkin);

        await _unitOfWork.SaveChangesAsync();

        var aluno = await _alunoRepository.GetByIdAsync(request.AlunoId);
        return ResponseDto<CheckinRequestDto>.SuccessResult(MapToDto(request, aluno), "Solicitacao aprovada");
    }

    public async Task<ResponseDto<CheckinRequestDto>> DenyRequestAsync(Guid requestId, Guid staffUserId)
    {
        var request = await _checkinRequestRepository.GetByIdAsync(requestId);
        if (request is null)
            return ResponseDto<CheckinRequestDto>.FailureResult("Solicitacao nao encontrada");

        if (request.Status != StatusCheckinRequest.Pendente)
            return ResponseDto<CheckinRequestDto>.FailureResult("Solicitacao nao esta pendente");

        request.Status = StatusCheckinRequest.Negado;
        request.RespondidaEm = DateTime.UtcNow;
        request.RespondidaPorId = staffUserId;
        _checkinRequestRepository.Update(request);

        await _unitOfWork.SaveChangesAsync();

        var aluno = await _alunoRepository.GetByIdAsync(request.AlunoId);
        return ResponseDto<CheckinRequestDto>.SuccessResult(MapToDto(request, aluno), "Solicitacao negada");
    }

    public async Task<ResponseDto<CheckinRequestDto>> CancelRequestAsync(Guid requestId, Guid alunoId)
    {
        var request = await _checkinRequestRepository.GetByIdAsync(requestId);
        if (request is null)
            return ResponseDto<CheckinRequestDto>.FailureResult("Solicitacao nao encontrada");

        if (request.AlunoId != alunoId)
            return ResponseDto<CheckinRequestDto>.FailureResult("Solicitacao nao pertence a este aluno");

        if (request.Status != StatusCheckinRequest.Pendente)
            return ResponseDto<CheckinRequestDto>.FailureResult("Solicitacao nao esta pendente");

        request.Status = StatusCheckinRequest.Cancelado;
        request.RespondidaEm = DateTime.UtcNow;
        _checkinRequestRepository.Update(request);

        await _unitOfWork.SaveChangesAsync();

        var aluno = await _alunoRepository.GetByIdAsync(alunoId);
        return ResponseDto<CheckinRequestDto>.SuccessResult(MapToDto(request, aluno), "Solicitacao cancelada");
    }

    private static CheckinRequestDto MapToDto(CheckinRequest request, Aluno? aluno)
    {
        return new CheckinRequestDto
        {
            Id = request.Id,
            AlunoId = request.AlunoId,
            AlunoNome = aluno?.Usuario?.Nome ?? string.Empty,
            Status = request.Status,
            CriadaEm = request.CriadoEm,
            RespondidaEm = request.RespondidaEm,
            RespondidaPorId = request.RespondidaPorId,
            RespondidaPorNome = null
        };
    }
}
