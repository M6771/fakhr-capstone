import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
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
  author: string;
  durationLabel: string;
  thumbnailUri?: string;
  onPress?: () => void;
};

const DEFAULT_THUMB =
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80";

export function LibraryVideoCard({
  title,
  author,
  durationLabel,
  thumbnailUri = DEFAULT_THUMB,
  onPress,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.thumbWrap}>
        <Image
          source={{ uri: thumbnailUri }}
          style={styles.thumb}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.playHit}>
          <View style={styles.playCircle}>
            <Ionicons name="play" size={26} color={libColors.card} style={styles.playIcon} />
          </View>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{durationLabel}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={3}>
          {title}
        </Text>
        <View style={styles.authorRow}>
          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={14}
              color={libColors.textSecondary}
            />
          </View>
          <Text style={styles.author} numberOfLines={1}>
            {author}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const THUMB_H = 200;

const styles = StyleSheet.create({
  card: {
    backgroundColor: libColors.card,
    borderRadius: libRadii.card,
    overflow: "hidden",
    marginBottom: libSpacing.xl,
    ...libShadow,
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  thumbWrap: {
    height: THUMB_H,
    backgroundColor: libColors.chip,
    position: "relative",
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  playHit: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  playCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: libColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    marginLeft: 4,
  },
  badge: {
    position: "absolute",
    bottom: libSpacing.md,
    right: libSpacing.md,
    backgroundColor: libColors.videoBadge,
    paddingHorizontal: libSpacing.md,
    paddingVertical: libSpacing.xs,
    borderRadius: libRadii.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: libColors.card,
    letterSpacing: 0.3,
  },
  body: {
    padding: libSpacing.xl,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: libColors.textPrimary,
    lineHeight: 24,
    marginBottom: libSpacing.md,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: libSpacing.sm,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: libColors.chip,
    alignItems: "center",
    justifyContent: "center",
  },
  author: {
    flex: 1,
    fontSize: 14,
    color: libColors.textSecondary,
  },
});
