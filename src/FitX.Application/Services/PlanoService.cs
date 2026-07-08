using FitX.Application.DTOs;
using FitX.Domain.Entities;
using FitX.Domain.Interfaces;

namespace FitX.Application.Services;

public class PlanoService
{
    private readonly IRepository<Plano> _planoRepository;
    private readonly IUnitOfWork _unitOfWork;

    public PlanoService(IRepository<Plano> planoRepository, IUnitOfWork unitOfWork)
    {
        _planoRepository = planoRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ResponseDto<IEnumerable<PlanoDto>>> GetAllAsync()
    {
        var planos = await _planoRepository.GetAllAsync();
        var dtos = planos.OrderBy(p => p.Ordem).Select(MapToDto);
        return ResponseDto<IEnumerable<PlanoDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<PlanoDto>> GetByIdAsync(Guid id)
    {
        var plano = await _planoRepository.GetByIdAsync(id);
        if (plano is null)
            return ResponseDto<PlanoDto>.FailureResult("Plano não encontrado");

        return ResponseDto<PlanoDto>.SuccessResult(MapToDto(plano));
    }

    public async Task<ResponseDto<PlanoDto>> CreateAsync(CreatePlanoDto dto)
    {
        var plano = new Plano
        {
            Nome = dto.Nome,
            Preco = dto.Preco,
            Descricao = dto.Descricao,
            Recursos = dto.Recursos,
            DuracaoDias = dto.DuracaoDias,
            PermitePersonal = dto.PermitePersonal,
            PermiteAulas = dto.PermiteAulas,
            Ativo = true
        };

        await _planoRepository.AddAsync(plano);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<PlanoDto>.SuccessResult(MapToDto(plano), "Plano criado com sucesso");
    }

    public async Task<ResponseDto<PlanoDto>> UpdateAsync(Guid id, UpdatePlanoDto dto)
    {
        var plano = await _planoRepository.GetByIdAsync(id);
        if (plano is null)
            return ResponseDto<PlanoDto>.FailureResult("Plano não encontrado");

        if (dto.Nome is not null) plano.Nome = dto.Nome;
        if (dto.Preco.HasValue) plano.Preco = dto.Preco.Value;
        if (dto.Descricao is not null) plano.Descricao = dto.Descricao;
        if (dto.Recursos is not null) plano.Recursos = dto.Recursos;
        if (dto.DuracaoDias.HasValue) plano.DuracaoDias = dto.DuracaoDias.Value;
        if (dto.PermitePersonal.HasValue) plano.PermitePersonal = dto.PermitePersonal.Value;
        if (dto.PermiteAulas.HasValue) plano.PermiteAulas = dto.PermiteAulas.Value;
        if (dto.Ativo.HasValue) plano.Ativo = dto.Ativo.Value;

        _planoRepository.Update(plano);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<PlanoDto>.SuccessResult(MapToDto(plano), "Plano atualizado com sucesso");
    }

    public async Task<ResponseDto<bool>> DeleteAsync(Guid id)
    {
        var plano = await _planoRepository.GetByIdAsync(id);
        if (plano is null)
            return ResponseDto<bool>.FailureResult("Plano não encontrado");

        _planoRepository.Remove(plano);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<bool>.SuccessResult(true, "Plano removido com sucesso");
    }

    private static PlanoDto MapToDto(Plano plano)
    {
        return new PlanoDto
        {
            Id = plano.Id,
            Nome = plano.Nome,
            Preco = plano.Preco,
            Descricao = plano.Descricao,
            Recursos = plano.Recursos,
            DuracaoDias = plano.DuracaoDias,
            PermitePersonal = plano.PermitePersonal,
            PermiteAulas = plano.PermiteAulas,
            Ativo = plano.Ativo,
            TotalAlunos = plano.Alunos?.Count ?? 0
        };
    }
}
