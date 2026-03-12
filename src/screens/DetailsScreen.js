import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../utils/colors";

const DetailsScreen = ({ route, navigation }) => {
  const { lesson, previousScreen } = route.params;
  const { width, height } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);

  const isLandscape = width > height;
  const isTablet = width > 600;
  const padding = isTablet ? 32 : isLandscape ? 24 : 16;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleStartLesson = () => {
    navigation.navigate("LessonContent", { lesson, previousScreen: "Details" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { padding }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={[styles.header, { backgroundColor: lesson.color }]}>
          <MaterialIcons name={lesson.icon} size={64} color="#fff" />
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.subtitle}>{lesson.subtitle}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialIcons name="schedule" size={18} color={lesson.color} />
              <Text style={styles.infoLabel}> Duración</Text>
            </View>
            <Text style={styles.infoValue}>{lesson.duration}</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialIcons name="bar-chart" size={18} color={lesson.color} />
              <Text style={styles.infoLabel}> Nivel</Text>
            </View>
            <Text style={styles.infoValue}>{lesson.level}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="menu-book" size={20} color={lesson.color} />
            <Text style={styles.sectionTitle}> Descripción</Text>
          </View>
          <Text style={styles.description}>{lesson.description}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="auto-stories" size={20} color={lesson.color} />
            <Text style={styles.sectionTitle}> Temas que aprenderás</Text>
          </View>
          {(lesson.topics || []).map((topic, index) => (
            <View key={index} style={styles.topicItem}>
              <View
                style={[styles.topicBullet, { backgroundColor: lesson.color }]}
              />
              <Text style={styles.topicText}>{topic}</Text>
            </View>
          ))}
        </View>

        <View style={styles.navInfo}>
          <View style={styles.navRow}>
            <MaterialIcons name="navigation" size={18} color="#fff" />
            <Text style={styles.navInfoText}>
              {" "}
              Navegaste desde: {previousScreen}
            </Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: lesson.color }]}
        onPress={handleStartLesson}
      >
        <View style={styles.buttonRow}>
          <MaterialIcons name="play-arrow" size={22} color="#fff" />
          <Text style={styles.buttonText}> Iniciar Lección</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },
  content: { flexGrow: 1 },
  header: {
    padding: 32,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: "#fff", opacity: 0.9 },
  infoContainer: { flexDirection: "row", gap: 12, marginBottom: 24 },
  infoCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  infoLabel: { fontSize: 14, color: COLORS.textLight },
  infoValue: { fontSize: 16, fontWeight: "bold" },
  section: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  description: { fontSize: 15, lineHeight: 24 },
  topicItem: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  topicBullet: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  topicText: { fontSize: 15 },
  navInfo: {
    backgroundColor: COLORS.accent,
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  navInfoText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  button: { padding: 18, borderRadius: 16, alignItems: "center", margin: 20 },
  buttonRow: { flexDirection: "row", alignItems: "center" },
  buttonText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
});

export default DetailsScreen;