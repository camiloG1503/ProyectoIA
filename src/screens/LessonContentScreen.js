import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../utils/colors";
import { saveLessonProgress } from "../utils/storage";

const LessonContentScreen = ({ route, navigation }) => {
  const { lesson } = route.params;

  const handleFinishLesson = async () => {
    try {
      await saveLessonProgress(lesson.id);

      navigation.navigate("Completed", { lesson });
    } catch (error) {
      console.log("Error finishing lesson:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          {lesson.icon} {lesson.title}
        </Text>
        <Text style={styles.subtitle}>{lesson.subtitle}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introducción</Text>
          <Text style={styles.text}>
            La Inteligencia Artificial (IA) es una rama de la informática que
            busca crear sistemas capaces de realizar tareas que normalmente
            requieren inteligencia humana, como aprender, analizar información y
            tomar decisiones.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conceptos clave</Text>
          {lesson.topics.map((topic, index) => (
            <View key={index} style={styles.topicItem}>
              <Text style={styles.topicBullet}>•</Text>
              <Text style={styles.topicText}>{topic}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aplicación en el mundo real</Text>
          <Text style={styles.text}>
            Hoy en día la IA se utiliza en muchas áreas como la medicina,
            educación, transporte, comercio electrónico y automatización de
            procesos.
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: lesson.color }]}
        onPress={handleFinishLesson}
      >
        <Text style={styles.buttonText}>Finalizar lección</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },
  content: { padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  subtitle: { fontSize: 16, color: COLORS.textLight, marginBottom: 20 },
  section: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.primary,
  },
  text: { fontSize: 15, lineHeight: 22, color: COLORS.textLight },
  topicItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  topicBullet: { fontSize: 20, marginRight: 8, color: COLORS.vibrantPurple },
  topicText: { fontSize: 15, color: COLORS.text },
  button: { padding: 16, margin: 20, borderRadius: 14, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default LessonContentScreen;