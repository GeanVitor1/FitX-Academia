using FitX.Application.DTOs;
using FitX.Domain.Entities;
using FitX.Domain.Interfaces;

namespace FitX.Application.Services;

public class AulaService
{
    private readonly IAulaRepository _aulaRepository;
    private readonly IProfessorRepository _professorRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AulaService(
        IAulaRepository aulaRepository,
        IProfessorRepository professorRepository,
        IUnitOfWork unitOfWork)
    {
        _aulaRepository = aulaRepository;
        _professorRepository = professorRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ResponseDto<IEnumerable<AulaDto>>> GetAllAsync()
    {
        var aulas = await _aulaRepository.GetAllWithProfessorAsync();
        var dtos = aulas.Select(MapToDto);
        return ResponseDto<IEnumerable<AulaDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<AulaDto>> GetByIdAsync(Guid id)
    {
        var aula = await _aulaRepository.GetDetailedByIdAsync(id);
        if (aula is null)
            return ResponseDto<AulaDto>.FailureResult("Aula não encontrada");

        return ResponseDto<AulaDto>.SuccessResult(MapToDto(aula));
    }

    public async Task<ResponseDto<IEnumerable<AulaDto>>> GetByProfessorIdAsync(Guid professorId)
    {
        var aulas = await _aulaRepository.GetAllWithProfessorAsync();
        var dtos = aulas.Where(a => a.ProfessorId == professorId).Select(MapToDto);
        return ResponseDto<IEnumerable<AulaDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<AulaDto>> CreateAsync(CreateAulaDto dto)
    {
        var professor = await _professorRepository.GetByIdAsync(dto.ProfessorId);
        if (professor is null)
            return ResponseDto<AulaDto>.FailureResult("Professor não encontrado");

        var aula = new Aula
        {
            Nome = dto.Nome,
            ProfessorId = dto.ProfessorId,
            Horario = dto.Horario,
            DiasSemana = dto.DiasSemana,
            Vagas = dto.Vagas,
            Descricao = dto.Descricao,
            Ativa = true
        };

        await _aulaRepository.AddAsync(aula);
        await _unitOfWork.SaveChangesAsync();

        var result = await _aulaRepository.GetDetailedByIdAsync(aula.Id);
        return ResponseDto<AulaDto>.SuccessResult(MapToDto(result!), "Aula criada com sucesso");
    }

    public async Task<ResponseDto<AulaDto>> UpdateAsync(Guid id, CreateAulaDto dto)
    {
        var aula = await _aulaRepository.GetByIdAsync(id);
        if (aula is null)
            return ResponseDto<AulaDto>.FailureResult("Aula não encontrada");

        aula.Nome = dto.Nome;
        aula.ProfessorId = dto.ProfessorId;
        aula.Horario = dto.Horario;
        aula.DiasSemana = dto.DiasSemana;
        aula.Vagas = dto.Vagas;
        aula.Descricao = dto.Descricao;

        _aulaRepository.Update(aula);
        await _unitOfWork.SaveChangesAsync();

        var result = await _aulaRepository.GetDetailedByIdAsync(aula.Id);
        return ResponseDto<AulaDto>.SuccessResult(MapToDto(result!), "Aula atualizada com sucesso");
    }

    public async Task<ResponseDto<bool>> DeleteAsync(Guid id)
    {
        var aula = await _aulaRepository.GetByIdAsync(id);
        if (aula is null)
            return ResponseDto<bool>.FailureResult("Aula não encontrada");

        _aulaRepository.Remove(aula);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<bool>.SuccessResult(true, "Aula removida com sucesso");
    }

    private static AulaDto MapToDto(Aula aula)
    {
        return new AulaDto
        {
            Id = aula.Id,
            Nome = aula.Nome,
            ProfessorId = aula.ProfessorId,
            ProfessorNome = aula.Professor?.Usuario?.Nome ?? string.Empty,
            Horario = aula.Horario,
            DiasSemana = aula.DiasSemana,
            Vagas = aula.Vagas,
            VagasOcupadas = aula.VagasOcupadas,
            Ativa = aula.Ativa,
            Descricao = aula.Descricao
        };
    }
}
