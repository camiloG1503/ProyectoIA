// screens/ModuleOverviewScreen.js
// HUB del módulo (checklist + accesos) — IA Learning

import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, RADIUS } from "../utils/colors";
import { isLessonUnlocked, loadProgress, saveLessonProgress } from "../utils/storage";
import {
  loadLessonInternalProgress,
  saveLessonInternalProgress,
} from "../utils/lessonInternalProgressStorage";
import { pickMotivationPhrase } from "../utils/motivationPhrases";
import { ROUTE_NAMES } from "../navigation/routeNames";

const CHECKLIST_ITEMS = [
  { key: "readingCompleted", label: "☑ Lectura completada" },
  { key: "pdfCompleted", label: "☑ PDF del módulo" },
  { key: "videoCompleted", label: "☑ Video visto" },
  { key: "exerciseCompleted", label: "☑ Ejercicio realizado" },
  { key: "localChallengeSaved", label: "☑ Desafío local guardado" },
];

const BADGES_BY_ID = {
  1: "Explorador de IA",
  2: "Constructor de Prompts",
  3: "Creador de Ideas",
  4: "Ciudadano Digital",
  5: "Prompt Master",
  6: "Graduado IA Learning",
};

const ModuleOverviewScreen = ({ route, navigation }) => {
  const { lesson } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const [completedLessons, setCompletedLessons] = useState([]);
  const [internalProgress, setInternalProgress] = useState({
    readingCompleted: false,
    pdfCompleted: false,
    videoCompleted: false,
    exerciseCompleted: false,
    localChallengeSaved: false,
  });

  const refresh = async () => {
    const stored = await loadProgress();
    const completed = stored?.completedLessons || [];

    if (!isLessonUnlocked(lesson.id, completed)) {
      Alert.alert(
        "Módulo bloqueado",
        "Completa el módulo anterior para desbloquear esta lección.",
      );
      navigation.navigate(ROUTE_NAMES.HOME);
      return;
    }

    setCompletedLessons(completed);

    const internal = await loadLessonInternalProgress(lesson.id);
    setInternalProgress(internal);
  };

  useEffect(() => {
    refresh();
    const unsubscribe = navigation.addListener("focus", refresh);
    return unsubscribe;
  }, [lesson?.id, navigation]);

  const internalDoneCount = useMemo(
    () => Object.values(internalProgress).filter(Boolean).length,
    [internalProgress],
  );

  const internalPercent = useMemo(
    () => Math.round((internalDoneCount / 5) * 100),
    [internalDoneCount],
  );

  const hasVideoAsset = useMemo(
    () => [1, 2, 4].includes(Number(lesson?.id)),
    [lesson?.id],
  );

  const finalizeDisabled =
    !internalProgress.videoCompleted ||
    !internalProgress.exerciseCompleted ||
    !internalProgress.localChallengeSaved;

  const handleFinalize = async () => {
    const xp = 50 + lesson.id * 10;
    const badgeName = BADGES_BY_ID[lesson.id] || "Insignia IA Learning";
    const phrase = pickMotivationPhrase();

    await saveLessonProgress(lesson.id);
    navigation.navigate(ROUTE_NAMES.COMPLETED, {
      lesson,
      rewards: { xp, badgeName, phrase },
    });
  };

  const go = (routeName, params = {}) =>
    navigation.navigate(routeName, { lesson, ...params });

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Bloque A — Cabecera viva */}
        <View style={styles.headerCard}>
          <View
            style={[
              styles.headerTop,
              { flexDirection: isTablet ? "row" : "column" },
            ]}
          >
            <View style={[styles.headerHero, { backgroundColor: lesson.color }]}>
              <MaterialIcons name={lesson.icon} size={44} color="#fff" />
              <Text style={styles.headerTitle}>{lesson.title}</Text>
              <Text style={styles.headerSub}>
                {lesson.level} · {lesson.duration}
              </Text>
            </View>

            <View style={styles.headerStats}>
              <Text style={styles.headerStatLabel}>Progreso del módulo</Text>
              <Text style={styles.headerStatValue}>{internalPercent}%</Text>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${internalPercent}%`,
                      backgroundColor: lesson.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.headerHint}>
                {internalDoneCount}/5 actividades completadas
              </Text>
            </View>
          </View>
        </View>

        {/* Bloque B — ¿Qué aprenderás? */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>¿Qué aprenderás?</Text>
          {(lesson.topics || []).slice(0, 6).map((t, idx) => (
            <View key={`${lesson.id}-topic-${idx}`} style={styles.topicRow}>
              <View style={styles.topicDot} />
              <Text style={styles.topicText}>{t}</Text>
            </View>
          ))}
        </View>

        {/* Bloque G — Checklist visual */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Checklist del módulo</Text>
          {CHECKLIST_ITEMS.map((item) => {
            const done = Boolean(internalProgress[item.key]);
            return (
              <Text
                key={item.key}
                style={[styles.checkItem, done ? styles.checkDone : styles.checkPending]}
              >
                {item.label}
              </Text>
            );
          })}
        </View>

        {/* Accesos */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ruta del módulo</Text>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => go(ROUTE_NAMES.MICRO_LESSONS)}
          >
            <MaterialIcons name="menu-book" size={18} color="#fff" />
            <Text style={styles.actionText}>Lectura</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnAlt]}
            onPress={() => go(ROUTE_NAMES.MODULE_PDF)}
          >
            <MaterialIcons name="picture-as-pdf" size={18} color="#fff" />
            <Text style={styles.actionText}>PDF del módulo</Text>
          </TouchableOpacity>

          {hasVideoAsset ? (
            <TouchableOpacity
              style={[
                styles.actionBtn,
                !internalProgress.pdfCompleted && styles.actionBtnDisabled,
              ]}
              onPress={() => go(ROUTE_NAMES.MODULE_VIDEO)}
              disabled={!internalProgress.pdfCompleted}
            >
              <MaterialIcons name="smart-display" size={18} color="#fff" />
              <Text style={styles.actionText}>Video interactivo</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.actionBtn,
                !internalProgress.pdfCompleted && styles.actionBtnDisabled,
              ]}
              onPress={async () => {
                await saveLessonInternalProgress(lesson.id, {
                  videoCompleted: true,
                });
                refresh();
              }}
              disabled={!internalProgress.pdfCompleted}
            >
              <MaterialIcons name="check-circle" size={18} color="#fff" />
              <Text style={styles.actionText}>
                Marcar video como visto (sin video)
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.actionBtn,
              !internalProgress.videoCompleted && styles.actionBtnDisabled,
            ]}
            onPress={() => go(ROUTE_NAMES.CHAT_EXERCISE)}
            disabled={!internalProgress.videoCompleted}
          >
            <MaterialIcons name="chat" size={18} color="#fff" />
            <Text style={styles.actionText}>Ejercicio (chat)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionBtn,
              !internalProgress.exerciseCompleted && styles.actionBtnDisabled,
            ]}
            onPress={() => go(ROUTE_NAMES.LOCAL_CHALLENGE)}
            disabled={!internalProgress.exerciseCompleted}
          >
            <MaterialIcons name="public" size={18} color="#fff" />
            <Text style={styles.actionText}>Desafío local</Text>
          </TouchableOpacity>
        </View>

        {/* Finalizar módulo */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Finalizar módulo</Text>
          <Text style={styles.bodyText}>
            Completa el video, el ejercicio y guarda tu desafío local para
            finalizar.
          </Text>

          <TouchableOpacity
            style={[styles.finalizeBtn, finalizeDisabled && styles.finalizeDisabled]}
            onPress={handleFinalize}
            disabled={finalizeDisabled}
          >
            <MaterialIcons name="task-alt" size={20} color="#fff" />
            <Text style={styles.finalizeText}>Finalizar módulo</Text>
          </TouchableOpacity>

          {completedLessons.includes(lesson.id) && (
            <Text style={styles.doneNote}>
              Este módulo ya está marcado como completado.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },
  content: { padding: 20, gap: 14, paddingBottom: 40 },

  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 14,
  },
  headerTop: { gap: 14 },
  headerHero: {
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    gap: 8,
    flex: 1,
    minWidth: 260,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  headerSub: { color: "rgba(255,255,255,0.92)", fontSize: 13 },
  headerStats: {
    flex: 1,
    minWidth: 260,
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  headerStatLabel: { fontSize: 12, fontWeight: "800", color: COLORS.textLight },
  headerStatValue: { fontSize: 22, fontWeight: "900", color: COLORS.text },
  headerHint: { fontSize: 12, color: COLORS.textLight },
  progressBarBg: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: RADIUS.pill,
    overflow: "hidden",
  },
  progressBarFill: { height: 10, borderRadius: RADIUS.pill },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    gap: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "900", color: COLORS.primary },
  bodyText: { fontSize: 13, lineHeight: 18, color: COLORS.textLight },

  topicRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  topicDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.puertoTejadaGreen,
    marginTop: 6,
  },
  topicText: { flex: 1, fontSize: 13, color: COLORS.text, lineHeight: 18 },

  checkItem: { fontSize: 14, fontWeight: "800" },
  checkDone: { color: COLORS.puertoTejadaGreen },
  checkPending: { color: "#9CA3AF" },

  actionBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    minHeight: 50,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  actionBtnAlt: { backgroundColor: COLORS.puertoTejadaRed },
  actionBtnDisabled: { opacity: Platform.OS === "web" ? 0.55 : 0.5 },
  actionText: { color: "#fff", fontWeight: "800" },

  finalizeBtn: {
    backgroundColor: COLORS.puertoTejadaGreen,
    borderRadius: 16,
    minHeight: 54,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  finalizeDisabled: { opacity: Platform.OS === "web" ? 0.55 : 0.5 },
  finalizeText: { color: "#fff", fontWeight: "900" },
  doneNote: { fontSize: 12, color: COLORS.textLight },
});

export default ModuleOverviewScreen;
