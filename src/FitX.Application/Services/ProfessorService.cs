using FitX.Application.DTOs;
using FitX.Domain.Entities;
using FitX.Domain.Enums;
using FitX.Domain.Interfaces;

namespace FitX.Application.Services;

public class ProfessorService
{
    private readonly IProfessorRepository _professorRepository;
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ProfessorService(
        IProfessorRepository professorRepository,
        IUsuarioRepository usuarioRepository,
        IUnitOfWork unitOfWork)
    {
        _professorRepository = professorRepository;
        _usuarioRepository = usuarioRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ResponseDto<IEnumerable<ProfessorDto>>> GetAllAsync()
    {
        var professores = await _professorRepository.GetAllWithDetailsAsync();
        var dtos = professores.Select(MapToDto);
        return ResponseDto<IEnumerable<ProfessorDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<ProfessorDto>> GetByIdAsync(Guid id)
    {
        var professor = await _professorRepository.GetDetailedByIdAsync(id);
        if (professor is null)
            return ResponseDto<ProfessorDto>.FailureResult("Professor não encontrado");

        return ResponseDto<ProfessorDto>.SuccessResult(MapToDto(professor));
    }

    public async Task<ResponseDto<ProfessorDto>> GetByUsuarioIdAsync(Guid usuarioId)
    {
        var professor = await _professorRepository.GetByUsuarioIdAsync(usuarioId);
        if (professor is null)
            return ResponseDto<ProfessorDto>.FailureResult("Professor não encontrado");

        return ResponseDto<ProfessorDto>.SuccessResult(MapToDto(professor));
    }

    public async Task<ResponseDto<ProfessorDto>> CreateAsync(CreateProfessorDto dto)
    {
        if (await _usuarioRepository.EmailExistsAsync(dto.Email))
            return ResponseDto<ProfessorDto>.FailureResult("Email já está em uso");

        var usuario = new Usuario
        {
            Nome = dto.Nome,
            Email = dto.Email,
            Role = UserRole.Professor,
            Telefone = dto.Telefone,
            Ativo = true
        };

        await _usuarioRepository.AddAsync(usuario);
        await _unitOfWork.SaveChangesAsync();

        var professor = new Professor
        {
            UsuarioId = usuario.Id,
            Especialidade = dto.Especialidade,
            CREF = dto.CREF,
            Bio = dto.Bio
        };

        await _professorRepository.AddAsync(professor);
        await _unitOfWork.SaveChangesAsync();

        var result = await _professorRepository.GetDetailedByIdAsync(professor.Id);
        return ResponseDto<ProfessorDto>.SuccessResult(MapToDto(result!), "Professor criado com sucesso");
    }

    public async Task<ResponseDto<ProfessorDto>> UpdateAsync(Guid id, UpdateProfessorDto dto)
    {
        var professor = await _professorRepository.GetByIdAsync(id);
        if (professor is null)
            return ResponseDto<ProfessorDto>.FailureResult("Professor não encontrado");

        if (dto.Telefone is not null) professor.Usuario!.Telefone = dto.Telefone;
        if (dto.Especialidade is not null) professor.Especialidade = dto.Especialidade;
        if (dto.CREF is not null) professor.CREF = dto.CREF;
        if (dto.Bio is not null) professor.Bio = dto.Bio;

        _professorRepository.Update(professor);
        await _unitOfWork.SaveChangesAsync();

        var result = await _professorRepository.GetDetailedByIdAsync(professor.Id);
        return ResponseDto<ProfessorDto>.SuccessResult(MapToDto(result!), "Professor atualizado com sucesso");
    }

    public async Task<ResponseDto<bool>> DeleteAsync(Guid id)
    {
        var professor = await _professorRepository.GetByIdAsync(id);
        if (professor is null)
            return ResponseDto<bool>.FailureResult("Professor não encontrado");

        _professorRepository.Remove(professor);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<bool>.SuccessResult(true, "Professor removido com sucesso");
    }

    private static ProfessorDto MapToDto(Professor professor)
    {
        return new ProfessorDto
        {
            Id = professor.Id,
            UsuarioId = professor.UsuarioId,
            Nome = professor.Usuario?.Nome ?? string.Empty,
            Email = professor.Usuario?.Email ?? string.Empty,
            Telefone = professor.Usuario?.Telefone,
            Especialidade = professor.Especialidade,
            CREF = professor.CREF,
            Bio = professor.Bio,
            AvaliacaoMedia = professor.AvaliacaoMedia,
            TotalAlunos = professor.Alunos?.Count ?? 0
        };
    }
}
