// screens/PWAScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, PUERTO_TEJADA } from "../utils/colors";

const PWAScreen = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (Platform.OS === "web") {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      setIsInstalled(isStandalone);

      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  const handleInstallPrompt = () => {
    if (Platform.OS === "web") {
      Alert.alert(
        "Instalar PWA",
        "Busca el ícono de instalación en la barra de direcciones de tu navegador.",
        [{ text: "Entendido" }]
      );
    } else {
      Alert.alert(
        "Información",
        "En dispositivos móviles, puedes instalar esta app desde el menú del navegador (Añadir a pantalla de inicio)."
      );
    }
  };

  const checkServiceWorker = () => {
    if (Platform.OS === "web" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        if (registrations.length > 0) {
          Alert.alert("Service Worker activo", `Hay ${registrations.length} service worker(s) registrado(s).`);
        } else {
          Alert.alert("Service Worker inactivo", "No se encontró service worker registrado.");
        }
      });
    } else {
      Alert.alert("No soportado", "Service Worker no está disponible en esta plataforma.");
    }
  };

  const testOffline = () => {
    if (Platform.OS === "web") {
      if (!isOnline) {
        Alert.alert("Modo offline", "La app está funcionando sin conexión. ¡PWA en acción!");
      } else {
        Alert.alert("Modo online", "Desconecta tu internet y vuelve a probar para ver la magia.");
      }
    } else {
      Alert.alert("Simulación", "En móvil, activa el modo avión y abre la app desde el navegador para probar offline.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.localBanner}>
          <View style={styles.flagStrip}>
            <View style={[styles.flagColor, { backgroundColor: COLORS.puertoTejadaRed }]} />
            <View style={[styles.flagColor, { backgroundColor: COLORS.puertoTejadaWhite }]} />
            <View style={[styles.flagColor, { backgroundColor: COLORS.puertoTejadaGreen }]} />
          </View>
          <Text style={styles.bannerText}>Puerto Tejada, Cauca · PWA Educativa</Text>
        </View>

        <View style={styles.card}>
          <MaterialIcons name="important-devices" size={40} color={COLORS.puertoTejadaRed} />
          <Text style={styles.title}>¿Qué es una PWA?</Text>
          <Text style={styles.paragraph}>
            Una Progressive Web App (PWA) es una aplicación web que utiliza tecnologías modernas para ofrecer una experiencia similar a una app nativa. Funciona sin conexión, se puede instalar en el dispositivo y se actualiza automáticamente.
          </Text>
        </View>

        <View style={styles.card}>
          <MaterialIcons name="build" size={40} color={COLORS.puertoTejadaGreen} />
          <Text style={styles.title}>Componentes clave</Text>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listText}>
              <Text style={{ fontWeight: "bold" }}>Manifest.json:</Text> Define nombre, iconos, colores y comportamiento de instalación.
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listText}>
              <Text style={{ fontWeight: "bold" }}>Service Worker:</Text> Script que intercepta peticiones y permite cachear recursos para funcionar offline.
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listText}>
              <Text style={{ fontWeight: "bold" }}>HTTPS:</Text> Obligatorio para seguridad y para que el service worker funcione.
            </Text>
          </View>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Estado de la PWA</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Plataforma:</Text>
            <Text style={styles.statusValue}>{Platform.OS.toUpperCase()}</Text>
          </View>
          {Platform.OS === "web" && (
            <>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Modo standalone:</Text>
                <Text style={styles.statusValue}>{isInstalled ? "Sí (Instalada)" : "No (Navegador)"}</Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Conexión:</Text>
                <Text style={[styles.statusValue, { color: isOnline ? COLORS.puertoTejadaGreen : COLORS.error }]}>
                  {isOnline ? "Online" : "Offline"}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Service Worker:</Text>
                <Text style={styles.statusValue}>Activo (cacheando)</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.puertoTejadaRed }]} onPress={handleInstallPrompt}>
            <MaterialIcons name="get-app" size={20} color="#fff" />
            <Text style={styles.buttonText}>Instalar PWA</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.vibrantPurple }]} onPress={checkServiceWorker}>
            <MaterialIcons name="memory" size={20} color="#fff" />
            <Text style={styles.buttonText}>Verificar SW</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.puertoTejadaGreen }]} onPress={testOffline}>
            <MaterialIcons name="wifi-off" size={20} color="#fff" />
            <Text style={styles.buttonText}>Probar Offline</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Esta app es una PWA real. Puedes instalarla y usarla sin internet.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },
  content: { padding: 20 },
  localBanner: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },
  flagStrip: { flexDirection: "row", height: 6 },
  flagColor: { flex: 1 },
  bannerText: {
    textAlign: "center",
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.puertoTejadaRed,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 6 },
      android: { elevation: 4 },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 8,
    color: COLORS.primary,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textLight,
    textAlign: "justify",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 8,
    paddingRight: 10,
  },
  bullet: {
    fontSize: 18,
    marginRight: 8,
    color: COLORS.puertoTejadaGreen,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textLight,
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 6 },
      android: { elevation: 4 },
    }),
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: COLORS.primary,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 15,
    color: COLORS.textLight,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    minWidth: "30%",
    marginBottom: 8,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
      android: { elevation: 4 },
    }),
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 13,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default PWAScreen;