// screens/FinalCertificateScreen.js
// Certificado final — IA Learning

import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../utils/colors";
import { lessonsData } from "../utils/lessonsData";
import { loadProgress } from "../utils/storage";
import { sharePdf } from "../utils/pdfHelpers";
import { buildFinalCertificateHtml } from "../utils/pdfTemplates";

const FinalCertificateScreen = () => {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const [completedLessons, setCompletedLessons] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const syncProgress = async () => {
      const stored = await loadProgress();
      setCompletedLessons(stored?.completedLessons || []);
    };

    syncProgress();
  }, []);

  const requiredIds = useMemo(() => lessonsData.map((lesson) => lesson.id), []);
  const allCompleted = requiredIds.every((id) => completedLessons.includes(id));

  const handleCertificatePdf = async () => {
    const studentName = user?.name || "Estudiante de prueba";
    const html = buildFinalCertificateHtml({
      studentName,
      completedCount: requiredIds.length,
    });
    const result = await sharePdf({
      html,
      fileName: "Certificado final IA Learning",
      statusMessage: "Certificado final generado y listo para descargar.",
    });
    if (result?.message) {
      setStatus(result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View
        style={[styles.content, { flexDirection: isTablet ? "row" : "column" }]}
      >
        <View style={styles.hero}>
          <MaterialIcons name="verified" size={40} color="#fff" />
          <Text style={styles.heroTitle}>Certificado final</Text>
          <Text style={styles.heroSubtitle}>
            Disponible al completar los 6 modulos del curso.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Estado de progreso</Text>
          <Text style={styles.bodyText}>
            Modulos completados: {completedLessons.length} /{" "}
            {requiredIds.length}
          </Text>
          {!allCompleted && (
            <Text style={styles.helperText}>
              Completa todos los modulos para habilitar el certificado final.
            </Text>
          )}

          <View style={styles.previewCard}>
            <View style={styles.previewOverlay}>
              <Text style={styles.previewTitle}>CERTIFICADO FINAL</Text>
              <Text style={styles.previewName}>
                {user?.name || "Estudiante de prueba"}
              </Text>
              <Text style={styles.previewModule}>IA Learning</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              !allCompleted && styles.disabledButton,
              { width: isTablet ? "50%" : "100%" },
            ]}
            onPress={handleCertificatePdf}
            disabled={!allCompleted}
          >
            <MaterialIcons name="download" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Descargar certificado</Text>
          </TouchableOpacity>
          {!!status && <Text style={styles.statusText}>{status}</Text>}
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
    backgroundColor: COLORS.puertoTejadaGreen,
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
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    textAlign: "center",
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
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.text,
  },
  helperText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  previewCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#CFE8E7",
    backgroundColor: "#ECFEFF",
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  previewOverlay: {
    alignItems: "center",
    gap: 6,
  },
  previewTitle: {
    color: "#0F172A",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.8,
  },
  previewName: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "700",
  },
  previewModule: {
    color: "#0F766E",
    fontWeight: "700",
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
  disabledButton: {
    backgroundColor: "#94A3B8",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  statusText: {
    color: COLORS.text,
    fontSize: 14,
  },
});

export default FinalCertificateScreen;
