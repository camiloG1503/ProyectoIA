// components/StatCard.js
// Tarjeta de estadística — I.E. Fidelina Echeverry · Puerto Tejada, Cauca

import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING } from "../utils/colors";

const StatCard = ({ icon, value, label, color }) => (
  <View style={[styles.card, { borderTopColor: color }]}>
    <View style={[styles.iconContainer, { backgroundColor: color + "18" }]}>
      <MaterialIcons name={icon} size={20} color={color} />
    </View>
    <Text style={[styles.value, { color }]}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: "center",
    borderTopWidth: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  value: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 13,
  },
});

export default StatCard;
