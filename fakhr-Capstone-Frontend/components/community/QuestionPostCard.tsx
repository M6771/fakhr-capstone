import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { libraryColors as c } from "../../constants/libraryTheme";
import type { QuestionPost } from "./types";

type Props = {
  post: QuestionPost;
  onReport: () => void;
};

export function QuestionPostCard({ post, onReport }: Props) {
  const router = useRouter();

  const giveAdvice = () => {
    router.push({
      pathname: "/(tabs)/community/advice",
      params: {
        postId: post.id,
        preview: encodeURIComponent(post.question.slice(0, 180)),
      },
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          {post.authorAvatarUrl ? (
            <Image
              source={{ uri: post.authorAvatarUrl }}
              style={styles.avatarImg}
              contentFit="cover"
            />
          ) : (
            <Ionicons name="person" size={16} color={c.textLight} />
          )}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name}>{post.authorName}</Text>
          <Text style={styles.meta}>{post.metaLine}</Text>
        </View>
        <Pressable hitSlop={8} onPress={onReport} style={styles.flagBtn}>
          <Ionicons name="flag-outline" size={20} color={c.textLight} />
        </Pressable>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{post.badgeLabel}</Text>
      </View>
      <Text style={styles.question}>{post.question}</Text>
      <View style={styles.bottomRow}>
        <Pressable style={styles.adviceBtn} onPress={giveAdvice}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={18}
            color={c.primary}
          />
          <Text style={styles.adviceText}>Give Advice</Text>
        </Pressable>
        <Text style={styles.responses}>
          {post.responseCount} responses
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: c.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: c.headerIconBg,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%" },
  headerText: { flex: 1, marginLeft: 10 },
  name: { fontSize: 15, fontWeight: "700", color: c.text },
  meta: { fontSize: 12, color: c.textMuted, marginTop: 2 },
  flagBtn: { padding: 4 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: c.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: c.white,
  },
  question: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
    color: c.text,
    marginBottom: 14,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  adviceBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  adviceText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "700",
    color: c.primary,
  },
  responses: {
    fontSize: 13,
    fontWeight: "600",
    color: c.textMuted,
  },
});
