// components/TricolorStripe.js
// Franja tricolor reutilizable — I.E. Fidelina Echeverry · Puerto Tejada, Cauca

import React from "react";
import { View } from "react-native";
import { COLORS } from "../utils/colors";

const TricolorStripe = ({ height = 5 }) => (
  <View style={{ flexDirection: "row", height }}>
    <View style={{ flex: 1, backgroundColor: COLORS.puertoTejadaRed }} />
    <View style={{ flex: 1, backgroundColor: COLORS.puertoTejadaWhite }} />
    <View style={{ flex: 1, backgroundColor: COLORS.puertoTejadaGreen }} />
  </View>
);

export default TricolorStripe;
