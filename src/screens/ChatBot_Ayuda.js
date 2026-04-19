import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

//ESTRUCTURA DINÁMICA: Múltiples respuestas por cada intención
const baseConocimiento = [
  {
    palabras: [
      "uso",
      "utilizar",
      "funciona",
      "funcionalidad",
      "empezar",
      "iniciar",
    ],
    respuestas: [
      "Puedes usar el curso navegando por las unidades y completando las lecciones a tu ritmo.",
      "¡Es súper fácil! Solo elige una unidad en el menú principal y comienza a interactuar con las lecciones.",
      "El curso está diseñado para que avances paso a paso. Selecciona el primer módulo para arrancar.",
    ],
  },
  {
    palabras: ["unidades", "temas", "contenido", "aprender", "temario"],
    respuestas: [
      "El curso está dividido en varias unidades, cada una centrada en un concepto clave de la Inteligencia Artificial.",
      "Encontrarás módulos interactivos que van desde los fundamentos de la IA hasta casos de uso prácticos.",
      "Revisa la pantalla principal para explorar todo el temario y las unidades que tenemos para ti.",
    ],
  },
  {
    palabras: [
      "navegar",
      "moverme",
      "ir a",
      "como entro",
      "avanzar",
      "retroceder",
    ],
    respuestas: [
      "Utiliza el menú inferior o los botones en pantalla para navegar entre las secciones del curso.",
      "Puedes moverte libremente usando la barra de navegación o saltar al siguiente tema al terminar una lección.",
      "La navegación es sencilla: desliza o usa los botones de 'Siguiente' y 'Atrás' en cada unidad interactiva.",
    ],
  },
  {
    palabras: ["recomendaciones", "consejos", "tips", "estudio", "mejor"],
    respuestas: [
      "Te recomendamos estudiar de manera constante y jugar con todas las simulaciones interactivas.",
      "Un buen tip: no te saltes los ejercicios prácticos. ¡La IA se entiende mejor haciendo pruebas!",
      "Tómalo con calma, repasa los conceptos si es necesario y aprovecha el contenido interactivo de cada lección.",
    ],
  },
  {
    palabras: [
      "previos",
      "conocimientos",
      "saber antes",
      "requisitos",
      "preparacion",
    ],
    respuestas: [
      "No necesitas conocimientos previos de programación, pero tener curiosidad por la tecnología te ayudará muchísimo.",
      "¡Empezamos desde cero! Cualquier persona con ganas de aprender sobre IA puede tomar este curso.",
      "El único requisito es tener ganas de aprender. Nosotros te guiaremos paso a paso por los conceptos.",
    ],
  },
  {
    palabras: ["progreso", "motivacion", "avance", "seguir", "certificado"],
    respuestas: [
      "¡Sigue avanzando! Cada pequeña lección te acerca a dominar las bases de la Inteligencia Artificial.",
      "Tu progreso se guarda automáticamente. ¡No te rindas, lo estás haciendo genial!",
    ],
  },
];

// 2. FALLBACKS DINÁMICOS: Guían al usuario sobre qué preguntar
const respuestas_defecto = [
  "Hmm, no he entendido del todo. ¿Podrías preguntarme sobre el contenido de las unidades o cómo navegar por la app?",
  "Mi especialidad es ayudarte a usar este curso de IA. ¿Tienes alguna duda sobre los requisitos o cómo empezar?",
  "No tengo la respuesta exacta a eso. Intenta preguntarme sobre los temas del curso o consejos para estudiar.",
];

// FUNCIÓN AUXILIAR: Elimina tildes y pasa a minúsculas
const normalizarTexto = (texto) => {
  return texto
    .toLowerCase()
    .normalize("NFD") // Separa las letras de sus acentos
    .replace(/[\u0300-\u036f]/g, ""); // Elimina los acentos
};

const ChatBot_Ayuda = () => {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "¡Hola! Soy tu guía del curso. Pregúntame sobre cómo usar la app, las unidades o qué necesitas saber para empezar.",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollViewRef = useRef();

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { from: "user", text: input };
    const response = conseguirRespuesta(input);

    setMessages((prev) => [
      ...prev,
      userMessage,
      { from: "bot", text: response },
    ]);
    setInput("");

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };


  const conseguirRespuesta = (question) => {
    const textoLimpio = normalizarTexto(question);

    for (let intencion of baseConocimiento) {
      // Verificamos si alguna palabra clave está en el texto limpio
      const hayCoincidencia = intencion.palabras.some((palabraK) =>
        textoLimpio.includes(normalizarTexto(palabraK)),
      );

      if (hayCoincidencia) {
        // Seleccionamos una respuesta al azar dentro de esa categoría
        const opciones = intencion.respuestas;
        const indiceAleatorio = Math.floor(Math.random() * opciones.length);
        return opciones[indiceAleatorio];
      }
    }

    // Si no hay coincidencias, devolvemos un mensaje de error al azar
    const indiceDefecto = Math.floor(Math.random() * respuestas_defecto.length);
    return respuestas_defecto[indiceDefecto];
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f4f6fb" }}
      edges={["bottom", "left", "right"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        <ScrollView
          style={styles.history}
          contentContainerStyle={{ paddingVertical: 16 }}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.bubble,
                msg.from === "user" ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text
                style={msg.from === "user" ? styles.userText : styles.botText}
              >
                {msg.text}
              </Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Escribe tu pregunta..."
            placeholderTextColor="#888"
            accessibilityLabel="Campo de pregunta para el chatbot"
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            accessibilityLabel="Enviar pregunta al chatbot"
          >
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... Tus estilos originales (se mantienen exactamente igual)
  container: { flex: 1, backgroundColor: "#f4f6fb" },
  history: { flex: 1, paddingHorizontal: 16 },
  bubble: { maxWidth: "80%", marginVertical: 6, padding: 12, borderRadius: 16 },
  userBubble: {
    backgroundColor: "#4f8cff",
    alignSelf: "flex-end",
    borderTopRightRadius: 4,
  },
  botBubble: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
    borderTopLeftRadius: 4,
  },
  userText: { color: "#fff", fontSize: 16 },
  botText: { color: "#222", fontSize: 16 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#222",
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#4f8cff",
    borderRadius: 22,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatBot_Ayuda;
