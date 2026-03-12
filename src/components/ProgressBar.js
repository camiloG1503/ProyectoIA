import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

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
                            backgroundColor: color,
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
    },

    info: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },

    label: {
        fontSize: 14,
        color: "#374151",
        fontWeight: "600",
    },

    percent: {
        fontSize: 14,
        color: "#374151",
        fontWeight: "700",
    },

    barBackground: {
        width: "100%",
        height: 10,
        backgroundColor: "#E5E7EB",
        borderRadius: 6,
        overflow: "hidden",
    },

    barFill: {
        height: "100%",
        borderRadius: 6,
    },
});

export default ProgressBar;