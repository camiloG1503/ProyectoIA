import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { loadProgress } from "../utils/storage";
import { lessonsData } from "../utils/lessonsData";
import { COLORS } from "../utils/colors";

const LessonScreen = ({ navigation }) => {
  const [completedLessons, setCompletedLessons] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadUserProgress = async () => {
    const stored = await loadProgress();
    setCompletedLessons(stored?.completedLessons || []);
  };

  useEffect(() => {
    loadUserProgress();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserProgress();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            🧠 Aprende Inteligencia Artificial
          </Text>
          <Text style={styles.headerSubtitle}>
            Aprende IA paso a paso y domina las herramientas del futuro
          </Text>
        </View>

        <View style={styles.lessonsContainer}>
          {lessonsData.map((lesson) => {
            const completed = completedLessons.includes(lesson.id);
            return (
              <TouchableOpacity
                key={lesson.id}
                style={[styles.lessonCard, completed && styles.completedCard]}
                onPress={() => navigation.navigate("Details", { lesson })}
              >
                <Text style={styles.lessonTitle}>
                  {lesson.icon} {lesson.title}
                </Text>
                <Text style={styles.lessonSubtitle}>
                  {completed ? "✅ Completada" : lesson.subtitle}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },
  header: {
    padding: 20,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  headerSubtitle: { fontSize: 14, color: "#eee", lineHeight: 20 },

  lessonsContainer: { padding: 20 },
  lessonCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  completedCard: { backgroundColor: "#d4ffd4" },
  lessonTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  lessonSubtitle: { fontSize: 14, color: COLORS.textLight },
});

export default LessonScreen;