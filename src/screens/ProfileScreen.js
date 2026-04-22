// screens/ProfileScreen.js
// Rediseño visual — I.E. Fidelina Echeverry · Puerto Tejada, Cauca

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Platform,
    Alert,
    Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { loadProgress, resetProgress } from '../utils/storage';
import { lessonsData } from '../utils/lessonsData';
import { COLORS, PUERTO_TEJADA, RADIUS, SPACING } from '../utils/colors';
import ProgressBar from '../components/ProgressBar';
import { useAuth } from '../context/AuthContext';

// ─── Franja tricolor ──────────────────────────────────────────────────────────
const TricolorStripe = ({ height = 5 }) => (
    <View style={{ flexDirection: 'row', height }}>
        <View style={{ flex: 1, backgroundColor: COLORS.puertoTejadaRed }} />
        <View style={{ flex: 1, backgroundColor: COLORS.puertoTejadaWhite }} />
        <View style={{ flex: 1, backgroundColor: COLORS.puertoTejadaGreen }} />
    </View>
);

// ─── Tarjeta de estadística ───────────────────────────────────────────────────
const StatCard = ({ icon, value, label, color }) => (
    <View style={[statStyles.card, { borderTopColor: color }]}>
        <View style={[statStyles.iconContainer, { backgroundColor: color + '18' }]}>
            <MaterialIcons name={icon} size={20} color={color} />
        </View>
        <Text style={[statStyles.value, { color }]}>{value}</Text>
        <Text style={statStyles.label}>{label}</Text>
    </View>
);

const statStyles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        alignItems: 'center',
        borderTopWidth: 3,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.07,
                shadowRadius: 8,
            },
            android: { elevation: 3 },
        }),
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    value: {
        fontSize: 26,
        fontWeight: '800',
        letterSpacing: -0.5,
        marginBottom: 2,
    },
    label: {
        fontSize: 10,
        color: COLORS.textLight,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 13,
    },
});

// ─── Fila de info del perfil ──────────────────────────────────────────────────
const InfoRow = ({ icon, label, value, iconColor }) => (
    <View style={infoStyles.row}>
        <View style={[infoStyles.iconWrap, { backgroundColor: (iconColor || COLORS.puertoTejadaRed) + '15' }]}>
            <MaterialIcons name={icon} size={16} color={iconColor || COLORS.puertoTejadaRed} />
        </View>
        <View style={infoStyles.textWrap}>
            <Text style={infoStyles.label}>{label}</Text>
            <Text style={infoStyles.value}>{value}</Text>
        </View>
    </View>
);

const infoStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    iconWrap: {
        width: 34,
        height: 34,
        borderRadius: RADIUS.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textWrap: {
        flex: 1,
    },
    label: {
        fontSize: 11,
        color: COLORS.textLight,
        fontWeight: '500',
        marginBottom: 1,
    },
    value: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '600',
    },
});

