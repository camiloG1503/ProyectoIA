// screens/LessonScreen.js
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    RefreshControl,
    Platform,
} from "react-native";
import { loadProgress } from "../utils/storage";
import { lessonsData } from "../utils/lessonsData";
import { COLORS, RADIUS, SPACING, SHADOWS } from "../utils/colors";

// ─── Franja tricolor institucional ─────────────────────────────────────────────
const TricolorStripe = ({ height = 6 }) => (
    <View style={{ flexDirection: "row", height }}>
        <View style={{ flex: 1, backgroundColor: COLORS.puertoTejadaRed }} />
        <View style={{ flex: 1, backgroundColor: COLORS.puertoTejadaWhite }} />
        <View style={{ flex: 1, backgroundColor: COLORS.puertoTejadaGreen }} />
    </View>
);

const LessonScreen = ({ navigation }) => {
    const [completedLessons, setCompletedLessons] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadUserProgress = async () => {
        const stored = await loadProgress();
        setCompletedLessons(stored?.completedLessons || []);
    };

    useEffect(() => {
        loadUserProgress();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadUserProgress();
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TricolorStripe />
            <ScrollView
                showsVerticalScrollIndicator={Platform.OS !== "web"}
                refreshControl={
                    Platform.OS === "web"
                        ? undefined
                        : <RefreshControl 
                            refreshing={refreshing} 
                            onRefresh={handleRefresh} 
                            colors={[COLORS.puertoTejadaRed]} 
                          />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        🧠 Aprende Inteligencia Artificial
                    </Text>
                    <Text style={styles.headerSubtitle}>
                        Aprende IA paso a paso y domina las herramientas del futuro para Puerto Tejada
                    </Text>
                </View>

                <View style={styles.lessonsContainer}>
                    {lessonsData.map((lesson) => {
                        const completed = completedLessons.includes(lesson.id);
                        return (
                            <TouchableOpacity
                                key={lesson.id}
                                style={[
                                    styles.lessonCard, 
                                    completed && styles.completedCard
                                ]}
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate("Details", { lesson, previousScreen: "Home" })}
                            >
                                <View style={styles.cardContent}>
                                    <View style={styles.infoArea}>
                                        <Text style={styles.lessonTitle}>
                                            {lesson.icon} {lesson.title}
                                        </Text>
                                        <Text style={[
                                            styles.lessonSubtitle,
                                            completed && styles.completedText
                                        ]}>
                                            {completed ? "✅ Lección completada con éxito" : lesson.subtitle}
                                        </Text>
                                    </View>
                                    {completed && (
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>LISTO</Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: SPACING.lg,
        backgroundColor: COLORS.puertoTejadaRed,
        borderBottomLeftRadius: RADIUS.xl,
        borderBottomRightRadius: RADIUS.xl,
        ...SHADOWS.card,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#fff",
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: "rgba(255,255,255,0.9)",
        lineHeight: 20,
        fontWeight: "500",
    },
    lessonsContainer: {
        padding: SPACING.md,
        paddingTop: SPACING.lg,
    },
    lessonCard: {
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.card,
    },
    completedCard: {
        backgroundColor: COLORS.puertoTejadaLightGreen,
        borderColor: COLORS.puertoTejadaGreen + "40",
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    infoArea: {
        flex: 1,
    },
    lessonTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: 4,
    },
    lessonSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        lineHeight: 18,
    },
    completedText: {
        color: COLORS.puertoTejadaGreen,
        fontWeight: "600",
    },
    badge: {
        backgroundColor: COLORS.puertoTejadaGreen,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
        marginLeft: 10,
    },
    badgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "900",
    },
});

export default LessonScreen;