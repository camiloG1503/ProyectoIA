// App.js
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  useEffect(() => {
    // Filtrar warning de InteractionManager que proviene de dependencias
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("InteractionManager has been deprecated")
      ) {
        return;
      }

      originalWarn(...args);
    };

    LogBox.ignoreLogs([
      "InteractionManager has been deprecated and will be removed in a future release.",
    ]);

    // Inyectar estilos globales para scroll en web - SOLO EN WEB
    if (Platform.OS === "web") {
      try {
        const style = document.createElement("style");
        style.textContent = `
          html, body {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
            overflow-y: scroll;
            overflow-x: hidden;
            scrollbar-gutter: stable;
            overscroll-behavior-y: none;
          }

          #root {
            min-height: 100%;
            width: 100%;
          }
        `;
        document.head.appendChild(style);
      } catch (error) {
        console.error("Error injecting web styles:", error);
      }
    }
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
