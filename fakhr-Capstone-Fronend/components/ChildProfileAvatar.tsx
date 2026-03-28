import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { resolveRemoteImageUrl } from "../utils/resolveMediaUrl";

const FAKHR_BUNDLE = require("../assets/images/fakhr-profile.png");

type Props = {
  name: string;
  profileImageUrl?: string | null;
  color: string;
  size?: number;
  style?: ViewStyle;
};

export function ChildProfileAvatar({ name, profileImageUrl, color, size = 56, style }: Props) {
  const remote = resolveRemoteImageUrl(profileImageUrl);
  const firstName = name.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  const useFakhrAsset = !remote && firstName === "fakhr";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const fontSize = Math.max(12, size * 0.32);
  const radius = size / 2;

  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: radius }, style]}>
      {remote ? (
        <Image
          source={{ uri: remote }}
          style={{ width: size, height: size, borderRadius: radius }}
          contentFit="cover"
          transition={200}
        />
      ) : useFakhrAsset ? (
        <Image
          source={FAKHR_BUNDLE}
          style={{ width: size, height: size, borderRadius: radius }}
          contentFit="cover"
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: size,
              height: size,
              borderRadius: radius,
              backgroundColor: `${color}20`,
            },
          ]}
        >
          <Text style={[styles.fallbackText, { color, fontSize }]}>{initials}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    fontWeight: "600",
  },
});
