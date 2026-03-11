import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
    StatusBar,
    useWindowDimensions
} from 'react-native';
import LessonCard from '../components/LessonCard';
import ProgressBar from '../components/ProgressBar';
import { lessonsData } from '../utils/lessonsData';
import { COLORS } from '../utils/colors';

const HomeScreen = ({ navigation }) => {
    const [lessons] = useState(lessonsData);
    const { width, height } = useWindowDimensions();

    // Detectar orientación
    const isLandscape = width > height;
    const numColumns = isLandscape ? 2 : 1;

    // Calcular progreso
    const completedLessons = lessons.filter(lesson => lesson.progress === 100).length;

    // useCallback para optimización de rendimiento
    const handleLessonPress = useCallback((lesson) => {
        // Enviar datos a Details usando route params
        navigation.navigate('Details', {
            lesson: lesson,
            previousScreen: 'Home'
        });
    }, [navigation]);

    // renderItem optimizado con useCallback
    const renderItem = useCallback(({ item }) => (
        <LessonCard
            lesson={item}
            onPress={() => handleLessonPress(item)}
            isLandscape={isLandscape}
        />
    ), [handleLessonPress, isLandscape]);

    // keyExtractor correcto para FlatList
    const keyExtractor = useCallback((item) => item.id, []);

    // Header del FlatList
    const ListHeaderComponent = useCallback(() => (
        <View style={styles.header}>
            <Text style={styles.title}>Aprende IA Estratégicamente</Text>
            <Text style={styles.subtitle}>
                No copies, ¡crea! Descubre cómo usar la IA como aliado creativo y productivo
            </Text>

            <View style={styles.progressSection}>
                <ProgressBar
                    current={completedLessons}
                    total={lessons.length}
                    color={COLORS.vibrantPurple}
                />
            </View>

            <Text style={styles.sectionTitle}>🎯 Tus Lecciones</Text>
        </View>
    ), [completedLessons, lessons.length]);

    const isTablet = width > 600;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBg} />

            <FlatList
                key={numColumns}
                data={lessons}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                ListHeaderComponent={ListHeaderComponent}
                numColumns={numColumns}
                contentContainerStyle={[
                    styles.listContent,
                    isTablet && styles.listContentTablet
                ]}
                columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
                // Optimizaciones de FlatList
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={50}
                initialNumToRender={8}
                windowSize={10}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },
    listContent: {
        padding: 16,
    },
    listContentTablet: {
        paddingHorizontal: 32,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        gap: 12,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        marginBottom: 24,
        lineHeight: 22,
    },
    progressSection: {
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 16,
    },
});

export default HomeScreen;
