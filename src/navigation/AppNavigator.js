import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS } from '../utils/colors';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerStyle: {
                    backgroundColor: COLORS.primary,
                },
                headerTintColor: COLORS.white,
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 18,
                },
                headerShadowVisible: true,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: '🎓 IA Estratégica',
                    headerStyle: {
                        backgroundColor: COLORS.darkBg,
                    },
                }}
            />

            <Stack.Screen
                name="Details"
                component={DetailsScreen}
                options={({ route }) => ({
                    title: route.params?.lesson?.title || 'Detalles',
                    headerStyle: {
                        backgroundColor: route.params?.lesson?.color || COLORS.primary,
                    },
                })}
            />

            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: '👤 Mi Perfil',
                    headerStyle: {
                        backgroundColor: COLORS.primary,
                    },
                }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
