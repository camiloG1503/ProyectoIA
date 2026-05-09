// screens/MicroLessonsScreen.js
// Microlecciones del modulo — IA Learning

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { COLORS } from "../utils/colors";

const MicroLessonsScreen = ({ route }) => {
  // route.params: { lesson }
  const { lesson } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const [readingActive, setReadingActive] = useState(false);

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

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View
        style={[styles.content, { flexDirection: isTablet ? "row" : "column" }]}
      >
        <View style={[styles.hero, { backgroundColor: lesson.color }]}>
          <MaterialIcons name={lesson.icon} size={44} color="#fff" />
          <Text style={styles.heroTitle}>{lesson.title}</Text>
          <Text style={styles.heroSubtitle}>Microlecciones del modulo</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Lectura guiada</Text>
          {(lesson.content?.paragraphs || []).map((paragraph, index) => (
            <Text key={`${lesson.id}-${index}`} style={styles.paragraphText}>
              {paragraph}
            </Text>
          ))}
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
    textAlign: "center",
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
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
  paragraphText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text,
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
});

export default MicroLessonsScreen;
