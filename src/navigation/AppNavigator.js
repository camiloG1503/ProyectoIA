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
import LessonContentScreen from "../screens/RequirementFlowScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CompletedScreen from "../screens/CompletedScreen";
import ChatBot_Ayuda from "../screens/ChatBot_Ayuda";
import PWAScreen from "../screens/PWAScreen";
import LoginScreen from "../screens/LoginScreen";

import { COLORS } from "../utils/colors";

const Stack = createStackNavigator();

const AppStack = () => {
  const headerColor = Platform.select({
    ios: COLORS.puertoTejadaRed,
    android: COLORS.primary,
  });

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: headerColor,
        },
        headerTintColor: "#fff",
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
        component={LessonContentScreen}
        options={{ title: "Contenido de la Lección" }}
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
