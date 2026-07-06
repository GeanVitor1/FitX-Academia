using FitX.Application.DTOs;
using FitX.Domain.Entities;
using FitX.Domain.Enums;
using FitX.Domain.Interfaces;

namespace FitX.Application.Services;

public class AgendamentoService
{
    private readonly IAgendamentoRepository _agendamentoRepository;
    private readonly IAlunoRepository _alunoRepository;
    private readonly IAulaRepository _aulaRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AgendamentoService(
        IAgendamentoRepository agendamentoRepository,
        IAlunoRepository alunoRepository,
        IAulaRepository aulaRepository,
        IUnitOfWork unitOfWork)
    {
        _agendamentoRepository = agendamentoRepository;
        _alunoRepository = alunoRepository;
        _aulaRepository = aulaRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ResponseDto<IEnumerable<AgendamentoDto>>> GetByAlunoIdAsync(Guid alunoId)
    {
        var agendamentos = await _agendamentoRepository.GetByAlunoIdAsync(alunoId);
        var dtos = agendamentos.Select(MapToDto);
        return ResponseDto<IEnumerable<AgendamentoDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<IEnumerable<AgendamentoDto>>> GetByAulaIdAsync(Guid aulaId)
    {
        var agendamentos = await _agendamentoRepository.GetByAulaIdAsync(aulaId);
        var dtos = agendamentos.Select(MapToDto);
        return ResponseDto<IEnumerable<AgendamentoDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<AgendamentoDto>> GetByIdAsync(Guid id)
    {
        var agendamento = await _agendamentoRepository.GetDetailedByIdAsync(id);
        if (agendamento is null)
            return ResponseDto<AgendamentoDto>.FailureResult("Agendamento não encontrado");

        return ResponseDto<AgendamentoDto>.SuccessResult(MapToDto(agendamento));
    }

    public async Task<ResponseDto<AgendamentoDto>> CreateAsync(CreateAgendamentoDto dto)
    {
        var aluno = await _alunoRepository.GetByIdAsync(dto.AlunoId);
        if (aluno is null)
            return ResponseDto<AgendamentoDto>.FailureResult("Aluno não encontrado");

        var aula = await _aulaRepository.GetByIdAsync(dto.AulaId);
        if (aula is null)
            return ResponseDto<AgendamentoDto>.FailureResult("Aula não encontrada");

        var agendamento = new Agendamento
        {
            AlunoId = dto.AlunoId,
            AulaId = dto.AulaId,
            Data = dto.Data,
            Status = StatusAgendamento.Pendente
        };

        await _agendamentoRepository.AddAsync(agendamento);
        await _unitOfWork.SaveChangesAsync();

        var result = await _agendamentoRepository.GetDetailedByIdAsync(agendamento.Id);
        return ResponseDto<AgendamentoDto>.SuccessResult(MapToDto(result!), "Agendamento criado com sucesso");
    }

    public async Task<ResponseDto<AgendamentoDto>> CancelarAsync(Guid id)
    {
        var agendamento = await _agendamentoRepository.GetByIdAsync(id);
        if (agendamento is null)
            return ResponseDto<AgendamentoDto>.FailureResult("Agendamento não encontrado");

        agendamento.Status = StatusAgendamento.Cancelado;
        _agendamentoRepository.Update(agendamento);
        await _unitOfWork.SaveChangesAsync();

        var result = await _agendamentoRepository.GetDetailedByIdAsync(agendamento.Id);
        return ResponseDto<AgendamentoDto>.SuccessResult(MapToDto(result!), "Agendamento cancelado com sucesso");
    }

    public async Task<ResponseDto<IEnumerable<AgendamentoDto>>> GetByDataAsync(DateTime data)
    {
        var agendamentos = await _agendamentoRepository.GetByDataAsync(data);
        var dtos = agendamentos.Select(MapToDto);
        return ResponseDto<IEnumerable<AgendamentoDto>>.SuccessResult(dtos);
    }

    private static AgendamentoDto MapToDto(Agendamento agendamento)
    {
        return new AgendamentoDto
        {
            Id = agendamento.Id,
            AlunoId = agendamento.AlunoId,
            AlunoNome = agendamento.Aluno?.Usuario?.Nome ?? string.Empty,
            AulaId = agendamento.AulaId,
            AulaNome = agendamento.Aula?.Nome ?? string.Empty,
            Data = agendamento.Data,
            Status = agendamento.Status
        };
    }
}
