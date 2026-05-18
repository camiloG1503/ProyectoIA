// components/InputField.js
// Campo de entrada reutilizable — I.E. Fidelina Echeverry · Puerto Tejada, Cauca

import React, { useState, useCallback } from "react";
import { View, Text, TextInput, StyleSheet, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING } from "../utils/colors";

const InputField = ({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  editable = true,
  rightElement,
  hint,
}) => {
  const [focused, setFocused] = useState(false);

  // Memoizar callbacks para evitar re-renders innecesarios en Android
  const handleFocus = useCallback(() => setFocused(true), []);
  const handleBlur = useCallback(() => setFocused(false), []);
  const handleChangeText = useCallback(
    (text) => {
      onChangeText(text);
    },
    [onChangeText],
  );

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          focused && styles.containerFocused,
          !editable && styles.containerDisabled,
        ]}
      >
        <MaterialIcons
          name={icon}
          size={20}
          color={focused ? COLORS.puertoTejadaRed : COLORS.textLight}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textDisabled}
          value={value}
          onChangeText={handleChangeText}
          autoCapitalize="none"
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {rightElement}
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 56,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  containerFocused: {
    borderColor: COLORS.puertoTejadaRed,
    backgroundColor: "#FFF8F8",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.puertoTejadaRed,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: { elevation: 0 },
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

// Memoizar el componente para evitar re-renders al escribir en Android
export default React.memo(InputField);
