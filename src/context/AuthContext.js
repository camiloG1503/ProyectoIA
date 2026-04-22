// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { loadAuthState, saveAuthState, clearAuthState } from '../utils/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStoredAuth = async () => {
            try {
                const storedUser = await loadAuthState();
                if (storedUser) {
                    setUser(storedUser);
                }
            } catch (error) {
                console.log('Error loading auth state:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadStoredAuth();
    }, []);

    const login = async (email, password) => {
        // Simulación de validación institucional
        if (!email || !password) {
            throw new Error('Todos los campos son obligatorios');
        }

        // Validar que termine en @fidelina.edu.co (sin restringir parte local)
        const emailLower = email.trim().toLowerCase();
        if (!emailLower.endsWith('@fidelina.edu.co')) {
            throw new Error('Debes usar tu correo institucional (@fidelina.edu.co)');
        }

        // Verificar que haya algo antes del @
        const localPart = emailLower.split('@')[0];
        if (localPart.length === 0) {
            throw new Error('Ingresa un nombre de usuario válido antes del @');
        }

        if (password.length < 4) {
            throw new Error('La contraseña debe tener al menos 4 caracteres');
        }

        // Simulación de credenciales correctas
        const userData = {
            email: emailLower,
            name: localPart.replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            role: 'Estudiante',
            institution: 'I.E. Fidelina Echeverry',
            location: 'Puerto Tejada, Cauca',
            loginTime: new Date().toISOString(),
        };

        await saveAuthState(userData);
        setUser(userData);
        return userData;
    };

    const logout = async () => {
        await clearAuthState();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};