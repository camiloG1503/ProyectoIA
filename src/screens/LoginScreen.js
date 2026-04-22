// screens/LoginScreen.js
// Rediseño visual — I.E. Fidelina Echeverry · Puerto Tejada, Cauca

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, PUERTO_TEJADA, RADIUS, SPACING } from '../utils/colors';
import { useAuth } from '../context/AuthContext';

// ─── Franja tricolor ──────────────────────────────────────────────────────────
const TricolorStripe = ({ height = 5 }) => (
    <View style={{ flexDirection: 'row', height }}>
        <View style={{ flex: 1, backgroundColor: COLORS.puertoTejadaRed }} />
        <View style={{ flex: 1, backgroundColor: COLORS.puertoTejadaWhite }} />
        <View style={{ flex: 1, backgroundColor: COLORS.puertoTejadaGreen }} />
    </View>
);

// ─── Campo de entrada ─────────────────────────────────────────────────────────
const InputField = ({
    icon,
    placeholder,
    value,
    onChangeText,
    keyboardType,
    secureTextEntry,
    editable = true,
    rightElement,
    hint,
}) => {
    const [focused, setFocused] = useState(false);

    return (
        <View style={inputStyles.wrapper}>
            <View
                style={[
                    inputStyles.container,
                    focused && inputStyles.containerFocused,
                    !editable && inputStyles.containerDisabled,
                ]}
            >
                <MaterialIcons
                    name={icon}
                    size={20}
                    color={focused ? COLORS.puertoTejadaRed : COLORS.textLight}
                    style={inputStyles.icon}
                />
                <TextInput
                    style={inputStyles.input}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.textDisabled}
                    value={value}
                    onChangeText={onChangeText}
                    autoCapitalize="none"
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    editable={editable}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
                {rightElement}
            </View>
            {hint ? <Text style={inputStyles.hint}>{hint}</Text> : null}
        </View>
    );
};

const inputStyles = StyleSheet.create({
    wrapper: {
        marginBottom: SPACING.md,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surfaceAlt,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        height: 56,
        borderWidth: 1.5,
        borderColor: COLORS.border,
    },
    containerFocused: {
        borderColor: COLORS.puertoTejadaRed,
        backgroundColor: '#FFF8F8',
        ...Platform.select({
            ios: {
                shadowColor: COLORS.puertoTejadaRed,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
            },
            android: { elevation: 2 },
        }),
    },
    containerDisabled: {
        opacity: 0.6,
    },
    icon: {
        marginRight: SPACING.sm,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: COLORS.text,
        paddingVertical: 0,
    },
    hint: {
        fontSize: 11,
        color: COLORS.textLight,
        marginTop: 5,
        marginLeft: SPACING.sm,
    },
});

