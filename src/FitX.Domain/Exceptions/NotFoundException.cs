namespace FitX.Domain.Exceptions;

public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }
    public NotFoundException(string name, object key) : base($"Entidade \"{name}\" com chave ({key}) não foi encontrada.") { }
}
