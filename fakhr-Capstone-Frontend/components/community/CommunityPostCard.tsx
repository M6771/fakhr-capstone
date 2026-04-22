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
import { libraryColors as c } from "../../constants/libraryTheme";
import type { TextPost } from "./types";

type Props = {
  post: TextPost;
  onReport: () => void;
};

export function CommunityPostCard({ post, onReport }: Props) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);

  const toggleLike = () => {
    setLiked((v) => !v);
    setLikes((n) => n + (liked ? -1 : 1));
  };

  const onComment = () => {
    setComments((n) => n + 1);
    Alert.alert("Comment", "Thanks for engaging! (mock)");
  };

  const onShare = () => {
    Alert.alert("Share", "Share sheet (mock).");
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
      <Text style={styles.body}>{post.body}</Text>
      <View style={styles.footer}>
        <Pressable style={styles.footerItem} onPress={toggleLike}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={20}
            color={c.primary}
          />
          <Text style={styles.footerCount}>{likes}</Text>
        </Pressable>
        <Pressable style={styles.footerItem} onPress={onComment}>
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={c.primary}
          />
          <Text style={styles.footerCount}>{comments}</Text>
        </Pressable>
        <View style={styles.spacer} />
        <Pressable onPress={onShare} hitSlop={8}>
          <Ionicons name="share-outline" size={20} color={c.primary} />
        </Pressable>
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
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: c.text,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  footerCount: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: c.primary,
  },
  spacer: { flex: 1 },
});
