using FitX.Application.DTOs;
using FitX.Domain.Entities;
using FitX.Domain.Interfaces;

namespace FitX.Application.Services;

public class AvaliacaoService
{
    private readonly IAvaliacaoRepository _avaliacaoRepository;
    private readonly IAlunoRepository _alunoRepository;
    private readonly IProfessorRepository _professorRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AvaliacaoService(
        IAvaliacaoRepository avaliacaoRepository,
        IAlunoRepository alunoRepository,
        IProfessorRepository professorRepository,
        IUnitOfWork unitOfWork)
    {
        _avaliacaoRepository = avaliacaoRepository;
        _alunoRepository = alunoRepository;
        _professorRepository = professorRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ResponseDto<IEnumerable<AvaliacaoDto>>> GetAllAsync()
    {
        var avaliacoes = await _avaliacaoRepository.GetAllAsync();
        var dtos = avaliacoes.Select(MapToDto);
        return ResponseDto<IEnumerable<AvaliacaoDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<IEnumerable<AvaliacaoDto>>> GetByAlunoIdAsync(Guid alunoId)
    {
        var avaliacoes = await _avaliacaoRepository.GetByAlunoIdAsync(alunoId);
        var dtos = avaliacoes.Select(MapToDto);
        return ResponseDto<IEnumerable<AvaliacaoDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<AvaliacaoDto>> GetByIdAsync(Guid id)
    {
        var avaliacao = await _avaliacaoRepository.GetDetailedByIdAsync(id);
        if (avaliacao is null)
            return ResponseDto<AvaliacaoDto>.FailureResult("Avaliação não encontrada");

        return ResponseDto<AvaliacaoDto>.SuccessResult(MapToDto(avaliacao));
    }

    public async Task<ResponseDto<AvaliacaoDto>> CreateAsync(CreateAvaliacaoDto dto, Guid professorId)
    {
        var aluno = await _alunoRepository.GetByIdAsync(dto.AlunoId);
        if (aluno is null)
            return ResponseDto<AvaliacaoDto>.FailureResult("Aluno não encontrado");

        var professor = await _professorRepository.GetByIdAsync(professorId);
        if (professor is null)
            return ResponseDto<AvaliacaoDto>.FailureResult("Professor não encontrado");

        var imc = dto.Peso / (dto.Altura * dto.Altura);

        var avaliacao = new Avaliacao
        {
            AlunoId = dto.AlunoId,
            ProfessorId = professorId,
            Data = DateTime.UtcNow,
            Peso = dto.Peso,
            Altura = dto.Altura,
            IMC = imc,
            PercentualGordura = dto.PercentualGordura,
            MassaMuscular = dto.MassaMuscular,
            CircunferenciaBracos = dto.CircunferenciaBracos,
            CircunferenciaPernas = dto.CircunferenciaPernas,
            CircunferenciaCintura = dto.CircunferenciaCintura,
            CircunferenciaAbdomen = dto.CircunferenciaAbdomen,
            Observacoes = dto.Observacoes
        };

        await _avaliacaoRepository.AddAsync(avaliacao);
        await _unitOfWork.SaveChangesAsync();

        var result = await _avaliacaoRepository.GetDetailedByIdAsync(avaliacao.Id);
        return ResponseDto<AvaliacaoDto>.SuccessResult(MapToDto(result!), "Avaliação criada com sucesso");
    }

    public async Task<ResponseDto<bool>> DeleteAsync(Guid id)
    {
        var avaliacao = await _avaliacaoRepository.GetByIdAsync(id);
        if (avaliacao is null)
            return ResponseDto<bool>.FailureResult("Avaliação não encontrada");

        _avaliacaoRepository.Remove(avaliacao);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<bool>.SuccessResult(true, "Avaliação removida com sucesso");
    }

    private static AvaliacaoDto MapToDto(Avaliacao avaliacao)
    {
        return new AvaliacaoDto
        {
            Id = avaliacao.Id,
            AlunoId = avaliacao.AlunoId,
            AlunoNome = avaliacao.Aluno?.Usuario?.Nome ?? string.Empty,
            ProfessorId = avaliacao.ProfessorId,
            ProfessorNome = avaliacao.Professor?.Usuario?.Nome ?? string.Empty,
            Data = avaliacao.Data,
            Peso = avaliacao.Peso,
            Altura = avaliacao.Altura,
            IMC = avaliacao.IMC,
            PercentualGordura = avaliacao.PercentualGordura,
            MassaMuscular = avaliacao.MassaMuscular,
            CircunferenciaBracos = avaliacao.CircunferenciaBracos,
            CircunferenciaPernas = avaliacao.CircunferenciaPernas,
            CircunferenciaCintura = avaliacao.CircunferenciaCintura,
            CircunferenciaAbdomen = avaliacao.CircunferenciaAbdomen,
            Observacoes = avaliacao.Observacoes
        };
    }
}
