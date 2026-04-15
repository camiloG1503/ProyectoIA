// components/LessonCard.js
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../utils/colors";

const LessonCard = React.memo(
    ({ lesson, onPress, isLandscape = false, isCompleted = false }) => {
        const { width } = useWindowDimensions();

        const cardWidth = isLandscape ? "48%" : width > 600 ? "48%" : "100%";
        const progress = lesson.progress ?? (isCompleted ? 100 : 0);

        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    isCompleted && styles.completedCard,
                    { width: cardWidth },
                ]}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <View style={[styles.iconContainer, { backgroundColor: lesson.color }]}>
                    <MaterialIcons name={lesson.icon} size={28} color="#fff" />
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>{lesson.title}</Text>
                    <Text style={styles.subtitle}>{lesson.subtitle}</Text>

                    <View style={styles.info}>
                        {/* Badge de nivel con color verde Puerto Tejada si está completado */}
                        <View
                            style={[
                                styles.badge,
                                {
                                    backgroundColor: isCompleted
                                        ? COLORS.puertoTejadaGreen
                                        : COLORS.primary,
                                },
                            ]}
                        >
                            <Text style={styles.badgeText}>{lesson.level}</Text>
                        </View>
                        <Text style={styles.duration}>⏱ {lesson.duration}</Text>
                    </View>

                    {/* Barra de progreso */}
                    <View style={styles.progressBarBackground}>
                        <View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: `${progress}%`,
                                    backgroundColor: progress === 100 ? "#22C55E" : lesson.color,
                                },
                            ]}
                        />
                    </View>

                    <View style={styles.progressRow}>
                        <Text style={styles.progressText}>{progress}%</Text>
                        {progress === 100 && (
                            <View style={styles.completedBadge}>
                                <Text style={styles.completedText}>✔ COMPLETADO</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
        flexDirection: "row",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    completedCard: {
        borderWidth: 2,
        borderColor: COLORS.puertoTejadaGreen, // Borde verde local
    },
    iconContainer: {
        width: 55,
        height: 55,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 10,
    },
    info: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    duration: {
        fontSize: 12,
        color: "#6B7280",
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: "#E5E7EB",
        borderRadius: 6,
        overflow: "hidden",
    },
    progressBarFill: {
        height: 8,
        borderRadius: 6,
    },
    progressRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 6,
    },
    progressText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#374151",
    },
    completedBadge: {
        backgroundColor: COLORS.puertoTejadaGreen,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    completedText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "bold",
    },
});

export default LessonCard;