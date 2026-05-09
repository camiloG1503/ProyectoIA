// screens/PromptPracticeScreen.js
// Practica de prompts — IA Learning

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../utils/colors";

const promptChecks = [
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
      /explica|resume|crea|genera|analiza|redacta|propone|disena|disena/i.test(
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
      /lista|tabla|pasos|puntos|formato|maximo|maximo|bloques|titulo/i.test(
        text,
      ),
    hint: "Pide un formato de salida: lista, tabla, pasos o bloques.",
  },
];

const PromptPracticeScreen = ({ route }) => {
  // route.params: { lesson }
  const { lesson } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const [promptText, setPromptText] = useState("");
  const [promptFeedback, setPromptFeedback] = useState("");

  const handlePromptCheck = () => {
    const text = promptText.trim();
    if (!text) {
      setPromptFeedback(
        "Escribe una version mejorada del prompt para recibir retroalimentacion.",
      );
      return;
    }

    const missing = promptChecks.filter((check) => !check.test(text));
    if (missing.length === 0) {
      setPromptFeedback(
        "Excelente: tu prompt tiene rol, tarea, contexto y formato. Ya es apto para obtener respuestas mas utiles.",
      );
      return;
    }

    const hints = missing.map((item) => item.hint).join(" ");
    setPromptFeedback(`Vas bien, pero falta ajustar: ${hints}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View
        style={[styles.content, { flexDirection: isTablet ? "row" : "column" }]}
      >
        <View style={[styles.hero, { backgroundColor: lesson.color }]}>
          <MaterialIcons name="edit-note" size={40} color="#fff" />
          <Text style={styles.heroTitle}>Practica de prompts</Text>
          <Text style={styles.heroSubtitle}>{lesson.title}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Caso practico</Text>
          <View style={styles.tipBox}>
            <Text style={styles.tipLabel}>Problema local</Text>
            <Text style={styles.tipText}>{lesson.localChallenge?.problem}</Text>
          </View>
          <View style={styles.promptBox}>
            <Text style={styles.promptLabel}>Prompt mal hecho</Text>
            <Text style={styles.promptOriginal}>
              {lesson.localChallenge?.badPrompt}
            </Text>
          </View>

          <Text style={styles.bodyText}>
            Mejora el prompt para que incluya rol, tarea, contexto local y
            formato de respuesta.
          </Text>

          <TextInput
            style={styles.promptInput}
            placeholder="Escribe aqui tu prompt mejorado"
            placeholderTextColor="#9CA3AF"
            multiline
            value={promptText}
            onChangeText={setPromptText}
          />

          <TouchableOpacity
            style={[styles.primaryButton, { width: isTablet ? "50%" : "100%" }]}
            onPress={handlePromptCheck}
          >
            <MaterialIcons name="fact-check" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Evaluar mejora</Text>
          </TouchableOpacity>
          {!!promptFeedback && (
            <Text style={styles.statusText}>{promptFeedback}</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  content: {
    padding: 20,
    gap: 14,
    flexWrap: "wrap",
  },
  hero: {
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
    gap: 8,
    flex: 1,
    minWidth: 280,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    gap: 12,
    flex: 1,
    minWidth: 280,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textLight,
  },
  tipBox: {
    backgroundColor: "#EEF2FF",
    borderRadius: 18,
    padding: 14,
    gap: 4,
  },
  tipLabel: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  tipText: {
    color: COLORS.text,
    lineHeight: 22,
  },
  promptBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 14,
  },
  promptLabel: {
    color: COLORS.textLight,
    fontWeight: "700",
    marginBottom: 6,
  },
  promptOriginal: {
    color: COLORS.text,
    fontStyle: "italic",
  },
  promptInput: {
    minHeight: 120,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 14,
    textAlignVertical: "top",
    color: COLORS.text,
    backgroundColor: "#fff",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    minHeight: 50,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  statusText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PromptPracticeScreen;
