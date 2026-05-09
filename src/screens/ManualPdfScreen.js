// screens/ManualPdfScreen.js
// Manual PDF — IA Learning

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { lessonsData } from "../utils/lessonsData";
import { COLORS } from "../utils/colors";
import { sharePdf } from "../utils/pdfHelpers";
import { buildManualHtml } from "../utils/pdfTemplates";

const ManualPdfScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const [status, setStatus] = useState("");

  const handleManualDownload = async () => {
    const html = buildManualHtml(lessonsData);
    const result = await sharePdf({
      html,
      fileName: "Manual del curso IA Learning",
      statusMessage: "Manual PDF generado correctamente.",
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
          <MaterialIcons name="menu-book" size={40} color="#fff" />
          <Text style={[styles.heroTitle, isTablet && styles.heroTitleLarge]}>
            Manual del curso
          </Text>
          <Text style={styles.heroSubtitle}>
            Guia con instrucciones de uso y lecturas resumidas.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Descarga oficial</Text>
          <Text style={styles.bodyText}>
            Estas a punto de descargar el manual del curso. Aqui encuentras la
            guia general y las lecturas resumidas.
          </Text>
          <View style={styles.infoBox}>
            <MaterialIcons name="info" size={18} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Recomendado para repasar en casa o cuando no tengas conexion.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <MaterialIcons
              name="check-circle"
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.bulletText}>Lecturas de los 6 modulos</Text>
          </View>
          <View style={styles.bulletRow}>
            <MaterialIcons
              name="check-circle"
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.bulletText}>Casos locales y prompts base</Text>
          </View>
          <View style={styles.bulletRow}>
            <MaterialIcons
              name="check-circle"
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.bulletText}>Guia para usar la app</Text>
          </View>
          <TouchableOpacity
            style={[styles.primaryButton, { width: isTablet ? "50%" : "100%" }]}
            onPress={handleManualDownload}
          >
            <MaterialIcons name="picture-as-pdf" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Descargar manual PDF</Text>
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
    backgroundColor: COLORS.primary,
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
  heroTitleLarge: {
    fontSize: 26,
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
    color: COLORS.textLight,
    fontSize: 15,
    lineHeight: 22,
  },
  infoBox: {
    backgroundColor: "#FDF5F5",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    color: COLORS.text,
    fontSize: 14,
    flex: 1,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bulletText: {
    color: COLORS.text,
    fontSize: 14,
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
  statusText: {
    color: COLORS.text,
    fontSize: 14,
  },
});

export default ManualPdfScreen;
