export interface ExercicioLib {
  id: string;
  nome: string;
  grupoMuscular: string;
  categoria: string;
  favorito: boolean;
}

const exercicioData: Record<string, Record<string, string[]>> = {
  'Peito': {
    'Supinos': ['Supino Reto Barra', 'Supino Reto Halteres', 'Supino Reto Maquina', 'Supino Inclinado Barra', 'Supino Inclinado Halteres', 'Supino Inclinado Maquina', 'Supino Declinado Barra', 'Supino Declinado Halteres', 'Supino Declinado Smith', 'Supino Smith', 'Supino com Pegada Fechada', 'Supino Inclinado Smith'],
    'Fly': ['Crucifixo Reto', 'Crucifixo Inclinado', 'Crucifixo Declinado', 'Peck Deck', 'Fly Maquina', 'Fly Cabo Reto', 'Fly Cabo Inclinado', 'Cross Over Alto', 'Cross Over Medio', 'Cross Over Baixo', 'Crossover Unilateral'],
    'Peso Corporal': ['Flexao Tradicional', 'Flexao Inclinada', 'Flexao Declinada', 'Flexao Diamante', 'Flexao Explosiva', 'Flexao com Aplauso', 'Flexao com Pes Elevados', 'Flexao em Arco', 'Flexao com Apoio Unilateral'],
    'Outros': ['Paralelas', 'Paralelas com Peso', 'Pullover', 'Pullover Maquina', 'Pullover Halteres', 'Pullover Cabo', 'Dips Maquina']
  },
  'Costas': {
    'Puxadas': ['Puxada Frontal', 'Puxada Pronada', 'Puxada Supinada', 'Puxada Triangulo', 'Puxada Aberta', 'Puxada Fechada', 'Puxada Alta Pronada', 'Puxada Alta Supinada', 'Pulldown Neutro'],
    'Remadas': ['Remada Curvada Barra', 'Remada Curvada Halteres', 'Remada Cavalinho', 'Remada Unilateral Halteres', 'Remada Unilateral Cabo', 'Remada Maquina', 'Remada Pronada', 'Remada Supinada', 'Remada Triangulo', 'Remada na Polia Baixa', 'Remada na Polia Alta', 'Remada Smith', 'Remada com Barra T'],
    'Peso Corporal': ['Barra Fixa Pronada', 'Barra Fixa Supinada', 'Barra Fixa Neutra', 'Dominada', 'Dominada com Peso', 'Barra Fixa Pegada Aberta', 'Barra Fixa Pegada Fechada', 'Australiana'],
    'Outros': ['Encolhimento Barra', 'Encolhimento Halteres', 'Bom Dia', 'Hiperextensao']
  },
  'Ombros': {
    'Press': ['Press Militar Barra', 'Press Militar Halteres', 'Press Militar Maquina', 'Press Arnold', 'Desenvolvimento Maquina', 'Desenvolvimento Smith', 'Press com Cabo'],
    'Laterais': ['Elevacao Lateral Halteres', 'Elevacao Lateral Maquina', 'Elevacao Lateral Cabo', 'Elevacao Lateral Unilateral', 'Elevacao Lateral Sentado', 'Elevacao Lateral Inclinado'],
    'Frontais': ['Elevacao Frontal Halteres', 'Elevacao Frontal Barra', 'Elevacao Frontal Cabo', 'Elevacao Frontal Anilha', 'Elevacao Frontal Alternada', 'Elevacao Frontal Polia Baixa'],
    'Traseira': ['Face Pull', 'Elevacao Posterior', 'Reverse Fly', 'Reverse Fly Maquina', 'Elevacao Posterior Cabo', 'Elevacao Posterior Halteres Sentado'],
    'Outros': ['Y Raise', 'T Raise', 'W Raise', 'Limpeza e Press']
  },
  'Biceps': {
    'Roscas': ['Rosca Direta Barra', 'Rosca Direta Halteres', 'Rosca Direta Barra W', 'Rosca Scott', 'Rosca Scott Unilateral', 'Rosca Martelo', 'Rosca Martelo Cabo', 'Rosca Martelo Cruzado', 'Rosca Concentrada', 'Rosca Concentrada Cabo', 'Rosca Cabo', 'Rosca Cabo Unilateral', 'Rosca Alternada', 'Rosca Inclinada', 'Rosca Polia Alta', 'Rosca Polia Baixa', 'Rosca Inversa', 'Rosca 21', 'Rosca no Banco 45'],
    'Peso Corporal': ['Barra Fixa Supinada Biceps']
  },
  'Triceps': {
    'Polia': ['Triceps Pulley', 'Triceps Corda', 'Triceps Barra', 'Triceps Barra V', 'Triceps Unilateral Corda', 'Triceps Polia Alta', 'Triceps Polia Baixa'],
    'Halteres': ['Triceps Testa', 'Triceps Testa Unilateral', 'Triceps Frances', 'Triceps Frances Unilateral', 'Triceps Coice', 'Triceps Coice Unilateral', 'Triceps Coice Cabo', 'Kickback Halteres'],
    'Peso Corporal': ['Mergulho', 'Mergulho com Peso', 'Mergulho no Banco', 'Flexao Diamante Triceps'],
    'Maquina': ['Triceps Maquina']
  },
  'Antebracos': {
    'Punho': ['Rosca Punho Barra', 'Rosca Punho Halteres', 'Rosca Punho Inversa Barra', 'Rosca Punho Inversa Halteres', 'Rosca Punho Polia', 'Extensao Punho Barra', 'Extensao Punho Halteres', 'Punho de Fermiao'],
    'Isometrico': ['Pendura na Barra', 'Passeio do Fazendeiro', 'Passeio do Fazendeiro Unilateral']
  },
  'Pernas': {
    'Quadriceps': ['Agachamento Livre', 'Agachamento Frontal', 'Agachamento Smith', 'Agachamento Sumo', 'Agachamento com Salto', 'Agachamento Bulgaro', 'Agachamento Bulgaro Halteres', 'Leg Press 45', 'Leg Press 90', 'Leg Press Unilateral', 'Cadeira Extensora', 'Cadeira Extensora Unilateral', 'Cadeira Hack', 'Afundo', 'Afundo Reverso', 'Afundo Lateral', 'Afundo Caminhando', 'Passadeira'],
    'Posterior': ['Mesa Flexora', 'Mesa Flexora Unilateral', 'Cadeira Flexora', 'Cadeira Flexora Unilateral', 'Stiff', 'Stiff Unilateral', 'RDL', 'RDL Unilateral', 'Cadeira Adutora', 'Cadeira Abdutora'],
    'Gluteos': ['Hip Thrust', 'Hip Thrust Unilateral', 'Abducao Maquina', 'Elevacao Pelvica', 'Ponte Unilateral', 'Coice Cabo'],
    'Panturrilha': ['Panturrilha Sentado', 'Panturrilha Sentado Unilateral', 'Panturrilha em Pe', 'Panturrilha em Pe Unilateral', 'Panturrilha Smith', 'Panturrilha no Hack']
  },
  'Abdomen': {
    'Abdomen': ['Ab Crunch Maquina', 'Abdominal Reto', 'Abdominal Inclinado', 'Abdominal Infra', 'Abdominal Canivete', 'Abdominal Cabo', 'Prancha', 'Prancha Lateral', 'Prancha com Peso', 'Elevacao Pernas', 'Elevacao Pernas Barra', 'Dragon Flag', 'Russian Twist', 'Bicicleta', 'Woodchop Cabo', 'V Ups', 'Crunches Reverso', 'Abdominal Roda', 'Mountain Climber', 'Prancha com Toque no Ombro']
  },
  'Cardio': {
    'Cardio': ['Esteira', 'Bicicleta Ergometrica', 'Bicicleta Spinning', 'Elipitico', 'Remador', 'Escada', 'Air Bike', 'Pular Corda', 'Corrida', 'Polichinelo', 'Burpee', 'Natacao']
  }
};

export function buildExercicioLib(): ExercicioLib[] {
  const lib: ExercicioLib[] = [];
  let id = 0;
  for (const [grupo, cats] of Object.entries(exercicioData)) {
    for (const [cat, exercicios] of Object.entries(cats)) {
      for (const nome of exercicios) {
        lib.push({ id: (id++).toString(), nome, grupoMuscular: grupo, categoria: cat, favorito: false });
      }
    }
  }
  return lib;
}

export const EXERCICIO_LIB = buildExercicioLib();
