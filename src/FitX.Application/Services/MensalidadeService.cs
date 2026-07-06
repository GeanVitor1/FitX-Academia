using FitX.Application.DTOs;
using FitX.Domain.Entities;
using FitX.Domain.Enums;
using FitX.Domain.Interfaces;

namespace FitX.Application.Services;

public class MensalidadeService
{
    private readonly IMensalidadeRepository _mensalidadeRepository;
    private readonly IRepository<Pagamento> _pagamentoRepository;
    private readonly IAlunoRepository _alunoRepository;
    private readonly IUnitOfWork _unitOfWork;

    public MensalidadeService(
        IMensalidadeRepository mensalidadeRepository,
        IRepository<Pagamento> pagamentoRepository,
        IAlunoRepository alunoRepository,
        IUnitOfWork unitOfWork)
    {
        _mensalidadeRepository = mensalidadeRepository;
        _pagamentoRepository = pagamentoRepository;
        _alunoRepository = alunoRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ResponseDto<IEnumerable<MensalidadeDto>>> GetByAlunoIdAsync(Guid alunoId)
    {
        var mensalidades = await _mensalidadeRepository.GetByAlunoIdAsync(alunoId);
        var dtos = mensalidades.Select(MensalidadeMapper.MapToDto);
        return ResponseDto<IEnumerable<MensalidadeDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<MensalidadeDto>> GetByIdAsync(Guid id)
    {
        var mensalidade = await _mensalidadeRepository.GetWithPagamentosAsync(id);
        if (mensalidade is null)
            return ResponseDto<MensalidadeDto>.FailureResult("Mensalidade não encontrada");

        return ResponseDto<MensalidadeDto>.SuccessResult(MensalidadeMapper.MapToDto(mensalidade));
    }

    public async Task<ResponseDto<MensalidadeDto>> CreateAsync(CreateMensalidadeDto dto)
    {
        var mensalidade = new Mensalidade
        {
            AlunoId = dto.AlunoId,
            PlanoId = dto.PlanoId,
            Valor = dto.Valor,
            DataVencimento = dto.DataVencimento,
            Status = StatusMensalidade.Aberta,
            Observacao = dto.Observacao
        };

        await _mensalidadeRepository.AddAsync(mensalidade);
        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<MensalidadeDto>.SuccessResult(MensalidadeMapper.MapToDto(mensalidade), "Mensalidade criada com sucesso");
    }

    public async Task<ResponseDto<PagamentoDto>> RegisterPaymentAsync(CreatePagamentoDto dto)
    {
        var mensalidade = await _mensalidadeRepository.GetWithPagamentosAsync(dto.MensalidadeId);
        if (mensalidade is null)
            return ResponseDto<PagamentoDto>.FailureResult("Mensalidade não encontrada");

        var pagamento = new Pagamento
        {
            MensalidadeId = dto.MensalidadeId,
            Metodo = dto.Metodo,
            Valor = dto.Valor,
            Data = DateTime.UtcNow,
            Comprovante = dto.Comprovante,
            Status = StatusPagamento.Pago
        };

        await _pagamentoRepository.AddAsync(pagamento);

        var totalPago = mensalidade.Pagamentos.Sum(p => p.Valor) + dto.Valor;
        if (totalPago >= mensalidade.Valor)
        {
            mensalidade.Status = StatusMensalidade.Paga;
            mensalidade.PagoEm = DateTime.UtcNow;
            _mensalidadeRepository.Update(mensalidade);
        }

        await _unitOfWork.SaveChangesAsync();

        return ResponseDto<PagamentoDto>.SuccessResult(new PagamentoDto
        {
            Id = pagamento.Id,
            MensalidadeId = pagamento.MensalidadeId,
            Metodo = pagamento.Metodo,
            Valor = pagamento.Valor,
            Data = pagamento.Data,
            Comprovante = pagamento.Comprovante,
            Status = pagamento.Status
        }, "Pagamento registrado com sucesso");
    }
}

internal static class MensalidadeMapper
{
    internal static MensalidadeDto MapToDto(Mensalidade mensalidade)
    {
        var totalPago = mensalidade.Pagamentos?.Sum(p => p.Valor) ?? 0;
        return new MensalidadeDto
        {
            Id = mensalidade.Id,
            AlunoId = mensalidade.AlunoId,
            AlunoNome = mensalidade.Aluno?.Usuario?.Nome ?? string.Empty,
            PlanoId = mensalidade.PlanoId,
            PlanoNome = mensalidade.Plano?.Nome ?? string.Empty,
            Valor = mensalidade.Valor,
            DataVencimento = mensalidade.DataVencimento,
            PagoEm = mensalidade.PagoEm,
            Status = mensalidade.Status,
            Observacao = mensalidade.Observacao,
            TotalPago = totalPago,
            Saldo = mensalidade.Valor - totalPago
        };
    }
}
