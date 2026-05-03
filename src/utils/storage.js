// utils/storage.js
// Proxy de almacenamiento — re-exporta funcionalidades de módulos específicos
// Mantiene compatibilidad hacia atrás — I.E. Fidelina Echeverry · Puerto Tejada, Cauca

// Re-exportar funciones de progreso
export {
  loadProgress,
  saveLessonProgress,
  resetProgress,
} from "./progressStorage";

// Re-exportar funciones de autenticación
export { loadAuthState, saveAuthState, clearAuthState } from "./authStorage";

// Re-exportar claves
export { STORAGE_KEYS } from "./storageKeys";
