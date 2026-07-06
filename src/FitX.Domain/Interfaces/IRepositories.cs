using FitX.Domain.Entities;
using FitX.Domain.Enums;

namespace FitX.Domain.Interfaces;

public interface IUsuarioRepository : IRepository<Usuario>
{
    Task<Usuario?> GetByEmailAsync(string email);
    Task<IEnumerable<Usuario>> GetByRoleAsync(UserRole role);
    Task<bool> EmailExistsAsync(string email);
}

public interface IAlunoRepository : IRepository<Aluno>
{
    Task<Aluno?> GetByUsuarioIdAsync(Guid usuarioId);
    Task<Aluno?> GetDetailedByIdAsync(Guid id);
    Task<IEnumerable<Aluno>> GetAllWithDetailsAsync();
    Task<IEnumerable<Aluno>> GetByProfessorIdAsync(Guid professorId);
    Task<IEnumerable<Aluno>> GetByStatusAsync(StatusAluno status);
}

public interface IProfessorRepository : IRepository<Professor>
{
    Task<Professor?> GetByUsuarioIdAsync(Guid usuarioId);
    Task<Professor?> GetDetailedByIdAsync(Guid id);
    Task<IEnumerable<Professor>> GetAllWithDetailsAsync();
}

public interface ITreinoRepository : IRepository<Treino>
{
    Task<Treino?> GetDetailedByIdAsync(Guid id);
    Task<IEnumerable<Treino>> GetByAlunoIdAsync(Guid alunoId);
    Task<IEnumerable<Treino>> GetByProfessorIdAsync(Guid professorId);
}

public interface ICheckinRepository : IRepository<Checkin>
{
    Task<IEnumerable<Checkin>> GetByAlunoIdAsync(Guid alunoId);
    Task<Checkin?> GetActiveCheckinAsync(Guid alunoId);
    Task<IEnumerable<Checkin>> GetActiveCheckinsAsync();
}

public interface IMensalidadeRepository : IRepository<Mensalidade>
{
    Task<IEnumerable<Mensalidade>> GetByAlunoIdAsync(Guid alunoId);
    Task<IEnumerable<Mensalidade>> GetByStatusAsync(StatusMensalidade status);
    Task<Mensalidade?> GetWithPagamentosAsync(Guid id);
}

public interface IAulaRepository : IRepository<Aula>
{
    Task<IEnumerable<Aula>> GetAllWithProfessorAsync();
    Task<Aula?> GetDetailedByIdAsync(Guid id);
}

public interface IAvaliacaoRepository : IRepository<Avaliacao>
{
    Task<IEnumerable<Avaliacao>> GetByAlunoIdAsync(Guid alunoId);
    Task<Avaliacao?> GetDetailedByIdAsync(Guid id);
    Task<IEnumerable<Avaliacao>> GetByProfessorIdAsync(Guid professorId);
}

public interface IPagamentoRepository : IRepository<Pagamento>
{
    Task<IEnumerable<Pagamento>> GetByMensalidadeIdAsync(Guid mensalidadeId);
    Task<IEnumerable<Pagamento>> GetAllWithDetailsAsync();
    Task<Pagamento?> GetDetailedByIdAsync(Guid id);
}

public interface IAgendamentoRepository : IRepository<Agendamento>
{
    Task<IEnumerable<Agendamento>> GetByAlunoIdAsync(Guid alunoId);
    Task<IEnumerable<Agendamento>> GetByAulaIdAsync(Guid aulaId);
    Task<Agendamento?> GetDetailedByIdAsync(Guid id);
    Task<IEnumerable<Agendamento>> GetByDataAsync(DateTime data);
}

public interface INotificacaoRepository : IRepository<Notificacao>
{
    Task<IEnumerable<Notificacao>> GetByUsuarioIdAsync(Guid usuarioId);
    Task<IEnumerable<Notificacao>> GetNaoLidasAsync(Guid usuarioId);
    Task<int> CountNaoLidasAsync(Guid usuarioId);
}
