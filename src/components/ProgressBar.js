import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/colors';

const ProgressBar = ({ current, total, color = COLORS.primary }) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>Progreso general</Text>
                <Text style={styles.stats}>{current} / {total} lecciones</Text>
            </View>

            <View style={styles.barContainer}>
                <View
                    style={[
                        styles.barFill,
                        { width: `${percentage}%`, backgroundColor: color }
                    ]}
                />
            </View>

            <Text style={styles.percentage}>{Math.round(percentage)}% completado</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    stats: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    barContainer: {
        width: '100%',
        height: 10,
        backgroundColor: COLORS.light,
        borderRadius: 5,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 5,
    },
    percentage: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 4,
        textAlign: 'center',
    },
});

export default ProgressBar;
