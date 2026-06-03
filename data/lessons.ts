import type { Lesson, UserGoalType } from "../types";

export const LESSONS: Lesson[] = [
  {
    id: "mod1-lesson1",
    title: "Conhecendo o Instrumento",
    description: "Partes da guitarra, nomes das cordas e postura correta",
    order: 1,
    module: "Fundamentos",
    goalTypes: ["chords", "solo", "rhythm", "complete"],
    videoUrl: "https://www.youtube.com/watch?v=0H7Z7ViJWmI",
    exercises: [
      {
        id: "ex-1-1",
        title: "Partes da Guitarra",
        instructions: "Identifique as partes principais da guitarra",
        type: "quiz",
        quizData: {
          question: "Qual é o nome da parte que conecta o braço ao corpo da guitarra?",
          options: ["Headstock", "Neck Joint", "Fretboard", "Pickguard"],
          correctIndex: 1,
        },
      },
      {
        id: "ex-1-2",
        title: "Nomes das Cordas",
        instructions: "Decore os nomes das cordas soltas",
        type: "quiz",
        quizData: {
          question: "Qual é a afinação padrão da 1ª corda (a mais fina)?",
          options: ["E4 (Mi)", "A2 (Lá)", "D3 (Ré)", "G3 (Sol)"],
          correctIndex: 0,
        },
      },
    ],
  },
  {
    id: "mod1-lesson2",
    title: "Postura e Mão Direita",
    description: "Como segurar a palheta e posicionar a mão direita",
    order: 2,
    module: "Fundamentos",
    goalTypes: ["chords", "solo", "rhythm", "complete"],
    videoUrl: "https://www.youtube.com/watch?v=G0O3fG07Qgo",
    exercises: [
      {
        id: "ex-2-1",
        title: "Postura Correta",
        instructions: "Sente-se com a coluna ereta e o instrumento confortável",
        type: "practice",
        tips: "Mantenha os ombros relaxados e o braço da guitarra em um ângulo de 45°",
      },
      {
        id: "ex-2-2",
        title: "Uso da Palheta",
        instructions: "Segure a palheta entre o polegar e o indicador",
        type: "quiz",
        quizData: {
          question: "Qual a forma correta de segurar a palheta?",
          options: [
            "Com dois dedos, bem firme",
            "Entre polegar e indicador, com leve pressão",
            "Com todos os dedos fechados",
            "Entre o médio e o anelar",
          ],
          correctIndex: 1,
        },
      },
    ],
  },
  {
    id: "mod1-lesson3",
    title: "Primeiros Acordes",
    description: "Aprenda os acordes de A, D e E",
    order: 3,
    module: "Fundamentos",
    goalTypes: ["chords", "solo", "rhythm", "complete"],
    exercises: [
      {
        id: "ex-3-1",
        title: "Acorde de Lá Maior (A)",
        instructions: "Posicione os dedos nas casas corretas",
        type: "practice",
        diagramUrl: "assets/diagrams/A-chord.png",
        tips: "Dedos 1, 2 e 3 na segunda casa, cordas 2, 3 e 4",
      },
      {
        id: "ex-3-2",
        title: "Acordes Abertos",
        instructions: "Quais são os dedos usados no acorde de D?",
        type: "quiz",
        quizData: {
          question: "No acorde de Ré Maior (D), quais cordas são tocadas?",
          options: [
            "Apenas as 3 primeiras cordas",
            "Apenas as 3 cordas mais graves",
            "Todas as 6 cordas",
            "Apenas as 4 primeiras cordas",
          ],
          correctIndex: 3,
        },
      },
    ],
  },
  {
    id: "mod1-lesson4",
    title: "Ritmo Básico",
    description: "Introdução ao ritmo e levadas simples",
    order: 4,
    module: "Fundamentos",
    goalTypes: ["chords", "rhythm", "complete"],
    exercises: [
      {
        id: "ex-4-1",
        title: "Pulsação",
        instructions: "Pratique a levada básica para baixo e para cima",
        type: "practice",
        tips: "Use um metrônomo a 60 BPM para começar",
      },
    ],
  },
  {
    id: "mod1-lesson5",
    title: "Trocando de Acordes",
    description: "Técnicas para transição suave entre acordes",
    order: 5,
    module: "Fundamentos",
    goalTypes: ["chords", "solo", "rhythm", "complete"],
    videoUrl: "https://www.youtube.com/watch?v=9cUzXYKmzEI",
    exercises: [
      {
        id: "ex-5-1",
        title: "Transição A-D",
        instructions: "Pratique alternar entre A e D suavemente",
        type: "practice",
        tips: "Mantenha a palhetada constante enquanto troca os dedos",
      },
    ],
  },
  {
    id: "mod2-lesson1",
    title: "Acordes Menores",
    description: "Am, Dm, Em e suas aplicações",
    order: 6,
    module: "Acordes",
    goalTypes: ["chords", "complete"],
    videoUrl: "https://www.youtube.com/watch?v=oqKpSy7XDfY",
    exercises: [
      {
        id: "ex-6-1",
        title: "Acorde Am",
        instructions: "Forme o acorde de Lá menor",
        type: "quiz",
        quizData: {
          question: "Quantos dedos são necessários para o acorde de Am?",
          options: ["1 dedo", "2 dedos", "3 dedos", "4 dedos"],
          correctIndex: 1,
        },
      },
    ],
  },
  {
    id: "mod2-lesson2",
    title: "Acordes com Sétima",
    description: "A7, D7, E7 e o som característico",
    order: 7,
    module: "Acordes",
    goalTypes: ["chords", "complete"],
    exercises: [
      {
        id: "ex-7-1",
        title: "Acorde A7",
        instructions: "Diferença entre A e A7",
        type: "quiz",
        quizData: {
          question: "Qual dedo é removido do acorde A para formar A7?",
          options: ["Dedo 1", "Dedo 2", "Dedo 3", "Nenhum"],
          correctIndex: 2,
        },
      },
    ],
  },
  {
    id: "mod2-lesson3",
    title: "Ciclo de Acordes I-IV-V",
    description: "A progressão mais usada no rock e blues",
    order: 8,
    module: "Acordes",
    goalTypes: ["chords", "rhythm", "complete"],
    exercises: [
      {
        id: "ex-8-1",
        title: "Progressão I-IV-V",
        instructions: "Identifique os graus na escala de C",
        type: "quiz",
        quizData: {
          question: "Em C maior, quais são os acordes I, IV e V?",
          options: [
            "C, Dm, Em",
            "C, F, G",
            "C, G, Am",
            "C, F, Am",
          ],
          correctIndex: 1,
        },
      },
    ],
  },
  {
    id: "mod2-lesson4",
    title: "Acordes Power Chords",
    description: "Power chords de 5ª para rock e punk",
    order: 9,
    module: "Acordes",
    goalTypes: ["chords", "solo", "rhythm", "complete"],
    videoUrl: "https://www.youtube.com/watch?v=XJ2SBg09M6s",
    exercises: [
      {
        id: "ex-9-1",
        title: "Power Chord E5",
        instructions: "Forme um power chord na corda E",
        type: "practice",
        diagramUrl: "assets/diagrams/E5-power.png",
        tips: "Use os dedos 1 e 3, como um intervalo de 5ª",
      },
    ],
  },
  {
    id: "mod3-lesson1",
    title: "Escala Pentatônica",
    description: "A escala mais importante para solos",
    order: 10,
    module: "Melodia",
    goalTypes: ["solo", "complete"],
    videoUrl: "https://www.youtube.com/watch?v=oHDq1ca19Gg",
    exercises: [
      {
        id: "ex-10-1",
        title: "Pentatônica de Am",
        instructions: "Decore o padrão da pentatônica menor",
        type: "quiz",
        quizData: {
          question: "Quantas notas tem a escala pentatônica?",
          options: ["5", "6", "7", "8"],
          correctIndex: 0,
        },
      },
    ],
  },
  {
    id: "mod3-lesson2",
    title: "Bends e Slides",
    description: "Técnicas de expressão no solo",
    order: 11,
    module: "Melodia",
    goalTypes: ["solo", "complete"],
    exercises: [
      {
        id: "ex-11-1",
        title: "Bend de 1 Tom",
        instructions: "Pratique bends com a corda G",
        type: "practice",
        tips: "Use dois dedos para dar mais força ao bend",
      },
    ],
  },
  {
    id: "mod3-lesson3",
    title: "Pestana (Barre)",
    description: "Acordes com pestana - F e Bb",
    order: 12,
    module: "Acordes",
    goalTypes: ["chords", "complete"],
    videoUrl: "https://www.youtube.com/watch?v=WpGSMdSyt18",
    exercises: [
      {
        id: "ex-12-1",
        title: "Pestana F",
        instructions: "Forme o acorde de F com pestana",
        type: "quiz",
        quizData: {
          question: "Qual dedo faz a pestana no acorde de F?",
          options: ["Dedo 1 (indicador)", "Dedo 2 (médio)", "Dedo 3 (anelar)", "Dedo 4 (mindinho)"],
          correctIndex: 0,
        },
      },
    ],
  },
  {
    id: "mod3-lesson4",
    title: "Ritmos Sincopados",
    description: "Levadas com contratempo e sincopas",
    order: 13,
    module: "Ritmo",
    goalTypes: ["rhythm", "complete"],
    exercises: [
      {
        id: "ex-13-1",
        title: "Síncope Básica",
        instructions: "Toque acentuando o contratempo",
        type: "practice",
        tips: "Conte 1-e-2-e-3-e-4-e e acentue os 'e's",
      },
    ],
  },
  {
    id: "mod4-lesson1",
    title: "Blues em A",
    description: "Estrutura de 12 compassos de blues",
    order: 14,
    module: "Músicas",
    goalTypes: ["chords", "solo", "rhythm", "complete"],
    videoUrl: "https://www.youtube.com/watch?v=4y9P7qVYQsM",
    exercises: [
      {
        id: "ex-14-1",
        title: "12 Compassos",
        instructions: "Identifique a estrutura do blues",
        type: "quiz",
        quizData: {
          question: "Quantos compassos tem um blues padrão?",
          options: ["8", "10", "12", "16"],
          correctIndex: 2,
        },
      },
    ],
  },
  {
    id: "mod4-lesson2",
    title: "Riff Clássico - Smoke on the Water",
    description: "Aprenda o riff mais famoso do rock",
    order: 15,
    module: "Músicas",
    goalTypes: ["solo", "complete"],
    videoUrl: "https://www.youtube.com/watch?v=_SJT0b8S-4E",
    exercises: [
      {
        id: "ex-15-1",
        title: "Riff Principal",
        instructions: "Pratique o riff em G, Bb e C",
        type: "practice",
        tips: "Use power chords na 3ª e 4ª casa das cordas D e G",
      },
    ],
  },
  {
    id: "mod4-lesson3",
    title: "Primeira Música Completa",
    description: "Monte uma música usando acordes que você aprendeu",
    order: 16,
    module: "Músicas",
    goalTypes: ["chords", "rhythm", "complete"],
    exercises: [
      {
        id: "ex-16-1",
        title: "Sequência de Acordes",
        instructions: "Toque: Am - C - G - D",
        type: "practice",
        tips: "Comece devagar e aumente o BPM gradualmente",
      },
    ],
  },
  {
    id: "mod4-lesson4",
    title: "Improvisação Guiada",
    description: "Solos simples sobre backing track",
    order: 17,
    module: "Músicas",
    goalTypes: ["solo", "complete"],
    videoUrl: "https://www.youtube.com/watch?v=2KjJh8jPqys",
    exercises: [
      {
        id: "ex-17-1",
        title: "Improviso em Am",
        instructions: "Use a pentatônica de Am para solo",
        type: "practice",
        tips: "Toque com calma, sinta o ritmo",
      },
    ],
  },
  {
    id: "mod5-lesson1",
    title: "Field Goals: Revisão Geral",
    description: "Teste seus conhecimentos até aqui",
    order: 18,
    module: "Revisão",
    goalTypes: ["chords", "solo", "rhythm", "complete"],
    exercises: [
      {
        id: "ex-18-1",
        title: "Revisão de Acordes",
        instructions: "Teste seu conhecimento",
        type: "quiz",
        quizData: {
          question: "Qual acorde é formado pelos dedos nas casas 0-2-2-1-3-0?",
          options: ["C (Dó Maior)", "G (Sol Maior)", "Am (Lá menor)", "Em (Mi menor)"],
          correctIndex: 2,
        },
      },
    ],
  },
  {
    id: "mod5-lesson2",
    title: "Prática de Velocidade",
    description: "Exercícios para aumentar a velocidade",
    order: 19,
    module: "Revisão",
    goalTypes: ["solo", "complete"],
    exercises: [
      {
        id: "ex-19-1",
        title: "Cromatismo",
        instructions: "Pratique 1-2-3-4 em cada corda",
        type: "practice",
        tips: "Use metrônomo, comece a 70 BPM",
      },
    ],
  },
  {
    id: "mod5-lesson3",
    title: "Seu Estilo Musical",
    description: "Dicas para encontrar seu caminho musical",
    order: 20,
    module: "Revisão",
    goalTypes: ["chords", "solo", "rhythm", "complete"],
    exercises: [
      {
        id: "ex-20-1",
        title: "Estilos",
        instructions: "Qual estilo mais combina com você?",
        type: "quiz",
        quizData: {
          question: "Qual estilo musical é conhecido pelo uso intenso de power chords?",
          options: ["Jazz", "Punk Rock", "Bossa Nova", "Clássico"],
          correctIndex: 1,
        },
      },
    ],
  },
];

export function getFilteredLessons(goal: UserGoalType): Lesson[] {
  return LESSONS.filter((l) => l.goalTypes.includes(goal)).sort(
    (a, b) => a.order - b.order
  );
}

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
