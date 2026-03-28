import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  feedColors,
  feedRadii,
  feedShadowSoft,
  feedSpacing,
} from "./communityFeedTheme";

export function CommunityInfoBanner() {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="shield-checkmark" size={22} color={feedColors.primary} />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.title}>Safe Community Space</Text>
        <Text style={styles.desc}>
          All content is moderated to ensure a supportive environment for all
          parents.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: feedSpacing.md,
    padding: feedSpacing.lg,
    borderRadius: feedRadii.card,
    backgroundColor: feedColors.chip,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.06)",
    marginBottom: feedSpacing.lg,
    ...feedShadowSoft,
  },
  iconWrap: {
    marginTop: 2,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: feedColors.textPrimary,
    marginBottom: feedSpacing.xs,
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
    color: feedColors.textSecondary,
  },
});
