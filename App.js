import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  useEffect(() => {
    // Inyectar estilos globales para scroll en web - SOLO EN WEB
    if (Platform.OS === "web") {
      try {
        const style = document.createElement("style");
        style.textContent = `
          html, body, #root {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
            overflow-y: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior-y: none;
          }
        `;
        document.head.appendChild(style);
      } catch (error) {
        console.error("Error injecting web styles:", error);
      }
    }
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <AppNavigator />
    </NavigationContainer>
  );
}