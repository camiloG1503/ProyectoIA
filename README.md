# Nombre del proyecto: IA Learning (ProyectoIA) — Curso interactivo de IA

Aplicación educativa multiplataforma (Android, iOS y Web/PWA) creada para apoyar a estudiantes de la **I.E. Fidelina Echeverry** (Puerto Tejada, Cauca, Colombia) en el aprendizaje **progresivo y contextualizado** de conceptos de Inteligencia Artificial mediante módulos cortos, retos locales y herramientas de acompañamiento.

> En el código el directorio del proyecto se llama `ProyectoIA`, pero el nombre funcional de la app (UI) es **IA Learning**.

---
## Integrantes:
- David Alejandro Gomez Gonzalias.
- Emerson Chara Valencia.
- Jason Fernando Ibarguen Arrechea.
- Bairon Camilo Gomez Rengifo.


## Descripción general de la aplicación

**IA Learning** está pensada para estudiantes de secundaria con poco o nulo conocimiento previo en IA. La app organiza el contenido en **módulos/lecciones** con una navegación guiada y elementos de gamificación “suave” para mantener la motivación:

- Progreso visible por lección y global.
- Contenido explicado con ejemplos cercanos al contexto del municipio.
- Actividades prácticas (ejercicios y práctica de prompts).
- Apoyo con un **chatbot** de ayuda (basado en palabras clave, no IA generativa).
- Funcionalidades de utilidad como **certificados en PDF** y **manuales descargables**.
- En Web funciona como **PWA** (instalable y con soporte offline, según el navegador).

---

## Tecnologías utilizadas

### Stack principal

- **React Native** `0.83.6`
- **Expo SDK** `55`
- **JavaScript**
- **React** `19.2.0`

### Navegación y UI

- **React Navigation**
  - `@react-navigation/native`
  - `@react-navigation/stack` y `@react-navigation/native-stack`
- **Expo Vector Icons** (`@expo/vector-icons`) — iconos Material
- **React Native Safe Area Context** (`react-native-safe-area-context`) — SafeAreaView
- **Animaciones** con `Animated` y `expo-linear-gradient`

### Almacenamiento local / estado

- **AsyncStorage** (`@react-native-async-storage/async-storage`)
- **React Context API** (autenticación en `src/context/AuthContext.js`)

### Funcionalidades (Expo / RN)

- **Sensores**: `expo-sensors` (acelerómetro para tips)
- **Galería / permisos**: `expo-media-library` (guardar capturas)
- **Capturas de pantalla**: `react-native-view-shot`
- **Portapapeles**: `expo-clipboard`
- **Generación/compartir PDF**: `expo-print` + `expo-sharing`
- **Audio/voz**: `expo-speech`
- **Cámara**: `expo-camera` (dependencia presente; uso depende de pantallas/flujo)
- **QR**: `qrcode` + `react-native-qrcode-svg`
- **Soporte Web/PWA**: `react-native-web` + configuración en `app.json`

---

## Instrucciones para instalar y ejecutar el proyecto

### Requisitos previos

- **Node.js** (recomendado: versión LTS)
- **npm** (incluido con Node) o gestor equivalente
- **Expo CLI** (opcional, pero recomendado)
- Para correr en dispositivo/emulador:
  - **Android Studio** (emulador) y/o dispositivo Android
  - **Xcode** (macOS) para iOS
  - **Expo Go** (si se usa modo “Expo” en lugar de `expo run:*`)

### Instalación

1. Abre una terminal en la raíz del repositorio (carpeta donde está `ProyectoIA/`).
2. Entra al proyecto:
   - `cd ProyectoIA`
3. Instala dependencias:
   - `npm install`

### Ejecución (modo desarrollo)

Desde `ProyectoIA/`:

- Iniciar Metro/Expo (recomendado):
  - `npm run start`
  - Esto ejecuta `expo start`

- Ejecutar en Android (build nativo local):
  - `npm run android`
  - Esto ejecuta `expo run:android`

- Ejecutar en iOS (macOS):
  - `npm run ios`
  - Esto ejecuta `expo run:ios`

- Ejecutar en Web (PWA):
  - `npm run web`
  - Esto ejecuta `expo start --web`

### Notas importantes

