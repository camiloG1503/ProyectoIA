import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, Text } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import LessonContentScreen from "../screens/LessonContentScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CompletedScreen from "../screens/CompletedScreen";

import { COLORS } from "../utils/colors";

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={({ navigation }) => ({
                headerStyle: {
                    backgroundColor: COLORS.primary,
                },

                headerTintColor: "#fff",

                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Profile")}
                        style={{ marginRight: 15 }}
                    >
                        <Text style={{ color: "white", fontSize: 18 }}>👤</Text>
                    </TouchableOpacity>
                ),
            })}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "🎓 IA Learning" }}
            />

            <Stack.Screen
                name="Details"
                component={DetailsScreen}
                options={{ title: "Detalles de la Lección" }}
            />

            <Stack.Screen
                name="LessonContent"
                component={LessonContentScreen}
                options={{ title: "Contenido de la Lección" }}
            />

            <Stack.Screen
                name="Completed"
                component={CompletedScreen}
                options={{
                    title: "Lección completada",
                    headerLeft: null,
                }}
            />

            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: "Perfil" }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;