// ─── Componente principal ─────────────────────────────────────────────────────
const ProfileScreen = () => {
    const { user, logout } = useAuth();
    const [completedLessons, setCompletedLessons] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    const loadUserProgress = async () => {
        try {
            const stored = await loadProgress();
            setCompletedLessons(stored?.completedLessons || []);
        } catch {
            setCompletedLessons([]);
        }
    };

    useEffect(() => {
        loadUserProgress();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadUserProgress();
        setRefreshing(false);
    };

    const performReset = async () => {
        await resetProgress();
        setCompletedLessons([]);
    };

    const handleReset = () => {
        Alert.alert(
            'Reiniciar progreso',
            '¿Seguro que deseas borrar todo tu avance? Esta acción no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Reiniciar', style: 'destructive', onPress: performReset },
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro de que deseas salir de tu cuenta?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Salir',
                    style: 'destructive',
                    onPress: async () => { await logout(); },
                },
            ]
        );
    };

    const totalLessons = lessonsData.length;
    const completed    = completedLessons.length;
    const pending      = totalLessons - completed;
    const percentage   = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    Platform.OS === 'web'
                        ? undefined
                        : <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={COLORS.puertoTejadaRed}
                            colors={[COLORS.puertoTejadaRed]}
                          />
                }
            >
                {/* ═══════════════════════════════════════════════════════════
                    HERO DEL PERFIL
                ═══════════════════════════════════════════════════════════ */}
                <View style={styles.hero}>
                    {/* Patrón decorativo */}
                    <View style={styles.heroPattern} pointerEvents="none">
                        {[...Array(5)].map((_, row) => (
                            <View key={row} style={styles.patternRow}>
                                {[...Array(7)].map((_, col) => (
                                    <View key={col} style={styles.patternDot} />
                                ))}
                            </View>
                        ))}
                    </View>

                    <Animated.View style={[styles.heroContent, { opacity: fadeAnim }]}>
                        {/* Avatar */}
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatarOuter}>
                                <View style={styles.avatarInner}>
                                    <Text style={styles.avatarEmoji}>🤖</Text>
                                </View>
                            </View>
                            {/* Anillo tricolor */}
                            <View style={styles.avatarRingRed} />
                            <View style={styles.avatarRingWhite} />
                            <View style={styles.avatarRingGreen} />
                        </View>

                        {/* Nombre */}
                        <Text style={styles.heroName}>{user?.name || 'Estudiante IA'}</Text>
                        <Text style={styles.heroEmail}>{user?.email || ''}</Text>

                        {/* Chips de rol e institución */}
                        <View style={styles.heroBadges}>
                            <View style={styles.roleBadge}>
                                <MaterialIcons name="school" size={12} color={COLORS.puertoTejadaRed} />
                                <Text style={styles.roleBadgeText}>{user?.role || 'Estudiante'}</Text>
                            </View>
                            <View style={styles.osBadge}>
                                <Text style={styles.osBadgeText}>
                                    {Platform.OS === 'ios' ? '📱 iOS' : '🤖 Android'}
                                </Text>
                            </View>
                        </View>
                    </Animated.View>

                    <TricolorStripe height={5} />
                </View>

                <Animated.View style={[styles.bodyContent, { opacity: fadeAnim }]}>

                    {/* ═══════════════════════════════════════════════════════
                        ESTADÍSTICAS RÁPIDAS
                    ═══════════════════════════════════════════════════════ */}
                    <View style={styles.statsRow}>
                        <StatCard
                            icon="check-circle"
                            value={completed}
                            label={'Lecciones\ncompletadas'}
                            color={COLORS.puertoTejadaGreen}
                        />
                        <View style={{ width: SPACING.sm }} />
                        <StatCard
                            icon="radio-button-unchecked"
                            value={pending}
                            label={'Lecciones\npendientes'}
                            color={COLORS.warning}
                        />
                        <View style={{ width: SPACING.sm }} />
                        <StatCard
                            icon="trending-up"
                            value={`${percentage}%`}
                            label={'Progreso\ngeneral'}
                            color={COLORS.puertoTejadaRed}
                        />
                    </View>

                    {/* ═══════════════════════════════════════════════════════
                        PROGRESO VISUAL
                    ═══════════════════════════════════════════════════════ */}
                    <View style={styles.card}>
                        <View style={styles.cardTitleRow}>
                            <View style={[styles.cardAccent, { backgroundColor: COLORS.accent }]} />
                            <Text style={styles.cardTitle}>Progreso del curso</Text>
                        </View>
                        <ProgressBar
                            current={completed}
                            total={totalLessons}
                            color={COLORS.puertoTejadaGreen}
                        />
                        <View style={styles.progressFooter}>
                            <Text style={styles.progressFooterText}>
                                {completed} de {totalLessons} lecciones completadas
                            </Text>
                            {percentage === 100 && (
                                <View style={styles.completedChip}>
                                    <MaterialIcons name="verified" size={12} color="#fff" />
                                    <Text style={styles.completedChipText}>¡Módulo completo!</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* ═══════════════════════════════════════════════════════
                        INFORMACIÓN DEL USUARIO
                    ═══════════════════════════════════════════════════════ */}
                    <View style={styles.card}>
                        <View style={styles.cardTitleRow}>
                            <View style={[styles.cardAccent, { backgroundColor: COLORS.puertoTejadaRed }]} />
                            <Text style={styles.cardTitle}>Información de cuenta</Text>
                        </View>
                        <InfoRow
                            icon="person"
                            label="Nombre completo"
                            value={user?.name || 'Estudiante'}
                            iconColor={COLORS.puertoTejadaRed}
                        />
                        <InfoRow
                            icon="email"
                            label="Correo institucional"
                            value={user?.email || '-'}
                            iconColor={COLORS.puertoTejadaRed}
                        />
                        <InfoRow
                            icon="badge"
                            label="Rol"
                            value={user?.role || 'Estudiante'}
                            iconColor={COLORS.accent}
                        />
                        <InfoRow
                            icon="account-balance"
                            label="Institución"
                            value={user?.institution || PUERTO_TEJADA.institucion}
                            iconColor={COLORS.puertoTejadaGreen}
                        />
                        <View style={[infoStyles.row, { borderBottomWidth: 0 }]}>
                            <View style={[infoStyles.iconWrap, { backgroundColor: COLORS.puertoTejadaGreen + '15' }]}>
                                <MaterialIcons name="place" size={16} color={COLORS.puertoTejadaGreen} />
                            </View>
                            <View style={infoStyles.textWrap}>
                                <Text style={infoStyles.label}>Municipio</Text>
                                <Text style={infoStyles.value}>{user?.location || `${PUERTO_TEJADA.nombre}, ${PUERTO_TEJADA.departamento}`}</Text>
                            </View>
                        </View>
                    </View>

                    {/* ═══════════════════════════════════════════════════════
                        IDENTIDAD PUERTO TEJADA
                    ═══════════════════════════════════════════════════════ */}
                    <View style={[styles.card, styles.municipioCard]}>
                        <TricolorStripe height={5} />
                        <View style={styles.municipioBody}>
                            <View style={styles.municipioIconWrap}>
                                <Text style={styles.municipioEmoji}>🌿</Text>
                            </View>
                            <View style={styles.municipioText}>
                                <Text style={styles.municipioName}>
                                    {PUERTO_TEJADA.nombre}, {PUERTO_TEJADA.departamento}
                                </Text>
                                <Text style={styles.municipioInstitution}>{PUERTO_TEJADA.institucion}</Text>
                                <Text style={styles.municipioFundacion}>Fundado: {PUERTO_TEJADA.fundacion}</Text>
                                <Text style={styles.municipioDesc} numberOfLines={3}>
                                    {PUERTO_TEJADA.descripcion}
                                </Text>
                                <Text style={styles.municipioLema}>"{PUERTO_TEJADA.lema}"</Text>
                            </View>
                        </View>
                    </View>

                    {/* ═══════════════════════════════════════════════════════
                        MOTIVACIÓN
                    ═══════════════════════════════════════════════════════ */}
                    <View style={styles.motivationCard}>
                        <View style={styles.motivationIconRow}>
                            <Text style={styles.motivationEmoji}>🚀</Text>
                            <Text style={styles.motivationTitle}>Sigue aprendiendo</Text>
                        </View>
                        <Text style={styles.motivationText}>
                            La Inteligencia Artificial está cambiando el mundo. Cada lección que
                            completas te acerca más a dominar esta tecnología y ser parte del futuro del Cauca.
                        </Text>
                        {completed > 0 && (
                            <View style={styles.motivationChip}>
                                <MaterialIcons name="emoji-events" size={14} color={COLORS.warning} />
                                <Text style={styles.motivationChipText}>
                                    ¡Llevas {completed} lección{completed > 1 ? 'es' : ''} completada{completed > 1 ? 's' : ''}!
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* ═══════════════════════════════════════════════════════
                        ACCIONES
                    ═══════════════════════════════════════════════════════ */}
                    <View style={styles.actionsSection}>
                        {/* Reiniciar progreso */}
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleReset}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: '#FFF3F3' }]}>
                                <MaterialIcons name="refresh" size={20} color="#D32F2F" />
                            </View>
                            <View style={styles.actionTextWrap}>
                                <Text style={[styles.actionTitle, { color: '#D32F2F' }]}>Reiniciar progreso</Text>
                                <Text style={styles.actionSub}>Borra todo el avance del curso</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color={COLORS.textDisabled} />
                        </TouchableOpacity>

                        {/* Cerrar sesión */}
                        <TouchableOpacity
                            style={[styles.actionButton, styles.actionButtonLast]}
                            onPress={handleLogout}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: COLORS.surfaceAlt }]}>
                                <MaterialIcons name="logout" size={20} color={COLORS.textLight} />
                            </View>
                            <View style={styles.actionTextWrap}>
                                <Text style={[styles.actionTitle, { color: COLORS.textSecondary }]}>Cerrar sesión</Text>
                                <Text style={styles.actionSub}>Salir de tu cuenta institucional</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color={COLORS.textDisabled} />
                        </TouchableOpacity>
                    </View>

                    {/* Espacio final */}
                    <View style={{ height: SPACING.xl }} />
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
};

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },

    // ─── Hero ────────────────────────────────────────────────────────────────
    hero: {
        backgroundColor: COLORS.puertoTejadaRed,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: COLORS.puertoTejadaRedDark,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.28,
                shadowRadius: 16,
            },
            android: { elevation: 12 },
        }),
    },
    heroPattern: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 140,
        height: '100%',
        opacity: 0.10,
        justifyContent: 'center',
        gap: 10,
        paddingTop: 20,
    },
    patternRow: {
        flexDirection: 'row',
        gap: 10,
    },
    patternDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#fff',
    },
    heroContent: {
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.lg,
    },

    // Avatar
    avatarContainer: {
        position: 'relative',
        width: 110,
        height: 110,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    avatarOuter: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(255,255,255,0.20)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInner: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarEmoji: {
        fontSize: 42,
    },
    // Anillos tricolor en el avatar
    avatarRingRed: {
        position: 'absolute',
        width: 104,
        height: 104,
        borderRadius: 52,
        borderWidth: 3,
        borderColor: COLORS.puertoTejadaRed,
        opacity: 0.4,
    },
    avatarRingWhite: {
        position: 'absolute',
        width: 108,
        height: 108,
        borderRadius: 54,
        borderWidth: 1.5,
        borderColor: '#fff',
        opacity: 0.5,
    },
    avatarRingGreen: {
        position: 'absolute',
        width: 112,
        height: 112,
        borderRadius: 56,
        borderWidth: 2,
        borderColor: COLORS.puertoTejadaGreen,
        opacity: 0.5,
    },

    // Textos hero
    heroName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.5,
        marginBottom: 4,
        textAlign: 'center',
    },
    heroEmail: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.75)',
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    heroBadges: {
        flexDirection: 'row',
        gap: SPACING.sm,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: RADIUS.pill,
    },
    roleBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.puertoTejadaRed,
    },
    osBadge: {
        backgroundColor: 'rgba(255,255,255,0.18)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: RADIUS.pill,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.30)',
    },
    osBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },

    // ─── Body ────────────────────────────────────────────────────────────────
    bodyContent: {
        padding: SPACING.md,
        paddingTop: SPACING.lg,
    },

    // ─── Stats ───────────────────────────────────────────────────────────────
    statsRow: {
        flexDirection: 'row',
        marginBottom: SPACING.md,
    },

    // ─── Card base ───────────────────────────────────────────────────────────
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xl,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.07,
                shadowRadius: 10,
            },
            android: { elevation: 4 },
        }),
    },
    cardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: SPACING.md,
    },
    cardAccent: {
        width: 4,
        height: 20,
        borderRadius: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        letterSpacing: -0.3,
    },

    // Progreso footer
    progressFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.sm,
    },
    progressFooterText: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    completedChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.puertoTejadaGreen,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: RADIUS.pill,
    },
    completedChipText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },

    // ─── Municipio ───────────────────────────────────────────────────────────
    municipioCard: {
        padding: 0,
        overflow: 'hidden',
    },
    municipioBody: {
        flexDirection: 'row',
        padding: SPACING.md,
        gap: SPACING.md,
        alignItems: 'flex-start',
    },
    municipioIconWrap: {
        width: 52,
        height: 52,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.successLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    municipioEmoji: {
        fontSize: 28,
    },
    municipioText: {
        flex: 1,
    },
    municipioName: {
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.puertoTejadaRed,
        marginBottom: 2,
    },
    municipioInstitution: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.puertoTejadaGreen,
        marginBottom: 4,
    },
    municipioFundacion: {
        fontSize: 11,
        color: COLORS.textLight,
        fontStyle: 'italic',
        marginBottom: 6,
    },
    municipioDesc: {
        fontSize: 12,
        color: COLORS.textLight,
        lineHeight: 17,
        marginBottom: 6,
    },
    municipioLema: {
        fontSize: 12,
        color: COLORS.puertoTejadaGreen,
        fontWeight: '600',
        fontStyle: 'italic',
    },

    // ─── Motivación ──────────────────────────────────────────────────────────
    motivationCard: {
        backgroundColor: COLORS.puertoTejadaRed,
        borderRadius: RADIUS.xl,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.puertoTejadaRed,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
            },
            android: { elevation: 5 },
        }),
    },
    motivationIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    motivationEmoji: {
        fontSize: 22,
    },
    motivationTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.3,
    },
    motivationText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 19,
        marginBottom: SPACING.sm,
    },
    motivationChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: RADIUS.pill,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    motivationChipText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },

    // ─── Acciones ─────────────────────────────────────────────────────────────
    actionsSection: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.md,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
            },
            android: { elevation: 3 },
        }),
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    actionButtonLast: {
        borderBottomWidth: 0,
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionTextWrap: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },
    actionSub: {
        fontSize: 12,
        color: COLORS.textLight,
    },
});

export default ProfileScreen;