import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import {
  feedColors,
  feedRadii,
  feedShadow,
  feedSpacing,
} from "./communityFeedTheme";

type Props = {
  composerAvatarUri?: string;
  onComposerPress?: () => void;
  onPhotoPress?: () => void;
  onTagTopicsPress?: () => void;
  onPrivacyPress?: () => void;
};

export function CommunityCreatePostCard({
  composerAvatarUri,
  onComposerPress,
  onPhotoPress,
  onTagTopicsPress,
  onPrivacyPress,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          {composerAvatarUri ? (
            <Image
              source={{ uri: composerAvatarUri }}
              style={styles.avatarImg}
              contentFit="cover"
            />
          ) : (
            <Ionicons name="person" size={20} color={feedColors.textSecondary} />
          )}
        </View>
        <Pressable
          style={({ pressed }) => [styles.inputLike, pressed && { opacity: 0.92 }]}
          onPress={
            onComposerPress ??
            (() => Alert.alert("Create post", "Opens composer (placeholder)."))
          }
        >
          <Text style={styles.placeholder}>
            Share a parenting win or question...
          </Text>
        </Pressable>
      </View>
      <View style={styles.actions}>
        <ActionChip
          icon="image-outline"
          label="Photo"
          onPress={
            onPhotoPress ??
            (() => Alert.alert("Photo", "Attach a photo (placeholder)."))
          }
        />
        <ActionChip
          icon="pricetag-outline"
          label="Tag Topics"
          onPress={
            onTagTopicsPress ??
            (() => Alert.alert("Topics", "Choose topics (placeholder)."))
          }
        />
        <ActionChip
          icon="lock-closed-outline"
          label="Privacy"
          onPress={
            onPrivacyPress ??
            (() => Alert.alert("Privacy", "Audience settings (placeholder)."))
          }
        />
      </View>
    </View>
  );
}

function ActionChip({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.action, pressed && { opacity: 0.8 }]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={18} color={feedColors.textSecondary} />
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: feedColors.card,
    borderRadius: feedRadii.card,
    padding: feedSpacing.lg,
    marginBottom: feedSpacing.lg,
    ...feedShadow,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: feedSpacing.md,
    marginBottom: feedSpacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: feedColors.chip,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  inputLike: {
    flex: 1,
    backgroundColor: feedColors.searchBg,
    borderRadius: feedRadii.pill,
    paddingVertical: feedSpacing.md,
    paddingHorizontal: feedSpacing.lg,
    justifyContent: "center",
    minHeight: 48,
  },
  placeholder: {
    fontSize: 15,
    color: feedColors.textSecondary,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: feedSpacing.md,
    justifyContent: "flex-start",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: feedColors.textSecondary,
  },
});
