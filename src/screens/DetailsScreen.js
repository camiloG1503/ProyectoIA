// screens/DetailsScreen.js
// Rediseño visual — I.E. Fidelina Echeverry · Puerto Tejada, Cauca

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    useWindowDimensions,
    Platform,
    Alert,
    Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

// ─── Chip de meta info ────────────────────────────────────────────────────────
const MetaChip = ({ icon, label, value, color }) => (
    <View style={[metaStyles.chip, { borderColor: color + "30" }]}>
        <View style={[metaStyles.iconWrap, { backgroundColor: color + "18" }]}>
            <MaterialIcons name={icon} size={16} color={color} />
        </View>
        <View>
            <Text style={metaStyles.chipLabel}>{label}</Text>
            <Text style={[metaStyles.chipValue, { color }]}>{value}</Text>
        </View>
    </View>
);

const metaStyles = StyleSheet.create({
    chip: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.sm,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
            },
            android: { elevation: 3 },
        }),
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: RADIUS.sm,
        justifyContent: "center",
        alignItems: "center",
    },
    chipLabel: {
        fontSize: 10,
        color: COLORS.textLight,
        fontWeight: "500",
        marginBottom: 1,
    },
    chipValue: {
        fontSize: 13,
        fontWeight: "700",
    },
});

// ─── Componente principal ─────────────────────────────────────────────────────
const DetailsScreen = ({ route, navigation }) => {
    const { lesson, previousScreen } = route.params;
    const { width, height } = useWindowDimensions();
    const [refreshing, setRefreshing] = useState(false);
    const scaleAnim = React.useRef(new Animated.Value(0.97)).current;
    const fadeAnim  = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
        ]).start();
    }, []);

    const isTablet   = width > 600;
    const padding    = isTablet ? 28 : SPACING.md;

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 500);
    };

    const navigateToLesson = () => {
        navigation.navigate("LessonContent", { lesson, previousScreen: "Details" });
    };

    const handleStartLesson = () => {
        if (Platform.OS === "android") {
            Alert.alert(
                "🤖 ¿Listo para comenzar?",
                `Vas a iniciar "${lesson.title}". ¡Mucho éxito!`,
                [{ text: "Continuar", onPress: navigateToLesson }]
            );
        } else {
            Alert.alert(
                "📱 Iniciar lección",
                `¿Deseas comenzar "${lesson.title}"?`,
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Comenzar", onPress: navigateToLesson },
                ]
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingHorizontal: padding }]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    Platform.OS === "web"
                        ? undefined
                        : <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={COLORS.puertoTejadaRed}
                            colors={[COLORS.puertoTejadaRed]}
                          />
                }
            >
                <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>

                    {/* ═══════════════════════════════════════════════════════
                        HERO DE LA LECCIÓN
                    ═══════════════════════════════════════════════════════ */}
                    <View style={[styles.hero, { backgroundColor: lesson.color }]}>
                        {/* Patrón decorativo */}
                        <View style={styles.heroPattern} pointerEvents="none">
                            {[...Array(4)].map((_, row) => (
                                <View key={row} style={styles.patternRow}>
                                    {[...Array(6)].map((_, col) => (
                                        <View key={col} style={styles.patternDot} />
                                    ))}
                                </View>
                            ))}
                        </View>

                        {/* Ícono */}
                        <View style={styles.heroIconOuter}>
                            <View style={styles.heroIconInner}>
                                <MaterialIcons name={lesson.icon} size={44} color="#fff" />
                            </View>
                        </View>

                        <Text style={styles.heroTitle}>{lesson.title}</Text>
                        <Text style={styles.heroSubtitle}>{lesson.subtitle}</Text>

                        {/* Badge de navegación */}
                        <View style={styles.navBadge}>
                            <MaterialIcons name="arrow-back" size={12} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.navBadgeText}>Desde: {previousScreen}</Text>
                        </View>

                        {/* Franja tricolor inferior */}
                        <View style={{ marginTop: SPACING.md }}>
                            <TricolorStripe height={4} />
                        </View>
                    </View>

                    {/* ═══════════════════════════════════════════════════════
                        META INFO — duración y nivel
                    ═══════════════════════════════════════════════════════ */}
                    <View style={styles.metaRow}>
                        <MetaChip
                            icon="schedule"
                            label="Duración"
                            value={lesson.duration}
                            color={lesson.color}
                        />
                        <View style={{ width: SPACING.sm }} />
                        <MetaChip
                            icon="bar-chart"
                            label="Nivel"
                            value={lesson.level}
                            color={COLORS.puertoTejadaGreen}
                        />
                    </View>

                    {/* ═══════════════════════════════════════════════════════
                        DESCRIPCIÓN
                    ═══════════════════════════════════════════════════════ */}
                    <View style={styles.card}>
                        <View style={styles.cardTitleRow}>
                            <View style={[styles.cardAccent, { backgroundColor: lesson.color }]} />
                            <MaterialIcons name="menu-book" size={18} color={lesson.color} />
                            <Text style={styles.cardTitle}>Descripción</Text>
                        </View>
                        <Text style={styles.description}>{lesson.description}</Text>
                    </View>

                    {/* ═══════════════════════════════════════════════════════
                        TEMAS QUE APRENDERÁS
                    ═══════════════════════════════════════════════════════ */}
                    {(lesson.topics || []).length > 0 && (
                        <View style={styles.card}>
                            <View style={styles.cardTitleRow}>
                                <View style={[styles.cardAccent, { backgroundColor: COLORS.puertoTejadaGreen }]} />
                                <MaterialIcons name="auto-stories" size={18} color={COLORS.puertoTejadaGreen} />
                                <Text style={styles.cardTitle}>Temas que aprenderás</Text>
                            </View>
                            {(lesson.topics || []).map((topic, index) => (
                                <View key={index} style={styles.topicItem}>
                                    <View style={[styles.topicBullet, { backgroundColor: lesson.color }]}>
                                        <Text style={styles.topicNumber}>{index + 1}</Text>
                                    </View>
                                    <Text style={styles.topicText}>{topic}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* ═══════════════════════════════════════════════════════
                        INSTITUCIÓN
                    ═══════════════════════════════════════════════════════ */}
                    <View style={[styles.card, styles.institutionCard]}>
                        <TricolorStripe height={4} />
                        <View style={styles.institutionBody}>
                            <MaterialIcons name="school" size={20} color={COLORS.puertoTejadaRed} />
                            <View style={styles.institutionText}>
                                <Text style={styles.institutionName}>{PUERTO_TEJADA.institucion}</Text>
                                <Text style={styles.institutionLocation}>
                                    {PUERTO_TEJADA.nombre}, {PUERTO_TEJADA.departamento}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ height: 100 }} />
                </Animated.View>
            </ScrollView>

            {/* ─── Botón flotante de inicio ──────────────────────────────────── */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[styles.startButton, { backgroundColor: lesson.color }]}
                    onPress={handleStartLesson}
                    activeOpacity={0.85}
                >
                    <MaterialIcons name="play-arrow" size={24} color="#fff" />
                    <Text style={styles.startButtonText}>Iniciar lección</Text>
                </TouchableOpacity>
            </View>
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
        paddingTop: SPACING.md,
    },

    // ─── Hero ────────────────────────────────────────────────────────────────
    hero: {
        borderRadius: RADIUS.xl,
        overflow: "hidden",
        marginBottom: SPACING.md,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.18,
                shadowRadius: 16,
            },
            android: { elevation: 8 },
        }),
    },
    heroPattern: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 130,
        height: "100%",
        opacity: 0.15,
        justifyContent: "center",
        gap: 10,
        paddingTop: 16,
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
    heroIconOuter: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "rgba(255,255,255,0.18)",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: SPACING.xl,
        marginBottom: SPACING.md,
    },
    heroIconInner: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "rgba(255,255,255,0.22)",
        justifyContent: "center",
        alignItems: "center",
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#fff",
        textAlign: "center",
        letterSpacing: -0.5,
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.xs,
    },
    heroSubtitle: {
        fontSize: 14,
        color: "rgba(255,255,255,0.80)",
        textAlign: "center",
        paddingHorizontal: SPACING.xl,
        lineHeight: 20,
        marginBottom: SPACING.md,
    },
    navBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "rgba(0,0,0,0.18)",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: RADIUS.pill,
        alignSelf: "center",
    },
    navBadgeText: {
        fontSize: 11,
        color: "rgba(255,255,255,0.75)",
        fontWeight: "500",
    },

    // ─── Meta row ────────────────────────────────────────────────────────────
    metaRow: {
        flexDirection: "row",
        marginBottom: SPACING.md,
    },

    // ─── Card base ───────────────────────────────────────────────────────────
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xl,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
            },
            android: { elevation: 3 },
        }),
    },
    cardTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        marginBottom: SPACING.md,
    },
    cardAccent: {
        width: 4,
        height: 18,
        borderRadius: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.text,
        letterSpacing: -0.3,
    },

    // ─── Descripción ─────────────────────────────────────────────────────────
    description: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },

    // ─── Temas ───────────────────────────────────────────────────────────────
    topicItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    topicBullet: {
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 1,
    },
    topicNumber: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "800",
    },
    topicText: {
        flex: 1,
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },

    // ─── Institución card ─────────────────────────────────────────────────────
    institutionCard: {
        padding: 0,
        overflow: "hidden",
    },
    institutionBody: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.sm,
        padding: SPACING.md,
    },
    institutionText: {
        flex: 1,
    },
    institutionName: {
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.puertoTejadaRed,
    },
    institutionLocation: {
        fontSize: 11,
        color: COLORS.textLight,
        marginTop: 2,
    },

    // ─── Bottom bar ───────────────────────────────────────────────────────────
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.surface,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        paddingBottom: Platform.OS === "ios" ? SPACING.lg : SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.08,
                shadowRadius: 10,
            },
            android: { elevation: 10 },
        }),
    },
    startButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: SPACING.sm,
        borderRadius: RADIUS.md,
        paddingVertical: 16,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
            },
            android: { elevation: 6 },
        }),
    },
    startButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.2,
    },
});

export default DetailsScreen;