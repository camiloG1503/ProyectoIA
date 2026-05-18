// screens/LocalChallengeScreen.js
// Desafío local destacado — IA Learning

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, RADIUS } from "../utils/colors";
import { saveLessonInternalProgress } from "../utils/lessonInternalProgressStorage";

const LocalChallengeScreen = ({ route, navigation }) => {
  const { lesson } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const [text, setText] = useState("");
  const prompt =
    lesson?.localChallenge?.problem ||
    "Propón una idea usando IA para mejorar algo en tu comunidad.";

  const handleSave = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      Alert.alert("Falta tu idea", "Escribe tu idea antes de guardar.");
      return;
    }

    const key = `lesson_local_challenge_${lesson.id}`;
    const payload = { text: trimmed, savedAtISO: new Date().toISOString() };
    await AsyncStorage.setItem(key, JSON.stringify(payload));
    await saveLessonInternalProgress(lesson.id, { localChallengeSaved: true });

    Alert.alert("Guardado", "Tu idea se guardó correctamente.");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={[styles.content, { maxWidth: isTablet ? 720 : undefined }]}>
        <Text style={styles.title}>🌎 Desafío Puerto Tejada</Text>
        <Text style={styles.question}>{prompt}</Text>

        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Escribe tu idea aquí..."
          placeholderTextColor="#9CA3AF"
          multiline
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Guardar mi idea</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light, alignItems: "center" },
  content: { width: "100%", padding: 20, gap: 12 },
  title: { fontSize: 20, fontWeight: "900", color: COLORS.puertoTejadaRed },
  question: { fontSize: 14, lineHeight: 20, color: COLORS.text },
  input: {
    minHeight: 180,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 14,
    backgroundColor: "#fff",
    textAlignVertical: "top",
    color: COLORS.text,
  },
  saveBtn: {
    backgroundColor: COLORS.puertoTejadaGreen,
    borderRadius: RADIUS.lg,
    minHeight: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "900", fontSize: 16 },
});

export default LocalChallengeScreen;

