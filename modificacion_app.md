**IA Learning – Directrices de Desarrollo para Agentes de IA**

**Propósito**



Eres un agente de IA encargado de modificar, extender o depurar el código de la aplicación IA Learning.

Tu misión exclusiva es aplicar buenas prácticas estandarizadas de React Native (JavaScript), siguiendo los principios de navegación, diseño responsivo/adaptativo, optimización, UX/UI, PWA, sensores, permisos, desarrollo multiplataforma y arquitectura del chatbot.



Antes de escribir código, verifica que cumple CADA UNA de las reglas de este documento. Si una modificación rompe alguna, la modificación es inválida.



**1. Arquitectura del Proyecto**



El proyecto está construido con React Native (JavaScript) usando Expo.



Estructura de carpetas obligatoria dentro de /src:



navigation/ → Configuración del Stack Navigator.



screens/ → Pantallas completas (Home, Details, LessonContent, Completed, Profile, y cualquier nueva pantalla).



components/ → Componentes reutilizables (tarjetas, barras de progreso, etc.).



utils/ → Funciones auxiliares, arrays de datos, paleta de colores, lógica de progreso y mapa del chatbot.



No se permite colocar lógica de navegación, estilos complejos o lógica de negocio directamente en archivos que no correspondan a su carpeta.



**2. Navegación**



Se utiliza Stack Navigator (@react-navigation/stack o @react-navigation/native-stack).



El paso de datos entre pantallas se hace exclusivamente mediante route.params.



Si se añade una pantalla nueva:



Crear el archivo en /src/screens.

Importarlo y añadirlo al Stack.Navigator en /src/navigation.

Si requiere parámetros, documentarlos en un comentario dentro de la pantalla receptora.

Restricción: No se deben usar estados globales complejos (Redux, Context API) a menos que se justifique explícitamente por una necesidad que route.params o AsyncStorage no puedan cubrir. Los datos de progreso y perfil se almacenan localmente.



**3. Diseño Responsivo y Adaptativo (OBLIGATORIO)**



Hook principal: useWindowDimensions() de React Native para obtener width y height en tiempo real.



Breakpoints: Se define al menos un punto de quiebre para distinguir entre modo compacto y regular.



Ejemplo estándar: const isTablet = width > 768;



Reglas de adaptación:



Títulos: Deben cambiar su contenido o tamaño textualmente según isTablet (modo compact / regular).



Listas/Tarjetas:



isTablet === false → 1 columna.



isTablet === true → 2 columnas (o más, si UX lo justifica).



Botones:



Compacto: 100% del ancho del contenedor.



Regular: 50% del ancho (o el % que se justifique en la entrega, pero nunca 100% salvo que sea un CTA principal).



Contenedores principales: Ajustar flexDirection entre "column" (compacto) y "row" (regular) según el breakpoint.



SafeAreaView: Debe envolver el contenedor raíz de cada pantalla para respetar los márgenes seguros del dispositivo.



Evidencia de validación: Antes de aprobar un cambio visual, el código debe funcionar tanto en portrait como en landscape, o en simulaciones de celular y tablet.



**4. Optimización Aplicada**



Renderizado de componentes:



Todo componente reutilizable en /src/components debe estar envuelto en React.memo().



Listas e Imágenes:



Prohibido usar ScrollView para listas largas o cargadas dinámicamente.



Uso obligatorio de FlatList para cualquier renderizado de arrays de datos.



Optimización de imágenes: Usar resizeMode="cover" o "contain" con dimensiones predefinidas. Evitar imágenes de tamaño completo sin compresión.



Persistencia:



El progreso del usuario (lecciones completadas) se guarda con AsyncStorage.



Las operaciones de lectura/escritura en AsyncStorage deben estar en funciones asíncronas dentro de /src/utils, no desperdigadas por las pantallas.



**5. Integración PWA**



La aplicación se exporta como aplicación móvil, pero se tiene en cuenta la base de PWA.



Service Workers y Caché: Si se añade lógica de PWA, el agente debe asegurarse de que el cacheo no rompa la actualización del progreso guardado en AsyncStorage.



