// components/ChatBubble.js

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, RADIUS } from "../utils/colors";

const ChatBubble = React.memo(({ text, type, isCorrect }) => {
  const isUser = type === "user";

  const bubbleStyle = [
    styles.bubble,
    isUser ? styles.userBubble : styles.botBubble,
    isUser && isCorrect === true && styles.correctBubble,
    isUser && isCorrect === false && styles.wrongBubble,
  ];

  const rowStyle = [styles.row, isUser ? styles.rowRight : styles.rowLeft];

  return (
    <View style={rowStyle}>
      <View style={bubbleStyle}>
        <Text style={styles.text}>
          {isUser && isCorrect === true ? "✅ " : ""}
          {isUser && isCorrect === false ? "❌ " : ""}
          {text}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { width: "100%", marginBottom: 10, flexDirection: "row" },
  rowLeft: { justifyContent: "flex-start" },
  rowRight: { justifyContent: "flex-end" },
  bubble: {
    maxWidth: "85%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.lg,
  },
  botBubble: { backgroundColor: "#DBEAFE" }, // azul claro
  userBubble: { backgroundColor: "#E5E7EB" }, // gris claro
  correctBubble: { backgroundColor: "#DCFCE7" }, // verde claro
  wrongBubble: { backgroundColor: "#FEE2E2" }, // rojo claro
  text: { color: COLORS.text, lineHeight: 19, fontWeight: "600" },
});

export default ChatBubble;

