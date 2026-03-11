import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { COLORS } from '../utils/colors';

const LessonCard = React.memo(({ lesson, onPress, isLandscape = false }) => {
    const { width } = useWindowDimensions();

    // Diseño responsivo basado en el ancho de pantalla
    const isSmallScreen = width < 375;
    const cardWidth = isLandscape ? '48%' : (width > 600 ? '48%' : '100%');

    return (
        <TouchableOpacity
            style={[styles.card, { width: cardWidth }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: lesson.color }]}>
                <Text style={styles.icon}>{lesson.icon}</Text>
            </View>

            <View style={styles.content}>
                <Text style={[styles.title, isSmallScreen && styles.titleSmall]}>
                    {lesson.title}
                </Text>
                <Text style={styles.subtitle}>{lesson.subtitle}</Text>

                <View style={styles.info}>
                    <View style={[styles.badge, { backgroundColor: COLORS.accent }]}>
                        <Text style={styles.badgeText}>{lesson.level}</Text>
                    </View>
                    <Text style={styles.duration}>⏱️ {lesson.duration}</Text>
                </View>

                {lesson.progress > 0 && (
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${lesson.progress}%`, backgroundColor: lesson.color }
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>{lesson.progress}%</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    icon: {
        fontSize: 32,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    titleSmall: {
        fontSize: 16,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 8,
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        color: COLORS.white,
        fontWeight: '600',
    },
    duration: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
    progressBar: {
        flex: 1,
        height: 6,
        backgroundColor: COLORS.light,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        color: COLORS.textLight,
        fontWeight: '600',
    },
});

export default LessonCard;
