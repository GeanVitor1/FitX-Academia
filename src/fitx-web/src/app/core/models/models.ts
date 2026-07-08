import type { User } from './auth.models';
export type { User } from './auth.models';

export interface ResponseDto<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface PagedResultDto<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface AlunoDto {
  id: string;
  usuarioId: string;
  nome: string;
  email: string;
  telefone?: string;
  professorId?: string;
  professorNome?: string;
  planoId?: string;
  planoNome?: string;
  dataMatricula: string;
  status: StatusAluno;
  observacoes?: string;
}

export interface CreateAlunoDto {
  nome: string;
  email: string;
  password: string;
  telefone?: string;
  professorId?: string;
  planoId?: string;
  observacoes?: string;
}

export interface UpdateAlunoDto {
  telefone?: string;
  professorId?: string;
  planoId?: string;
  status?: StatusAluno;
  observacoes?: string;
}

export interface ProfessorDto {
  id: string;
  usuarioId: string;
  nome: string;
  email: string;
  telefone?: string;
  especialidade?: string;
  cref?: string;
  bio?: string;
  avaliacaoMedia?: number;
  totalAlunos: number;
}

export interface CreateProfessorDto {
  nome: string;
  email: string;
  password: string;
  telefone?: string;
  especialidade?: string;
  cref?: string;
  bio?: string;
}

export interface UpdateProfessorDto {
  telefone?: string;
  especialidade?: string;
  cref?: string;
  bio?: string;
}

export interface PlanoDto {
  id: string;
  nome: string;
  preco: number;
  descricao?: string;
  recursos?: string;
  duracaoDias: number;
  permitePersonal: boolean;
  permiteAulas: boolean;
  ativo: boolean;
  totalAlunos: number;
}

export interface CreatePlanoDto {
  nome: string;
  preco: number;
  descricao?: string;
  recursos?: string;
  duracaoDias: number;
  permitePersonal: boolean;
  permiteAulas: boolean;
}

export interface UpdatePlanoDto {
  nome?: string;
  preco?: number;
  descricao?: string;
  recursos?: string;
  duracaoDias?: number;
  permitePersonal?: boolean;
  permiteAulas?: boolean;
  ativo?: boolean;
}

export interface TreinoDto {
  id: string;
  alunoId: string;
  alunoNome: string;
  professorId: string;
  professorNome: string;
  nome: string;
  descricao?: string;
  dataInicio: string;
  dataFim?: string;
  ativo: boolean;
  diaSemana: number;
  totalSeries: number;
}

export interface CreateTreinoDto {
  alunoId: string;
  nome: string;
  descricao?: string;
  dataInicio: string;
  diaSemana: number;
}

export interface UpdateTreinoDto {
  nome?: string;
  descricao?: string;
  dataFim?: string;
  ativo?: boolean;
  diaSemana?: number;
}

export interface SerieDto {
  id: string;
  exercicioId: string;
  exercicioNome: string;
  repeticoes: number;
  carga?: number;
  descansoSegundos: number;
  ordem: number;
  observacao?: string;
}

export interface CreateSerieDto {
  exercicioId: string;
  repeticoes: number;
  carga?: number;
  descansoSegundos: number;
  ordem: number;
  observacao?: string;
}

export interface ExercicioDto {
  id: string;
  nome: string;
  grupoMuscular: GrupoMuscular;
  descricao?: string;
  videoUrl?: string;
  imagemUrl?: string;
}

export interface MensalidadeDto {
  id: string;
  alunoId: string;
  alunoNome: string;
  planoId: string;
  planoNome: string;
  valor: number;
  dataVencimento: string;
  pagoEm?: string;
  status: StatusMensalidade;
  observacao?: string;
  totalPago: number;
  saldo: number;
}

export interface CreateMensalidadeDto {
  alunoId: string;
  planoId: string;
  valor: number;
  dataVencimento: string;
  observacao?: string;
}

export interface PagamentoDto {
  id: string;
  mensalidadeId: string;
  metodo: MetodoPagamento;
  valor: number;
  data: string;
  comprovante?: string;
  status: StatusPagamento;
}

