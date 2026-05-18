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
import { COLORS, RADIUS, SPACING, SHADOWS } from "../utils/colors";

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
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
                            <Text style={{ fontWeight: "bold", color: COLORS.text }}>Manifest.json:</Text> Define nombre, iconos, colores y comportamiento de instalación.
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.listText}>
                            <Text style={{ fontWeight: "bold", color: COLORS.text }}>Service Worker:</Text> Script que intercepta peticiones y permite cachear recursos para funcionar offline.
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.listText}>
                            <Text style={{ fontWeight: "bold", color: COLORS.text }}>HTTPS:</Text> Obligatorio para seguridad y para que el service worker funcione.
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
                                <Text style={[styles.statusValue, { color: isOnline ? COLORS.puertoTejadaGreen : COLORS.error || "#ff4444" }]}>
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
                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: COLORS.puertoTejadaRed }]} 
                        onPress={handleInstallPrompt}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons name="get-app" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Instalar PWA</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: COLORS.primaryDark || "#8E0000" }]} 
                        onPress={checkServiceWorker}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons name="memory" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Verificar SW</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: COLORS.puertoTejadaGreen }]} 
                        onPress={testOffline}
                        activeOpacity={0.8}
                    >
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
    container: { 
        flex: 1, 
        backgroundColor: COLORS.background 
    },
    content: { 
        padding: SPACING.md 
    },
    localBanner: {
        marginBottom: SPACING.lg,
        borderRadius: RADIUS.md,
        overflow: "hidden",
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.card,
    },
    flagStrip: { 
        flexDirection: "row", 
        height: 6 
    },
    flagColor: { 
        flex: 1 
    },
    bannerText: {
        textAlign: "center",
        paddingVertical: 10,
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.puertoTejadaRed,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.card,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 12,
        marginBottom: 8,
        color: COLORS.puertoTejadaRed,
    },
    paragraph: {
        fontSize: 15,
        lineHeight: 22,
        color: COLORS.textLight,
        textAlign: "justify",
    },
    listItem: {
        flexDirection: "row",
        marginBottom: 10,
        paddingRight: 10,
    },
    bullet: {
        fontSize: 18,
        marginRight: 10,
        color: COLORS.puertoTejadaGreen,
    },
    listText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        color: COLORS.textLight,
    },
    statusCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.card,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 14,
        color: COLORS.text,
    },
    statusRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider || "#f0f0f0",
        paddingBottom: 6,
    },
    statusLabel: {
        fontSize: 15,
        color: COLORS.textLight,
    },
    statusValue: {
        fontSize: 15,
        fontWeight: "700",
        color: COLORS.text,
    },
    buttonContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: SPACING.lg,
        gap: 8,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: RADIUS.pill,
        flex: 1,
        minWidth: "45%",
        ...SHADOWS.card,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "700",
        marginLeft: 8,
        fontSize: 13,
    },
    footer: {
        alignItems: "center",
        paddingVertical: SPACING.xl,
    },
    footerText: {
        fontSize: 13,
        color: COLORS.textLight,
        textAlign: "center",
        fontStyle: "italic",
        lineHeight: 18,
    },
});

export default PWAScreen;