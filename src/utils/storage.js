// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = 'ai_learning_progress';
const AUTH_KEY = 'ai_learning_auth';

export const loadProgress = async () => {
    try {
        const data = await AsyncStorage.getItem(PROGRESS_KEY);

        if (data) {
            const parsed = JSON.parse(data);

            return {
                completedLessons: Array.isArray(parsed.completedLessons)
                    ? parsed.completedLessons
                    : [],
            };
        }

        return { completedLessons: [] };
    } catch (error) {
        console.log('Error loading progress:', error);

        return { completedLessons: [] };
    }
};

export const saveLessonProgress = async (lessonId) => {
    try {
        const stored = await loadProgress();

        const completed = [...stored.completedLessons];

        if (!completed.includes(lessonId)) {
            completed.push(lessonId);
        }

        const newData = {
            completedLessons: completed,
        };

        await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(newData));

        return newData;
    } catch (error) {
        console.log('Error saving progress:', error);

        return { completedLessons: [] };
    }
};

export const resetProgress = async () => {
    try {
        await AsyncStorage.removeItem(PROGRESS_KEY);

        return true;
    } catch (error) {
        console.log('Error resetting progress:', error);

        return false;
    }
};

// ---------- NUEVAS FUNCIONES DE AUTENTICACIÓN ----------
export const loadAuthState = async () => {
    try {
        const data = await AsyncStorage.getItem(AUTH_KEY);
        if (data) {
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        console.log('Error loading auth state:', error);
        return null;
    }
};

export const saveAuthState = async (user) => {
    try {
        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
        return true;
    } catch (error) {
        console.log('Error saving auth state:', error);
        return false;
    }
};

export const clearAuthState = async () => {
    try {
        await AsyncStorage.removeItem(AUTH_KEY);
        return true;
    } catch (error) {
        console.log('Error clearing auth state:', error);
        return false;
    }
};