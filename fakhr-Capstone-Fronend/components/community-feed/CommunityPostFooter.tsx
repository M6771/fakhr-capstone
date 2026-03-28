import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  feedColors,
  feedRadii,
  feedSpacing,
} from "./communityFeedTheme";

type SocialProps = {
  variant: "social";
  likes: number;
  comments: number;
  liked: boolean;
  onLikePress: () => void;
  onCommentPress: () => void;
  onSharePress: () => void;
};

type QuestionProps = {
  variant: "question";
  responsesCount: number;
  onGiveAdvicePress: () => void;
};

export type CommunityPostFooterProps = SocialProps | QuestionProps;

export function CommunityPostFooter(props: CommunityPostFooterProps) {
  if (props.variant === "question") {
    return (
      <View style={styles.questionRow}>
        <Pressable
          style={({ pressed }) => [
            styles.adviceBtn,
            pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
          ]}
          onPress={props.onGiveAdvicePress}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={18}
            color={feedColors.card}
          />
          <Text style={styles.adviceBtnText}>Give Advice</Text>
        </Pressable>
        <Text style={styles.responses}>
          {props.responsesCount} responses
        </Text>
      </View>
    );
  }

  const { likes, comments, liked, onLikePress, onCommentPress, onSharePress } =
    props;
  const heartIcon = liked ? "heart" : "heart-outline";
  const heartColor = liked ? "#EF4444" : feedColors.textSecondary;

  return (
    <View style={styles.socialRow}>
      <Pressable
        style={({ pressed }) => [styles.stat, pressed && styles.pressedStat]}
        onPress={onLikePress}
      >
        <Ionicons name={heartIcon} size={20} color={heartColor} />
        <Text style={styles.statText}>{likes}</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.stat, pressed && styles.pressedStat]}
        onPress={onCommentPress}
      >
        <Ionicons
          name="chatbubble-outline"
          size={19}
          color={feedColors.textSecondary}
        />
        <Text style={styles.statText}>{comments}</Text>
      </Pressable>
      <View style={styles.spacer} />
      <Pressable
        style={({ pressed }) => [styles.stat, pressed && styles.pressedStat]}
        onPress={onSharePress}
      >
        <Ionicons
          name="share-outline"
          size={22}
          color={feedColors.textSecondary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: feedSpacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: feedColors.chip,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: feedSpacing.xs,
    paddingRight: feedSpacing.lg,
  },
  pressedStat: {
    opacity: 0.75,
  },
  statText: {
    fontSize: 14,
    fontWeight: "600",
    color: feedColors.textSecondary,
  },
  spacer: {
    flex: 1,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: feedSpacing.md,
    paddingTop: feedSpacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: feedColors.chip,
  },
  adviceBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: feedSpacing.sm,
    backgroundColor: feedColors.primary,
    paddingVertical: feedSpacing.md,
    paddingHorizontal: feedSpacing.lg,
    borderRadius: feedRadii.pill,
  },
  adviceBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: feedColors.card,
  },
  responses: {
    fontSize: 14,
    fontWeight: "500",
    color: feedColors.textSecondary,
  },
});
