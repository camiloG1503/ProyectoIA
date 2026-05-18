// screens/FinalCertificateScreen.js
// Certificado final — IA Learning

import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
  Animated,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../utils/colors";
import { lessonsData } from "../utils/lessonsData";
import { loadProgress } from "../utils/storage";
import { sharePdf } from "../utils/pdfHelpers";
import { buildFinalCertificateHtml } from "../utils/pdfTemplates";
import { toQrDataUri } from "../utils/qr";

const FinalCertificateScreen = () => {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const [completedLessons, setCompletedLessons] = useState([]);
  const [status, setStatus] = useState("");
  const [celebrateVisible, setCelebrateVisible] = useState(false);
  const [generating, setGenerating] = useState(false);
  const confettiAnim = React.useRef(new Animated.Value(0)).current;

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
    try {
      setGenerating(true);
      const studentName = user?.name || "Estudiante de prueba";
      const qrDataUri = await toQrDataUri(
        "https://drive.google.com/file/d/1hv8VFFcHMB23SfMtY3LqgObYUGZ8NAJi/view?usp=sharing",
      );
      const uuid = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`;

      const html = buildFinalCertificateHtml({
        studentName,
        completedCount: requiredIds.length,
        qrDataUri,
        uuid,
      });

      const result = await sharePdf({
        html,
        fileName: "Certificado final IA Learning",
        statusMessage: "Certificado final generado y listo para descargar.",
      });
      if (result?.message) setStatus(result.message);
    } finally {
      setGenerating(false);
      setCelebrateVisible(false);
    }
  };

  const openCelebration = () => {
    setCelebrateVisible(true);
    confettiAnim.setValue(0);
    Animated.timing(confettiAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: Platform.OS !== "web",
    }).start();
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
            onPress={openCelebration}
            disabled={!allCompleted || generating}
          >
            <MaterialIcons name="download" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Descargar certificado</Text>
          </TouchableOpacity>
          {!!status && <Text style={styles.statusText}>{status}</Text>}
        </View>
      </View>

      <Modal visible={celebrateVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Animated.View
              style={[
                styles.modalConfetti,
                {
                  opacity: confettiAnim,
                  transform: [
                    {
                      translateY: confettiAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.modalTitle}>
                🎉 ¡Felicitaciones {user?.name || "Estudiante"}!
              </Text>
              <Text style={styles.modalSub}>Has completado los 6 módulos.</Text>
            </Animated.View>

            <TouchableOpacity
              style={[styles.modalPrimary, generating && styles.modalDisabled]}
              onPress={handleCertificatePdf}
              disabled={generating}
            >
              <Text style={styles.modalPrimaryText}>
                {generating ? "Generando..." : "Generar y descargar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondary}
              onPress={() => setCelebrateVisible(false)}
              disabled={generating}
            >
              <Text style={styles.modalSecondaryText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    gap: 12,
  },
  modalConfetti: {
    backgroundColor: "#F0FDF4",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
    textAlign: "center",
  },
  modalSub: { textAlign: "center", color: COLORS.textLight },
  modalPrimary: {
    backgroundColor: COLORS.puertoTejadaGreen,
    borderRadius: 16,
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  modalDisabled: { opacity: 0.6 },
  modalPrimaryText: { color: "#fff", fontWeight: "900" },
  modalSecondary: {
    borderRadius: 16,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
  },
  modalSecondaryText: { color: COLORS.text, fontWeight: "800" },
});

export default FinalCertificateScreen;
