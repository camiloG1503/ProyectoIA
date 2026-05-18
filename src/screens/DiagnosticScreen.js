// screens/DiagnosticScreen.js
// Diagnostico inicial — IA Learning

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../utils/colors";

const diagnosticQuestions = [
  {
    question:
      "Antes de que comiences los modulos, ¿como describirias tu nivel de uso de IA?",
    options: [
      "Nunca la he usado",
      "La uso algunas veces",
      "La uso con frecuencia",
    ],
  },
  {
    question: "¿Para que usas mas la IA actualmente?",
    options: [
      "Estudio y tareas",
      "Ideas de proyectos",
      "Curiosidad o entretenimiento",
    ],
  },
  {
    question: "¿Que tan seguido verificas si la respuesta de IA es correcta?",
    options: ["Siempre", "A veces", "Casi nunca"],
  },
  {
    question:
      "¿Sueles dar contexto local (curso, edad, municipio) cuando escribes prompts?",
    options: ["Si", "A veces", "No"],
  },
  {
    question: "Despues de este modulo, ¿que quieres mejorar primero?",
    options: [
      "Escribir mejores prompts",
      "Evaluar respuestas",
      "Usarla con etica",
    ],
  },
];

const DiagnosticScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const [diagnosticAnswers, setDiagnosticAnswers] = useState({});
  const [diagnosticStatus, setDiagnosticStatus] = useState("");

  const handleDiagnosticSelect = (questionIndex, option) => {
    setDiagnosticAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const handleDiagnosticSubmit = () => {
    const answeredCount = Object.keys(diagnosticAnswers).length;
    if (answeredCount < diagnosticQuestions.length) {
      setDiagnosticStatus(
        "Responde todas las preguntas para guardar tu diagnostico inicial.",
      );
      return;
    }

    setDiagnosticStatus(
      `Diagnostico registrado: ${answeredCount} respuestas. Punto de partida identificado.`,
    );
  };

  const renderOption =
    (questionIndex) =>
    ({ item: option }) => {
      const isSelected = diagnosticAnswers[questionIndex] === option;

      return (
        <TouchableOpacity
          style={[styles.optionButton, isSelected && styles.optionSelected]}
          onPress={() => handleDiagnosticSelect(questionIndex, option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      );
    };

  const renderQuestion = ({ item, index }) => (
    <View style={styles.questionCard}>
      <Text style={styles.questionText}>{item.question}</Text>
      <FlatList
        data={item.options}
        keyExtractor={(option, optionIndex) =>
          `${index}-${option}-${optionIndex}`
        }
        renderItem={renderOption(index)}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.optionSpacer} />}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <FlatList
        data={diagnosticQuestions}
        keyExtractor={(item, index) => `${index}-${item.question}`}
        renderItem={renderQuestion}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.questionSpacer} />}
        ListHeaderComponent={
          <View
            style={[
              styles.headerRow,
              { flexDirection: isTablet ? "row" : "column" },
            ]}
          >
            <View style={styles.hero}>
              <MaterialIcons
                name="assignment-turned-in"
                size={38}
                color="#fff"
              />
              <Text
                style={[styles.heroTitle, isTablet && styles.heroTitleLarge]}
              >
                Diagnostico inicial
              </Text>
              <Text style={styles.heroSubtitle}>
                Conoce tu punto de partida antes de avanzar por los modulos.
              </Text>
            </View>
            <View style={styles.introCard}>
              <Text style={styles.sectionTitle}>Cuestionario rapido</Text>
              <Text style={styles.bodyText}>
                Este diagnostico no se califica. Nos ayuda a personalizar tu
                proceso.
              </Text>
            </View>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footerCard}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                { width: isTablet ? "50%" : "100%" },
              ]}
              onPress={handleDiagnosticSubmit}
            >
              <MaterialIcons name="fact-check" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Guardar diagnostico</Text>
            </TouchableOpacity>
            {!!diagnosticStatus && (
              <Text style={styles.statusText}>{diagnosticStatus}</Text>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  listContent: {
    padding: 20,
    paddingBottom: 28,
  },
  headerRow: {
    gap: 14,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  hero: {
    backgroundColor: COLORS.puertoTejadaRed,
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
  heroTitleLarge: {
    fontSize: 26,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    textAlign: "center",
  },
  introCard: {
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
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 10,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#fff",
  },
  optionSpacer: {
    height: 8,
  },
  questionSpacer: {
    height: 12,
  },
  optionSelected: {
    borderColor: COLORS.puertoTejadaGreen,
    backgroundColor: "#ECFDF5",
  },
  optionText: {
    color: COLORS.text,
    fontWeight: "600",
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
  },
  footerCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 12,
    gap: 10,
  },
});

export default DiagnosticScreen;
