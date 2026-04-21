import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Animated,
  Platform,
} from "react-native";
import { COLORS } from "../utils/colors";

const CompletedScreen = ({ route, navigation }) => {
  const { lesson } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const scaleAnim = new Animated.Value(0);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={Platform.OS !== "web"}
        refreshControl={
          Platform.OS === "web"
            ? undefined
            : <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View style={[styles.card, { backgroundColor: lesson.color + "20" }]}>
            <Text style={styles.icon}>🎉</Text>
            <Text style={styles.title}>¡Lección completada!</Text>
            <Text style={styles.subtitle}>
              Has terminado "{lesson.title}" con éxito. Sigue aprendiendo para
              dominar la Inteligencia Artificial.
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: lesson.color }]}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.buttonText}>Volver al inicio</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 5,
  },
  icon: { fontSize: 80, marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: COLORS.textLight,
    marginBottom: 30,
    lineHeight: 24,
  },
  button: { paddingVertical: 16, paddingHorizontal: 40, borderRadius: 14 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default CompletedScreen;