export interface CreatePagamentoDto {
  mensalidadeId: string;
  metodo: MetodoPagamento;
  valor: number;
  comprovante?: string;
}

export interface CheckinDto {
  id: string;
  alunoId: string;
  alunoNome: string;
  dataEntrada: string;
  dataSaida?: string;
  status: StatusCheckin;
}

export interface AulaDto {
  id: string;
  nome: string;
  professorId: string;
  professorNome: string;
  horario: string;
  diasSemana: string;
  vagas: number;
  vagasOcupadas: number;
  ativa: boolean;
  descricao?: string;
}

export interface CreateAulaDto {
  nome: string;
  professorId: string;
  horario: string;
  diasSemana: string;
  vagas: number;
  descricao?: string;
}

export interface AgendamentoDto {
  id: string;
  alunoId: string;
  alunoNome: string;
  aulaId: string;
  aulaNome: string;
  data: string;
  status: StatusAgendamento;
}

export interface CreateAgendamentoDto {
  alunoId: string;
  aulaId: string;
  data: string;
}

export interface AvaliacaoDto {
  id: string;
  alunoId: string;
  alunoNome: string;
  professorId: string;
  professorNome: string;
  data: string;
  peso: number;
  altura: number;
  imc: number;
  percentualGordura?: number;
  massaMuscular?: number;
  circunferenciaBracos?: number;
  circunferenciaPernas?: number;
  circunferenciaCintura?: number;
  circunferenciaAbdomen?: number;
  observacoes?: string;
}

export interface CreateAvaliacaoDto {
  alunoId: string;
  peso: number;
  altura: number;
  percentualGordura?: number;
  massaMuscular?: number;
  circunferenciaBracos?: number;
  circunferenciaPernas?: number;
  circunferenciaCintura?: number;
  circunferenciaAbdomen?: number;
  observacoes?: string;
}

export interface NotificacaoDto {
  id: string;
  titulo: string;
  mensagem: string;
  lida: boolean;
  link?: string;
  criadaEm: string;
}

export interface CreateNotificacaoDto {
  usuarioId: string;
  titulo: string;
  mensagem: string;
  link?: string;
}

export interface UsuarioDto {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  avatar?: string;
  telefone?: string;
  ativo: boolean;
  criadoEm: string;
  ultimoLogin?: string;
}

export interface CreateUsuarioDto {
  nome: string;
  email: string;
  password: string;
  role: UserRole;
  telefone?: string;
}

export interface UpdateUsuarioDto {
  nome?: string;
  telefone?: string;
  avatar?: string;
  ativo?: boolean;
}

export interface DashboardDto {
  totalAlunos: number;
  alunosAtivos: number;
  novasMatriculasMes: number;
  receitaMensal: number;
  totalCheckinsHoje: number;
  aulasHoje: number;
  mensalidadesPendentes: number;
  notificacoesNaoLidas: number;
  atividadesRecentes: RecenteAtividadeDto[];
}

export interface RecenteAtividadeDto {
  tipo: string;
  descricao: string;
  data: string;
}

export type StatusAluno = 'Ativo' | 'Inativo' | 'Suspenso' | 'Pendente';
export type StatusMensalidade = 'Aberta' | 'Paga' | 'Atrasada' | 'Cancelada';
export type StatusPagamento = 'Pendente' | 'Pago' | 'Atrasado' | 'Cancelado';
export type StatusCheckin = 'Presente' | 'Saiu';
export type StatusAgendamento = 'Confirmado' | 'Pendente' | 'Cancelado' | 'Presente';
export type MetodoPagamento = 'PIX' | 'CartaoCredito' | 'CartaoDebito' | 'Boleto' | 'Dinheiro';
export type UserRole = 'Admin' | 'Professor' | 'Aluno' | 'Recepcionista' | 'Financeiro';
export type GrupoMuscular = 'Peito' | 'Costas' | 'Ombros' | 'Biceps' | 'Triceps' | 'Antebracos' | 'Abdomen' | 'Gluteos' | 'Quadriceps' | 'Posterior' | 'Panturrilhas' | 'FullBody';
