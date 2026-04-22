// screens/HomeScreen.js
// Rediseño visual — I.E. Fidelina Echeverry · Puerto Tejada, Cauca

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    Platform,
    TouchableOpacity,
    Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import LessonCard from "../components/LessonCard";
import { lessonsData } from "../utils/lessonsData";
import { loadProgress } from "../utils/storage";
import { COLORS, PUERTO_TEJADA, RADIUS, SPACING } from "../utils/colors";

// ─── Franja tricolor reutilizable ─────────────────────────────────────────────
const TricolorStripe = ({ height = 6 }) => (
    <View style={{ flexDirection: "row", height }}>
        <View style={{ flex: 1, backgroundColor: COLORS.puertoTejadaRed }} />
        <View style={{ flex: 1, backgroundColor: COLORS.puertoTejadaWhite }} />
        <View style={{ flex: 1, backgroundColor: COLORS.puertoTejadaGreen }} />
    </View>
);

// ─── Estadística del hero ──────────────────────────────────────────────────────
const HeroStat = ({ value, label, icon }) => (
    <View style={heroStatStyles.container}>
        <MaterialIcons name={icon} size={18} color="rgba(255,255,255,0.75)" />
        <Text style={heroStatStyles.value}>{value}</Text>
        <Text style={heroStatStyles.label}>{label}</Text>
    </View>
);

const heroStatStyles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
    },
    value: {
        fontSize: 22,
        fontWeight: "800",
        color: "#fff",
        marginTop: 2,
        letterSpacing: -0.5,
    },
    label: {
        fontSize: 10,
        color: "rgba(255,255,255,0.70)",
        fontWeight: "500",
        marginTop: 1,
        textAlign: "center",
    },
});

