// utils/colors.js
// Paleta unificada — I.E. Fidelina Echeverry · Puerto Tejada, Cauca
// Sistema de color: Rojo institucional dominante, verde de logro, blanco como respiro

export const COLORS = {
    // ─── IDENTIDAD INSTITUCIONAL (DOMINANTES) ───────────────────────────────
    // Bandera Puerto Tejada: rojo (superior) · blanco (centro) · verde (inferior)
    puertoTejadaRed:        "#C62828",   // Rojo bandera — color primario de la app
    puertoTejadaRedLight:   "#EF5350",   // Rojo claro — hover / estados activos
    puertoTejadaRedDark:    "#8E0000",   // Rojo oscuro — gradiente profundo / sombras
    puertoTejadaWhite:      "#FFFFFF",   // Blanco bandera — fondos de tarjeta
    puertoTejadaGreen:      "#2E7D32",   // Verde bandera — logro / completado
    puertoTejadaGreenLight: "#43A047",   // Verde claro — badges completados
    puertoTejadaLightGreen: "#A5D6A7",   // Verde muy suave — bordes / fondos de éxito

    // ─── SISTEMA PRINCIPAL (alias semánticos) ────────────────────────────────
    primary:        "#C62828",   // = puertoTejadaRed  (antes azul, ahora institucional)
    primaryDark:    "#8E0000",   // gradiente oscuro del primary
    primaryLight:   "#FFCDD2",   // fondo tenue para secciones con acento rojo
    success:        "#2E7D32",   // = puertoTejadaGreen
    successLight:   "#E8F5E9",   // fondo tenue para estados completados
    warning:        "#F57F17",   // Ámbar — alertas y niveles intermedios
    warningLight:   "#FFF8E1",
    error:          "#D32F2F",   // Rojo error (más vivo que el institucional)
    info:           "#1565C0",   // Azul información (relegado a detalles)

    // ─── ACENTO SECUNDARIO ───────────────────────────────────────────────────
    // Usado en ProgressBar de perfil, detalles no institucionales
    accent:         "#5C6BC0",   // Índigo suave — contraste elegante con el rojo
    accentLight:    "#E8EAF6",

    // ─── NEUTRALES ───────────────────────────────────────────────────────────
    white:          "#FFFFFF",
    light:          "#FAFAFA",   // Fondo general de pantallas
    surface:        "#FFFFFF",   // Fondo de tarjetas
    surfaceAlt:     "#F5F5F5",   // Fondo de inputs / secciones alternadas
    border:         "#E0E0E0",   // Bordes sutiles
    divider:        "#EEEEEE",   // Separadores

    // ─── TIPOGRAFÍA ──────────────────────────────────────────────────────────
    text:           "#1A1A2E",   // Texto principal — casi negro con tono azul oscuro
    textSecondary:  "#424242",   // Texto secundario
    textLight:      "#757575",   // Texto terciario / placeholders
    textDisabled:   "#BDBDBD",   // Texto deshabilitado
    textOnPrimary:  "#FFFFFF",   // Texto sobre fondos rojos

    // ─── GRADIENTES (pares inicio→fin para LinearGradient) ──────────────────
    gradientRed:    ["#C62828", "#8E0000"],       // Header institucional
    gradientRedSoft:["#EF5350", "#C62828"],       // Botones y badges
    gradientGreen:  ["#2E7D32", "#1B5E20"],       // Completado
    gradientCard:   ["#FFFFFF", "#FAFAFA"],       // Tarjetas con profundidad
    gradientHero:   ["#8E0000", "#C62828", "#EF5350"], // Hero login/home

    // ─── SOMBRAS (colored shadows) ───────────────────────────────────────────
    shadowRed:      "rgba(198, 40, 40, 0.35)",   // Sombra de botones rojos
    shadowGreen:    "rgba(46, 125, 50, 0.30)",   // Sombra de elementos verdes
    shadowNeutral:  "rgba(0, 0, 0, 0.10)",       // Sombra suave general
    shadowCard:     "rgba(0, 0, 0, 0.08)",       // Sombra de tarjetas

    // ─── LEGADO (mantenidos para no romper archivos existentes) ─────────────
    // Estos se irán reemplazando en cada pantalla que se actualice
    secondary:      "#EF5350",
    secondaryLight: "#FFCDD2",
    purple:         "#5C6BC0",
    darkBg:         "#1A1A2E",
    vibrantPurple:  "#5C6BC0",   // Redirigido a índigo (más elegante)
    deepPurple:     "#3949AB",
};

// ─── DATOS CONMEMORATIVOS DE PUERTO TEJADA ───────────────────────────────────
export const PUERTO_TEJADA = {
    nombre:      "Puerto Tejada",
    departamento:"Cauca",
    fundacion:   "17 de Septiembre de 1897",
    bandera:     "Rojo, Blanco, Verde (franjas horizontales iguales)",
    escudo:      "Tres franjas horizontales con elementos culturales y agrícolas",
    lema:        "Tierra de oportunidades y progreso",
    descripcion: "Puerto Tejada, ubicado en el norte del Cauca, es reconocido por su riqueza cultural, agrícola y el empuje de su gente. Esta aplicación es un homenaje a la educación y al futuro de nuestra región.",
    institucion: "I.E. Fidelina Echeverry",
};

// ─── TOKENS DE DISEÑO ────────────────────────────────────────────────────────
export const RADIUS = {
    xs:   6,
    sm:   10,
    md:   16,
    lg:   20,
    xl:   28,
    xxl:  36,
    pill: 999,
};

export const SPACING = {
    xs:  4,
    sm:  8,
    md:  16,
    lg:  24,
    xl:  32,
    xxl: 48,
};

export const SHADOWS = {
    card: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    cardHigh: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 8,
    },
    buttonRed: {
        shadowColor: "#C62828",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
    },
    buttonGreen: {
        shadowColor: "#2E7D32",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 10,
        elevation: 6,
    },
};