- **Permisos**: algunas funciones (guardar capturas, cámara, etc.) requieren permisos del dispositivo. La app solicita permisos al momento de uso (por ejemplo, al guardar una captura).
- **PWA offline**: en Web, la experiencia offline depende del navegador, el modo de instalación y el entorno (HTTPS en producción). La pantalla `PWAScreen` incluye herramientas de verificación y prueba.

---

## Funcionalidades principales

### 1) Autenticación institucional (simulada)

- Pantalla de inicio de sesión con validación de **correo institucional**.
- Manejo de sesión con **Context API** y persistencia en AsyncStorage.
- Control de flujo `AuthStack` vs `AppStack` en `src/navigation/AppNavigator.js`.

### 2) Curso por módulos (lecciones) con progreso persistente

- Listado de lecciones/módulos en `HomeScreen` con diseño responsivo (1–2 columnas según tamaño de pantalla).
- Datos del curso centralizados en `src/utils/lessonsData.js`.
- Progreso guardado localmente con AsyncStorage (lecciones completadas).

### 3) Contenido interactivo por lección

En `LessonContentScreen` se incluyen herramientas para reforzar la experiencia:

- **Tips por acelerómetro**: al agitar el dispositivo se muestra un consejo relacionado con el módulo (`src/utils/iaTips.js`).
- **Captura de pantalla**: permite guardar evidencia del contenido en la galería (MediaLibrary + view-shot).
- Finalización de lección y actualización de progreso.

### 4) Microlecciones, diagnóstico y práctica de prompts

El flujo de pantallas incluye componentes de aprendizaje corto y práctica:

- Diagnóstico inicial (`DiagnosticScreen`)
- Microlecciones (`MicroLessonsScreen`)
- Práctica de prompts (`PromptPracticeScreen`)
- Video por módulo (`ModuleVideoScreen`) y preguntas asociadas (utilidades en `src/utils/`)

### 5) Reto local (contextualización)

- Pantalla dedicada a desafíos del municipio (`LocalChallengeScreen`), alineada con el enfoque pedagógico del curso: aprender con problemas reales del entorno.

### 6) Chatbot de ayuda (reglas/keywords)

- `ChatBot_Ayuda` ofrece respuestas predefinidas por coincidencia de palabras clave.
- No usa un modelo de IA en línea: está diseñado para funcionar **offline** y con lógica simple.

### 7) Certificados y material descargable (PDF)

- **Certificado final** al completar todos los módulos (`FinalCertificateScreen`):
  - Generación en PDF.
  - Inclusión de **QR** para verificación/consulta (según plantilla).
- Manuales y PDFs por módulo (`ManualPdfScreen`, `ModulePdfScreen`) usando helpers en `src/utils/pdfHelpers.js` y `src/utils/pdfTemplates.js`.

### 8) PWA (instalable y con verificación)

- Pantalla `PWAScreen` con:
  - Detección de instalación (standalone)
  - Estado online/offline
  - Verificación de Service Worker
  - Guía de instalación

---

## Estructura del proyecto (resumen)

El código principal está dentro de `ProyectoIA/`:

- `App.js`: arranque, `NavigationContainer` y provider de autenticación.
- `src/navigation/`: rutas y stacks (navegación).
- `src/screens/`: pantallas completas (curso, perfil, PWA, chatbot, etc.).
- `src/components/`: componentes reutilizables (cards, barras, chips, etc.).
- `src/utils/`: datos del curso, helpers de almacenamiento, PDF, QR, tips, etc.
- `web/`: recursos/configuración para el build web (Expo).

---

## Sugerencias de uso y pruebas rápidas

- Para validar el flujo principal:
  1. Inicia sesión.
  2. Entra a una lección y finalízala para ver el progreso.
  3. Prueba el tip con acelerómetro (en dispositivo/emulador con sensores).
  4. Genera un PDF (manual o certificado final cuando aplique).
  5. En Web, revisa `PWAScreen` y prueba modo offline.

---

## Autores / contexto académico

Este repositorio corresponde al proyecto de un **curso interactivo sobre IA** para el contexto educativo local de Puerto Tejada, Cauca, con enfoque en microaprendizaje, retos contextualizados y acompañamiento para estudiantes.

