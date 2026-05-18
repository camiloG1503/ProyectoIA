// utils/motivationPhrases.js

export const MOTIVATION_PHRASES = [
  "Cada intento cuenta. Ajusta tu prompt y vuelve a probar.",
  "Aprender IA es practicar: claridad, contexto y paciencia.",
  "Tu creatividad es tu superpoder. Úsala con responsabilidad.",
  "Paso a paso se construye el conocimiento. ¡Sigue!",
  "Un buen prompt es como una buena pregunta: claro y con contexto.",
  "Verifica, contrasta y mejora. Así se aprende de verdad.",
];

export const pickMotivationPhrase = () =>
  MOTIVATION_PHRASES[Math.floor(Math.random() * MOTIVATION_PHRASES.length)];

