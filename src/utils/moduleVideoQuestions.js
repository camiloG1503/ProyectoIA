// utils/moduleVideoQuestions.js
// Pausas y preguntas interactivas por módulo (v1)

export const VIDEO_QUESTIONS_BY_MODULE = {
  1: [
    {
      atSeconds: 61.2,
      question: "¿Cuál es una idea correcta sobre la IA?",
      options: [
        "La IA solo sirve para jugar videojuegos",
        "La IA puede ayudar a resolver problemas en educación y salud",
        "La IA nunca se equivoca",
      ],
      correctIndex: 1,
      feedbackCorrect:
        "Correcto: la IA se usa en muchas áreas para apoyar decisiones y tareas.",
      feedbackWrong:
        "Revisa: la IA se aplica en educación, salud, transporte y más.",
    },
    {
      atSeconds: 92.4,
      question: "¿Qué es un buen primer paso al usar una IA?",
      options: [
        "Dar una instrucción vaga sin contexto",
        "Definir una tarea clara y un contexto",
        "Copiar cualquier respuesta sin verificar",
      ],
      correctIndex: 1,
      feedbackCorrect:
        "Bien: una tarea clara + contexto ayudan a obtener mejores respuestas.",
      feedbackWrong:
        "Intenta de nuevo: lo más útil es ser claro con la tarea y el contexto.",
    },
  ],
  2: [
    {
      atSeconds: 64.8,
      question: "Un prompt mejorado debe incluir...",
      options: [
        "Solo emojis",
        "Rol + tarea + contexto + formato",
        "Un párrafo sin objetivo",
      ],
      correctIndex: 1,
      feedbackCorrect: "Excelente: esa combinación hace el prompt más preciso.",
      feedbackWrong:
        "Pista: piensa en rol, tarea, contexto y el formato de salida.",
    },
    {
      atSeconds: 81,
      question: "¿Cuál formato ayuda más a entender una respuesta?",
      options: ["Lista de pasos", "Un bloque gigante de texto", "Sin estructura"],
      correctIndex: 0,
      feedbackCorrect: "Correcto: los pasos o listas mejoran la claridad.",
      feedbackWrong: "Revisa: las listas o pasos ordenados facilitan el estudio.",
    },
  ],
  4: [
    {
      atSeconds: 151.8,
      question: "¿Qué práctica es más segura al usar IA?",
      options: [
        "Compartir datos personales sin cuidado",
        "Verificar y contrastar la información",
        "Publicar respuestas sin leer",
      ],
      correctIndex: 1,
      feedbackCorrect:
        "Correcto: siempre verifica y contrasta, especialmente en temas importantes.",
      feedbackWrong:
        "Recuerda: la IA puede fallar; verifica y contrasta la información.",
    },
    
  ],
};

