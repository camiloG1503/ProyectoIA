// utils/progressStorage.js
// Almacenamiento de progreso de lecciones — I.E. Fidelina Echeverry · Puerto Tejada, Cauca

import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./storageKeys";

const PROGRESS_KEY = STORAGE_KEYS.PROGRESS;

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
    console.log("Error loading progress:", error);

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
    console.log("Error saving progress:", error);

    return { completedLessons: [] };
  }
};

export const resetProgress = async () => {
  try {
    await AsyncStorage.removeItem(PROGRESS_KEY);

    return true;
  } catch (error) {
    console.log("Error resetting progress:", error);

    return false;
  }
};

export const isLessonUnlocked = (lessonId, completedLessons) => {
  if (lessonId === 1) return true;
  if (!Array.isArray(completedLessons)) return false;
  return completedLessons.includes(lessonId - 1);
};
