import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { CategoryTab } from "../../../components/community/CategoryTab";
import { CommunityPostCard } from "../../../components/community/CommunityPostCard";
import { CATEGORY_TABS, postsForCategory } from "../../../components/community/communityMockData";
import { CreatePostBox } from "../../../components/community/CreatePostBox";
import { ImagePostCard } from "../../../components/community/ImagePostCard";
import { QuestionPostCard } from "../../../components/community/QuestionPostCard";
import { SafeBanner } from "../../../components/community/SafeBanner";
import type { CommunityCategoryId, CommunityPost } from "../../../components/community/types";
import { libraryColors as c } from "../../../constants/libraryTheme";

const HEADER_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80";

export default function ParentCommunityScreen() {
  const insets = useSafeAreaInsets();

  const [category, setCategory] = useState<CommunityCategoryId>("all");
  const [draft, setDraft] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalBody, setModalBody] = useState("");

  const data = useMemo(() => postsForCategory(category), [category]);

  const report = useCallback((name: string) => {
    Alert.alert(
      "Report content",
      `Report post by ${name}? Our team reviews every flag.`,
      [{ text: "Cancel", style: "cancel" }, { text: "Report", style: "destructive" }]
    );
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: CommunityPost }) => {
      if (item.kind === "text") {
        return (
          <CommunityPostCard
            post={item}
            onReport={() => report(item.authorName)}
          />
        );
      }
      if (item.kind === "image") {
        return (
          <ImagePostCard
            post={item}
            onReport={() => report(item.authorName)}
          />
        );
      }
      return (
        <QuestionPostCard
          post={item}
          onReport={() => report(item.authorName)}
        />
      );
    },
    [report]
  );

  const listHeader = (
    <>
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <View style={styles.brandIcon}>
            <Ionicons name="people" size={20} color={c.white} />
          </View>
          <Text style={styles.brandName}>Fakhr</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable
            style={styles.roundBtn}
            onPress={() => Alert.alert("Notifications", "No new notifications.")}
          >
            <Ionicons name="notifications-outline" size={22} color={c.text} />
          </Pressable>
          <Image
            source={{ uri: HEADER_AVATAR }}
            style={styles.profilePic}
            contentFit="cover"
          />
        </View>
      </View>

      <SafeBanner />

      <CreatePostBox
        draft={draft}
        onChangeDraft={setDraft}
        onOpenModal={() => setModalVisible(true)}
        onPhoto={() => Alert.alert("Photo", "Pick a photo (mock).")}
        onTagTopics={() =>
          Alert.alert("Tag topics", "Choose ADHD, Autism, speech delay, etc. (mock).")
        }
        onPrivacy={() =>
          Alert.alert("Privacy", "Choose who can see this post (mock).")
        }
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catScroll}
      >
        {CATEGORY_TABS.map((tab) => (
          <CategoryTab
            key={tab.id}
            label={tab.label}
            selected={category === tab.id}
            onPress={() => setCategory(tab.id)}
          />
        ))}
      </ScrollView>
    </>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.flex}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: 120 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        />

        <Pressable
          style={[
            styles.shieldFab,
            { bottom: 72 + insets.bottom, right: 16 },
          ]}
          onPress={() =>
            Alert.alert(
              "Safety & help",
              "Community guidelines: be kind, respect privacy, and flag anything unsafe. Moderation protects families of children with disabilities."
            )
          }
        >
          <Ionicons name="shield-checkmark" size={22} color={c.white} />
        </Pressable>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Create post</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Share a parenting win or question..."
              placeholderTextColor={c.textLight}
              value={modalBody}
              onChangeText={setModalBody}
              multiline
              textAlignVertical="top"
            />
            <View style={styles.modalRow}>
              <Pressable
                style={[styles.modalSecondary, styles.modalSecondarySpaced]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalSecondaryText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.modalPrimary}
                onPress={() => {
                  Alert.alert("Posted", "Your post was saved locally (mock).");
                  setModalVisible(false);
                  setModalBody("");
                  setDraft("");
                }}
              >
                <Text style={styles.modalPrimaryText}>Post</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.bgApp },
  flex: { flex: 1, position: "relative" },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: c.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  brandName: {
    fontSize: 22,
    fontWeight: "800",
    color: c.text,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: c.headerIconBg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: c.chipBg,
  },
  catScroll: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    marginTop: 4,
  },
  shieldFab: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: c.shieldFab,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: c.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 28,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: c.text,
    marginBottom: 12,
  },
  modalInput: {
    minHeight: 120,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: c.inputBorder,
    padding: 12,
    fontSize: 15,
    color: c.text,
    marginBottom: 16,
    backgroundColor: c.bgApp,
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  modalSecondarySpaced: {
    marginRight: 8,
  },
  modalSecondaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: c.textMuted,
  },
  modalPrimary: {
    backgroundColor: c.primary,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  modalPrimaryText: {
    color: c.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
