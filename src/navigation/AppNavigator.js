// navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, Platform, View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import LessonContentScreen from '../screens/RequirementFlowScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CompletedScreen from '../screens/CompletedScreen';
import ChatBot_Ayuda from '../screens/ChatBot_Ayuda';
import PWAScreen from '../screens/PWAScreen';
import LoginScreen from '../screens/LoginScreen';

import { COLORS } from '../utils/colors';

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
                headerTintColor: '#fff',
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Profile')}
                        style={{ marginRight: 15 }}
                    >
                        <Text style={{ color: 'white', fontSize: 18 }}>👤</Text>
                    </TouchableOpacity>
                ),
            })}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: '🎓 IA Learning' }}
            />
            <Stack.Screen
                name="Details"
                component={DetailsScreen}
                options={{ title: 'Detalles de la Lección' }}
            />
            <Stack.Screen
                name="LessonContent"
                component={LessonContentScreen}
                options={{ title: 'Contenido de la Lección' }}
            />
            <Stack.Screen
                name="Completed"
                component={CompletedScreen}
                options={{
                    title: 'Lección completada',
                    headerLeft: null,
                }}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Perfil' }}
            />
            <Stack.Screen
                name="ChatBot_Ayuda"
                component={ChatBot_Ayuda}
                options={{ title: 'Ayuda IA' }}
            />
            <Stack.Screen
                name="PWA"
                component={PWAScreen}
                options={{ title: 'Mi primera PWA' }}
            />
        </Stack.Navigator>
    );
};

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
    );
};

const AppNavigator = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.light }}>
                <ActivityIndicator size="large" color={COLORS.puertoTejadaRed} />
            </View>
        );
    }

    return user ? <AppStack /> : <AuthStack />;
};

export default AppNavigator;