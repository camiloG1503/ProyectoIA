// utils/pdfHelpers.js
// Utilidades de PDF (Print/Sharing/linking) — I.E. Fidelina Echeverry · Puerto Tejada, Cauca

import { Alert, Linking, Platform } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export const sharePdf = async ({ html, fileName, statusMessage }) => {
  try {
    if (Platform.OS === "web") {
      await Print.printAsync({ html });
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