La experiencia de usuario debe ser coherente: los breakpoints adaptativos y la navegación deben funcionar idénticamente en Web y en dispositivo nativo.



**6. Manejo de Sensores y Permisos**



Permisos: Si una nueva funcionalidad requiere acceso a cámara, galería o ubicación, se debe:



Usar expo-permissions o la librería equivalente actual.

Pedir el permiso en el momento exacto de uso (no en la carga inicial de la app), con una explicación previa al usuario.

Manejar el caso de denegación permanente (redirigir a ajustes o mostrar mensaje informativo).

Sensores: Cualquier uso de acelerómetro, giroscopio o similar debe detenerse al salir de la pantalla (useEffect cleanup o navigation.addListener('blur')).



**7. Optimización UX y UI**



Principio general: Claridad, progresión, organización sencilla (alineado con el documento del proyecto: la app busca ser clara y organizada para principiantes).



Jerarquía visual: Usar los colores y estilos definidos en /src/utils/colors. No inventar paletas nuevas.



Progreso: La barra de progreso en components debe reflejar fielmente los datos de AsyncStorage.



Consistencia multiplataforma: Las fuentes, espaciados y sombras deben verse bien en iOS y Android (cuidado con propiedades como shadow en Android, usar elevation).



**8. ChatBot de la App**



La lógica del chatbot reside en /src/utils (o el archivo que contenga el mapa respuestas).



Estructura del mapa:



Clave palabras: array de strings con posibles términos del usuario.



Clave respuesta: array de strings con respuestas asociadas.



Normalización de entrada: Antes de buscar coincidencias, la función conseguirRespuesta debe:



Eliminar acentos.

Convertir todo a minúsculas.

Eliminar signos de puntuación básicos (.,;:!¡?¿).

Coincidencia:



Se recorre el mapa con un bucle for.



Si una palabra de la entrada normalizada coincide con algún elemento del array palabras de una entrada del mapa, se devuelve aleatoriamente una de las respuestas asociadas a esa clave.



Respuesta por defecto: Si no hay coincidencias, devolver un mensaje genérico amable y útil (ej. "No tengo esa información exacta. Pregúntame sobre cómo usar la app o las unidades del curso.").



Modificaciones al chatbot:



Añadir nuevas entradas al mapa respuestas.



Prohibido modificar la lógica de normalización o búsqueda sin justificación explícita de mejora de rendimiento. Si se modifica, debe seguir funcionando con normalización y respuesta por defecto.



**9. Protocolo de Actuación del Agente**



Cuando recibas una solicitud de modificación:



Identifica la pantalla o componente objetivo (screens, components, utils, navigation).



Antes de tocar código, verifica: ¿Esta modificación altera la navegación? ¿Requiere ajustes de breakpoint o useWindowDimensions? ¿Implica crear una lista nueva? (Si es así, FlatList y React.memo). ¿Afecta al chatbot? ¿Necesita permisos del dispositivo?



Aplica el estándar correspondiente de este documento. No improvises. Si no hay un estándar para algo, documenta claramente por qué usas una alternativa y mantenla simple.



Entrega el código con comentarios concisos allí donde la lógica adaptativa o de optimización no sea obvia a primera vista.



**10. MAPA DE RESPONSABILIDADES**



\- navigation/ → control de flujo de pantallas

\- screens/ → lógica de presentación por vista

\- components/ → elementos reutilizables sin lógica de negocio

\- utils/ → lógica reutilizable y datos

\- context/ → estado global mínimo (auth)



Regla clave:

Ninguna pantalla debe contener lógica compleja reutilizable → debe moverse a utils o components





**MODO DE OPERACIÓN DEL AGENTE**



Este documento puede ser usado en dos modos:



1\. MODO PLAN (actual)

El agente NO debe modificar código.

Debe generar instrucciones paso a paso para otro agente.



2\. MODO EJECUCIÓN

El agente aplica directamente los cambios en el código.



Si estás en MODO PLAN:

\- No escribir código

\- No aplicar cambios

\- Solo generar instrucciones claras, ordenadas y justificadas

