// screens/ChatExerciseScreen.js
// Ejercicio tipo chat — IA Learning

import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, RADIUS } from "../utils/colors";
import ChatBubble from "../components/ChatBubble";
import { promptChecks } from "../utils/promptChecks";
import { saveLessonInternalProgress } from "../utils/lessonInternalProgressStorage";

const ChatExerciseScreen = ({ route, navigation }) => {
  const { lesson } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const initialMessages = useMemo(() => {
    const problem =
      lesson?.localChallenge?.problem ||
      "Crea un prompt para resolver un problema real de tu contexto.";
    const badPrompt =
      lesson?.localChallenge?.badPrompt ||
      "Ayúdame con esto (sin contexto, sin formato).";

    return [
      { id: "b1", type: "bot", text: problem },
      { id: "b2", type: "bot", text: `Ejemplo de mal prompt: ${badPrompt}` },
      {
        id: "b3",
        type: "bot",
        text: "Escribe un prompt mejorado (rol + tarea + contexto + formato).",
      },
    ];
  }, [lesson]);

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [failCount, setFailCount] = useState(0);
  const listRef = useRef(null);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
    setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 50);
  };

  const validatePrompt = (text) => {
    const trimmed = text.trim();
    const missing = promptChecks.filter((check) => !check.test(trimmed));
    return { ok: missing.length === 0, missing };
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    setInput("");
    const { ok, missing } = validatePrompt(text);

    addMessage({
      id: `u-${Date.now()}`,
      type: "user",
      text,
      isCorrect: ok,
    });

    if (ok) {
      await saveLessonInternalProgress(lesson.id, { exerciseCompleted: true });
      addMessage({
        id: `b-ok-${Date.now()}`,
        type: "bot",
        text: "¡Muy bien! Tu prompt está completo. Presiona Continuar para volver al módulo.",
      });
      return;
    }

    setFailCount((c) => c + 1);
    const hints = missing.map((m) => `- ${m.hint}`).join("\n");
    addMessage({
      id: `b-w-${Date.now()}`,
      type: "bot",
      text: `Te falta mejorar:\n${hints}`,
    });
  };

  const showHintButton = failCount >= 2;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="chat" size={22} color={COLORS.puertoTejadaRed} />
          <Text style={styles.headerTitle}>Ejercicio (chat)</Text>
        </View>
        <Text style={styles.headerSub}>{lesson.title}</Text>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ChatBubble text={item.text} type={item.type} isCorrect={item.isCorrect} />
        )}
      />

      <View
        style={[
          styles.composer,
          { flexDirection: isTablet ? "row" : "column" },
        ]}
      >
        <TextInput
          style={[styles.input, { flex: isTablet ? 1 : undefined }]}
          value={input}
          onChangeText={setInput}
          placeholder="Escribe tu prompt mejorado..."
          placeholderTextColor="#9CA3AF"
          multiline
        />

        <View style={styles.actions}>
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <MaterialIcons name="send" size={18} color="#fff" />
            <Text style={styles.sendText}>Enviar</Text>
          </TouchableOpacity>

          {showHintButton && (
            <TouchableOpacity
              style={styles.hintBtn}
              onPress={() =>
                addMessage({
                  id: `b-h-${Date.now()}`,
                  type: "bot",
                  text: `Pista rápida:\n- Rol\n- Tarea\n- Contexto\n- Formato`,
                })
              }
            >
              <Text style={styles.hintText}>Ver pista</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.continueText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 4,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerTitle: { fontSize: 16, fontWeight: "900", color: COLORS.text },
  headerSub: { fontSize: 12, color: COLORS.textLight },
  list: { padding: 16, paddingBottom: 12 },

  composer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 12,
    gap: 10,
  },
  input: {
    minHeight: 56,
    maxHeight: 120,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    backgroundColor: "#F9FAFB",
    textAlignVertical: "top",
  },
  actions: { flexDirection: "row", gap: 10, alignItems: "center" },
  sendBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.puertoTejadaRed,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  sendText: { color: "#fff", fontWeight: "900" },
  hintBtn: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
  },
  hintText: { color: COLORS.text, fontWeight: "800" },
  continueBtn: {
    marginLeft: "auto",
    backgroundColor: COLORS.puertoTejadaGreen,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  continueText: { color: "#fff", fontWeight: "900" },
});

export default ChatExerciseScreen;

