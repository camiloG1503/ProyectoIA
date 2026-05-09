// screens/ModuleOverviewScreen.js
// Contenido del modulo — IA Learning

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  TextInput,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { COLORS } from "../utils/colors";
import { loadProgress, saveLessonProgress } from "../utils/storage";
import { sharePdf } from "../utils/pdfHelpers";
import { buildModulePdfHtml } from "../utils/pdfTemplates";
import { ROUTE_NAMES } from "../navigation/routeNames";

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

const ModuleOverviewScreen = ({ route, navigation }) => {
  // route.params: { lesson }
  const { lesson } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const [completedLessons, setCompletedLessons] = useState([]);
  const [readingActive, setReadingActive] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [promptFeedback, setPromptFeedback] = useState("");
  const [modulePdfStatus, setModulePdfStatus] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const syncProgress = async () => {
      const stored = await loadProgress();
      setCompletedLessons(stored?.completedLessons || []);
    };

    syncProgress();

    return () => {
      Speech.stop();
    };
  }, []);

  const isModuleCompleted = completedLessons.includes(lesson.id);

  const handleCompleteModule = async () => {
    const newData = await saveLessonProgress(lesson.id);
    setCompletedLessons(newData.completedLessons || []);
    setStatus("Modulo marcado como completado.");
    navigation.navigate(ROUTE_NAMES.COMPLETED, { lesson });
  };

  const handleSpeech = () => {
    if (readingActive) {
      Speech.stop();
      setReadingActive(false);
      return;
    }

    const readingText =
      lesson.content?.paragraphs?.join(" ") || lesson.description;
    Speech.speak(readingText, {
      language: "es-CO",
      rate: 0.95,
      onDone: () => setReadingActive(false),
      onStopped: () => setReadingActive(false),
      onError: () => setReadingActive(false),
    });
    setReadingActive(true);
  };

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

  const handleModulePdf = async () => {
    const html = buildModulePdfHtml(lesson);
    const result = await sharePdf({
      html,
      fileName: `Modulo ${lesson.id} PDF`,
      statusMessage: "PDF del modulo generado correctamente.",
    });
    if (result?.message) {
      setModulePdfStatus(result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.headerRow,
            { flexDirection: isTablet ? "row" : "column" },
          ]}
        >
          <View style={[styles.hero, { backgroundColor: lesson.color }]}>
            <MaterialIcons name={lesson.icon} size={44} color="#fff" />
            <Text style={[styles.heroTitle, isTablet && styles.heroTitleLarge]}>
              {lesson.title}
            </Text>
            <Text style={styles.heroSubtitle}>{lesson.subtitle}</Text>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{lesson.level}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Resumen rapido</Text>
            <Text style={styles.bodyText}>{lesson.description}</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>{lesson.duration}</Text>
              </View>
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>{lesson.level}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Microlecciones</Text>
          <FlatList
            data={lesson.content?.paragraphs || []}
            keyExtractor={(item, index) => `${lesson.id}-${index}`}
            renderItem={({ item }) => (
              <Text style={styles.paragraphText}>{item}</Text>
            )}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
              <View style={styles.paragraphSpacer} />
            )}
          />
          <TouchableOpacity
            style={[styles.primaryButton, { width: isTablet ? "50%" : "100%" }]}
            onPress={handleSpeech}
          >
            <MaterialIcons
              name={readingActive ? "stop" : "volume-up"}
              size={20}
              color="#fff"
            />
            <Text style={styles.primaryButtonText}>
              {readingActive ? "Detener lectura" : "Escuchar lectura"}
            </Text>
          </TouchableOpacity>
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

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>PDF del modulo</Text>
          <Text style={styles.bodyText}>
            Descarga este modulo en PDF para repasarlo sin conexion.
          </Text>
          <TouchableOpacity
            style={[styles.primaryButton, { width: isTablet ? "50%" : "100%" }]}
            onPress={handleModulePdf}
          >
            <MaterialIcons name="picture-as-pdf" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>
              Descargar PDF del modulo
            </Text>
          </TouchableOpacity>
          {!!modulePdfStatus && (
            <Text style={styles.statusText}>{modulePdfStatus}</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Finalizar modulo</Text>
          <Text style={styles.bodyText}>
            Marca el modulo como completado cuando termines todas las
            actividades.
          </Text>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              isModuleCompleted && styles.primaryButtonDone,
              { width: isTablet ? "50%" : "100%" },
            ]}
            onPress={handleCompleteModule}
            disabled={isModuleCompleted}
          >
            <MaterialIcons name="task-alt" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>
              {isModuleCompleted ? "Modulo completado" : "Completar modulo"}
            </Text>
          </TouchableOpacity>
          {!!status && <Text style={styles.statusText}>{status}</Text>}
        </View>
      </ScrollView>
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
    paddingBottom: 32,
  },
  headerRow: {
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
    textAlign: "center",
  },
  heroTitleLarge: {
    fontSize: 26,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    textAlign: "center",
  },
  heroBadge: {
    marginTop: 6,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  heroBadgeText: {
    color: "#fff",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    gap: 12,
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
  paragraphText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text,
  },
  paragraphSpacer: {
    height: 10,
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  metaChip: {
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  metaChipText: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 12,
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
  primaryButtonDone: {
    backgroundColor: COLORS.puertoTejadaGreen,
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
});

export default ModuleOverviewScreen;
