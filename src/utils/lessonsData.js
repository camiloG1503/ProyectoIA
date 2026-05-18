export const lessonsData = [
  {
    id: 1,
    title: "Módulo 1: IA en tu contexto",
    subtitle: "Microlecciones y práctica local",
    icon: "psychology",
    duration: "20 min",
    level: "Inicial",
    color: "#193CB8",
    stepType: "module",
    description:
      "Comprende qué es la IA en lenguaje claro y practícala con un caso real de Puerto Tejada para mejorar prompts.",
    content: {
      paragraphs: [
        "La Inteligencia Artificial (IA) es un conjunto de programas que aprenden a partir de ejemplos y datos para realizar tareas que normalmente hacen las personas, como reconocer imágenes, traducir textos o responder preguntas.",
        "La IA no piensa ni siente: identifica patrones en grandes cantidades de información. Por eso, cuanto mejor le expliques lo que necesitas, más útil será su respuesta.",
        "En Puerto Tejada, la IA puede apoyar actividades escolares como redactar informes, organizar ideas para proyectos comunitarios o preparar respuestas para trámites con la alcaldía.",
        "Usar IA de forma responsable significa verificar la información que produce, citar su uso cuando entregues trabajos escolares y nunca compartir datos personales tuyos ni de compañeros.",
        "No se trata de copiar respuestas: se trata de pensar mejor, preguntar con precisión y revisar lo que la IA genera antes de usarlo. Tú sigues siendo el autor de tus ideas.",
      ],
    },
    localChallenge: {
      problem:
        "En el barrio La Ye se reportan tres puntos con basura sin recoger hace dos semanas. El personero estudiantil quiere redactar un mensaje claro y respetuoso para enviar a la oficina de servicios públicos de la alcaldía de Puerto Tejada.",
      badPrompt:
        "Haz algo sobre la basura de Puerto Tejada.",
    },
    topics: [
      "Qué es la IA y qué no es",
      "Cómo aprende la IA con ejemplos",
      "Uso responsable y verificación de información",
      "Aplicaciones locales en Puerto Tejada",
      "Diferencia entre copiar y usar IA como herramienta",
    ],
  },
  {
    id: 2,
    title: "Módulo 2: Prompts para estudiar",
    subtitle: "Cómo pedir explicaciones útiles",
    icon: "picture-as-pdf",
    duration: "20 min",
    level: "Inicial",
    color: "#D32F2F",
    stepType: "module",
    description:
      "Aprende a pedir resúmenes, ejemplos y explicaciones paso a paso para tus clases sin perder el pensamiento crítico.",
    content: {
      paragraphs: [
        "Un prompt es la instrucción que le das a la IA. La calidad de la respuesta depende directamente de qué tan claro y completo sea tu prompt: entre más contexto das, más precisa y útil será la respuesta.",
        "Un buen prompt para estudiar debe incluir tres elementos: el objetivo (qué quieres entender), el nivel académico (grado o conocimiento previo) y el formato de salida (resumen, lista, ejemplo, tabla, etc.).",
        "Por ejemplo, en lugar de escribir 'explícame la célula', prueba: 'Explícame qué es la célula para un estudiante de grado 9. Usa una analogía con algo cotidiano y dame 3 ideas clave en lista.'",
        "Siempre revisa si la respuesta tiene sentido. Si algo parece raro o inventado, vuelve a preguntar pidiendo que la IA te explique de dónde sacó esa información o que simplifique.",
        "Puedes iterar: si la primera respuesta no te convence, ajusta una sola parte del prompt. Por ejemplo, cambia el formato o añade más contexto sobre tu tarea.",
      ],
    },
    localChallenge: {
      problem:
        "Una estudiante de grado 9 de la I.E. Fidelina Echeverry necesita entender el concepto de fracciones con ejemplos del mercado de Puerto Tejada, como dividir libras de panela o porciones de mango. Debe preparar una exposición de 5 minutos para sus compañeros.",
      badPrompt:
        "Explícame fracciones rápido.",
    },
    topics: [
      "Estructura de un buen prompt: objetivo, nivel y formato",
      "Diferencia entre un prompt vago y uno preciso",
      "Cómo pedir ejemplos cotidianos y analogías",
      "Verificación y reformulación de respuestas",
      "Iteración: ajustar el prompt hasta obtener lo que necesitas",
    ],
  },
  {
    id: 3,
    title: "Módulo 3: IA para ideas y proyectos",
    subtitle: "Del problema a una solución",
    icon: "quiz",
    duration: "20 min",
    level: "Intermedio",
    color: "#7C3AED",
    stepType: "module",
    description:
      "Usa IA para estructurar ideas de proyectos escolares y comunitarios con instrucciones más precisas.",
    content: {
      paragraphs: [
        "Cuando tienes un problema real, el primer paso es describirlo con detalle: qué está pasando, quién se ve afectado, cuándo ocurre y en qué lugar. Cuanto más específico sea el contexto, más útil será la ayuda de la IA.",
        "Luego, pide a la IA que te proponga varias alternativas de solución, no solo una. Solicita que explique las ventajas y desventajas de cada opción para que puedas elegir la más adecuada para tu entorno.",
        "Es importante que las propuestas sean viables para tu comunidad. Por eso, incluye en el prompt datos concretos: '…en un municipio de 45 000 habitantes como Puerto Tejada, con estudiantes de secundaria y presupuesto cero'.",
        "Una vez que eliges la mejor propuesta, pide a la IA que te ayude a redactarla de forma clara: con un objetivo, acciones concretas y un mensaje que la comunidad entienda sin tecnicismos.",
        "Recuerda que la IA genera ideas como punto de partida. Tú y tu equipo deben ajustarlas, validarlas con personas reales del barrio o colegio, y tomar la decisión final.",
      ],
    },
    localChallenge: {
      problem:
        "El grupo juvenil Semilleros de Paz de la I.E. Fidelina Echeverry quiere lanzar una campaña para reducir el uso de plásticos en la feria escolar de fin de año. Cuentan con materiales reciclados, apoyo de tres profesores y una semana de preparación.",
      badPrompt:
        "Dame una campaña ambiental cualquiera.",
    },
    topics: [
      "Cómo describir un problema real con contexto completo",
      "Solicitar y comparar múltiples alternativas de solución",
      "Adaptar propuestas al entorno local",
      "Redactar ideas claras para la comunidad",
      "El rol del equipo humano para validar y ajustar",
    ],
  },
  {
    id: 4,
    title: "Módulo 4: IA y ciudadanía digital",
    subtitle: "Ética, datos y verificación",
    icon: "menu-book",
    duration: "20 min",
    level: "Intermedio",
    color: "#10B981",
    stepType: "module",
    description:
      "Aprende a cuidar datos personales, detectar errores y usar IA con responsabilidad.",
    content: {
      paragraphs: [
        "La ciudadanía digital significa actuar con responsabilidad en el mundo en línea. Cuando usas herramientas de IA, eres responsable de lo que compartes, de lo que publicas con su ayuda y de verificar que la información sea correcta.",
        "Nunca compartas datos personales sensibles en una herramienta de IA pública: nombres completos de compañeros, números de documento, teléfonos, fotos o información del colegio. Esos datos pueden quedar almacenados o ser vistos por terceros.",
        "La IA puede 'alucinar': inventar datos, fechas, nombres o citas con total seguridad. Si ves algo que no puedes verificar en una fuente confiable (libro, sitio oficial, docente), no lo uses como si fuera verdad.",
        "La ética digital también implica reconocer cuándo una idea viene de la IA y cuándo es producción propia. Si entregás un trabajo donde usaste IA para redactar o generar ideas, decírlo es un acto de honestidad académica.",
        "Tomar decisiones responsables en línea incluye no usar la IA para engañar, suplantar identidades ni generar contenido que dañe a otros. La tecnología amplifica tanto lo bueno como lo dañino: tú decides qué amplificar.",
      ],
    },
    localChallenge: {
      problem:
        "Un estudiante de grado 10 quiere usar una IA para analizar los resultados de una encuesta sobre hábitos de estudio en su salón. Para hacerlo, planea pegar en el chat una lista con los nombres y números de WhatsApp de sus 32 compañeros.",
      badPrompt:
        "Analiza esta lista con nombres y teléfonos y dime quién falta.",
    },
    topics: [
      "Qué es la ciudadanía digital y por qué importa",
      "Datos que nunca debes compartir con una IA",
      "Cómo detectar y reportar alucinaciones de la IA",
      "Honestidad académica cuando usas IA en tareas",
      "Decisiones éticas: qué amplificar con tecnología",
    ],
  },
  {
    id: 5,
    title: "Módulo 5: Taller de prompts",
    subtitle: "Entrenamiento guiado",
    icon: "edit-note",
    duration: "20 min",
    level: "Intermedio",
    color: "#F59E0B",
    stepType: "module",
    description:
      "Refuerza la técnica Rol + Tarea + Contexto + Formato en situaciones del municipio.",
    content: {
      paragraphs: [
        "La técnica Rol + Tarea + Contexto + Formato es la más efectiva para obtener respuestas útiles de la IA. Cada elemento cumple una función: el Rol define quién responde, la Tarea explica qué hacer, el Contexto aporta detalles clave y el Formato indica cómo debe verse la respuesta.",
        "Ejemplo completo: 'Actúa como un comunicador comunitario experto (Rol). Redacta un mensaje para invitar a los habitantes de Puerto Tejada a una jornada de limpieza (Tarea). Es para publicar en el grupo de WhatsApp del barrio La Trinidad, con vecinos de todas las edades (Contexto). El mensaje debe tener máximo 5 líneas, un emoji al inicio y un llamado a la acción al final (Formato).'",
        "Agregar contexto local mejora la calidad de la respuesta y evita recomendaciones genéricas que no aplican para tu municipio, tu institución o tu situación específica.",
        "Si pides un formato de salida claro (tabla, lista numerada, párrafo corto, guion para presentación), puedes usar la respuesta de inmediato en tareas o proyectos sin necesidad de reescribir todo.",
        "El ajuste iterativo es parte del proceso: después de recibir la primera respuesta, identifica qué parte no cumplió lo que esperabas, cambia solo eso en tu prompt y vuelve a intentar. Con práctica, cada intento te acerca más al resultado ideal.",
      ],
    },
    localChallenge: {
      problem:
        "Un emprendimiento familiar de Puerto Tejada vende artesanías en chaquira y tejidos elaborados por mujeres del municipio. Necesitan un mensaje corto para publicar en redes sociales y promocionar su participación en la Feria Artesanal de fin de año.",
      badPrompt:
        "Escribe algo para vender artesanías.",
    },
    topics: [
      "Estructura Rol + Tarea + Contexto + Formato",
      "Cómo escribir un prompt completo paso a paso",
      "Importancia del contexto local en el prompt",
      "Formatos de salida: cuándo usar lista, tabla o párrafo",
      "Ajuste iterativo: mejorar el prompt con cada intento",
    ],
  },
  {
    id: 6,
    title: "Módulo 6: Cierre y certificación",
    subtitle: "Insignia y certificado por módulo",
    icon: "verified",
    duration: "20 min",
    level: "ODS 4",
    color: "#14B8A6",
    stepType: "module",
    description:
      "Finaliza el módulo y descarga un certificado prototipo con estilo institucional.",
    content: {
      paragraphs: [
        "Llegar al módulo 6 significa que has recorrido un camino completo: desde entender qué es la IA hasta aplicar prompts bien estructurados para resolver problemas reales de tu comunidad.",
        "La certificación reconoce el desarrollo de habilidades concretas: formular prompts con Rol, Tarea, Contexto y Formato; usar la IA de forma ética y crítica; y aplicar el conocimiento a situaciones del municipio.",
        "No necesitas terminar todo el curso al mismo tiempo para descargar el certificado del módulo que ya completaste. Cada módulo tiene su propio reconocimiento, lo que te permite avanzar a tu ritmo.",
        "El certificado usa un código único de verificación que identifica el módulo completado, el año y la institución. Es un prototipo con fines educativos y puede ser presentado como evidencia de aprendizaje ante tu docente.",
        "Este curso es solo el punto de partida. La IA evoluciona rápido, y la habilidad más valiosa que puedes desarrollar es la de seguir aprendiendo, adaptarte a nuevas herramientas y usarlas siempre con pensamiento crítico y responsabilidad.",
      ],
    },
    localChallenge: {
      problem:
        "El consejo estudiantil de la I.E. Fidelina Echeverry quiere presentar una propuesta ante la Secretaría de Educación para mejorar la movilidad escolar en horas pico. Deben entregar un documento de máximo una página con el problema, su impacto y tres soluciones concretas.",
      badPrompt:
        "Dame una solución de movilidad ya.",
    },
    topics: [
      "Repaso de las habilidades del curso",
      "Cómo descargar el certificado del módulo completado",
      "Código único de verificación y su propósito",
      "Enfoque ODS 4: Educación de Calidad",
      "Próximos pasos: seguir aprendiendo con IA",
    ],
  },
];