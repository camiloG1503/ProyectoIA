// screens/ModulePdfScreen.js
// PDF del modulo — IA Learning

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../utils/colors";
import { sharePdf } from "../utils/pdfHelpers";
import { buildModulePdfHtml } from "../utils/pdfTemplates";
import { saveLessonInternalProgress } from "../utils/lessonInternalProgressStorage";

const ModulePdfScreen = ({ route, navigation }) => {
  // route.params: { lesson }
  const { lesson } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const [status, setStatus] = useState("");

  const handleModulePdf = async () => {
    const html = buildModulePdfHtml(lesson);
    const result = await sharePdf({
      html,
      fileName: `Modulo_${lesson.id}_IA_Learning`,
      statusMessage: "PDF del modulo generado correctamente.",
    });
    if (result?.message) {
      setStatus(result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View
          style={[
            styles.content,
            { flexDirection: isTablet ? "row" : "column" },
          ]}
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
              style={[
                styles.primaryButton,
                { width: isTablet ? "50%" : "100%" },
              ]}
              onPress={handleModulePdf}
            >
              <MaterialIcons name="download" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>
                Descargar PDF del modulo
              </Text>
            </TouchableOpacity>
            {!!status && <Text style={styles.statusText}>{status}</Text>}

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                { width: isTablet ? "50%" : "100%" },
              ]}
              onPress={async () => {
                await saveLessonInternalProgress(lesson.id, {
                  pdfCompleted: true,
                });
                navigation.goBack();
              }}
            >
              <Text style={styles.secondaryButtonText}>
                ✅ Marcar PDF como leído
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    flexWrap: "wrap",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  hero: {
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
    flex: 1,
    minWidth: 280,
    alignSelf: "stretch",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 6,
    flexShrink: 1,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    textAlign: "center",
    flexShrink: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    flex: 1,
    minWidth: 280,
    alignSelf: "stretch",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textLight,
    marginBottom: 12,
    flexShrink: 1,
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
    marginTop: 8,
    marginBottom: 8,
  },
  secondaryButton: {
    backgroundColor: COLORS.puertoTejadaGreen,
    borderRadius: 16,
    minHeight: 50,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
});

export default ModulePdfScreen;
