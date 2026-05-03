// utils/chatbotKnowledge.js
// Base de conocimiento del chatbot — I.E. Fidelina Echeverry · Puerto Tejada, Cauca

export const baseConocimiento = [
  {
    palabras: ["empezar", "inicio", "comenzar", "empiezo", "donde"],
    respuestas: [
      "¡Es muy fácil! Ve a la pantalla principal, elige la Unidad 1 y pulsa el botón 'Empezar lección'.",
      "Te recomiendo iniciar por el módulo de 'Fundamentos'. Solo toca una tarjeta en el inicio para arrancar.",
    ],
  },
  {
    palabras: ["unidades", "temas", "aprender", "contenido", "modulos"],
    respuestas: [
      "Aprenderás sobre Historia de la IA, Chatbots, Generación de Imágenes y Ética Digital.",
      "El curso tiene 5 unidades interactivas diseñadas para que aprendas desde cero.",
    ],
  },
  {
    palabras: ["consejos", "tips", "estudio", "ayuda", "mejor"],
    respuestas: [
      "Mi mejor consejo: lee despacio y no te saltes los ejercicios prácticos al final de cada tema.",
      "Tómate tu tiempo. Si no entiendes algo, puedes volver a ver la lección las veces que quieras.",
    ],
  },
  {
    palabras: ["requisitos", "saber", "previos", "preparacion"],
    respuestas: [
      "No necesitas saber nada previo. Este curso de la Institución está diseñado para principiantes.",
      "¡Solo necesitas curiosidad! Empezamos explicando qué es la tecnología desde lo más básico.",
    ],
  },
];

export const respuestas_defecto = [
  "No estoy segura de entenderte. Prueba preguntando: '¿Cómo empiezo?' o '¿Qué aprenderé?'",
  "Todavía estoy aprendiendo. Intenta con palabras clave como 'unidades' o 'consejos'.",
];

export const normalizarTexto = (texto) => {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};
