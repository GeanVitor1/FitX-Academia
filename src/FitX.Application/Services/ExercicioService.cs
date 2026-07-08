using FitX.Application.DTOs;
using FitX.Domain.Entities;
using FitX.Domain.Enums;
using FitX.Domain.Interfaces;

namespace FitX.Application.Services;

public class ExercicioService
{
    private readonly IRepository<Exercicio> _exercicioRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ExercicioService(IRepository<Exercicio> exercicioRepository, IUnitOfWork unitOfWork)
    {
        _exercicioRepository = exercicioRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ResponseDto<IEnumerable<ExercicioDto>>> GetAllAsync()
    {
        var exercicios = await _exercicioRepository.GetAllAsync();
        var dtos = exercicios.OrderBy(e => e.Nome).Select(MapToDto);
        return ResponseDto<IEnumerable<ExercicioDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<ExercicioDto>> GetByIdAsync(Guid id)
    {
        var exercicio = await _exercicioRepository.GetByIdAsync(id);
        if (exercicio is null)
            return ResponseDto<ExercicioDto>.FailureResult("Exercício não encontrado");

        return ResponseDto<ExercicioDto>.SuccessResult(MapToDto(exercicio));
    }

    public async Task<ResponseDto<IEnumerable<ExercicioDto>>> GetByGrupoMuscularAsync(GrupoMuscular grupoMuscular)
    {
        var exercicios = await _exercicioRepository.FindAsync(e => e.GrupoMuscular == grupoMuscular);
        var dtos = exercicios.OrderBy(e => e.Nome).Select(MapToDto);
        return ResponseDto<IEnumerable<ExercicioDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<ExercicioDto>> CreateAsync(CreateExercicioDto dto)
    {
        var exercicio = new Exercicio
        {
            Nome = dto.Nome,
            GrupoMuscular = dto.GrupoMuscular,
            Descricao = dto.Descricao,
            VideoUrl = dto.VideoUrl,
            ImagemUrl = dto.ImagemUrl
        };

        await _exercicioRepository.AddAsync(exercicio);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<ExercicioDto>.SuccessResult(MapToDto(exercicio), "Exercício criado com sucesso");
    }

    public async Task<ResponseDto<ExercicioDto>> UpdateAsync(Guid id, UpdateExercicioDto dto)
    {
        var exercicio = await _exercicioRepository.GetByIdAsync(id);
        if (exercicio is null)
            return ResponseDto<ExercicioDto>.FailureResult("Exercício não encontrado");

        if (dto.Nome is not null) exercicio.Nome = dto.Nome;
        if (dto.GrupoMuscular.HasValue) exercicio.GrupoMuscular = dto.GrupoMuscular.Value;
        if (dto.Descricao is not null) exercicio.Descricao = dto.Descricao;
        if (dto.VideoUrl is not null) exercicio.VideoUrl = dto.VideoUrl;
        if (dto.ImagemUrl is not null) exercicio.ImagemUrl = dto.ImagemUrl;

        _exercicioRepository.Update(exercicio);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<ExercicioDto>.SuccessResult(MapToDto(exercicio), "Exercício atualizado com sucesso");
    }

    public async Task<ResponseDto<bool>> DeleteAsync(Guid id)
    {
        var exercicio = await _exercicioRepository.GetByIdAsync(id);
        if (exercicio is null)
            return ResponseDto<bool>.FailureResult("Exercício não encontrado");

        _exercicioRepository.Remove(exercicio);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<bool>.SuccessResult(true, "Exercício removido com sucesso");
    }

    private static ExercicioDto MapToDto(Exercicio exercicio)
    {
        return new ExercicioDto
        {
            Id = exercicio.Id,
            Nome = exercicio.Nome,
            GrupoMuscular = exercicio.GrupoMuscular,
            Descricao = exercicio.Descricao,
            VideoUrl = exercicio.VideoUrl,
            ImagemUrl = exercicio.ImagemUrl
        };
    }
}
