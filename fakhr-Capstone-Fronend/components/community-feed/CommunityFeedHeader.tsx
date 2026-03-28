import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { feedColors, feedShadowSoft, feedSpacing } from "./communityFeedTheme";

type Props = {
  title?: string;
  avatarUri?: string;
  onBellPress?: () => void;
  onAvatarPress?: () => void;
};

export function CommunityFeedHeader({
  title = "Fakhr",
  avatarUri,
  onBellPress,
  onAvatarPress,
}: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.logoCircle}>
        <Ionicons name="people" size={22} color={feedColors.primary} />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>
        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
          onPress={onBellPress ?? (() => Alert.alert("Notifications", "No new notifications."))}
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={feedColors.textPrimary}
          />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.avatarWrap, pressed && styles.pressed]}
          onPress={onAvatarPress ?? (() => Alert.alert("Profile", "Open profile from here."))}
        >
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatarImg}
              contentFit="cover"
            />
          ) : (
            <Ionicons name="person" size={20} color={feedColors.textSecondary} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const AV = 40;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: feedSpacing.lg,
  },
  logoCircle: {
    width: AV,
    height: AV,
    borderRadius: AV / 2,
    backgroundColor: feedColors.chip,
    alignItems: "center",
    justifyContent: "center",
    ...feedShadowSoft,
  },
  title: {
    flex: 1,
    marginHorizontal: feedSpacing.md,
    fontSize: 20,
    fontWeight: "700",
    color: feedColors.textPrimary,
    textAlign: "center",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: feedSpacing.sm,
  },
  iconBtn: {
    width: AV,
    height: AV,
    borderRadius: AV / 2,
    backgroundColor: feedColors.chip,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarWrap: {
    width: AV,
    height: AV,
    borderRadius: AV / 2,
    backgroundColor: feedColors.chip,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});
