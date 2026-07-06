using FitX.Application.DTOs;
using FitX.Domain.Entities;
using FitX.Domain.Interfaces;

namespace FitX.Application.Services;

public class TreinoService
{
    private readonly ITreinoRepository _treinoRepository;
    private readonly IRepository<Serie> _serieRepository;
    private readonly IUnitOfWork _unitOfWork;

    public TreinoService(
        ITreinoRepository treinoRepository,
        IRepository<Serie> serieRepository,
        IUnitOfWork unitOfWork)
    {
        _treinoRepository = treinoRepository;
        _serieRepository = serieRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ResponseDto<IEnumerable<TreinoDto>>> GetByAlunoIdAsync(Guid alunoId)
    {
        var treinos = await _treinoRepository.GetByAlunoIdAsync(alunoId);
        var dtos = treinos.Select(MapToDto);
        return ResponseDto<IEnumerable<TreinoDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<IEnumerable<TreinoDto>>> GetByProfessorIdAsync(Guid professorId)
    {
        var treinos = await _treinoRepository.GetByProfessorIdAsync(professorId);
        var dtos = treinos.Select(MapToDto);
        return ResponseDto<IEnumerable<TreinoDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<TreinoDto>> GetByIdAsync(Guid id)
    {
        var treino = await _treinoRepository.GetDetailedByIdAsync(id);
        if (treino is null)
            return ResponseDto<TreinoDto>.FailureResult("Treino não encontrado");

        return ResponseDto<TreinoDto>.SuccessResult(MapToDto(treino));
    }

    public async Task<ResponseDto<TreinoDto>> CreateAsync(CreateTreinoDto dto, Guid professorId)
    {
        var treino = new Treino
        {
            AlunoId = dto.AlunoId,
            ProfessorId = professorId,
            Nome = dto.Nome,
            Descricao = dto.Descricao,
            DataInicio = dto.DataInicio,
            DiaSemana = dto.DiaSemana,
            Ativo = true
        };

        await _treinoRepository.AddAsync(treino);
        await _unitOfWork.SaveChangesAsync();

        var result = await _treinoRepository.GetDetailedByIdAsync(treino.Id);
        return ResponseDto<TreinoDto>.SuccessResult(MapToDto(result!), "Treino criado com sucesso");
    }

    public async Task<ResponseDto<TreinoDto>> UpdateAsync(Guid id, UpdateTreinoDto dto)
    {
        var treino = await _treinoRepository.GetByIdAsync(id);
        if (treino is null)
            return ResponseDto<TreinoDto>.FailureResult("Treino não encontrado");

        if (dto.Nome is not null) treino.Nome = dto.Nome;
        if (dto.Descricao is not null) treino.Descricao = dto.Descricao;
        if (dto.DataFim.HasValue) treino.DataFim = dto.DataFim;
        if (dto.Ativo.HasValue) treino.Ativo = dto.Ativo.Value;
        if (dto.DiaSemana.HasValue) treino.DiaSemana = dto.DiaSemana.Value;

        _treinoRepository.Update(treino);
        await _unitOfWork.SaveChangesAsync();

        var result = await _treinoRepository.GetDetailedByIdAsync(treino.Id);
        return ResponseDto<TreinoDto>.SuccessResult(MapToDto(result!), "Treino atualizado com sucesso");
    }

    public async Task<ResponseDto<bool>> AddSerieAsync(Guid treinoId, CreateSerieDto dto)
    {
        var treino = await _treinoRepository.GetByIdAsync(treinoId);
        if (treino is null)
            return ResponseDto<bool>.FailureResult("Treino não encontrado");

        var serie = new Serie
        {
            TreinoId = treinoId,
            ExercicioId = dto.ExercicioId,
            Repeticoes = dto.Repeticoes,
            Carga = dto.Carga,
            DescansoSegundos = dto.DescansoSegundos,
            Ordem = dto.Ordem,
            Observacao = dto.Observacao
        };

        await _serieRepository.AddAsync(serie);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<bool>.SuccessResult(true, "Série adicionada com sucesso");
    }

    public async Task<ResponseDto<bool>> DeleteAsync(Guid id)
    {
        var treino = await _treinoRepository.GetByIdAsync(id);
        if (treino is null)
            return ResponseDto<bool>.FailureResult("Treino não encontrado");

        _treinoRepository.Remove(treino);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<bool>.SuccessResult(true, "Treino removido com sucesso");
    }

    private static TreinoDto MapToDto(Treino treino)
    {
        return new TreinoDto
        {
            Id = treino.Id,
            AlunoId = treino.AlunoId,
            AlunoNome = treino.Aluno?.Usuario?.Nome ?? string.Empty,
            ProfessorId = treino.ProfessorId,
            ProfessorNome = treino.Professor?.Usuario?.Nome ?? string.Empty,
            Nome = treino.Nome,
            Descricao = treino.Descricao,
            DataInicio = treino.DataInicio,
            DataFim = treino.DataFim,
            Ativo = treino.Ativo,
            DiaSemana = treino.DiaSemana,
            TotalSeries = treino.Series?.Count ?? 0
        };
    }
}
