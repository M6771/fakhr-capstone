import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  libColors,
  libRadii,
  libShadow,
  libSpacing,
} from "./libraryTheme";

type Props = {
  title: string;
  description: string;
  readLabel?: string;
  bookmarked?: boolean;
  onBookmark?: () => void;
  onRead?: () => void;
  onPress?: () => void;
};

export function LibraryArticleCard({
  title,
  description,
  readLabel = "Read Full Article",
  bookmarked = false,
  onBookmark,
  onRead,
  onPress,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <View style={styles.greenBadge}>
          <Text style={styles.greenBadgeText}>ARTICLE • 5 MIN READ</Text>
        </View>
        <Pressable
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
          onPress={() => onBookmark?.()}
          hitSlop={10}
        >
          <Ionicons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={24}
            color={libColors.primary}
          />
        </Pressable>
      </View>
      <Text style={styles.title} numberOfLines={3}>
        {title}
      </Text>
      <Text style={styles.desc} numberOfLines={2}>
        {description}
      </Text>
      <Pressable
        onPress={() => onRead?.()}
        style={({ pressed }) => [pressed && { opacity: 0.8 }]}
      >
        <Text style={styles.cta}>
          {readLabel} <Text style={styles.ctaArrow}>→</Text>
        </Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: libColors.card,
    borderRadius: libRadii.card,
    padding: libSpacing.xl,
    marginBottom: libSpacing.xl,
    ...libShadow,
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: libSpacing.md,
  },
  greenBadge: {
    backgroundColor: libColors.success,
    paddingHorizontal: libSpacing.md,
    paddingVertical: libSpacing.xs,
    borderRadius: libRadii.sm,
    maxWidth: "82%",
  },
  greenBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: libColors.card,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: libColors.textPrimary,
    lineHeight: 24,
    marginBottom: libSpacing.sm,
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
    color: libColors.textSecondary,
    marginBottom: libSpacing.md,
  },
  cta: {
    fontSize: 15,
    fontWeight: "600",
    color: libColors.primary,
  },
  ctaArrow: {
    fontWeight: "700",
  },
});
