// components/LessonCard.js
// Rediseño visual — I.E. Fidelina Echeverry · Puerto Tejada, Cauca
// Tarjeta de lección con identidad institucional, profundidad y elegancia

import React, { useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, RADIUS, SHADOWS } from "../utils/colors";

// ─── Franja tricolor institucional ───────────────────────────────────────────
const InstitutionalStripe = () => (
    <View style={stripeStyles.container}>
        <View style={[stripeStyles.band, { backgroundColor: COLORS.puertoTejadaRed }]} />
        <View style={[stripeStyles.band, { backgroundColor: COLORS.puertoTejadaWhite }]} />
        <View style={[stripeStyles.band, { backgroundColor: COLORS.puertoTejadaGreen }]} />
    </View>
);

const stripeStyles = StyleSheet.create({
    container: {
        flexDirection: "column",
        width: 5,
        borderTopLeftRadius: RADIUS.lg,
        borderBottomLeftRadius: RADIUS.lg,
        overflow: "hidden",
        alignSelf: "stretch",
        marginRight: 14,
    },
    band: {
        flex: 1,
    },
});

// ─── Componente principal ─────────────────────────────────────────────────────
const LessonCard = React.memo(
    ({ lesson, onPress, isLandscape = false, isCompleted = false }) => {
        const { width } = useWindowDimensions();

        const cardWidth = useMemo(() => {
            if (isLandscape) return "48%";
            return width > 600 ? "48%" : "100%";
        }, [width, isLandscape]);

        const progress = useMemo(() => {
            return lesson.progress ?? (isCompleted ? 100 : 0);
        }, [lesson.progress, isCompleted]);

        // Color de progreso: verde si está completo, color de la lección si no
        const progressColor = progress === 100 ? COLORS.puertoTejadaGreen : lesson.color;

        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    isCompleted && styles.completedCard,
                    { width: cardWidth },
                ]}
                onPress={onPress}
                activeOpacity={0.75}
            >
                {/* Franja tricolor izquierda — identidad institucional */}
                <InstitutionalStripe />

                {/* Ícono de la lección */}
                <View style={[styles.iconWrapper, { backgroundColor: lesson.color + "18" }]}>
                    <View style={[styles.iconInner, { backgroundColor: lesson.color }]}>
                        <MaterialIcons name={lesson.icon} size={24} color="#fff" />
                    </View>
                    {/* Anillo exterior sutil */}
                    <View style={[styles.iconRing, { borderColor: lesson.color + "40" }]} />
                </View>

                {/* Contenido */}
                <View style={styles.content}>
                    {/* Título y badge de nivel */}
                    <View style={styles.titleRow}>
                        <Text style={styles.title} numberOfLines={1}>{lesson.title}</Text>
                        {isCompleted && (
                            <View style={styles.completedIcon}>
                                <MaterialIcons name="check-circle" size={18} color={COLORS.puertoTejadaGreen} />
                            </View>
                        )}
                    </View>

                    <Text style={styles.subtitle} numberOfLines={1}>{lesson.subtitle}</Text>

                    {/* Meta info: nivel + duración */}
                    <View style={styles.metaRow}>
                        <View style={[styles.levelBadge, { backgroundColor: isCompleted ? COLORS.successLight : COLORS.primaryLight }]}>
                            <Text style={[styles.levelText, { color: isCompleted ? COLORS.puertoTejadaGreen : COLORS.puertoTejadaRed }]}>
                                {lesson.level}
                            </Text>
                        </View>
                        <View style={styles.durationChip}>
                            <MaterialIcons name="schedule" size={11} color={COLORS.textLight} />
                            <Text style={styles.durationText}>{lesson.duration}</Text>
                        </View>
                    </View>

                    {/* Barra de progreso */}
                    <View style={styles.progressSection}>
                        <View style={styles.progressBarBg}>
                            <View
                                style={[
                                    styles.progressBarFill,
                                    {
                                        width: `${progress}%`,
                                        backgroundColor: progressColor,
                                    },
                                ]}
                            />
                        </View>
                        <View style={styles.progressLabelRow}>
                            <Text style={[styles.progressPct, { color: progressColor }]}>
                                {progress}%
                            </Text>
                            {progress === 100 && (
                                <View style={styles.completedBadge}>
                                    <MaterialIcons name="verified" size={10} color="#fff" />
                                    <Text style={styles.completedBadgeText}>COMPLETADO</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
);

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        paddingVertical: 16,
        paddingRight: 16,
        paddingLeft: 0,
        marginBottom: 14,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    completedCard: {
        borderColor: COLORS.puertoTejadaGreenLight,
        backgroundColor: "#FAFFF9",
        ...Platform.select({
            ios: {
                shadowColor: COLORS.puertoTejadaGreen,
                shadowOpacity: 0.12,
            },
            android: {
                elevation: 3,
            },
        }),
    },

    // ─── Ícono ──────────────────────────────────────────────────────────────
    iconWrapper: {
        width: 56,
        height: 56,
        borderRadius: RADIUS.md,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
        position: "relative",
    },
    iconInner: {
        width: 44,
        height: 44,
        borderRadius: RADIUS.sm,
        justifyContent: "center",
        alignItems: "center",
    },
    iconRing: {
        position: "absolute",
        width: 52,
        height: 52,
        borderRadius: RADIUS.md + 2,
        borderWidth: 1.5,
        top: 2,
        left: 2,
    },

    // ─── Contenido ──────────────────────────────────────────────────────────
    content: {
        flex: 1,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 3,
    },
    title: {
        fontSize: 15,
        fontWeight: "700",
        color: COLORS.text,
        flex: 1,
        letterSpacing: -0.2,
    },
    completedIcon: {
        marginLeft: 6,
    },
    subtitle: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 10,
    },

    // ─── Meta ────────────────────────────────────────────────────────────────
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
    },
    levelBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: RADIUS.pill,
    },
    levelText: {
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
    durationChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        backgroundColor: COLORS.surfaceAlt,
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: RADIUS.pill,
    },
    durationText: {
        fontSize: 10,
        color: COLORS.textLight,
        fontWeight: "500",
    },

    // ─── Progreso ────────────────────────────────────────────────────────────
    progressSection: {
        gap: 5,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: COLORS.surfaceAlt,
        borderRadius: RADIUS.pill,
        overflow: "hidden",
    },
    progressBarFill: {
        height: 6,
        borderRadius: RADIUS.pill,
    },
    progressLabelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    progressPct: {
        fontSize: 11,
        fontWeight: "700",
    },
    completedBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        backgroundColor: COLORS.puertoTejadaGreen,
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: RADIUS.pill,
    },
    completedBadgeText: {
        color: "#fff",
        fontSize: 9,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
});

export default LessonCard;