// utils/promptChecks.js
// Checks para validar prompts (rol + tarea + contexto + formato)

export const promptChecks = [
  {
    key: "role",
    label: "Rol",
    test: (text) => /eres|actua como|actua|rol/i.test(text),
    hint: "Agrega quien responde, por ejemplo: Actua como tutor escolar.",
  },
  {
    key: "task",
    label: "Tarea",
    test: (text) =>
      /explica|resume|crea|genera|analiza|redacta|propone|disena|diseña/i.test(
        text,
      ),
    hint: "Define una tarea concreta: explicar, redactar, analizar, proponer.",
  },
  {
    key: "context",
    label: "Contexto",
    test: (text) =>
      /puerto tejada|cauca|estudiante|grado|colegio|municipio|barrio|feria/i.test(
        text,
      ),
    hint: "Incluye contexto local o academico (Puerto Tejada, grado, materia, etc.).",
  },
  {
    key: "format",
    label: "Formato",
    test: (text) =>
      /lista|tabla|pasos|puntos|formato|maximo|máximo|bloques|titulo|título/i.test(
        text,
      ),
    hint: "Pide un formato de salida: lista, tabla, pasos o bloques.",
  },
];

