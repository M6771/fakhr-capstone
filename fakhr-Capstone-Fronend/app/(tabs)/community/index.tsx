import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CommunityCreatePostCard,
  CommunityFeedBottomNav,
  CommunityFeedHeader,
  CommunityInfoBanner,
  CommunityPostCard,
  type CommunityPostCardProps,
  CommunityTabPills,
  type FeedTabId,
  feedColors,
  feedSpacing,
} from "../../../components/community-feed";

const ME_AVATAR =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80";
const AHMED_AVATAR =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80";
const SARAH_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80";
const READING_IMG =
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80";

type PostRow = CommunityPostCardProps & {
  feedTabs: FeedTabId[];
};

const ALL_POSTS: PostRow[] = [
  {
    variant: "text",
    authorName: "Ahmed K.",
    authorMeta: "2 hours ago • Father of 2",
    avatarUri: AHMED_AVATAR,
    content:
      "Last night was tough — meltdown at bedtime — but we breathed through it together. Small wins count. 🌙",
    initialLikes: 24,
    comments: 8,
    feedTabs: ["all", "tips"],
    contentLines: 5,
  },
  {
    variant: "image",
    authorName: "Sarah M.",
    authorMeta: "5 hours ago • Educator & Mom",
    avatarUri: SARAH_AVATAR,
    content:
      "Found this moment during story time — three little readers, one cozy corner. Grateful for quiet joy.",
    imageUri: READING_IMG,
    initialLikes: 142,
    comments: 15,
    feedTabs: ["all", "education"],
    contentLines: 4,
  },
  {
    variant: "question",
    authorName: "Anonymous Parent",
    authorMeta: "8 hours ago • Seeking Advice",
    anonymous: true,
    badgeLabel: "HEALTH QUESTION",
    content:
      "How do I explain my child’s sensory needs to relatives who don’t really “get it” yet?",
    initialLikes: 0,
    comments: 0,
    responsesCount: 12,
    feedTabs: ["all", "tips"],
    contentLines: 5,
  },
];

export default function CommunityScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<FeedTabId>("all");

  const openComposer = () => {
    router.push("/(tabs)/community/create-post" as never);
  };

  const visible = useMemo(() => {
    if (tab === "all") return ALL_POSTS;
    return ALL_POSTS.filter((p) => p.feedTabs.includes(tab));
  }, [tab]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.root}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <CommunityFeedHeader avatarUri={ME_AVATAR} />
          <CommunityInfoBanner />
          <CommunityCreatePostCard
            composerAvatarUri={ME_AVATAR}
            onComposerPress={openComposer}
          />
          <CommunityTabPills active={tab} onChange={setTab} />
          {visible.map((post, i) => (
            <CommunityPostCard key={`${post.authorName}-${i}`} {...post} />
          ))}
        </ScrollView>
        <CommunityFeedBottomNav
          active="discover"
          onFabPress={openComposer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: feedColors.background,
  },
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: feedSpacing.screen,
    paddingBottom: 120,
  },
});
