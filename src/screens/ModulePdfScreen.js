// screens/ModulePdfScreen.js
// PDF del modulo — IA Learning

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
import { COLORS } from "../utils/colors";
import { sharePdf } from "../utils/pdfHelpers";
import { buildModulePdfHtml } from "../utils/pdfTemplates";

const ModulePdfScreen = ({ route }) => {
  // route.params: { lesson }
  const { lesson } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const [status, setStatus] = useState("");

  const handleModulePdf = async () => {
    const html = buildModulePdfHtml(lesson);
    const result = await sharePdf({
      html,
      fileName: `Modulo ${lesson.id} PDF`,
      statusMessage: "PDF del modulo generado correctamente.",
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
        <View style={[styles.hero, { backgroundColor: lesson.color }]}>
          <MaterialIcons name="picture-as-pdf" size={40} color="#fff" />
          <Text style={styles.heroTitle}>PDF del modulo</Text>
          <Text style={styles.heroSubtitle}>{lesson.title}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contenido resumido</Text>
          <Text style={styles.bodyText}>
            Descarga el contenido del modulo para estudiar sin conexion.
          </Text>
          <TouchableOpacity
            style={[styles.primaryButton, { width: isTablet ? "50%" : "100%" }]}
            onPress={handleModulePdf}
          >
            <MaterialIcons name="download" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>
              Descargar PDF del modulo
            </Text>
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
    color: COLORS.textLight,
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

export default ModulePdfScreen;
