// screens/ModuleVideoScreen.js
// Video interactivo por módulo — IA Learning

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { COLORS, RADIUS } from "../utils/colors";
import { VIDEO_QUESTIONS_BY_MODULE } from "../utils/moduleVideoQuestions";
import { saveLessonInternalProgress } from "../utils/lessonInternalProgressStorage";

const VIDEO_SOURCES = {
  1: require("../../assets/videos/module-1.mp4"),
  2: require("../../assets/videos/module-2.mp4"),
  4: require("../../assets/videos/module-4.mp4"),
};

const ModuleVideoScreen = ({ route, navigation }) => {
  const { lesson } = route.params;
  const [questionModal, setQuestionModal] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [didFinish, setDidFinish] = useState(false);
  const [playerError, setPlayerError] = useState(null);
  const askedRef = useRef(new Set());
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const source = VIDEO_SOURCES[lesson.id];
  const questions = useMemo(
    () => VIDEO_QUESTIONS_BY_MODULE[lesson.id] || [],
    [lesson.id],
  );

  const player = useVideoPlayer(source ?? null, (playerInstance) => {
    if (!source) return;
    playerInstance.timeUpdateEventInterval = 0.5;
    playerInstance.play();
  });

  useEffect(() => {
    askedRef.current = new Set();
    setQuestionModal(null);
    setFeedback("");
    setDidFinish(false);
    setPlayerError(null);
  }, [lesson.id]);

  useEventListener(player, "timeUpdate", ({ currentTime }) => {
    if (!player?.playing || questionModal) return;
    const positionSeconds = currentTime || 0;

    for (let index = 0; index < questions.length; index += 1) {
      const q = questions[index];
      if (askedRef.current.has(index)) continue;

      if (positionSeconds >= q.atSeconds) {
        askedRef.current.add(index);
        player.pause();
        setFeedback("");
        setQuestionModal({ ...q, index });
        return;
      }
    }
  });

  useEventListener(player, "playToEnd", () => {
    setDidFinish(true);
  });

  useEventListener(player, "statusChange", ({ status, error }) => {
    if (status === "error") {
      setPlayerError(error || new Error("Error al reproducir el video"));
    }
  });

  const handleAnswer = async (selectedIndex) => {
    const isCorrect = selectedIndex === questionModal.correctIndex;
    if (isCorrect) {
      setFeedback(questionModal.feedbackCorrect);
      setTimeout(async () => {
        setQuestionModal(null);
        setFeedback("");
        try {
          player?.play();
        } catch {}
      }, 600);
      return;
    }

    setFeedback(questionModal.feedbackWrong);
  };

  const handleFinish = async () => {
    await saveLessonInternalProgress(lesson.id, { videoCompleted: true });
    navigation.goBack();
  };

  if (!source) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.noVideoCard}>
          <MaterialIcons name="info" size={24} color={COLORS.text} />
          <Text style={styles.noVideoTitle}>Video no disponible aún</Text>
          <Text style={styles.noVideoText}>
            Este módulo no tiene video cargado. Puedes volver al HUB y marcarlo
            como visto.
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (playerError) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.noVideoCard}>
          <MaterialIcons name="warning" size={24} color={COLORS.text} />
          <Text style={styles.noVideoTitle}>Modulo de video no disponible</Text>
          <Text style={styles.noVideoText}>
            No se pudo cargar el reproductor. Reinstala dependencias o recompila
            la app para incluir expo-video.
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const videoHeight = isTablet ? 260 : 220;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {isTablet ? (
        <View style={[styles.videoCard, styles.videoCardTablet]}>
          <View style={styles.infoColumn}>
            <Text style={[styles.title, styles.titleRegular]}>
              Video interactivo 
            </Text>
            <Text style={styles.sub}>{lesson.title}</Text>
            <TouchableOpacity
              style={[
                styles.primaryBtn,
                styles.primaryBtnTablet,
                !didFinish && styles.primaryBtnDisabled,
              ]}
              onPress={handleFinish}
              disabled={!didFinish}
            >
              <Text style={styles.primaryText}>Entendido</Text>
            </TouchableOpacity>
            {!didFinish && (
              <Text style={styles.finishHint}>
                Cuando el video termine, podrás marcarlo como visto.
              </Text>
            )}
          </View>
          <View style={styles.videoColumn}>
            <VideoView
              player={player}
              style={[styles.video, { height: videoHeight }]}
              nativeControls
              contentFit="contain"
            />
          </View>
        </View>
      ) : (
        <View style={styles.videoCard}>
          <Text style={[styles.title, styles.titleCompact]}>
            Video interactivo
          </Text>
          <Text style={styles.sub}>{lesson.title}</Text>

          <VideoView
            player={player}
            style={[styles.video, { height: videoHeight }]}
            nativeControls
            contentFit="contain"
          />

          <TouchableOpacity
            style={[styles.primaryBtn, !didFinish && styles.primaryBtnDisabled]}
            onPress={handleFinish}
            disabled={!didFinish}
          >
            <Text style={styles.primaryText}>Entendido</Text>
          </TouchableOpacity>
          {!didFinish && (
            <Text style={styles.finishHint}>
              Cuando el video termine, podrás marcarlo como visto.
            </Text>
          )}
        </View>
      )}

      <Modal
        visible={Boolean(questionModal)}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{questionModal?.question}</Text>
            {(questionModal?.options || []).map((opt, idx) => (
              <TouchableOpacity
                key={`${questionModal?.index}-${idx}`}
                style={styles.optionBtn}
                onPress={() => handleAnswer(idx)}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
            {!!feedback && <Text style={styles.feedback}>{feedback}</Text>}
            {!!feedback && feedback === questionModal?.feedbackWrong && (
              <Text style={styles.tryAgain}>Intenta de nuevo.</Text>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light, padding: 16 },
  videoCard: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.xl,
    padding: 16,
    gap: 10,
    flex: 1,
  },
  videoCardTablet: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
  },
  infoColumn: { flex: 1, gap: 8 },
  videoColumn: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontWeight: "900", color: COLORS.text },
  titleCompact: { fontSize: 18 },
  titleRegular: { fontSize: 20 },
  sub: { fontSize: 12, color: COLORS.textLight },
  video: {
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 16,
  },
  primaryBtn: {
    backgroundColor: COLORS.puertoTejadaGreen,
    borderRadius: 16,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  primaryBtnTablet: { width: "50%", minHeight: 46 },
  primaryBtnDisabled: { opacity: 0.55 },
  primaryText: { color: "#fff", fontWeight: "900" },
  finishHint: { fontSize: 11, color: COLORS.textLight },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: RADIUS.xl,
    padding: 18,
    gap: 10,
  },
  modalTitle: { fontSize: 16, fontWeight: "900", color: COLORS.text },
  optionBtn: {
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    padding: 12,
  },
  optionText: { color: COLORS.text, fontWeight: "700" },
  feedback: { color: COLORS.text, lineHeight: 18, fontWeight: "700" },
  tryAgain: { color: COLORS.textLight, fontSize: 12 },

  noVideoCard: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.xl,
    padding: 18,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  noVideoTitle: { fontSize: 18, fontWeight: "900", color: COLORS.text },
  noVideoText: { textAlign: "center", color: COLORS.textLight, lineHeight: 18 },
});

export default ModuleVideoScreen;
