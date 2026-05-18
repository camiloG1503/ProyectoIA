// screens/ManualPdfScreen.js
// Manual PDF — IA Learning

import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { lessonsData } from "../utils/lessonsData";
import { COLORS } from "../utils/colors";
import * as FileSystem from "expo-file-system/legacy";
import { generatePdfToCache, shareExistingPdf, sharePdf } from "../utils/pdfHelpers";
import { buildManualHtml } from "../utils/pdfTemplates";
import { toQrDataUri } from "../utils/qr";

const ManualPdfScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [cachedUri, setCachedUri] = useState(null);
  const [sizeLabel, setSizeLabel] = useState("");

  const manualTopics = useMemo(() => {
    const set = new Set();
    lessonsData.forEach((l) => (l.topics || []).forEach((t) => set.add(t)));
    return Array.from(set).slice(0, 12);
  }, []);

  const contentHash = useMemo(() => {
    const jsonLen = JSON.stringify(lessonsData).length;
    const ids = lessonsData.map((l) => l.id).join(",");
    return `${jsonLen}_${ids}`;
  }, []);

  const buildHtml = async () => {
    const qrDataUri = await toQrDataUri(
      "https://drive.google.com/file/d/1zCvpK1AH2gozIWRE_Wmh9a2MXZcYXMfw/view?usp=sharing",
    );
    return buildManualHtml(lessonsData, { qrDataUri });
  };

  const ensureCachedPdf = async () => {
    const html = await buildHtml();

    if (Platform.OS === "web") {
      return { html, uri: null };
    }

    const cached = await generatePdfToCache({
      html,
      cacheKey: "manual",
      fileNameBase: "manual_ia_learning",
      contentHash,
    });

    if (cached?.uri) {
      setCachedUri(cached.uri);
      const info = await FileSystem.getInfoAsync(cached.uri);
      if (info?.exists && typeof info.size === "number") {
        setSizeLabel(`Tamaño: ~${(info.size / (1024 * 1024)).toFixed(1)} MB`);
      }
    }

    return { html, uri: cached?.uri || null };
  };

  useEffect(() => {
    const warmup = async () => {
      try {
        setLoading(true);
        setStatus("Preparando tu manual…");
        const { html } = await ensureCachedPdf();
        if (Platform.OS === "web") {
          setSizeLabel("");
        }
        setStatus("");
        return html;
      } finally {
        setLoading(false);
      }
    };

    warmup();
  }, []);

  const handleDownload = async () => {
    setLoading(true);
    setStatus("Preparando tu manual…");
    try {
      const { html, uri } = await ensureCachedPdf();

      if (Platform.OS === "web") {
        const result = await sharePdf({
          html,
          fileName: "Manual_IA_Learning",
          statusMessage: "Manual PDF generado correctamente.",
        });
        setStatus(result?.message || "Manual PDF generado correctamente.");
        return;
      }

      const result = await shareExistingPdf({
        uri,
        fileName: "Manual del curso IA Learning",
      });
      if (result?.message) setStatus(result.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickView = async () => {
    setLoading(true);
    try {
      const { html, uri } = await ensureCachedPdf();

      if (Platform.OS === "web") {
        await sharePdf({
          html,
          fileName: "Manual_IA_Learning_(Vista_rapida)",
          statusMessage: "Vista rápida abierta.",
        });
        return;
      }

      await shareExistingPdf({ uri, fileName: "Manual IA Learning (Vista rápida)" });
    } finally {
      setLoading(false);
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
            <Text style={styles.sectionTitle}>Vista previa</Text>
            <Text style={styles.previewTitle}>📘 Manual IA Learning — 6 módulos</Text>
            {!!sizeLabel && <Text style={styles.previewSize}>{sizeLabel}</Text>}
            {loading && (
              <Text style={styles.helperText}>Preparando tu manual…</Text>
            )}

            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
              ¿Qué aprenderás?
            </Text>
            {manualTopics.map((t, idx) => (
              <View key={`topic-${idx}`} style={styles.bulletRow}>
                <MaterialIcons
                  name="check-circle"
                  size={16}
                  color={COLORS.primary}
                />
                <Text style={styles.bulletText}>{t}</Text>
              </View>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
              Descarga oficial
            </Text>
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
              <Text style={styles.bulletText}>
                Casos locales y prompts base
              </Text>
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
              style={[
                styles.primaryButton,
                { width: isTablet ? "50%" : "100%" },
              ]}
              onPress={handleDownload}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>📥 Descargar PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                { width: isTablet ? "50%" : "100%" },
              ]}
              onPress={handleQuickView}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>👁 Vista rápida</Text>
            </TouchableOpacity>

            {!!status && <Text style={styles.statusText}>{status}</Text>}

            <Text style={styles.footerNote}>
              🎓 Completa todos los módulos para desbloquear el certificado final.
            </Text>
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
    gap: 14,
    flexWrap: "wrap",
  },
  scrollContent: {
    paddingBottom: 24,
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
  statusText: {
    color: COLORS.text,
    fontSize: 14,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  previewSize: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  helperText: {
    fontSize: 13,
    color: COLORS.textLight,
    fontStyle: "italic",
  },
  footerNote: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: "center",
  },
});

export default ManualPdfScreen;
