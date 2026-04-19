// screens/ProfileScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Alert,
} from "react-native";
import { loadProgress, resetProgress } from "../utils/storage";
import { lessonsData } from "../utils/lessonsData";
import { COLORS, PUERTO_TEJADA } from "../utils/colors";
import ProgressBar from "../components/ProgressBar";

const ProfileScreen = () => {
  const [completedLessons, setCompletedLessons] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadUserProgress = async () => {
    try {
      const stored = await loadProgress();
      setCompletedLessons(stored?.completedLessons || []);
    } catch {
      setCompletedLessons([]);
    }
  };

  useEffect(() => {
    loadUserProgress();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserProgress();
    setRefreshing(false);
  };

  const performReset = async () => {
    await resetProgress();
    setCompletedLessons([]);
  };

  const handleReset = () => {
    if (Platform.OS === "android") {
      Alert.alert(
        "Reiniciar progreso",
        "¿Seguro que deseas borrar todo tu avance?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Reiniciar", style: "destructive", onPress: performReset },
        ]
      );
    } else {
      Alert.alert(
        "Reiniciar progreso",
        "Esta acción no se puede deshacer.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Reiniciar", style: "destructive", onPress: performReset },
        ]
      );
    }
  };

  const totalLessons = lessonsData.length;
  const completed = completedLessons.length;
  const pending = totalLessons - completed;
  const percentage =
    totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* HEADER */}
        <View style={styles.headerCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>🤖</Text>
          </View>
          <Text style={styles.username}>Estudiante IA</Text>
          <Text style={styles.subtitle}>
            Aprendiendo Inteligencia Artificial
          </Text>
          <View style={styles.osBadge}>
            <Text style={styles.osText}>
              {Platform.OS === "ios"
                ? "📱 iOS · Experiencia fluida"
                : "🤖 Android · Alto rendimiento"}
            </Text>
          </View>
        </View>

        {/* PROGRESO */}
        <View style={styles.progressCard}>
          <Text style={styles.cardTitle}>Progreso General</Text>
          <ProgressBar
            current={completed}
            total={totalLessons}
            color={COLORS.vibrantPurple}
          />
          <Text style={styles.progressText}>
            {completed} de {totalLessons} lecciones completadas
          </Text>
          <Text style={styles.percentage}>{percentage}%</Text>
        </View>

        {/* ESTADÍSTICAS */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completed}</Text>
            <Text style={styles.statLabel}>Lecciones completadas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{pending}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{percentage}</Text>
            <Text style={styles.statLabel}>Progreso %</Text>
          </View>
        </View>

        {/* MOTIVACIÓN */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationTitle}>🚀 Sigue aprendiendo</Text>
          <Text style={styles.motivationText}>
            La Inteligencia Artificial está cambiando el mundo. Cada lección que
            completas te acerca más a dominar esta tecnología.
          </Text>
        </View>

        {/* SECCIÓN IDENTIDAD PUERTO TEJADA (Bandera corregida) */}
        <View style={styles.localCard}>
          <View style={styles.flagMini}>
            <View
              style={[
                styles.flagMiniColor,
                { backgroundColor: COLORS.puertoTejadaRed },
              ]}
            />
            <View
              style={[
                styles.flagMiniColor,
                { backgroundColor: COLORS.puertoTejadaWhite },
              ]}
            />
            <View
              style={[
                styles.flagMiniColor,
                { backgroundColor: COLORS.puertoTejadaGreen },
              ]}
            />
          </View>
          <Text style={styles.localText}>Puerto Tejada, Cauca</Text>
          <Text style={styles.localDate}>
            Fundado: {PUERTO_TEJADA.fundacion}
          </Text>
          <Text style={styles.localDescription}>
            {PUERTO_TEJADA.descripcion}
          </Text>
          <Text style={styles.localLema}>{PUERTO_TEJADA.lema}</Text>
        </View>

        {/* BOTÓN RESET */}
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetText}>Reiniciar progreso</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },

  headerCard: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: COLORS.puertoTejadaRed, // Rojo bandera para el header del perfil
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  avatar: { fontSize: 60 },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: { fontSize: 14, color: "#eee", textAlign: "center" },
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
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  progressText: { marginTop: 10, color: COLORS.textLight },
  percentage: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 10,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    margin: 5,
    borderRadius: 16,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statNumber: { fontSize: 22, fontWeight: "bold", color: COLORS.primary },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 5,
    textAlign: "center",
  },

  motivationCard: {
    backgroundColor: COLORS.vibrantPurple,
    margin: 20,
    padding: 20,
    borderRadius: 20,
  },
  motivationTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  motivationText: { color: "#fff", lineHeight: 20 },

  // Tarjeta de identidad Puerto Tejada
  localCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.puertoTejadaLightGreen,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  flagMini: {
    flexDirection: "row",
    width: 120,
    height: 20,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  flagMiniColor: {
    flex: 1,
  },
  localText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.puertoTejadaRed,
    marginBottom: 4,
  },
  localDate: {
    fontSize: 14,
    color: COLORS.textLight,
    fontStyle: "italic",
    marginBottom: 10,
  },
  localDescription: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  localLema: {
    fontSize: 14,
    color: COLORS.puertoTejadaGreen,
    fontWeight: "600",
    marginTop: 4,
  },

  resetButton: {
    backgroundColor: "#ff4d4d",
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  resetText: { color: "#fff", fontWeight: "bold" },
});

export default ProfileScreen;