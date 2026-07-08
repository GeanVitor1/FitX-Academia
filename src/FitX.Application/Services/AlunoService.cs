using FitX.Application.DTOs;
using FitX.Domain.Entities;
using FitX.Domain.Enums;
using FitX.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace FitX.Application.Services;

public class AlunoService
{
    private readonly IAlunoRepository _alunoRepository;
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly UserManager<Usuario> _userManager;
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificacaoRepository _notificacaoRepository;
    private readonly IRepository<Plano> _planoRepository;

    public AlunoService(
        IAlunoRepository alunoRepository,
        IUsuarioRepository usuarioRepository,
        UserManager<Usuario> userManager,
        IUnitOfWork unitOfWork,
        INotificacaoRepository notificacaoRepository,
        IRepository<Plano> planoRepository)
    {
        _alunoRepository = alunoRepository;
        _usuarioRepository = usuarioRepository;
        _userManager = userManager;
        _unitOfWork = unitOfWork;
        _notificacaoRepository = notificacaoRepository;
        _planoRepository = planoRepository;
    }

    public async Task<ResponseDto<IEnumerable<AlunoDto>>> GetAllAsync()
    {
        var alunos = await _alunoRepository.GetAllWithDetailsAsync();
        var dtos = alunos.Select(MapToDto);
        return ResponseDto<IEnumerable<AlunoDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<AlunoDto>> GetByIdAsync(Guid id)
    {
        var aluno = await _alunoRepository.GetDetailedByIdAsync(id);
        if (aluno is null)
            return ResponseDto<AlunoDto>.FailureResult("Aluno não encontrado");

        return ResponseDto<AlunoDto>.SuccessResult(MapToDto(aluno));
    }

    public async Task<ResponseDto<AlunoDto>> GetByUsuarioIdAsync(Guid usuarioId)
    {
        var aluno = await _alunoRepository.GetByUsuarioIdAsync(usuarioId);
        if (aluno is null)
            return ResponseDto<AlunoDto>.FailureResult("Aluno não encontrado");

        return ResponseDto<AlunoDto>.SuccessResult(MapToDto(aluno));
    }

    public async Task<ResponseDto<AlunoDto>> CreateAsync(CreateAlunoDto dto)
    {
        if (await _alunoRepository.EmailExistsAsync(dto.Email))
            return ResponseDto<AlunoDto>.FailureResult("Email já está em uso");

        var usuario = new Usuario
        {
            UserName = dto.Email,
            Nome = dto.Nome,
            Email = dto.Email,
            Role = UserRole.Aluno,
            Telefone = dto.Telefone,
            Ativo = true
        };

        var identityResult = await _userManager.CreateAsync(usuario, dto.Password);
        if (!identityResult.Succeeded)
            return ResponseDto<AlunoDto>.FailureResult(
                identityResult.Errors.FirstOrDefault()?.Description ?? "Erro ao criar usuário");

        await _unitOfWork.SaveChangesAsync();

        var aluno = new Aluno
        {
            UsuarioId = usuario.Id,
            ProfessorId = dto.ProfessorId,
            PlanoId = dto.PlanoId,
            DataMatricula = DateTime.UtcNow,
            Status = StatusAluno.Ativo,
            Observacoes = dto.Observacoes
        };

        await _alunoRepository.AddAsync(aluno);
        await _unitOfWork.SaveChangesAsync();

        var planoNome = "selecionado";
        if (dto.PlanoId.HasValue)
        {
            var plano = await _planoRepository.GetByIdAsync(dto.PlanoId.Value);
            if (plano is not null)
                planoNome = $"{plano.Nome} (R$ {plano.Preco:F2}/mês)";
        }

        var notificacao = new Notificacao
        {
            UsuarioId = usuario.Id,
            Titulo = "Pagamento Pendente",
            Mensagem = $"Você foi cadastrado no plano {planoNome}. Realize o pagamento para liberar o acesso completo à academia.",
            Link = "/aluno/mensalidades",
            Lida = false
        };
        await _notificacaoRepository.AddAsync(notificacao);
        await _unitOfWork.SaveChangesAsync();

        var result = await _alunoRepository.GetDetailedByIdAsync(aluno.Id);
        return ResponseDto<AlunoDto>.SuccessResult(MapToDto(result!), "Aluno criado com sucesso");
    }

    public async Task<ResponseDto<AlunoDto>> UpdateAsync(Guid id, UpdateAlunoDto dto)
    {
        var aluno = await _alunoRepository.GetByIdAsync(id);
        if (aluno is null)
            return ResponseDto<AlunoDto>.FailureResult("Aluno não encontrado");

        if (dto.Telefone is not null && aluno.Usuario is not null) aluno.Usuario.Telefone = dto.Telefone;
        if (dto.ProfessorId.HasValue) aluno.ProfessorId = dto.ProfessorId;
        if (dto.PlanoId.HasValue) aluno.PlanoId = dto.PlanoId;
        if (dto.Status.HasValue) aluno.Status = dto.Status.Value;
        if (dto.Observacoes is not null) aluno.Observacoes = dto.Observacoes;

        _alunoRepository.Update(aluno);
        await _unitOfWork.SaveChangesAsync();

        var result = await _alunoRepository.GetDetailedByIdAsync(aluno.Id);
        return ResponseDto<AlunoDto>.SuccessResult(MapToDto(result!), "Aluno atualizado com sucesso");
    }

    public async Task<ResponseDto<bool>> DeleteAsync(Guid id)
    {
        var aluno = await _alunoRepository.GetByIdAsync(id);
        if (aluno is null)
            return ResponseDto<bool>.FailureResult("Aluno não encontrado");

        _alunoRepository.Remove(aluno);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<bool>.SuccessResult(true, "Aluno removido com sucesso");
    }

    private static AlunoDto MapToDto(Aluno aluno)
    {
        return new AlunoDto
        {
            Id = aluno.Id,
            UsuarioId = aluno.UsuarioId,
            Nome = aluno.Usuario?.Nome ?? string.Empty,
            Email = aluno.Usuario?.Email ?? string.Empty,
            Telefone = aluno.Usuario?.Telefone,
            ProfessorId = aluno.ProfessorId,
            ProfessorNome = aluno.Professor?.Usuario?.Nome,
            PlanoId = aluno.PlanoId,
            PlanoNome = aluno.Plano?.Nome,
            DataMatricula = aluno.DataMatricula,
            Status = aluno.Status,
            Observacoes = aluno.Observacoes
        };
    }
}
