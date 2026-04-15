// screens/LessonContentScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
  Platform,
  Vibration,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { Accelerometer } from "expo-sensors";
import * as Clipboard from "expo-clipboard";
import { captureRef } from "react-native-view-shot";

import { COLORS } from "../utils/colors";
import { getRandomTip } from "../utils/iaTips";
import { saveLessonProgress } from "../utils/storage";

const LessonContentScreen = ({ route, navigation }) => {
  const { lesson } = route.params;

  const scrollViewRef = useRef(null);
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);
  const [tipModalVisible, setTipModalVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState("");
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const lastShake = useRef(Date.now());
  const [isShakeEnabled, setIsShakeEnabled] = useState(true);
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  const SHAKE_THRESHOLD = 1.5;
  const SHAKE_COOLDOWN = 2000;

  const handleFinishLesson = async () => {
    try {
      await saveLessonProgress(lesson.id);
      navigation.navigate("Completed", { lesson });
    } catch (error) {
      console.log("Error finishing lesson:", error);
    }
  };

  const takeScreenshot = async () => {
    if (!scrollViewRef.current) {
      Alert.alert("Error", "No se pudo capturar la pantalla.");
      return;
    }

    try {
      if (!mediaPermission?.granted) {
        const { granted } = await requestMediaPermission();
        if (!granted) {
          // Alerta adaptada por plataforma
          if (Platform.OS === "android") {
            Alert.alert("Permiso denegado", "La app necesita acceso a la galería para guardar tu progreso.");
          } else {
            Alert.alert("Permiso denegado", "Necesitamos acceso a la galería para guardar la captura de pantalla.");
          }
          return;
        }
      }

      const uri = await captureRef(scrollViewRef.current, {
        format: "jpg",
        quality: 0.9,
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      
      // Mensaje de éxito adaptado
      if (Platform.OS === "android") {
        Alert.alert("✅ ¡LISTO!", "Captura guardada en galería.");
      } else {
        Alert.alert("✅ Progreso documentado", "La captura de esta lección se ha guardado en tu galería.");
      }
    } catch (error) {
      console.error("Error al capturar:", error);
      Alert.alert("Error", "No se pudo guardar la captura. Intenta de nuevo.");
    }
  };

  const subscribeAccelerometer = () => {
    setSubscription(
      Accelerometer.addListener((data) => {
        setAccelerometerData(data);
        detectShake(data);
      })
    );
    Accelerometer.setUpdateInterval(100);
  };

  const unsubscribeAccelerometer = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const detectShake = ({ x, y, z }) => {
    const now = Date.now();
    const magnitude = Math.sqrt(x * x + y * y + z * z);

    if (magnitude > SHAKE_THRESHOLD && (now - lastShake.current) > SHAKE_COOLDOWN && isShakeEnabled) {
      lastShake.current = now;

      if (Platform.OS !== "web") {
        Vibration.vibrate(50);
      }

      const tip = getRandomTip(lesson.id);
      setCurrentTip(tip);
      setTipModalVisible(true);

      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(shakeAnimation, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();

      setIsShakeEnabled(false);
      setTimeout(() => setIsShakeEnabled(true), SHAKE_COOLDOWN);
    }
  };

  const copyTipToClipboard = async () => {
    await Clipboard.setStringAsync(currentTip);
    if (Platform.OS === "android") {
      Alert.alert("📋 CONSEJO COPIADO", "Pégalo en ChatGPT o donde quieras.");
    } else {
      Alert.alert("📋 Consejo copiado", "Pégalo en tu IA favorita o compártelo.");
    }
  };

  useEffect(() => {
    subscribeAccelerometer();
    return () => unsubscribeAccelerometer();
  }, []);

  // Estilos dinámicos según plataforma para botones
  const screenshotButtonStyle = {
    ...styles.screenshotButtonBase,
    ...Platform.select({
      ios: {
        backgroundColor: lesson.color,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        backgroundColor: "#FF8C00", // Color vibrante Android como en DetailsScreen
        elevation: 8,
        paddingVertical: 18,
        borderRadius: 30,
      },
    }),
  };

  const screenshotButtonTextStyle = {
    ...styles.screenshotButtonTextBase,
    ...Platform.select({
      android: {
        textTransform: "uppercase",
        fontSize: 16,
        fontWeight: "bold",
      },
      ios: {
        fontSize: 16,
        fontWeight: "600",
      },
    }),
  };

  const finishButtonStyle = {
    ...styles.finishButtonBase,
    ...Platform.select({
      ios: {
        backgroundColor: lesson.color,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        backgroundColor: "#FF8C00",
        elevation: 8,
        paddingVertical: 18,
        borderRadius: 30,
      },
    }),
  };

  const finishButtonTextStyle = {
    ...styles.finishButtonTextBase,
    ...Platform.select({
      android: {
        textTransform: "uppercase",
        fontSize: 16,
        fontWeight: "bold",
      },
      ios: {
        fontSize: 16,
        fontWeight: "600",
      },
    }),
  };

  const renderTipModal = () => (
    <Modal
      transparent
      visible={tipModalVisible}
      animationType="fade"
      onRequestClose={() => setTipModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.tipCard,
            {
              transform: [
                {
                  scale: shakeAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.tipHeader}>
            <MaterialIcons name="lightbulb" size={28} color={COLORS.warning} />
            <Text style={styles.tipHeaderText}>Consejo de IA</Text>
          </View>
          <Text style={styles.tipText}>{currentTip}</Text>
          <View style={styles.tipActions}>
            <TouchableOpacity
              style={[styles.tipButton, { backgroundColor: COLORS.primary }]}
              onPress={copyTipToClipboard}
            >
              <MaterialIcons name="content-copy" size={20} color="#fff" />
              <Text style={styles.tipButtonText}>Copiar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tipButton, { backgroundColor: COLORS.textLight }]}
              onPress={() => setTipModalVisible(false)}
            >
              <MaterialIcons name="close" size={20} color="#fff" />
              <Text style={styles.tipButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {lesson.icon} {lesson.title}
          </Text>
          <Text style={styles.subtitle}>{lesson.subtitle}</Text>

          <View style={styles.interactiveBanner}>
            <MaterialIcons name="shake" size={24} color="#fff" />
            <Text style={styles.bannerText}>Agita el teléfono para un consejo IA</Text>
          </View>
        </View>

        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <MaterialIcons name="sensors" size={20} color={COLORS.vibrantPurple} />
            <Text style={styles.sensorTitle}>Acelerómetro en tiempo real</Text>
          </View>
          <View style={styles.sensorValues}>
            <View style={styles.axisContainer}>
              <Text style={[styles.axisLabel, { color: "#EF4444" }]}>X</Text>
              <Text style={styles.axisValue}>{accelerometerData.x.toFixed(3)}</Text>
            </View>
            <View style={styles.axisContainer}>
              <Text style={[styles.axisLabel, { color: "#10B981" }]}>Y</Text>
              <Text style={styles.axisValue}>{accelerometerData.y.toFixed(3)}</Text>
            </View>
            <View style={styles.axisContainer}>
              <Text style={[styles.axisLabel, { color: "#3B82F6" }]}>Z</Text>
              <Text style={styles.axisValue}>{accelerometerData.z.toFixed(3)}</Text>
            </View>
          </View>
          <Text style={styles.sensorHint}>
            Mueve tu dispositivo para ver cómo cambian los valores
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introducción</Text>
          <Text style={styles.text}>
            La Inteligencia Artificial (IA) es una rama de la informática que
            busca crear sistemas capaces de realizar tareas que normalmente
            requieren inteligencia humana, como aprender, analizar información y
            tomar decisiones.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conceptos clave</Text>
          {lesson.topics.map((topic, index) => (
            <View key={index} style={styles.topicItem}>
              <Text style={styles.topicBullet}>•</Text>
              <Text style={styles.topicText}>{topic}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aplicación en el mundo real</Text>
          <Text style={styles.text}>
            Hoy en día la IA se utiliza en muchas áreas como la medicina,
            educación, transporte, comercio electrónico y automatización de
            procesos.
          </Text>
        </View>

        <TouchableOpacity style={screenshotButtonStyle} onPress={takeScreenshot}>
          <MaterialIcons name="photo-camera" size={24} color="#fff" />
          <Text style={screenshotButtonTextStyle}>
            {Platform.OS === "android" ? "CAPTURAR PANTALLA" : "Capturar pantalla de lección"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={finishButtonStyle} onPress={handleFinishLesson}>
          <Text style={finishButtonTextStyle}>
            {Platform.OS === "android" ? "FINALIZAR LECCIÓN" : "Finalizar lección"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {renderTipModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },
  content: { padding: 20, paddingBottom: 40 },

  header: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 20,
  },

  interactiveBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.vibrantPurple,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 40,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.vibrantPurple,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  bannerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  sensorCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sensorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sensorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: 8,
  },
  sensorValues: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  axisContainer: {
    alignItems: "center",
  },
  axisLabel: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  axisValue: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    fontVariant: ["tabular-nums"],
  },
  sensorHint: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.textLight,
    fontStyle: "italic",
  },

  section: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.primary,
  },
  text: { fontSize: 15, lineHeight: 22, color: COLORS.textLight },
  topicItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  topicBullet: { fontSize: 20, marginRight: 8, color: COLORS.vibrantPurple },
  topicText: { fontSize: 15, color: COLORS.text },

  screenshotButtonBase: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 40,
    marginTop: 10,
    marginBottom: 15,
  },
  screenshotButtonTextBase: {
    color: "#fff",
    marginLeft: 8,
  },

  finishButtonBase: {
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  finishButtonTextBase: {
    color: "#fff",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  tipCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  tipHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginLeft: 10,
  },
  tipText: {
    fontSize: 18,
    lineHeight: 28,
    color: COLORS.text,
    marginBottom: 24,
  },
  tipActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  tipButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    gap: 6,
  },
  tipButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default LessonContentScreen;