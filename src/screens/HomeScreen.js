import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Platform,
} from "react-native";
import LessonCard from "../components/LessonCard";
import { lessonsData } from "../utils/lessonsData";
import { loadProgress } from "../utils/storage";
import { COLORS } from "../utils/colors";

const HomeScreen = ({ navigation }) => {
  const [completedLessons, setCompletedLessons] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadUserProgress = async () => {
    const stored = await loadProgress();
    setCompletedLessons(stored?.completedLessons || []);
  };

  useEffect(() => {
    loadUserProgress();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserProgress();
    setRefreshing(false);
  };

  const totalLessons = lessonsData.length;
  const completed = completedLessons.length;
  const percentage =
    totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

  // Color del header según plataforma
  const headerBgColor = Platform.select({
    ios: COLORS.primary,       // iOS: azul corporativo (más sobrio)
    android: "#FF6B6B",        // Android: color vibrante
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* HEADER */}
        <View style={[styles.header, { backgroundColor: headerBgColor }]}>
          <View style={styles.headerIconContainer}>
            <Text style={styles.headerEmoji}>🛰️</Text>
          </View>

          <Text style={styles.headerTitle}>
            Aprende Inteligencia Artificial
          </Text>
          <Text style={styles.headerSubtitle}>
            Paso a paso, domina las herramientas del futuro.
          </Text>

          {/* Badge que muestra el sistema operativo */}
          <View style={styles.osBadge}>
            <Text style={styles.osText}>
              {Platform.OS === "ios" ? "📱 iOS" : "🤖 Android"}
            </Text>
          </View>

          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Progreso del curso</Text>
            <View style={styles.progressBarBackground}>
              <View
                style={[styles.progressBarFill, { width: `${percentage}%` }]}
              />
            </View>
            <Text style={styles.progressText}>
              {completed} de {totalLessons} lecciones completadas
            </Text>
          </View>
        </View>

        {/* LISTA DE LECCIONES */}
        <View style={styles.lessonsContainer}>
          {lessonsData.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              isCompleted={completedLessons.includes(lesson.id)}
              onPress={() => navigation.navigate("Details", { lesson })}
            />
          ))}
        </View>
      </ScrollView>
      {/* Botón flotante de ChatBot */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("ChatBot_Ayuda")}
        accessibilityLabel="Abrir chat de ayuda"
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>💬</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },

  header: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },

  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },

  headerEmoji: { fontSize: 50 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
    textAlign: "center",
  },
  headerSubtitle: { color: "#eee", lineHeight: 20, textAlign: "center" },

  osBadge: {
    marginTop: 12,
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  osText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  progressCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    marginTop: 20,
    padding: 15,
    borderRadius: 16,
    width: "100%",
  },

  progressTitle: { color: "#fff", fontWeight: "bold", marginBottom: 8 },
  progressBarBackground: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: { height: 8, backgroundColor: "#22C55E" },
  progressText: { color: "#fff", marginTop: 6, fontSize: 12 },

  lessonsContainer: { padding: 20 },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 100,
  },
  fabIcon: {
    fontSize: 30,
    color: "#fff",
  },
});

export default HomeScreen;