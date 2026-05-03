// components/InfoRow.js
// Fila de info del perfil — I.E. Fidelina Echeverry · Puerto Tejada, Cauca

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING } from "../utils/colors";

const InfoRow = ({ icon, label, value, iconColor }) => (
  <View style={styles.row}>
    <View
      style={[
        styles.iconWrap,
        { backgroundColor: (iconColor || COLORS.puertoTejadaRed) + "15" },
      ]}
    >
      <MaterialIcons
        name={icon}
        size={16}
        color={iconColor || COLORS.puertoTejadaRed}
      />
    </View>
    <View style={styles.textWrap}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: "500",
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
});

export default InfoRow;
