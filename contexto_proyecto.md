# PROYECTO: IA Learning

## 1\. DESCRIPCIÓN GENERAL

**IA Learning** es una aplicación móvil educativa orientada a estudiantes de la **I.E. Fidelina Echeverry** en Puerto Tejada, Cauca, Colombia. Su objetivo es enseñar fundamentos de Inteligencia Artificial de manera progresiva, clara y contextualizada, mediante lecciones interactivas y un flujo guiado de aprendizaje.

* **Público objetivo:** Estudiantes de secundaria con poco o nulo conocimiento previo en IA.
* **Propósito:** Facilitar la comprensión de la IA, desde conceptos básicos hasta aplicaciones prácticas, con ejemplos y desafíos locales.
* **Nombre del proyecto:** IA Learning (no ProyectoIA).

\---

## 2\. STACK TECNOLÓGICO

|Categoría|Tecnología / Librería|
|-|-|
|Framework|React Native 0.83.6 + Expo SDK 55|
|Lenguaje|JavaScript|
|Navegación|React Navigation (Stack Navigator)|
|Almacenamiento local|AsyncStorage|
|UI / Iconos|MaterialIcons (Expo Vector Icons)|
|Animaciones|React Native Animated, LinearGradient|
|Funcionalidades extra|expo-camera, expo-sensors, expo-print, expo-sharing, expo-speech, expo-media-library, expo-clipboard|
|Soporte web|react-native-web (PWA habilitada)|
|Gestión de estado|React Context API (AuthContext)|

\---

## 3\. ESTRUCTURA DEL PROYECTO

App.js
src/
├── navigation/
│ └── AppNavigator.js # Configuración de Stack Navigator
├── screens/
│ ├── LoginScreen.js # Pantalla de inicio de sesión institucional
│ ├── HomeScreen.js # Pantalla principal con lecciones
│ ├── DetailsScreen.js # Detalles de cada lección
│ ├── LessonContentScreen.js # Contenido de la lección + ejercicios
│ ├── CompletedScreen.js # Pantalla de finalización exitosa
│ ├── ProfileScreen.js # Perfil y progreso del estudiante
│ ├── ChatBot\_Ayuda.js # Chatbot de ayuda con respuestas predefinidas
│ └── PWAScreen.js # Información sobre la PWA
├── components/
│ ├── LessonCard.js # Tarjeta reutilizable de lección
│ └── ProgressBar.js # Barra de progreso animada
├── context/
│ └── AuthContext.js # Contexto de autenticación (login/logout)
├── utils/
│ ├── colors.js # Paleta de colores institucional (Puerto Tejada)
│ ├── lessonsData.js # Datos de los 6 módulos/lecciones
│ ├── iaTips.js # Consejos aleatorios sobre IA
│ └── storage.js # Funciones de persistencia (AsyncStorage)
└── (otros archivos de configuración de Expo)

\---

## 4\. FLUJO DE NAVEGACIÓN

1. **AuthStack vs AppStack**: El `AppNavigator` decide qué stack mostrar según el estado de autenticación.

   * Si no hay usuario autenticado → `AuthStack` (LoginScreen).
   * Si hay usuario autenticado → `AppStack` con todas las pantallas.
2. **Pantallas principales**:

   * `LoginScreen`: Valida correo institucional (`@fidelina.edu.co`), simula login educativo.
   * `HomeScreen`: Lista las lecciones, muestra progreso general, acceso al chatbot y PWA.
   * `DetailsScreen`: Muestra información ampliada de una lección y permite iniciarla.
   * `LessonContentScreen`: Contenido teórico, sensor acelerómetro para obtener tips de IA, captura de pantalla y finalización.
   * `CompletedScreen`: Animación de celebración al completar una lección.
   * `ProfileScreen`: Estadísticas del usuario, datos institucionales, reinicio de progreso, cierre de sesión.
   * `ChatBot\_Ayuda`: Chatbot simple con respuestas por palabras clave y sugerencias.
   * `PWAScreen`: Explicación sobre PWAs, verificación de Service Worker y funcionalidad offline.

\---

## 5\. DATOS Y CONTENIDO

### 5.1 Lecciones (`lessonsData.js`)

El curso contiene **6 módulos** (id 1..6). Cada módulo tiene:

* `title`, `subtitle`, `icon`, `duration`, `level`, `color` (identidad visual).
* `content.paragraphs`: texto principal de la lección.
* `localChallenge`: problema real del municipio + prompt base para mejorar.
* `topics`: temas tratados en el módulo.

### 5.2 Progreso (`storage.js`)

El progreso se guarda en AsyncStorage bajo la clave `ai\_learning\_progress`. Estructura:

```json
{
  "completedLessons": \[1, 3, 5]  // IDs de lecciones completadas
}

No se sobrescribe una lección ya completada.

**5.3 Autenticación (storage.js y AuthContext.js)**

Clave en AsyncStorage: ai\_learning\_auth.

Datos de usuario almacenados: email, name, role, institution, location, loginTime.

Validación de correo: debe contener @fidelina.edu.co.

Contraseña: mínimo 4 caracteres (simulación educativa).

**5.4 Identidad institucional (colors.js)**


Paleta basada en la bandera de Puerto Tejada:

Rojo: #C62828 (primario).

Blanco: #FFFFFF.

Verde: #2E7D32 (logros/completado).

Datos conmemorativos del municipio y la institución.

**6. FUNCIONALIDADES DESTACADAS**


Modo offline: La app es una PWA funcional que puede usarse sin conexión.

Sensor acelerómetro: En LessonContentScreen, al agitar el dispositivo se muestra un consejo aleatorio sobre IA (tomado de iaTips.js según el lesson.id).

Chatbot de ayuda: ChatBot\_Ayuda usa coincidencia de palabras clave para responder preguntas frecuentes.

Captura de pantalla: El estudiante puede tomar una captura del contenido de la lección y guardarla en la galería (requiere permisos de MediaLibrary).

Certificado PDF: En la pantalla de lección, al completar el módulo se habilita la descarga de un certificado en PDF (usando expo-print y expo-sharing).

Manual del curso PDF: Descargable desde la misma pantalla, con lecturas resumidas de todos los módulos.

**7. OPTIMIZACIONES Y BUENAS PRÁCTICAS**


Uso de React.memo en componentes reutilizables (LessonCard).

Diseño responsivo con useWindowDimensions() y flexbox.

Animaciones con Animated para mejorar la experiencia de usuario.

Separación de responsabilidades: contexto (AuthContext), navegación, pantallas, componentes y utilidades.

Comentarios claros en el código y estructura consistente.

**8. NOTAS PARA EL AGENTE DE IA**


La aplicación se encuentra en desarrollo activo con Expo SDK 55.

Cualquier modificación debe respetar la identidad institucional (colores, mensajes).

Los módulos de lecciones ya están definidos; si se añaden nuevos, deben seguir la misma estructura de lessonsData.

El chatbot funciona con lógica simple de palabras clave; no utiliza IA avanzada.

La PWA está configurada para funcionar offline pero requiere HTTPS en producción.
```

