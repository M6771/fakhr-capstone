import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  feedColors,
  feedRadii,
  feedShadow,
  feedSpacing,
} from "./communityFeedTheme";
import { CommunityPostFooter } from "./CommunityPostFooter";

export type CommunityPostVariant = "text" | "image" | "question";

export type CommunityPostCardProps = {
  variant: CommunityPostVariant;
  authorName: string;
  authorMeta: string;
  avatarUri?: string | null;
  /** When true, show generic placeholder avatar */
  anonymous?: boolean;
  content: string;
  imageUri?: string;
  badgeLabel?: string;
  initialLikes: number;
  comments: number;
  responsesCount?: number;
  contentLines?: number;
};

export function CommunityPostCard({
  variant,
  authorName,
  authorMeta,
  avatarUri,
  anonymous,
  content,
  imageUri,
  badgeLabel,
  initialLikes,
  comments,
  responsesCount = 0,
  contentLines = 6,
}: CommunityPostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const toggleLike = () => {
    setLiked((prev) => {
      setLikes((n) => (prev ? n - 1 : n + 1));
      return !prev;
    });
  };

  const onFlag = () => {
    Alert.alert("Report", "Report this post to moderators?", [
      { text: "Cancel", style: "cancel" },
      { text: "Report", style: "destructive", onPress: () => {} },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          {anonymous || !avatarUri ? (
            <Ionicons name="person" size={22} color={feedColors.textSecondary} />
          ) : (
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatarImg}
              contentFit="cover"
            />
          )}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={1}>
            {authorName}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {authorMeta}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.flagBtn, pressed && { opacity: 0.7 }]}
          onPress={onFlag}
          hitSlop={8}
        >
          <Ionicons name="flag-outline" size={20} color={feedColors.textSecondary} />
        </Pressable>
      </View>

      {variant === "question" && badgeLabel ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>
      ) : null}

      <Text
        style={[styles.body, variant === "question" && styles.bodyQuestion]}
        numberOfLines={contentLines}
      >
        {content}
      </Text>

      {variant === "image" && imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.postImage}
          contentFit="cover"
          transition={200}
        />
      ) : null}

      {variant === "question" ? (
        <CommunityPostFooter
          variant="question"
          responsesCount={responsesCount}
          onGiveAdvicePress={() =>
            Alert.alert("Give advice", "Opens advice composer (placeholder).")
          }
        />
      ) : (
        <CommunityPostFooter
          variant="social"
          likes={likes}
          comments={comments}
          liked={liked}
          onLikePress={toggleLike}
          onCommentPress={() =>
            Alert.alert("Comments", "Thread opens here (placeholder).")
          }
          onSharePress={() =>
            Alert.alert("Share", "Share sheet (placeholder).")
          }
        />
      )}
    </View>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: feedSpacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: feedColors.chip,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  headerText: {
    flex: 1,
    marginLeft: feedSpacing.md,
    marginRight: feedSpacing.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: feedColors.textPrimary,
  },
  meta: {
    fontSize: 13,
    color: feedColors.textSecondary,
    marginTop: 2,
  },
  flagBtn: {
    padding: feedSpacing.xs,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(124, 130, 161, 0.15)",
    paddingHorizontal: feedSpacing.md,
    paddingVertical: 6,
    borderRadius: feedRadii.pill,
    marginBottom: feedSpacing.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: feedColors.primary,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: feedColors.textPrimary,
    marginBottom: feedSpacing.md,
  },
  bodyQuestion: {
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 24,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    marginBottom: feedSpacing.md,
    backgroundColor: feedColors.chip,
  },
});
