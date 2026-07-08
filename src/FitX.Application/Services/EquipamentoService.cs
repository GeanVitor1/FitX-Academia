using FitX.Application.DTOs;
using FitX.Domain.Entities;
using FitX.Domain.Interfaces;

namespace FitX.Application.Services;

public class EquipamentoService
{
    private readonly IRepository<Equipamento> _equipamentoRepository;
    private readonly IUnitOfWork _unitOfWork;

    public EquipamentoService(IRepository<Equipamento> equipamentoRepository, IUnitOfWork unitOfWork)
    {
        _equipamentoRepository = equipamentoRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ResponseDto<IEnumerable<EquipamentoDto>>> GetAllAsync()
    {
        var equipamentos = await _equipamentoRepository.GetAllAsync();
        var dtos = equipamentos.Select(MapToDto);
        return ResponseDto<IEnumerable<EquipamentoDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<EquipamentoDto>> GetByIdAsync(Guid id)
    {
        var equipamento = await _equipamentoRepository.GetByIdAsync(id);
        if (equipamento is null)
            return ResponseDto<EquipamentoDto>.FailureResult("Equipamento não encontrado");

        return ResponseDto<EquipamentoDto>.SuccessResult(MapToDto(equipamento));
    }

    public async Task<ResponseDto<EquipamentoDto>> CreateAsync(CreateEquipamentoDto dto)
    {
        var equipamento = new Equipamento
        {
            Nome = dto.Nome,
            Categoria = dto.Categoria,
            Localizacao = dto.Localizacao,
            Status = dto.Status,
            UltimaManutencao = dto.UltimaManutencao,
            Ativo = true
        };

        await _equipamentoRepository.AddAsync(equipamento);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<EquipamentoDto>.SuccessResult(MapToDto(equipamento), "Equipamento criado com sucesso");
    }

    public async Task<ResponseDto<EquipamentoDto>> UpdateAsync(Guid id, UpdateEquipamentoDto dto)
    {
        var equipamento = await _equipamentoRepository.GetByIdAsync(id);
        if (equipamento is null)
            return ResponseDto<EquipamentoDto>.FailureResult("Equipamento não encontrado");

        if (dto.Nome is not null) equipamento.Nome = dto.Nome;
        if (dto.Categoria is not null) equipamento.Categoria = dto.Categoria;
        if (dto.Localizacao is not null) equipamento.Localizacao = dto.Localizacao;
        if (dto.Status.HasValue) equipamento.Status = dto.Status.Value;
        if (dto.UltimaManutencao is not null) equipamento.UltimaManutencao = dto.UltimaManutencao;
        if (dto.Ativo.HasValue) equipamento.Ativo = dto.Ativo.Value;

        _equipamentoRepository.Update(equipamento);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<EquipamentoDto>.SuccessResult(MapToDto(equipamento), "Equipamento atualizado com sucesso");
    }

    public async Task<ResponseDto<bool>> DeleteAsync(Guid id)
    {
        var equipamento = await _equipamentoRepository.GetByIdAsync(id);
        if (equipamento is null)
            return ResponseDto<bool>.FailureResult("Equipamento não encontrado");

        _equipamentoRepository.Remove(equipamento);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<bool>.SuccessResult(true, "Equipamento removido com sucesso");
    }

    private static EquipamentoDto MapToDto(Equipamento equipamento)
    {
        return new EquipamentoDto
        {
            Id = equipamento.Id,
            Nome = equipamento.Nome,
            Categoria = equipamento.Categoria,
            Localizacao = equipamento.Localizacao,
            Status = equipamento.Status,
            UltimaManutencao = equipamento.UltimaManutencao,
            Ativo = equipamento.Ativo
        };
    }
}
