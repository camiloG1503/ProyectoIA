// utils/lessonInternalProgressStorage.js
// Progreso interno por módulo (checklist) — IA Learning

import AsyncStorage from "@react-native-async-storage/async-storage";

const buildKey = (lessonId) => `lesson_internal_progress_${lessonId}`;

const DEFAULTS = {
  readingCompleted: false,
  pdfCompleted: false,
  videoCompleted: false,
  exerciseCompleted: false,
  localChallengeSaved: false,
};

export const loadLessonInternalProgress = async (lessonId) => {
  try {
    const raw = await AsyncStorage.getItem(buildKey(lessonId));
    if (!raw) return { ...DEFAULTS };

    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...(parsed || {}) };
  } catch (error) {
    console.log("Error loading lesson internal progress:", error);
    return { ...DEFAULTS };
  }
};

export const saveLessonInternalProgress = async (lessonId, partial) => {
  try {
    const current = await loadLessonInternalProgress(lessonId);
    const merged = { ...current, ...(partial || {}) };
    await AsyncStorage.setItem(buildKey(lessonId), JSON.stringify(merged));
    return merged;
  } catch (error) {
    console.log("Error saving lesson internal progress:", error);
    return { ...DEFAULTS };
  }
};

