// screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Platform,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import LessonCard from "../components/LessonCard";
import { lessonsData } from "../utils/lessonsData";
import { loadProgress } from "../utils/storage";
import { COLORS, PUERTO_TEJADA } from "../utils/colors";

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
  const percentage = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

  const headerBgColor = Platform.select({
    ios: COLORS.puertoTejadaRed,
    android: "#FF6B6B",
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={Platform.OS !== "web"}
        scrollEnabled={true}
        refreshControl={Platform.OS === "web" ? undefined : <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
      >
        {/* HEADER PRINCIPAL */}
        <View style={[styles.header, { backgroundColor: headerBgColor }]}>
          <View style={styles.headerIconContainer}>
            <Text style={styles.headerEmoji}>🛰️</Text>
          </View>

          <Text style={styles.headerTitle}>Aprende Inteligencia Artificial</Text>
          <Text style={styles.headerSubtitle}>
            Paso a paso, domina las herramientas del futuro.
          </Text>

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

        {/* BANNER IDENTIDAD PUERTO TEJADA */}
        <View style={styles.puertoTejadaBanner}>
          <View style={styles.flagStrip}>
            <View
              style={[
                styles.flagColor,
                { backgroundColor: COLORS.puertoTejadaRed },
              ]}
            />
            <View
              style={[
                styles.flagColor,
                { backgroundColor: COLORS.puertoTejadaWhite },
              ]}
            />
            <View
              style={[
                styles.flagColor,
                { backgroundColor: COLORS.puertoTejadaGreen },
              ]}
            />
          </View>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Puerto Tejada, Cauca</Text>
            <Text style={styles.bannerDate}>
              Fundado: {PUERTO_TEJADA.fundacion}
            </Text>
            <Text style={styles.bannerDescription}>
              {PUERTO_TEJADA.descripcion}
            </Text>
          </View>
        </View>

        {/* BOTÓN DE ACCESO A LA PWA (ACTIVIDAD) */}
        <TouchableOpacity
          style={styles.pwaButton}
          onPress={() => navigation.navigate("PWA")}
        >
          <MaterialIcons
            name="important-devices"
            size={22}
            color={COLORS.puertoTejadaRed}
          />
          <Text style={styles.pwaButtonText}>Nuestra PWA</Text>
        </TouchableOpacity>

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

        {/* FOOTER CONMEMORATIVO */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>🌿 {PUERTO_TEJADA.lema} 🌿</Text>
          <Text style={styles.footerSmall}>
            Aplicación desarrollada con orgullo porteño
          </Text>
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
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
    width: "100%",
  },

  scroll: {
    flex: 1,
    width: "100%",
  },

  scrollContent: {
    flexGrow: 1,
    flexBasis: "auto",
  },
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
  osText: { color: "#fff", fontWeight: "600", fontSize: 14 },
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

  puertoTejadaBanner: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: { elevation: 4 },
    }),
  },
  flagStrip: {
    flexDirection: "row",
    height: 8,
  },
  flagColor: {
    flex: 1,
  },
  bannerTextContainer: {
    padding: 16,
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.puertoTejadaRed,
    marginBottom: 4,
  },
  bannerDate: {
    fontSize: 14,
    color: COLORS.textLight,
    fontStyle: "italic",
    marginBottom: 8,
  },
  bannerDescription: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 4,
  },

  pwaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 15,
    padding: 14,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: COLORS.puertoTejadaRed,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  pwaButtonText: {
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 16,
    color: COLORS.puertoTejadaRed,
  },

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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  fabIcon: {
    fontSize: 30,
    color: "#fff",
  },
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.puertoTejadaGreen,
  },
  footerSmall: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
});

export default HomeScreen;