// ─── Componente principal ─────────────────────────────────────────────────────
const HomeScreen = ({ navigation }) => {
    const [completedLessons, setCompletedLessons] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const slideAnim = React.useRef(new Animated.Value(20)).current;

    const loadUserProgress = async () => {
        const stored = await loadProgress();
        setCompletedLessons(stored?.completedLessons || []);
    };

    useEffect(() => {
        loadUserProgress();
        // Animación de entrada
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 60,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadUserProgress();
        setRefreshing(false);
    };

    const totalLessons = lessonsData.length;
    const completed = completedLessons.length;
    const pending = totalLessons - completed;
    const percentage = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    Platform.OS === "web"
                        ? undefined
                        : <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={COLORS.puertoTejadaRed}
                            colors={[COLORS.puertoTejadaRed]}
                          />
                }
                contentContainerStyle={styles.scrollContent}
            >
                {/* ═══════════════════════════════════════════════════════════
                    HERO — Cabecera institucional principal
                ═══════════════════════════════════════════════════════════ */}
                <View style={styles.hero}>
                    {/* Patrón de puntos decorativo */}
                    <View style={styles.heroPattern} pointerEvents="none">
                        {[...Array(6)].map((_, row) => (
                            <View key={row} style={styles.patternRow}>
                                {[...Array(8)].map((_, col) => (
                                    <View key={col} style={styles.patternDot} />
                                ))}
                            </View>
                        ))}
                    </View>

                    {/* Contenido del hero */}
                    <Animated.View
                        style={[
                            styles.heroContent,
                            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                        ]}
                    >
                        {/* Badge institucional */}
                        <View style={styles.institutionBadge}>
                            <MaterialIcons name="school" size={14} color={COLORS.puertoTejadaRed} />
                            <Text style={styles.institutionBadgeText}>
                                I.E. Fidelina Echeverry · Puerto Tejada
                            </Text>
                        </View>

                        {/* Ícono central */}
                        <View style={styles.heroIconContainer}>
                            <View style={styles.heroIconOuter}>
                                <View style={styles.heroIconInner}>
                                    <Text style={styles.heroEmoji}>🛰️</Text>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.heroTitle}>Aprende{"\n"}Inteligencia Artificial</Text>
                        <Text style={styles.heroSubtitle}>
                            Paso a paso, domina las herramientas del futuro
                        </Text>

                        {/* Estadísticas del hero */}
                        <View style={styles.heroStats}>
                            <HeroStat
                                icon="check-circle"
                                value={completed}
                                label={completed === 1 ? "Completada" : "Completadas"}
                            />
                            <View style={styles.heroStatDivider} />
                            <HeroStat
                                icon="menu-book"
                                value={totalLessons}
                                label="Lecciones"
                            />
                            <View style={styles.heroStatDivider} />
                            <HeroStat
                                icon="trending-up"
                                value={`${percentage}%`}
                                label="Progreso"
                            />
                        </View>
                    </Animated.View>

                    {/* Franja tricolor en la parte inferior del hero */}
                    <TricolorStripe height={5} />
                </View>

                <Animated.View
                    style={[
                        styles.bodyContent,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    {/* ═══════════════════════════════════════════════════════
                        TARJETA DE PROGRESO
                    ═══════════════════════════════════════════════════════ */}
                    <View style={styles.progressCard}>
                        {/* Encabezado de la tarjeta */}
                        <View style={styles.progressCardHeader}>
                            <View style={styles.progressCardTitleRow}>
                                <View style={[styles.progressDot, { backgroundColor: COLORS.puertoTejadaRed }]} />
                                <Text style={styles.progressCardTitle}>Progreso del curso</Text>
                            </View>
                            <Text style={styles.progressCardPct}>{percentage}%</Text>
                        </View>

                        {/* Barra de progreso */}
                        <View style={styles.progressBarBg}>
                            <View
                                style={[
                                    styles.progressBarFill,
                                    { width: `${percentage}%` },
                                ]}
                            />
                            {percentage > 0 && (
                                <View
                                    style={[
                                        styles.progressBarGlow,
                                        { width: `${percentage}%` },
                                    ]}
                                />
                            )}
                        </View>

                        {/* Chips de estado */}
                        <View style={styles.progressChips}>
                            <View style={[styles.chip, styles.chipCompleted]}>
                                <MaterialIcons name="check-circle" size={12} color={COLORS.puertoTejadaGreen} />
                                <Text style={[styles.chipText, { color: COLORS.puertoTejadaGreen }]}>
                                    {completed} completadas
                                </Text>
                            </View>
                            {pending > 0 && (
                                <View style={[styles.chip, styles.chipPending]}>
                                    <MaterialIcons name="radio-button-unchecked" size={12} color={COLORS.textLight} />
                                    <Text style={[styles.chipText, { color: COLORS.textLight }]}>
                                        {pending} pendientes
                                    </Text>
                                </View>
                            )}
                            {percentage === 100 && (
                                <View style={[styles.chip, styles.chipFinished]}>
                                    <MaterialIcons name="verified" size={12} color="#fff" />
                                    <Text style={[styles.chipText, { color: "#fff" }]}>
                                        ¡Módulo completo!
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* ═══════════════════════════════════════════════════════
                        BANNER PUERTO TEJADA
                    ═══════════════════════════════════════════════════════ */}
                    <View style={styles.municipioCard}>
                        <TricolorStripe height={5} />
                        <View style={styles.municipioBody}>
                            <View style={styles.municipioLeft}>
                                <Text style={styles.municipioEmoji}>🌿</Text>
                            </View>
                            <View style={styles.municipioRight}>
                                <Text style={styles.municipioName}>{PUERTO_TEJADA.nombre}, {PUERTO_TEJADA.departamento}</Text>
                                <Text style={styles.municipioInstitution}>{PUERTO_TEJADA.institucion}</Text>
                                <Text style={styles.municipioFundacion}>Fundado: {PUERTO_TEJADA.fundacion}</Text>
                                <Text style={styles.municipioLema} numberOfLines={2}>{PUERTO_TEJADA.lema}</Text>
                            </View>
                        </View>
                    </View>

                    {/* ═══════════════════════════════════════════════════════
                        ACCESO RÁPIDO — PWA
                    ═══════════════════════════════════════════════════════ */}
                    <TouchableOpacity
                        style={styles.pwaCard}
                        onPress={() => navigation.navigate("PWA")}
                        activeOpacity={0.8}
                    >
                        <View style={styles.pwaIconContainer}>
                            <MaterialIcons name="important-devices" size={22} color="#fff" />
                        </View>
                        <View style={styles.pwaTextContainer}>
                            <Text style={styles.pwaTitle}>Nuestra PWA</Text>
                            <Text style={styles.pwaSubtitle}>Instala la app en tu dispositivo</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={22} color={COLORS.puertoTejadaRed} />
                    </TouchableOpacity>

                    {/* ═══════════════════════════════════════════════════════
                        LECCIONES
                    ═══════════════════════════════════════════════════════ */}
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <View style={[styles.sectionAccent, { backgroundColor: COLORS.puertoTejadaRed }]} />
                            <Text style={styles.sectionTitle}>Lecciones del módulo</Text>
                        </View>
                        <Text style={styles.sectionCount}>{totalLessons} lecciones</Text>
                    </View>

                    <View style={styles.lessonsContainer}>
                        {lessonsData.map((lesson) => (
                            <LessonCard
                                key={lesson.id}
                                lesson={lesson}
                                isCompleted={completedLessons.includes(lesson.id)}
                                onPress={() =>
                                    navigation.navigate("Details", {
                                        lesson,
                                        previousScreen: "Home",
                                    })
                                }
                            />
                        ))}
                    </View>

                    {/* ═══════════════════════════════════════════════════════
                        FOOTER
                    ═══════════════════════════════════════════════════════ */}
                    <View style={styles.footer}>
                        <TricolorStripe height={3} />
                        <View style={styles.footerContent}>
                            <Text style={styles.footerTitle}>ProyectIA</Text>
                            <Text style={styles.footerSub}>
                                🌿 {PUERTO_TEJADA.lema} 🌿
                            </Text>
                            <Text style={styles.footerSmall}>
                                Aplicación desarrollada con orgullo porteño
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>

            {/* ─── FAB — ChatBot ────────────────────────────────────────────── */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate("ChatBot_Ayuda")}
                accessibilityLabel="Abrir chat de ayuda"
                activeOpacity={0.85}
            >
                <Text style={styles.fabIcon}>💬</Text>
                <View style={styles.fabBadge} />
            </TouchableOpacity>
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
    },

    // ─── Hero ────────────────────────────────────────────────────────────────
    hero: {
        backgroundColor: COLORS.puertoTejadaRed,
        overflow: "hidden",
        ...Platform.select({
            ios: {
                shadowColor: COLORS.puertoTejadaRedDark,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.30,
                shadowRadius: 16,
            },
            android: { elevation: 12 },
        }),
    },
    heroPattern: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 160,
        height: "100%",
        opacity: 0.12,
        justifyContent: "center",
        gap: 10,
        paddingTop: 20,
    },
    patternRow: {
        flexDirection: "row",
        gap: 10,
    },
    patternDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#fff",
    },
    heroContent: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.lg,
        alignItems: "center",
    },

    // Badge institucional
    institutionBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "#fff",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: RADIUS.pill,
        marginBottom: SPACING.lg,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.10,
                shadowRadius: 4,
            },
            android: { elevation: 3 },
        }),
    },
    institutionBadgeText: {
        fontSize: 11,
        fontWeight: "700",
        color: COLORS.puertoTejadaRed,
        letterSpacing: 0.2,
    },

    // Ícono hero
    heroIconContainer: {
        marginBottom: SPACING.md,
    },
    heroIconOuter: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: "rgba(255,255,255,0.15)",
        justifyContent: "center",
        alignItems: "center",
    },
    heroIconInner: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: "rgba(255,255,255,0.20)",
        justifyContent: "center",
        alignItems: "center",
    },
    heroEmoji: {
        fontSize: 38,
    },

    // Textos hero
    heroTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: "#fff",
        textAlign: "center",
        letterSpacing: -0.8,
        lineHeight: 34,
        marginBottom: SPACING.sm,
    },
    heroSubtitle: {
        fontSize: 14,
        color: "rgba(255,255,255,0.80)",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: SPACING.lg,
        paddingHorizontal: SPACING.md,
    },

    // Stats hero
    heroStats: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.12)",
        borderRadius: RADIUS.lg,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.sm,
        width: "100%",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.20)",
    },
    heroStatDivider: {
        width: 1,
        height: 36,
        backgroundColor: "rgba(255,255,255,0.25)",
    },

    // ─── Body ────────────────────────────────────────────────────────────────
    bodyContent: {
        padding: SPACING.md,
        paddingTop: SPACING.lg,
    },

    // ─── Tarjeta de progreso ──────────────────────────────────────────────────
    progressCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xl,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
            },
            android: { elevation: 4 },
        }),
    },
    progressCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SPACING.sm,
    },
    progressCardTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    progressCardTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: COLORS.text,
    },
    progressCardPct: {
        fontSize: 22,
        fontWeight: "800",
        color: COLORS.puertoTejadaRed,
        letterSpacing: -0.5,
    },
    progressBarBg: {
        height: 10,
        backgroundColor: COLORS.surfaceAlt,
        borderRadius: RADIUS.pill,
        overflow: "hidden",
        marginBottom: SPACING.sm,
        position: "relative",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: COLORS.puertoTejadaGreen,
        borderRadius: RADIUS.pill,
    },
    progressBarGlow: {
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        backgroundColor: "rgba(46,125,50,0.25)",
        borderRadius: RADIUS.pill,
    },
    progressChips: {
        flexDirection: "row",
        gap: 8,
        flexWrap: "wrap",
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: RADIUS.pill,
    },
    chipCompleted: {
        backgroundColor: COLORS.successLight,
    },
    chipPending: {
        backgroundColor: COLORS.surfaceAlt,
    },
    chipFinished: {
        backgroundColor: COLORS.puertoTejadaGreen,
    },
    chipText: {
        fontSize: 11,
        fontWeight: "600",
    },

    // ─── Municipio card ────────────────────────────────────────────────────
    municipioCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xl,
        overflow: "hidden",
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.07,
                shadowRadius: 8,
            },
            android: { elevation: 3 },
        }),
    },
    municipioBody: {
        flexDirection: "row",
        alignItems: "center",
        padding: SPACING.md,
        gap: SPACING.md,
    },
    municipioLeft: {
        width: 52,
        height: 52,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.successLight,
        justifyContent: "center",
        alignItems: "center",
    },
    municipioEmoji: {
        fontSize: 28,
    },
    municipioRight: {
        flex: 1,
    },
    municipioName: {
        fontSize: 14,
        fontWeight: "800",
        color: COLORS.puertoTejadaRed,
        marginBottom: 1,
    },
    municipioInstitution: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.puertoTejadaGreen,
        marginBottom: 3,
    },
    municipioFundacion: {
        fontSize: 11,
        color: COLORS.textLight,
        fontStyle: "italic",
        marginBottom: 2,
    },
    municipioLema: {
        fontSize: 11,
        color: COLORS.textSecondary,
        lineHeight: 15,
    },

    // ─── PWA card ─────────────────────────────────────────────────────────
    pwaCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xl,
        padding: SPACING.md,
        marginBottom: SPACING.lg,
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.sm,
        borderWidth: 1.5,
        borderColor: COLORS.primaryLight,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.puertoTejadaRed,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.10,
                shadowRadius: 8,
            },
            android: { elevation: 3 },
        }),
    },
    pwaIconContainer: {
        width: 42,
        height: 42,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.puertoTejadaRed,
        justifyContent: "center",
        alignItems: "center",
    },
    pwaTextContainer: {
        flex: 1,
    },
    pwaTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.text,
    },
    pwaSubtitle: {
        fontSize: 12,
        color: COLORS.textLight,
    },

    // ─── Sección header ────────────────────────────────────────────────────
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SPACING.md,
    },
    sectionTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    sectionAccent: {
        width: 4,
        height: 20,
        borderRadius: 2,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: "800",
        color: COLORS.text,
        letterSpacing: -0.3,
    },
    sectionCount: {
        fontSize: 12,
        color: COLORS.textLight,
        fontWeight: "500",
        backgroundColor: COLORS.surfaceAlt,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: RADIUS.pill,
    },

    // ─── Lecciones ─────────────────────────────────────────────────────────
    lessonsContainer: {
        gap: 0,
    },

    // ─── Footer ────────────────────────────────────────────────────────────
    footer: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xl,
        overflow: "hidden",
        marginTop: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    footerContent: {
        padding: SPACING.md,
        alignItems: "center",
    },
    footerTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.puertoTejadaRed,
        letterSpacing: -0.3,
        marginBottom: 4,
    },
    footerSub: {
        fontSize: 13,
        color: COLORS.puertoTejadaGreen,
        fontWeight: "600",
        marginBottom: 4,
    },
    footerSmall: {
        fontSize: 11,
        color: COLORS.textLight,
    },

    // ─── FAB ───────────────────────────────────────────────────────────────
    fab: {
        position: "absolute",
        right: 20,
        bottom: 28,
        backgroundColor: COLORS.puertoTejadaRed,
        width: 58,
        height: 58,
        borderRadius: 29,
        justifyContent: "center",
        alignItems: "center",
        ...Platform.select({
            ios: {
                shadowColor: COLORS.puertoTejadaRed,
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.40,
                shadowRadius: 10,
            },
            android: { elevation: 10 },
        }),
    },
    fabIcon: {
        fontSize: 26,
    },
    fabBadge: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.puertoTejadaGreen,
        borderWidth: 2,
        borderColor: "#fff",
    },
});

export default HomeScreen;