using FitX.Application.DTOs;
using FitX.Domain.Entities;
using FitX.Domain.Enums;
using FitX.Domain.Interfaces;

namespace FitX.Application.Services;

public class UsuarioService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UsuarioService(IUsuarioRepository usuarioRepository, IUnitOfWork unitOfWork)
    {
        _usuarioRepository = usuarioRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ResponseDto<IEnumerable<UsuarioDto>>> GetAllAsync()
    {
        var usuarios = await _usuarioRepository.GetAllAsync();
        var dtos = usuarios.Select(MapToDto);
        return ResponseDto<IEnumerable<UsuarioDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<UsuarioDto>> GetByIdAsync(Guid id)
    {
        var usuario = await _usuarioRepository.GetByIdAsync(id);
        if (usuario is null)
            return ResponseDto<UsuarioDto>.FailureResult("Usuário não encontrado");

        return ResponseDto<UsuarioDto>.SuccessResult(MapToDto(usuario));
    }

    public async Task<ResponseDto<UsuarioDto>> UpdateAsync(Guid id, UpdateUsuarioDto dto)
    {
        var usuario = await _usuarioRepository.GetByIdAsync(id);
        if (usuario is null)
            return ResponseDto<UsuarioDto>.FailureResult("Usuário não encontrado");

        if (dto.Nome is not null) usuario.Nome = dto.Nome;
        if (dto.Telefone is not null) usuario.Telefone = dto.Telefone;
        if (dto.Avatar is not null) usuario.Avatar = dto.Avatar;
        if (dto.Ativo.HasValue) usuario.Ativo = dto.Ativo.Value;

        _usuarioRepository.Update(usuario);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<UsuarioDto>.SuccessResult(MapToDto(usuario), "Usuário atualizado com sucesso");
    }

    public async Task<ResponseDto<bool>> DeleteAsync(Guid id)
    {
        var usuario = await _usuarioRepository.GetByIdAsync(id);
        if (usuario is null)
            return ResponseDto<bool>.FailureResult("Usuário não encontrado");

        _usuarioRepository.Remove(usuario);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<bool>.SuccessResult(true, "Usuário removido com sucesso");
    }

    private static UsuarioDto MapToDto(Usuario usuario)
    {
        return new UsuarioDto
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email,
            Role = usuario.Role,
            Avatar = usuario.Avatar,
            Telefone = usuario.Telefone,
            Ativo = usuario.Ativo,
            CriadoEm = usuario.CriadoEm,
            UltimoLogin = usuario.UltimoLogin
        };
    }
}