// ─── Componente principal ─────────────────────────────────────────────────────
const LoginScreen = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Animaciones de entrada
    const fadeAnim   = useRef(new Animated.Value(0)).current;
    const slideAnim  = useRef(new Animated.Value(40)).current;
    const scaleAnim  = useRef(new Animated.Value(0.92)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 55,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 55,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Campos requeridos', 'Por favor ingresa tu correo institucional y contraseña.');
            return;
        }
        setIsLoading(true);
        try {
            await login(email.trim(), password.trim());
        } catch (error) {
            Alert.alert('Error de acceso', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Fondo decorativo superior */}
            <View style={styles.bgDecor}>
                <View style={styles.bgCircle1} />
                <View style={styles.bgCircle2} />
                <View style={styles.bgCircle3} />
            </View>

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Animated.View
                        style={[
                            styles.content,
                            {
                                opacity: fadeAnim,
                                transform: [
                                    { translateY: slideAnim },
                                    { scale: scaleAnim },
                                ],
                            },
                        ]}
                    >
                        {/* ═══════════════════════════════════════════════════
                            CABECERA INSTITUCIONAL
                        ═══════════════════════════════════════════════════ */}
                        <View style={styles.header}>
                            {/* Franja tricolor superior */}
                            <View style={styles.headerStripeContainer}>
                                <TricolorStripe height={6} />
                            </View>

                            {/* Logo / escudo */}
                            <View style={styles.logoContainer}>
                                <View style={styles.logoOuter}>
                                    <View style={styles.logoInner}>
                                        <MaterialIcons
                                            name="school"
                                            size={40}
                                            color={COLORS.puertoTejadaRed}
                                        />
                                    </View>
                                </View>
                                {/* Anillo decorativo */}
                                <View style={styles.logoRing} />
                            </View>

                            <Text style={styles.institutionName}>
                                {PUERTO_TEJADA.institucion}
                            </Text>
                            <View style={styles.locationChip}>
                                <MaterialIcons name="place" size={12} color={COLORS.puertoTejadaGreen} />
                                <Text style={styles.locationText}>
                                    {PUERTO_TEJADA.nombre}, {PUERTO_TEJADA.departamento}
                                </Text>
                            </View>
                            <Text style={styles.lemaText}>"{PUERTO_TEJADA.lema}"</Text>
                        </View>

                        {/* ═══════════════════════════════════════════════════
                            TARJETA DE LOGIN
                        ═══════════════════════════════════════════════════ */}
                        <View style={styles.card}>
                            {/* Encabezado de la tarjeta */}
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Bienvenido, estudiante</Text>
                                <Text style={styles.cardSubtitle}>
                                    Ingresa con tu correo institucional para acceder al curso de IA
                                </Text>
                            </View>

                            {/* Divider */}
                            <View style={styles.cardDivider} />

                            {/* Campos */}
                            <InputField
                                icon="email"
                                placeholder="Correo institucional"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                editable={!isLoading}
                                hint="Ejemplo: juanperez@fidelina.edu.co"
                            />

                            <InputField
                                icon="lock"
                                placeholder="Contraseña"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                editable={!isLoading}
                                rightElement={
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                        style={styles.eyeButton}
                                    >
                                        <MaterialIcons
                                            name={showPassword ? 'visibility-off' : 'visibility'}
                                            size={20}
                                            color={COLORS.textLight}
                                        />
                                    </TouchableOpacity>
                                }
                            />

                            {/* Botón de login */}
                            <TouchableOpacity
                                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                                onPress={handleLogin}
                                disabled={isLoading}
                                activeOpacity={0.85}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <View style={styles.loginButtonContent}>
                                        <MaterialIcons name="login" size={20} color="#fff" />
                                        <Text style={styles.loginButtonText}>Ingresar al curso</Text>
                                    </View>
                                )}
                            </TouchableOpacity>

                            {/* Info de ayuda */}
                            <View style={styles.helpBox}>
                                <MaterialIcons name="info-outline" size={14} color={COLORS.textLight} />
                                <View style={styles.helpTextContainer}>
                                    <Text style={styles.helpText}>
                                        ¿Primera vez? Usa cualquier contraseña (mínimo 4 caracteres).
                                    </Text>
                                    <Text style={styles.helpText}>
                                        Entorno simulado con fines educativos.
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* ═══════════════════════════════════════════════════
                            FOOTER
                        ═══════════════════════════════════════════════════ */}
                        <View style={styles.footer}>
                            <Text style={styles.footerBrand}>🌱 ProyectIA</Text>
                            <Text style={styles.footerTagline}>
                                Educación de calidad para el futuro del Cauca
                            </Text>
                            <View style={styles.footerStripe}>
                                <TricolorStripe height={3} />
                            </View>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },

    // ─── Fondo decorativo ────────────────────────────────────────────────────
    bgDecor: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 340,
        overflow: 'hidden',
    },
    bgCircle1: {
        position: 'absolute',
        top: -80,
        right: -60,
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: COLORS.puertoTejadaRed,
        opacity: 0.08,
    },
    bgCircle2: {
        position: 'absolute',
        top: -40,
        left: -80,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: COLORS.puertoTejadaGreen,
        opacity: 0.07,
    },
    bgCircle3: {
        position: 'absolute',
        top: 160,
        right: 30,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.puertoTejadaRed,
        opacity: 0.05,
    },

    // ─── Layout ──────────────────────────────────────────────────────────────
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: SPACING.xl,
        paddingHorizontal: SPACING.md,
    },
    content: {
        flex: 1,
    },

    // ─── Header institucional ─────────────────────────────────────────────────
    header: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    headerStripeContainer: {
        width: 200,
        borderRadius: RADIUS.pill,
        overflow: 'hidden',
        marginBottom: SPACING.lg,
    },

    // Logo
    logoContainer: {
        position: 'relative',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    logoOuter: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: COLORS.puertoTejadaRed,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            android: { elevation: 6 },
        }),
    },
    logoInner: {
        width: 74,
        height: 74,
        borderRadius: 37,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoRing: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: COLORS.puertoTejadaRed,
        borderStyle: 'dashed',
        opacity: 0.25,
    },

    // Textos header
    institutionName: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.puertoTejadaRed,
        textAlign: 'center',
        letterSpacing: -0.5,
        marginBottom: SPACING.xs,
    },
    locationChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.successLight,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: RADIUS.pill,
        marginBottom: SPACING.sm,
    },
    locationText: {
        fontSize: 12,
        color: COLORS.puertoTejadaGreen,
        fontWeight: '600',
    },
    lemaText: {
        fontSize: 13,
        fontStyle: 'italic',
        color: COLORS.textLight,
        textAlign: 'center',
        paddingHorizontal: SPACING.lg,
        lineHeight: 18,
    },

    // ─── Tarjeta ──────────────────────────────────────────────────────────────
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xxl,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.10,
                shadowRadius: 20,
            },
            android: { elevation: 8 },
        }),
    },
    cardHeader: {
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    cardSubtitle: {
        fontSize: 13,
        color: COLORS.textLight,
        textAlign: 'center',
        lineHeight: 19,
        paddingHorizontal: SPACING.sm,
    },
    cardDivider: {
        height: 1,
        backgroundColor: COLORS.divider,
        marginBottom: SPACING.lg,
    },

    // ─── Botón principal ──────────────────────────────────────────────────────
    loginButton: {
        backgroundColor: COLORS.puertoTejadaRed,
        borderRadius: RADIUS.md,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.sm,
        marginBottom: SPACING.md,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.puertoTejadaRed,
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.38,
                shadowRadius: 10,
            },
            android: { elevation: 6 },
        }),
    },
    loginButtonDisabled: {
        backgroundColor: COLORS.textDisabled,
        ...Platform.select({
            ios: { shadowOpacity: 0 },
            android: { elevation: 0 },
        }),
    },
    loginButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.2,
    },

    // ─── Eye button ───────────────────────────────────────────────────────────
    eyeButton: {
        padding: 4,
    },

    // ─── Caja de ayuda ────────────────────────────────────────────────────────
    helpBox: {
        flexDirection: 'row',
        gap: SPACING.sm,
        backgroundColor: COLORS.surfaceAlt,
        borderRadius: RADIUS.md,
        padding: SPACING.sm,
        alignItems: 'flex-start',
    },
    helpTextContainer: {
        flex: 1,
    },
    helpText: {
        fontSize: 12,
        color: COLORS.textLight,
        lineHeight: 18,
    },

    // ─── Footer ───────────────────────────────────────────────────────────────
    footer: {
        alignItems: 'center',
        gap: SPACING.xs,
    },
    footerBrand: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.puertoTejadaGreen,
    },
    footerTagline: {
        fontSize: 12,
        color: COLORS.textLight,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    footerStripe: {
        width: 120,
        borderRadius: RADIUS.pill,
        overflow: 'hidden',
    },
});

export default LoginScreen;