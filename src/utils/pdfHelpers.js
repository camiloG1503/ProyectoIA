// utils/pdfHelpers.js
// Utilidades de PDF (Print/Sharing/linking) — I.E. Fidelina Echeverry · Puerto Tejada, Cauca

import { Alert, Linking, Platform } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";

const buildCacheKey = (cacheKey) => `pdf_cache_${cacheKey}`;

const printHtmlOnWeb = async ({ html, title }) => {
  if (typeof window === "undefined") {
    throw new Error("window no disponible para imprimir en web.");
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("No se pudo abrir una nueva ventana para imprimir.");
  }

  const withTitle = html.includes("<title>")
    ? html
    : html.replace(
        /<head(\s[^>]*)?>/i,
        (m) => `${m}\n<title>${title || "Documento"}</title>`,
      );

  printWindow.document.open();
  printWindow.document.write(withTitle);
  printWindow.document.close();

  await new Promise((resolve) => {
    const done = () => resolve(true);
    if (printWindow.document.readyState === "complete") return done();
    printWindow.onload = done;
    setTimeout(done, 800);
  });

  printWindow.focus();
  printWindow.print();

  setTimeout(() => {
    try {
      printWindow.close();
    } catch {}
  }, 600);
};

export const sharePdf = async ({ html, fileName, statusMessage }) => {
  try {
    if (Platform.OS === "web") {
      await printHtmlOnWeb({ html, title: fileName });
      return { ok: true, message: statusMessage };
    }

    const result = await Print.printToFileAsync({ html });
    if (result?.uri) {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(result.uri, {
          mimeType: "application/pdf",
          dialogTitle: fileName,
        });
      } else {
        await Linking.openURL(result.uri);
      }
    }

    return { ok: true, message: statusMessage };
  } catch (error) {
    console.log("PDF error:", error);
    Alert.alert("No se pudo generar el PDF", "Intenta nuevamente.");
    return { ok: false, message: "No se pudo generar el PDF." };
  }
};

export const shareExistingPdf = async ({ uri, fileName }) => {
  try {
    if (!uri) return { ok: false, message: "No hay PDF para compartir." };

    if (Platform.OS === "web") {
      // En web, abrir el PDF en una pestaña nueva (si es un blob/data URL o un link).
      try {
        window.open(uri, "_blank");
      } catch {
        await Linking.openURL(uri);
      }
      return { ok: true, message: "Vista rápida abierta." };
    }

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: fileName,
      });
      return { ok: true, message: "PDF listo para compartir." };
    }

    await Linking.openURL(uri);
    return { ok: true, message: "PDF listo." };
  } catch (error) {
    console.log("Share existing PDF error:", error);
    Alert.alert("No se pudo abrir el PDF", "Intenta nuevamente.");
    return { ok: false, message: "No se pudo abrir el PDF." };
  }
};

export const generatePdfToCache = async ({ html, cacheKey, fileNameBase, contentHash }) => {
  try {
    if (Platform.OS === "web") {
      return { ok: false, uri: null, fromCache: false };
    }

    const key = buildCacheKey(cacheKey);
    const raw = await AsyncStorage.getItem(key);
    const existing = raw ? JSON.parse(raw) : null;

    if (
      existing?.uri &&
      existing?.contentHash &&
      existing.contentHash === contentHash
    ) {
      const info = await FileSystem.getInfoAsync(existing.uri);
      if (info?.exists) {
        return { ok: true, uri: existing.uri, fromCache: true };
      }
    }

    const printed = await Print.printToFileAsync({ html });
    const targetUri = `${FileSystem.documentDirectory}${fileNameBase}.pdf`;

    const targetInfo = await FileSystem.getInfoAsync(targetUri);
    if (targetInfo?.exists) {
      await FileSystem.deleteAsync(targetUri, { idempotent: true });
    }

    await FileSystem.copyAsync({ from: printed.uri, to: targetUri });

    const meta = {
      uri: targetUri,
      createdAtISO: new Date().toISOString(),
      contentHash,
    };
    await AsyncStorage.setItem(key, JSON.stringify(meta));

    return { ok: true, uri: targetUri, fromCache: false };
  } catch (error) {
    console.log("PDF cache error:", error);
    return { ok: false, uri: null, fromCache: false };
  }
};
