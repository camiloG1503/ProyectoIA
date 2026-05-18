// components/MetaChip.js
// Chip de meta info — I.E. Fidelina Echeverry · Puerto Tejada, Cauca

import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING } from "../utils/colors";

const MetaChip = ({ icon, label, value, color }) => (
  <View style={[styles.chip, { borderColor: color + "30" }]}>
    <View style={[styles.iconWrap, { backgroundColor: color + "18" }]}>
      <MaterialIcons name={icon} size={16} color={color} />
    </View>
    <View>
      <Text style={styles.chipLabel}>{label}</Text>
      <Text style={[styles.chipValue, { color }]}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
    }),
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  chipLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: "500",
    marginBottom: 1,
  },
  chipValue: {
    fontSize: 13,
    fontWeight: "700",
  },
});

export default MetaChip;
