// utils/iaTips.js
// Consejos educativos de IA para cada lección (se muestran al agitar el dispositivo)

export const iaTips = {
  1: [
    "💡 Piensa en la IA como un estudiante muy rápido que aprende de ejemplos. ¡Tú eres su maestro cuando le das datos!",
    "🧠 La IA no 'piensa' como nosotros, solo encuentra patrones en montañas de información. ¡Como un detective de datos!",
    "🤖 Los asistentes como Siri o Alexa usan IA para entender tu voz. ¡Diles 'gracias' de vez en cuando!",
    "📚 La IA se entrena con libros, artículos y páginas web. ¡Lo que lees en internet podría estar enseñando a una IA!",
  ],
  2: [
    "✍️ Un buen prompt es como una receta: sé claro con los ingredientes (contexto) y el plato final (formato).",
    "🎯 Sé específico: 'Explícame la fotosíntesis como si fuera un niño de 8 años' funciona mejor que solo 'Háblame de plantas'.",
    "🧩 Divide tareas complejas: en lugar de 'Hazme un plan de negocios', pide primero un esquema y luego ve paso a paso.",
    "🔄 Si la IA no entiende, reformula. ¡Es como hablar con alguien que sabe mucho pero necesita instrucciones claras!",
  ],
  3: [
    "⚠️ ¡Verifica siempre! La IA puede inventar datos con total seguridad. Confirma en fuentes confiables.",
    "🔢 No confíes en cálculos matemáticos complejos hechos por IA. Es excelente con palabras, no tanto con números.",
    "🤐 No compartas información personal o contraseñas con una IA. ¡No es tu diario secreto!",
    "🚫 Si usas IA para tareas escolares, asegúrate de entender el tema. Aprender es el objetivo, no solo copiar.",
  ],
  4: [
    "📖 Usa la IA para resumir textos largos. Pídele: 'Resume este artículo en 5 puntos clave'.",
    "❓ Convierte la IA en tu tutor personal: 'Explícame el Teorema de Pitágoras con un ejemplo de la vida real'.",
    "📝 Crea tarjetas de estudio automáticas: 'Genera 10 preguntas y respuestas sobre la Revolución Francesa'.",
    "🎓 Antes de un examen, pídele a la IA que te haga preguntas de práctica. ¡Es como un simulacro infinito!",
  ],
  5: [
    "⚙️ Automatizar no es magia, es enseñarle a una máquina a hacer pasos repetitivos por ti. ¡Tú pones las reglas!",
    "📧 ¿Respondes los mismos correos siempre? Usa IA para redactar plantillas personalizadas.",
    "🗂️ Herramientas como Zapier o IFTTT conectan apps con IA para hacer tareas automáticas. ¡Explora!",
    "🤖 Los chatbots con IA pueden atender clientes 24/7. Piensa en un negocio donde esto sería útil.",
  ],
  6: [
    "🔍 Al investigar, pide a la IA: 'Dame argumentos a favor y en contra de [tema]'. Así ves todos los ángulos.",
    "📊 Compara fuentes: '¿Qué dicen diferentes expertos sobre el cambio climático? Resume posturas opuestas.'",
    "📑 Analiza documentos largos: 'Extrae las conclusiones principales de este PDF y haz una tabla comparativa.'",
    "🧐 Siempre pregunta: '¿De dónde sacaste esa información?' Si no puede citar fuentes, ¡desconfía!",
  ],
  7: [
    "💻 La IA puede escribir código, pero tú debes entenderlo. Pídele que te explique cada línea como a un principiante.",
    "🐞 Para depurar errores, pega el mensaje de error en la IA. A menudo te dará pistas de qué va mal.",
    "🧪 Usa la IA para generar datos de prueba o ejemplos rápidos. ¡Ahorra tiempo en lo aburrido!",
    "📚 Aprende un nuevo lenguaje más rápido: 'Compárame cómo se hace un bucle en Python vs JavaScript'.",
  ],
  8: [
    "🚀 El futuro de la IA incluye coches autónomos, diagnósticos médicos y creatividad aumentada. ¿Qué te gustaría inventar?",
    "⚖️ La ética en IA es vital. Pregúntate: ¿esta tecnología ayuda o perjudica a las personas?",
    "🌍 La IA también consume mucha energía. Pensar en modelos eficientes es parte del desafío.",
    "🤝 La colaboración humano-IA será clave. Aprender a trabajar con estas herramientas te hará destacar.",
  ],
};

// Función para obtener un consejo aleatorio para una lección específica
export const getRandomTip = (lessonId) => {
  const tips = iaTips[lessonId];
  if (!tips || tips.length === 0)
    return "🤖 Sigue explorando el mundo de la IA. ¡Cada día aprendes algo nuevo!";
  const randomIndex = Math.floor(Math.random() * tips.length);
  return tips[randomIndex];
};