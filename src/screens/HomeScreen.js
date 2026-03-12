import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Text style={styles.headerEmoji}>🛰️</Text>
          </View>

          <Text style={styles.headerTitle}>
            Aprende Inteligencia Artificial
          </Text>
          <Text style={styles.headerSubtitle}>
            Paso a paso, domina las herramientas del futuro.
          </Text>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },

  header: {
    backgroundColor: "#4F46E5",
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },

  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
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

  progressCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    marginTop: 20,
    padding: 15,
    borderRadius: 16,
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
});

export default HomeScreen;