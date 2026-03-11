import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    useWindowDimensions
} from 'react-native';
import { COLORS } from '../utils/colors';

const DetailsScreen = ({ route, navigation }) => {
    // Recibir datos mediante route params
    const { lesson, previousScreen } = route.params;
    const { width, height } = useWindowDimensions();

    const handleStartLesson = () => {
        // Navegar a Profile enviando información de la lección como route params
        navigation.navigate('Profile', {
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            fromDetails: true,
            completedTopics: lesson.topics.length
        });
    };

    const isLandscape = width > height;
    const isTablet = width > 600;
    const padding = isTablet ? 32 : (isLandscape ? 24 : 16);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={lesson.color} />

            <ScrollView contentContainerStyle={[styles.content, { padding }]}>
                {/* Header con ícono y título */}
                <View style={[styles.header, { backgroundColor: lesson.color }]}>
                    <Text style={styles.icon}>{lesson.icon}</Text>
                    <Text style={styles.title}>{lesson.title}</Text>
                    <Text style={styles.subtitle}>{lesson.subtitle}</Text>
                </View>

                {/* Información de la lección */}
                <View style={styles.infoContainer}>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>⏱️ Duración</Text>
                        <Text style={styles.infoValue}>{lesson.duration}</Text>
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>📊 Nivel</Text>
                        <Text style={styles.infoValue}>{lesson.level}</Text>
                    </View>
                </View>

                {/* Descripción */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📖 Descripción</Text>
                    <Text style={styles.description}>{lesson.description}</Text>
                </View>

                {/* Temas que aprenderás */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>✨ Temas que aprenderás</Text>
                    {lesson.topics.map((topic, index) => (
                        <View key={index} style={styles.topicItem}>
                            <View style={[styles.topicBullet, { backgroundColor: lesson.color }]} />
                            <Text style={styles.topicText}>{topic}</Text>
                        </View>
                    ))}
                </View>

                {/* Información de navegación recibida */}
                <View style={styles.navInfo}>
                    <Text style={styles.navInfoText}>
                        📍 Navegaste desde: {previousScreen}
                    </Text>
                </View>

                {/* Botón de acción */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: lesson.color }]}
                    onPress={handleStartLesson}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>
                        {lesson.progress > 0 ? 'Continuar Lección' : 'Iniciar Lección'}
                    </Text>
                </TouchableOpacity>

                {lesson.progress > 0 && (
                    <View style={styles.progressInfo}>
                        <Text style={styles.progressText}>
                            Ya has completado el {lesson.progress}% de esta lección
                        </Text>
                    </View>
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
        padding: 32,
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5,
    },
    icon: {
        fontSize: 64,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.white,
        opacity: 0.9,
        textAlign: 'center',
    },
    infoContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    infoCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    infoLabel: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    section: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 16,
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
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: COLORS.textLight,
        lineHeight: 24,
    },
    topicItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    topicBullet: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 12,
    },
    topicText: {
        fontSize: 15,
        color: COLORS.text,
        flex: 1,
    },
    navInfo: {
        backgroundColor: COLORS.accent,
        padding: 12,
        borderRadius: 12,
        marginBottom: 24,
        opacity: 0.7,
    },
    navInfoText: {
        fontSize: 14,
        color: COLORS.white,
        textAlign: 'center',
        fontWeight: '600',
    },
    button: {
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 5,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    progressInfo: {
        marginTop: 16,
        padding: 12,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        alignItems: 'center',
    },
    progressText: {
        fontSize: 14,
        color: COLORS.textLight,
    },
});

export default DetailsScreen;
