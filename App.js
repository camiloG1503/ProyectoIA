import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar, Platform } from "react-native";
import { View, StyleSheet } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  useEffect(() => {
    // Inyectar estilos globales para scroll en web
    if (Platform.OS === "web") {
      const style = document.createElement("style");
      style.textContent = `
        html, body {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        
        #root {
          height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }
        
        /* ScrollView en web */
        [class*="ScrollView"] {
          overflow-y: auto !important;
          overflow-x: hidden !important;
          -webkit-overflow-scrolling: touch;
        }
        
        /* SafeAreaView */
        [class*="SafeAreaView"] {
          display: flex;
          flex: 1;
          flex-direction: column;
          width: 100%;
          height: 100%;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <AppNavigator />
    </NavigationContainer>
  );
}