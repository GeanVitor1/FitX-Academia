using AutoMapper;
using FitX.Application.DTOs;
using FitX.Domain.Entities;

namespace FitX.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Aluno, AlunoDto>()
            .ForMember(dest => dest.Nome, opt => opt.MapFrom(src => src.Usuario!.Nome))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Usuario!.Email))
            .ForMember(dest => dest.Telefone, opt => opt.MapFrom(src => src.Usuario!.Telefone))
            .ForMember(dest => dest.ProfessorNome, opt => opt.MapFrom(src => src.Professor!.Usuario!.Nome))
            .ForMember(dest => dest.PlanoNome, opt => opt.MapFrom(src => src.Plano!.Nome));

        CreateMap<Professor, ProfessorDto>()
            .ForMember(dest => dest.Nome, opt => opt.MapFrom(src => src.Usuario!.Nome))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Usuario!.Email));

        CreateMap<Treino, TreinoDto>()
            .ForMember(dest => dest.AlunoNome, opt => opt.MapFrom(src => src.Aluno!.Usuario!.Nome))
            .ForMember(dest => dest.ProfessorNome, opt => opt.MapFrom(src => src.Professor!.Usuario!.Nome))
            .ForMember(dest => dest.TotalSeries, opt => opt.MapFrom(src => src.Series!.Count));

        CreateMap<Plano, PlanoDto>();

        CreateMap<Mensalidade, MensalidadeDto>()
            .ForMember(dest => dest.AlunoNome, opt => opt.MapFrom(src => src.Aluno!.Usuario!.Nome))
            .ForMember(dest => dest.PlanoNome, opt => opt.MapFrom(src => src.Plano!.Nome))
            .ForMember(dest => dest.TotalPago, opt => opt.MapFrom(src => src.Pagamentos!.Sum(p => p.Valor)))
            .ForMember(dest => dest.Saldo, opt => opt.MapFrom(src => src.Valor - src.Pagamentos!.Sum(p => p.Valor)));

        CreateMap<Pagamento, PagamentoDto>();

        CreateMap<Avaliacao, AvaliacaoDto>()
            .ForMember(dest => dest.AlunoNome, opt => opt.MapFrom(src => src.Aluno!.Usuario!.Nome))
            .ForMember(dest => dest.ProfessorNome, opt => opt.MapFrom(src => src.Professor!.Usuario!.Nome));

        CreateMap<Aula, AulaDto>()
            .ForMember(dest => dest.ProfessorNome, opt => opt.MapFrom(src => src.Professor!.Usuario!.Nome));

        CreateMap<Agendamento, AgendamentoDto>()
            .ForMember(dest => dest.AlunoNome, opt => opt.MapFrom(src => src.Aluno!.Usuario!.Nome))
            .ForMember(dest => dest.AulaNome, opt => opt.MapFrom(src => src.Aula!.Nome));

        CreateMap<Checkin, CheckinDto>()
            .ForMember(dest => dest.AlunoNome, opt => opt.MapFrom(src => src.Aluno!.Usuario!.Nome));

        CreateMap<Notificacao, NotificacaoDto>();
        CreateMap<Usuario, UsuarioDto>();
    }
}
