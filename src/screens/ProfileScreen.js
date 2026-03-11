import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    useWindowDimensions,
    TouchableOpacity
} from 'react-native';
import { userProfile } from '../utils/lessonsData';
import { COLORS } from '../utils/colors';

const ProfileScreen = ({ route, navigation }) => {
    // Recibir datos mediante route params (si vienen de Details)
    const params = route.params || {};
    const { lessonId, lessonTitle, fromDetails, completedTopics } = params;

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const isTablet = width > 600;
    const padding = isTablet ? 32 : (isLandscape ? 24 : 16);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

            <ScrollView contentContainerStyle={[styles.content, { padding }]}>
                {/* Header del perfil */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatar}>👤</Text>
                    </View>
                    <Text style={styles.name}>{userProfile.name}</Text>
                    <Text style={styles.email}>{userProfile.email}</Text>
                    <View style={[styles.levelBadge, { backgroundColor: COLORS.vibrantPurple }]}>
                        <Text style={styles.levelText}>🎓 {userProfile.level}</Text>
                    </View>
                </View>

                {/* Mostrar datos recibidos por route params si existen */}
                {fromDetails && (
                    <View style={styles.routeParamsInfo}>
                        <Text style={styles.routeParamsTitle}>📬 Información recibida</Text>
                        <View style={styles.paramItem}>
                            <Text style={styles.paramLabel}>Lección ID:</Text>
                            <Text style={styles.paramValue}>{lessonId}</Text>
                        </View>
                        <View style={styles.paramItem}>
                            <Text style={styles.paramLabel}>Lección:</Text>
                            <Text style={styles.paramValue}>{lessonTitle}</Text>
                        </View>
                        <View style={styles.paramItem}>
                            <Text style={styles.paramLabel}>Temas en lección:</Text>
                            <Text style={styles.paramValue}>{completedTopics} temas</Text>
                        </View>
                        <Text style={styles.routeParamsNote}>
                            ✅ Route params funcionando correctamente: Details → Profile
                        </Text>
                    </View>
                )}

                {/* Estadísticas */}
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: COLORS.primary }]}>
                        <Text style={styles.statNumber}>{userProfile.lessonsCompleted}</Text>
                        <Text style={styles.statLabel}>Lecciones completadas</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: COLORS.purple }]}>
                        <Text style={styles.statNumber}>{userProfile.totalLessons}</Text>
                        <Text style={styles.statLabel}>Lecciones totales</Text>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: COLORS.secondary }]}>
                        <Text style={styles.statNumber}>{userProfile.streakDays}</Text>
                        <Text style={styles.statLabel}>Días seguidos 🔥</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: COLORS.accent }]}>
                        <Text style={styles.statNumber}>{userProfile.joinDate}</Text>
                        <Text style={styles.statLabel}>Miembro desde</Text>
                    </View>
                </View>

                {/* Logros */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🏆 Logros</Text>
                    {userProfile.achievements.map((achievement) => (
                        <View
                            key={achievement.id}
                            style={[
                                styles.achievementItem,
                                !achievement.unlocked && styles.achievementLocked
                            ]}
                        >
                            <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                            <Text style={[
                                styles.achievementTitle,
                                !achievement.unlocked && styles.achievementTitleLocked
                            ]}>
                                {achievement.title}
                            </Text>
                            {achievement.unlocked ? (
                                <Text style={styles.achievementStatus}>✅</Text>
                            ) : (
                                <Text style={styles.achievementStatus}>🔒</Text>
                            )}
                        </View>
                    ))}
                </View>

                {/* Información adicional */}
                <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>💡 Sobre esta app</Text>
                    <Text style={styles.infoText}>
                        Esta aplicación te enseña a usar la Inteligencia Artificial de manera
                        estratégica, no solo para copiar información, sino como un aliado creativo
                        que potencia tu imaginación y productividad.
                    </Text>
                    <Text style={styles.infoText}>
                        🎯 Contribuye al ODS 4: Educación de calidad
                    </Text>
                </View>

                {/* Botón para volver */}
                {fromDetails && (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>← Volver a la lección</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },
    content: {
        flexGrow: 1,
    },
    header: {
        backgroundColor: COLORS.white,
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        fontSize: 48,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 12,
    },
    levelBadge: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    levelText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    routeParamsInfo: {
        backgroundColor: COLORS.accent,
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
    },
    routeParamsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 12,
    },
    paramItem: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    paramLabel: {
        fontSize: 14,
        color: COLORS.white,
        fontWeight: '600',
        marginRight: 8,
    },
    paramValue: {
        fontSize: 14,
        color: COLORS.white,
        flex: 1,
    },
    routeParamsNote: {
        fontSize: 12,
        color: COLORS.white,
        marginTop: 12,
        fontStyle: 'italic',
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    statCard: {
        flex: 1,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.white,
        textAlign: 'center',
        opacity: 0.9,
    },
    section: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 16,
        marginTop: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 16,
    },
    achievementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: COLORS.light,
        borderRadius: 12,
        marginBottom: 8,
    },
    achievementLocked: {
        opacity: 0.5,
    },
    achievementIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    achievementTitle: {
        fontSize: 15,
        color: COLORS.text,
        flex: 1,
        fontWeight: '600',
    },
    achievementTitleLocked: {
        color: COLORS.textLight,
    },
    achievementStatus: {
        fontSize: 18,
    },
    infoSection: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.textLight,
        lineHeight: 22,
        marginBottom: 8,
    },
    backButton: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.white,
    },
});

export default ProfileScreen;
