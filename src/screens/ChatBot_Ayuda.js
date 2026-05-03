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
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, RADIUS, SPACING, SHADOWS } from "../utils/colors";
import TricolorStripe from "../components/TricolorStripe";
import {
  baseConocimiento,
  respuestas_defecto,
  normalizarTexto,
} from "../utils/chatbotKnowledge";

const ChatBot_Ayuda = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "¡Hola! Soy Fidelina, tu asistente de la I.E. Fidelina Echeverry. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();

  const handleSend = (textOverride) => {
    const messageToSend = textOverride || input;
    if (!messageToSend.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: messageToSend }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = conseguirRespuesta(messageToSend);
      setMessages((prev) => [...prev, { from: "bot", text: response }]);
      setIsTyping(false);
    }, 1000);
  };

  const conseguirRespuesta = (question) => {
    const textoLimpio = normalizarTexto(question);
    for (let intencion of baseConocimiento) {
      const hayCoincidencia = intencion.palabras.some((palabraK) =>
        textoLimpio.includes(normalizarTexto(palabraK)),
      );
      if (hayCoincidencia) {
        const opciones = intencion.respuestas;
        return opciones[Math.floor(Math.random() * opciones.length)];
      }
    }
    return respuestas_defecto[
      Math.floor(Math.random() * respuestas_defecto.length)
    ];
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.puertoTejadaRed, COLORS.puertoTejadaRedDark]}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Asistente Fidelina</Text>
          <Text style={styles.headerSubtitle}>Apoyo Institucional</Text>
        </View>
        <MaterialIcons
          name="support_agent"
          size={26}
          color="rgba(255,255,255,0.4)"
        />
      </LinearGradient>

      <TricolorStripe />

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
          {isTyping && (
            <View style={styles.typingBubble}>
              <Text style={styles.typingText}>
                Fidelina está escribiendo...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* 2. SUGERENCIAS RÁPIDAS (Sincronizadas con la lógica) */}
        <View style={styles.suggestionBox}>
          <Text style={styles.suggestionTitle}>Prueba preguntando:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionScroll}
          >
            {[
              { label: "¿Cómo empiezo?", val: "empezar" },
              { label: "¿Qué aprenderé?", val: "unidades" },
              { label: "Consejos", val: "consejos" },
              { label: "Requisitos", val: "requisitos" },
            ].map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.tag}
                onPress={() => handleSend(item.val)}
              >
                <Text style={styles.tagText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Escribe tu duda aquí..."
            placeholderTextColor={COLORS.textLight}
          />
          <TouchableOpacity onPress={() => handleSend()}>
            <LinearGradient
              colors={[COLORS.puertoTejadaRed, COLORS.puertoTejadaRedDark]}
              style={styles.sendButton}
            >
              <MaterialIcons name="send" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  history: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bubble: {
    maxWidth: "85%",
    marginVertical: 6,
    padding: 14,
    borderRadius: RADIUS.lg,
    ...SHADOWS.card,
  },
  userBubble: {
    backgroundColor: COLORS.puertoTejadaRed,
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: COLORS.surface,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userText: {
    color: "#fff",
    fontSize: 15,
  },
  botText: {
    color: COLORS.text,
    fontSize: 15,
  },
  typingBubble: {
    alignSelf: "flex-start",
    padding: 10,
  },
  typingText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontStyle: "italic",
  },
  suggestionBox: {
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  suggestionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textLight,
    marginLeft: 16,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  suggestionScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: {
    fontSize: 13,
    color: COLORS.puertoTejadaRed,
    fontWeight: "700",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 18,
    fontSize: 15,
    color: COLORS.text,
  },
  sendButton: {
    marginLeft: 10,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatBot_Ayuda;
