// components/ProgressBar.js
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { COLORS, RADIUS } from "../utils/colors";

const ProgressBar = ({ current, total, color }) => {
    const progress = total === 0 ? 0 : current / total;
    const widthAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(widthAnim, {
            toValue: progress,
            duration: 600,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const widthInterpolated = widthAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <Text style={styles.label}>Progreso del curso</Text>
                <Text style={styles.percent}>{Math.round(progress * 100)}%</Text>
            </View>

            <View style={styles.barBackground}>
                <Animated.View
                    style={[
                        styles.barFill,
                        {
                            width: widthInterpolated,
                            backgroundColor: color || COLORS.puertoTejadaGreen,
                        },
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginVertical: 10,
    },
    info: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: "600",
    },
    percent: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: "800",
    },
    barBackground: {
        width: "100%",
        height: 10,
        backgroundColor: COLORS.surfaceAlt || "#E5E7EB",
        borderRadius: RADIUS.pill,
        overflow: "hidden",
    },
    barFill: {
        height: "100%",
        borderRadius: RADIUS.pill,
    },
});

export default ProgressBar;