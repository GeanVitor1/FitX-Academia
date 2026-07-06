using FitX.Application.DTOs;
using FitX.Domain.Entities;
using FitX.Domain.Enums;
using FitX.Domain.Interfaces;

namespace FitX.Application.Services;

public class PagamentoService
{
    private readonly IPagamentoRepository _pagamentoRepository;
    private readonly IMensalidadeRepository _mensalidadeRepository;
    private readonly IUnitOfWork _unitOfWork;

    public PagamentoService(
        IPagamentoRepository pagamentoRepository,
        IMensalidadeRepository mensalidadeRepository,
        IUnitOfWork unitOfWork)
    {
        _pagamentoRepository = pagamentoRepository;
        _mensalidadeRepository = mensalidadeRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ResponseDto<IEnumerable<PagamentoDto>>> GetAllAsync()
    {
        var pagamentos = await _pagamentoRepository.GetAllWithDetailsAsync();
        var dtos = pagamentos.Select(MapToDto);
        return ResponseDto<IEnumerable<PagamentoDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<IEnumerable<PagamentoDto>>> GetByMensalidadeIdAsync(Guid mensalidadeId)
    {
        var pagamentos = await _pagamentoRepository.GetByMensalidadeIdAsync(mensalidadeId);
        var dtos = pagamentos.Select(MapToDto);
        return ResponseDto<IEnumerable<PagamentoDto>>.SuccessResult(dtos);
    }

    public async Task<ResponseDto<PagamentoDto>> GetByIdAsync(Guid id)
    {
        var pagamento = await _pagamentoRepository.GetDetailedByIdAsync(id);
        if (pagamento is null)
            return ResponseDto<PagamentoDto>.FailureResult("Pagamento não encontrado");

        return ResponseDto<PagamentoDto>.SuccessResult(MapToDto(pagamento));
    }

    public async Task<ResponseDto<PagamentoDto>> CreateAsync(CreatePagamentoDto dto)
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

        return ResponseDto<PagamentoDto>.SuccessResult(MapToDto(pagamento), "Pagamento registrado com sucesso");
    }

    private static PagamentoDto MapToDto(Pagamento pagamento)
    {
        return new PagamentoDto
        {
            Id = pagamento.Id,
            MensalidadeId = pagamento.MensalidadeId,
            Metodo = pagamento.Metodo,
            Valor = pagamento.Valor,
            Data = pagamento.Data,
            Comprovante = pagamento.Comprovante,
            Status = pagamento.Status
        };
    }
}
