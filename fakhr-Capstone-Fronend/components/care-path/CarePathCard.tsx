import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import {
  carePathColors,
  carePathRadii,
  carePathShadow,
  carePathSpacing,
} from "./carePathTheme";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  /** Left accent bar like the mock */
  accentLeft?: boolean;
};

export function CarePathCard({ children, style, accentLeft }: Props) {
  return (
    <View style={[styles.card, accentLeft && styles.accentLeft, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: carePathColors.card,
    borderRadius: carePathRadii.card,
    padding: carePathSpacing.xl,
    ...carePathShadow,
  },
  accentLeft: {
    borderLeftWidth: 4,
    borderLeftColor: carePathColors.primary,
    paddingLeft: carePathSpacing.lg,
  },
});
