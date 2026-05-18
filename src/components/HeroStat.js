// components/HeroStat.js
// Estadística del hero — I.E. Fidelina Echeverry · Puerto Tejada, Cauca

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const HeroStat = ({ value, label, icon }) => (
  <View style={styles.container}>
    <MaterialIcons name={icon} size={18} color="rgba(255,255,255,0.75)" />
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginTop: 2,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 10,
    color: "rgba(255,255,255,0.70)",
    fontWeight: "500",
    marginTop: 1,
    textAlign: "center",
  },
});

export default HeroStat;
