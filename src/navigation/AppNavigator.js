// navigation/AppNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  TouchableOpacity,
  Text,
  Platform,
  View,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { ROUTE_NAMES } from "./routeNames";

import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import ModuleOverviewScreen from "../screens/ModuleOverviewScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CompletedScreen from "../screens/CompletedScreen";
import ChatBot_Ayuda from "../screens/ChatBot_Ayuda";
import PWAScreen from "../screens/PWAScreen";
import LoginScreen from "../screens/LoginScreen";
import ManualPdfScreen from "../screens/ManualPdfScreen";
import DiagnosticScreen from "../screens/DiagnosticScreen";
import MicroLessonsScreen from "../screens/MicroLessonsScreen";
import PromptPracticeScreen from "../screens/PromptPracticeScreen";
import ModulePdfScreen from "../screens/ModulePdfScreen";
import FinalCertificateScreen from "../screens/FinalCertificateScreen";

import { COLORS } from "../utils/colors";

const Stack = createStackNavigator();

const AppStack = () => {
  const headerColor = Platform.select({
    ios: COLORS.puertoTejadaRed,
    android: COLORS.primary,
    default: COLORS.primary,
  });

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: headerColor,
        },
        headerTintColor: "#fff",
        headerTitleStyle: { color: "#fff" },
        headerBackTitleVisible: false,
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTE_NAMES.PROFILE)}
            style={{ marginRight: 15 }}
          >
            <Text style={{ color: "white", fontSize: 18 }}>👤</Text>
          </TouchableOpacity>
        ),
      })}
    >
      <Stack.Screen
        name={ROUTE_NAMES.HOME}
        component={HomeScreen}
        options={{ title: "🎓 IA Learning" }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.DETAILS}
        component={DetailsScreen}
        options={{ title: "Detalles de la Lección" }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.LESSON_CONTENT}
        component={ModuleOverviewScreen}
        options={{ title: "Contenido del modulo" }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.MANUAL_PDF}
        component={ManualPdfScreen}
        options={{ title: "Manual del curso" }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.DIAGNOSTIC}
        component={DiagnosticScreen}
        options={{ title: "Diagnostico inicial" }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.MICRO_LESSONS}
        component={MicroLessonsScreen}
        options={{ title: "Microlecciones" }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.PROMPT_PRACTICE}
        component={PromptPracticeScreen}
        options={{ title: "Práctica de Prompts" }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.MODULE_PDF}
        component={ModulePdfScreen}
        options={{ title: "PDF del Módulo" }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.FINAL_CERTIFICATE}
        component={FinalCertificateScreen}
        options={{ title: "Certificado Final" }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.COMPLETED}
        component={CompletedScreen}
        options={{
          title: "Lección completada",
          headerLeft: null,
        }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.PROFILE}
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.CHATBOT_AYUDA}
        component={ChatBot_Ayuda}
        options={{ title: "Ayuda IA" }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.PWA}
        component={PWAScreen}
        options={{ title: "Mi primera PWA" }}
      />
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTE_NAMES.LOGIN} component={LoginScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.light,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.puertoTejadaRed} />
      </View>
    );
  }

  return user ? <AppStack /> : <AuthStack />;
};

export default AppNavigator;
