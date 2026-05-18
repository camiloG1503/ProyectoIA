// screens/MicroLessonsScreen.js
// Microlecciones del modulo — IA Learning

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { COLORS } from "../utils/colors";
import { saveLessonInternalProgress } from "../utils/lessonInternalProgressStorage";

const MicroLessonsScreen = ({ route, navigation }) => {
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
          <ScrollView
            contentContainerStyle={styles.readingContainer}
            showsVerticalScrollIndicator={false}
          >
            {(lesson.content?.paragraphs || []).map((paragraph, index) => (
              <View key={`${lesson.id}-${index}`} style={styles.paragraphCard}>
                <View style={styles.paragraphHeader}>
                  <MaterialIcons
                    name="menu-book"
                    size={18}
                    color={COLORS.puertoTejadaRed}
                  />
                  <Text style={styles.paragraphLabel}>{`Bloque ${index + 1}`}</Text>
                </View>
                <Text style={styles.paragraphText}>{paragraph}</Text>
              </View>
            ))}
          </ScrollView>
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

          <TouchableOpacity
            style={[
              styles.completeButton,
              { width: isTablet ? "50%" : "100%" },
            ]}
            onPress={async () => {
              await saveLessonInternalProgress(lesson.id, {
                readingCompleted: true,
              });
              navigation.goBack();
            }}
          >
            <Text style={styles.completeButtonText}>
              ✅ Marcar lectura completada
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
  readingContainer: {
    gap: 10,
    paddingBottom: 6,
  },
  paragraphCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
  },
  paragraphHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  paragraphLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.puertoTejadaGreen,
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
  completeButton: {
    backgroundColor: COLORS.puertoTejadaGreen,
    borderRadius: 16,
    minHeight: 50,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  completeButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
});

export default MicroLessonsScreen;
