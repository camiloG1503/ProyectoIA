// screens/CompletedScreen.js
// Rediseño visual — I.E. Fidelina Echeverry · Puerto Tejada, Cauca

import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Animated,
    Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, PUERTO_TEJADA, RADIUS, SPACING } from "../utils/colors";

// ─── Franja tricolor ──────────────────────────────────────────────────────────
const TricolorStripe = ({ height = 5 }) => (
    <View style={{ flexDirection: "row", height }}>
        <View style={{ flex: 1, backgroundColor: COLORS.puertoTejadaRed }} />
        <View style={{ flex: 1, backgroundColor: COLORS.puertoTejadaWhite }} />
        <View style={{ flex: 1, backgroundColor: COLORS.puertoTejadaGreen }} />
    </View>
);

// ─── Partícula de confeti decorativa ─────────────────────────────────────────
const ConfettiDot = ({ color, style }) => (
    <View style={[confettiStyles.dot, { backgroundColor: color }, style]} />
);

const confettiStyles = StyleSheet.create({
    dot: {
        position: "absolute",
        width: 10,
        height: 10,
        borderRadius: 5,
        opacity: 0.7,
    },
});

// ─── Componente principal ─────────────────────────────────────────────────────
const CompletedScreen = ({ route, navigation }) => {
    const { lesson } = route.params;
    const [refreshing, setRefreshing] = useState(false);

    // Animaciones
    const scaleAnim   = useRef(new Animated.Value(0)).current;
    const fadeAnim    = useRef(new Animated.Value(0)).current;
    const slideAnim   = useRef(new Animated.Value(40)).current;
    const rotateAnim  = useRef(new Animated.Value(0)).current;
    const pulseAnim   = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Secuencia de entrada
        Animated.sequence([
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 5,
                    tension: 80,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 7,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        // Rotación del ícono de logro
        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
        }).start();

        // Pulso continuo del ícono central
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.08, duration: 900, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1,    duration: 900, useNativeDriver: true }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 500);
    };

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["-15deg", "0deg"],
    });

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    Platform.OS === "web"
                        ? undefined
                        : <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={COLORS.puertoTejadaGreen}
                            colors={[COLORS.puertoTejadaGreen]}
                          />
                }
            >
                <Animated.View
                    style={[
                        styles.mainContent,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    {/* ═══════════════════════════════════════════════════════
                        CONFETI DECORATIVO (estático)
                    ═══════════════════════════════════════════════════════ */}
                    <View style={styles.confettiContainer} pointerEvents="none">
                        <ConfettiDot color={COLORS.puertoTejadaRed}   style={{ top: 20,  left: "15%" }} />
                        <ConfettiDot color={COLORS.puertoTejadaGreen} style={{ top: 40,  right: "18%" }} />
                        <ConfettiDot color="#FFD700"                   style={{ top: 10,  left: "50%" }} />
                        <ConfettiDot color={COLORS.puertoTejadaRed}   style={{ top: 70,  right: "30%" }} />
                        <ConfettiDot color={COLORS.puertoTejadaGreen} style={{ top: 80,  left: "25%" }} />
                        <ConfettiDot color="#FFD700"                   style={{ top: 30,  right: "10%" }} />
                        <ConfettiDot color={COLORS.puertoTejadaRed}   style={{ top: 60,  left: "8%"  }} />
                        <ConfettiDot color="#FFD700"                   style={{ top: 90,  left: "70%" }} />
                        <ConfettiDot color={COLORS.puertoTejadaGreen} style={{ top: 15,  left: "80%" }} />
                    </View>

                    {/* ═══════════════════════════════════════════════════════
                        ÍCONO DE CELEBRACIÓN
                    ═══════════════════════════════════════════════════════ */}
                    <Animated.View
                        style={[
                            styles.celebrationIconWrap,
                            {
                                transform: [
                                    { scale: Animated.multiply(scaleAnim, pulseAnim) },
                                    { rotate },
                                ],
                            },
                        ]}
                    >
                        <View style={styles.celebrationIconOuter}>
                            <View style={styles.celebrationIconInner}>
                                <Text style={styles.celebrationEmoji}>🎉</Text>
                            </View>
                        </View>
                        {/* Anillo de logro */}
                        <View style={styles.achievementRing} />
                    </Animated.View>

                    {/* ═══════════════════════════════════════════════════════
                        TEXTO PRINCIPAL
                    ═══════════════════════════════════════════════════════ */}
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <Text style={styles.congratsTitle}>¡Lección completada!</Text>
                        <Text style={styles.congratsSubtitle}>
                            Has terminado con éxito
                        </Text>
                    </Animated.View>

                    {/* ═══════════════════════════════════════════════════════
                        TARJETA DE LA LECCIÓN COMPLETADA
                    ═══════════════════════════════════════════════════════ */}
                    <Animated.View
                        style={[
                            styles.lessonCard,
                            { transform: [{ scale: scaleAnim }] },
                        ]}
                    >
                        <TricolorStripe height={5} />
                        <View style={styles.lessonCardBody}>
                            <View style={[styles.lessonIconWrap, { backgroundColor: lesson.color + "20" }]}>
                                <View style={[styles.lessonIconInner, { backgroundColor: lesson.color }]}>
                                    <MaterialIcons name={lesson.icon} size={28} color="#fff" />
                                </View>
                            </View>
                            <View style={styles.lessonCardText}>
                                <Text style={styles.lessonCardTitle}>{lesson.title}</Text>
                                <Text style={styles.lessonCardSub}>{lesson.subtitle}</Text>
                                <View style={styles.completedBadge}>
                                    <MaterialIcons name="verified" size={13} color={COLORS.puertoTejadaGreen} />
                                    <Text style={styles.completedBadgeText}>Completado</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>

                    {/* ═══════════════════════════════════════════════════════
                        MENSAJE MOTIVACIONAL
                    ═══════════════════════════════════════════════════════ */}
                    <Animated.View
                        style={[
                            styles.motivationCard,
                            { transform: [{ scale: scaleAnim }] },
                        ]}
                    >
                        <Text style={styles.motivationText}>
                            🚀 Sigue aprendiendo para dominar la{" "}
                            <Text style={styles.motivationHighlight}>
                                Inteligencia Artificial
                            </Text>{" "}
                            y ser parte del futuro del Cauca.
                        </Text>
                    </Animated.View>

                    {/* ═══════════════════════════════════════════════════════
                        INSTITUCIÓN
                    ═══════════════════════════════════════════════════════ */}
                    <Animated.View
                        style={[
                            styles.institutionCard,
                            { transform: [{ scale: scaleAnim }] },
                        ]}
                    >
                        <MaterialIcons name="school" size={16} color={COLORS.puertoTejadaRed} />
                        <Text style={styles.institutionText}>
                            {PUERTO_TEJADA.institucion} · {PUERTO_TEJADA.nombre}
                        </Text>
                    </Animated.View>

                    {/* ═══════════════════════════════════════════════════════
                        BOTÓN DE REGRESO
                    ═══════════════════════════════════════════════════════ */}
                    <Animated.View
                        style={[
                            styles.actionsWrap,
                            { transform: [{ scale: scaleAnim }] },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.homeButton}
                            onPress={() => navigation.navigate("Home")}
                            activeOpacity={0.85}
                        >
                            <MaterialIcons name="home" size={20} color="#fff" />
                            <Text style={styles.homeButtonText}>Volver al inicio</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.profileButton}
                            onPress={() => navigation.navigate("Profile")}
                            activeOpacity={0.85}
                        >
                            <MaterialIcons name="bar-chart" size={20} color={COLORS.puertoTejadaGreen} />
                            <Text style={styles.profileButtonText}>Ver mi progreso</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
};

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: SPACING.md,
        paddingTop: SPACING.xl,
    },
    mainContent: {
        alignItems: "center",
    },

    // ─── Confeti ─────────────────────────────────────────────────────────────
    confettiContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 120,
    },

    // ─── Ícono de celebración ─────────────────────────────────────────────────
    celebrationIconWrap: {
        position: "relative",
        width: 130,
        height: 130,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: SPACING.lg,
    },
    celebrationIconOuter: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: COLORS.successLight,
        justifyContent: "center",
        alignItems: "center",
        ...Platform.select({
            ios: {
                shadowColor: COLORS.puertoTejadaGreen,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.25,
                shadowRadius: 14,
            },
            android: { elevation: 8 },
        }),
    },
    celebrationIconInner: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: COLORS.puertoTejadaGreenLight,
    },
    celebrationEmoji: {
        fontSize: 46,
    },
    achievementRing: {
        position: "absolute",
        width: 128,
        height: 128,
        borderRadius: 64,
        borderWidth: 2.5,
        borderColor: COLORS.puertoTejadaGreen,
        borderStyle: "dashed",
        opacity: 0.4,
    },

    // ─── Textos de felicitación ───────────────────────────────────────────────
    congratsTitle: {
        fontSize: 30,
        fontWeight: "800",
        color: COLORS.text,
        textAlign: "center",
        letterSpacing: -0.8,
        marginBottom: SPACING.xs,
    },
    congratsSubtitle: {
        fontSize: 15,
        color: COLORS.textLight,
        textAlign: "center",
        marginBottom: SPACING.lg,
    },

    // ─── Tarjeta de lección ───────────────────────────────────────────────────
    lessonCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xl,
        overflow: "hidden",
        width: "100%",
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.puertoTejadaGreenLight,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.puertoTejadaGreen,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 12,
            },
            android: { elevation: 5 },
        }),
    },
    lessonCardBody: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.md,
        padding: SPACING.md,
    },
    lessonIconWrap: {
        width: 62,
        height: 62,
        borderRadius: RADIUS.md,
        justifyContent: "center",
        alignItems: "center",
    },
    lessonIconInner: {
        width: 48,
        height: 48,
        borderRadius: RADIUS.sm,
        justifyContent: "center",
        alignItems: "center",
    },
    lessonCardText: {
        flex: 1,
    },
    lessonCardTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: 3,
        letterSpacing: -0.3,
    },
    lessonCardSub: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: SPACING.sm,
    },
    completedBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: COLORS.successLight,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: RADIUS.pill,
        alignSelf: "flex-start",
    },
    completedBadgeText: {
        fontSize: 11,
        fontWeight: "700",
        color: COLORS.puertoTejadaGreen,
    },

    // ─── Motivación ───────────────────────────────────────────────────────────
    motivationCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xl,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        width: "100%",
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    motivationText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: "center",
        lineHeight: 22,
    },
    motivationHighlight: {
        fontWeight: "700",
        color: COLORS.puertoTejadaRed,
    },

    // ─── Institución ──────────────────────────────────────────────────────────
    institutionCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.sm,
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.pill,
        marginBottom: SPACING.lg,
    },
    institutionText: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.puertoTejadaRed,
    },

    // ─── Acciones ─────────────────────────────────────────────────────────────
    actionsWrap: {
        width: "100%",
        gap: SPACING.sm,
    },
    homeButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: SPACING.sm,
        backgroundColor: COLORS.puertoTejadaRed,
        borderRadius: RADIUS.md,
        paddingVertical: 16,
        width: "100%",
        ...Platform.select({
            ios: {
                shadowColor: COLORS.puertoTejadaRed,
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.35,
                shadowRadius: 10,
            },
            android: { elevation: 6 },
        }),
    },
    homeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.2,
    },
    profileButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: SPACING.sm,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        paddingVertical: 14,
        width: "100%",
        borderWidth: 1.5,
        borderColor: COLORS.puertoTejadaGreenLight,
    },
    profileButtonText: {
        color: COLORS.puertoTejadaGreen,
        fontSize: 15,
        fontWeight: "700",
    },
});

export default CompletedScreen;