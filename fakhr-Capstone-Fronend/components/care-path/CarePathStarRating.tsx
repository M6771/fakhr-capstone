import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { carePathColors, carePathSpacing } from "./carePathTheme";

type Props = {
  value: number;
  onChange: (n: number) => void;
  max?: number;
};

export function CarePathStarRating({ value, onChange, max = 5 }: Props) {
  const tap = (n: number) => {
    if (Platform.OS === "ios") {
      Haptics.selectionAsync();
    }
    onChange(n);
  };

  return (
    <View style={styles.row}>
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1;
        const filled = star <= value;
        return (
          <Pressable
            key={star}
            onPress={() => tap(star)}
            hitSlop={8}
            style={({ pressed }) => [pressed && styles.starPressed]}
          >
            <Ionicons
              name={filled ? "star" : "star-outline"}
              size={26}
              color={filled ? carePathColors.primary : carePathColors.starEmpty}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: carePathSpacing.xs,
  },
  starPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.92 }],
  },
});
