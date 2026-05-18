// utils/qr.js
// QR Data URI (solo web)

import { Platform } from "react-native";
import QRCode from "qrcode";

export const toQrDataUri = async (url) => {
  if (Platform.OS !== "web") return null;
  return QRCode.toDataURL(url, { margin: 1, width: 180 });
};
