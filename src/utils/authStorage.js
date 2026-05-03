// utils/authStorage.js
// Almacenamiento de autenticación — I.E. Fidelina Echeverry · Puerto Tejada, Cauca

import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./storageKeys";

const AUTH_KEY = STORAGE_KEYS.AUTH;

export const loadAuthState = async () => {
  try {
    const data = await AsyncStorage.getItem(AUTH_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.log("Error loading auth state:", error);
    return null;
  }
};

export const saveAuthState = async (user) => {
  try {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return true;
  } catch (error) {
    console.log("Error saving auth state:", error);
    return false;
  }
};

export const clearAuthState = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_KEY);
    return true;
  } catch (error) {
    console.log("Error clearing auth state:", error);
    return false;
  }
};
