using FitX.Application.DTOs;
using FitX.Domain.Entities;
using FitX.Domain.Enums;
using FitX.Domain.Interfaces;

namespace FitX.Application.Services;

public class CheckinService
{
    private readonly ICheckinRepository _checkinRepository;
    private readonly IAlunoRepository _alunoRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CheckinService(
        ICheckinRepository checkinRepository,
        IAlunoRepository alunoRepository,
        IUnitOfWork unitOfWork)
    {
        _checkinRepository = checkinRepository;
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
}
