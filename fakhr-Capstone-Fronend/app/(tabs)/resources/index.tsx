import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  LibraryArticleCard,
  LibraryBottomNav,
  type LibraryTabId,
  LibraryCategoryPills,
  type DisabilityId,
  LibraryHeader,
  LibraryInfographicCard,
  LibrarySearchBar,
  LibraryTagChips,
  LibraryVideoCard,
  libColors,
  libSpacing,
} from "../../../components/library";

const THUMB_TECH =
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80";

export default function FakhrLibraryScreen() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [disability, setDisability] = React.useState<DisabilityId>("physical");
  const [articleSaved, setArticleSaved] = React.useState(false);
  const [tab, setTab] = React.useState<LibraryTabId>("library");

  const onTab = (id: LibraryTabId) => {
    setTab(id);
    switch (id) {
      case "home":
        router.replace("/(tabs)");
        break;
      case "library":
        break;
      case "community":
        router.push("/(tabs)/community");
        break;
      case "profile":
        router.push("/(tabs)/profile");
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.root}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <LibraryHeader />
          <LibrarySearchBar value={search} onChangeText={setSearch} />
          <LibraryCategoryPills
            active={disability}
            onChange={setDisability}
            onViewAll={() =>
              Alert.alert("Disability types", "View all categories (placeholder).")
            }
          />
          <LibraryTagChips
            onTagPress={(t) => Alert.alert("Tag", `${t} (placeholder).`)}
          />

          <Text style={styles.sectionHeading}>Recommended for You</Text>

          <LibraryVideoCard
            title="Navigating Early Intervention Services: A Step-by-Step Guide"
            author="Dr. Sarah Ahmed"
            durationLabel="VIDEO • 08:45"
            onPress={() => Alert.alert("Video", "Playback UI only (placeholder).")}
          />

          <LibraryInfographicCard
            previewTitle="Understanding Sensory Overload"
            previewSub="Download PDF (2.4MB)"
            bottomTitle="10 Signs of Sensory Processing Sensitivity in Children"
            onPress={() => Alert.alert("Infographic", "Open preview (placeholder).")}
            onSave={() =>
              Alert.alert("Saved", "Added to your library (placeholder).")
            }
          />

          <LibraryArticleCard
            title={"Empowering Your Child's Communication Skills"}
            description="Practical strategies to support language development at home and in partnership with therapists and educators."
            bookmarked={articleSaved}
            onBookmark={() => setArticleSaved((v) => !v)}
            onRead={() => Alert.alert("Article", "Open full article (placeholder).")}
            onPress={() => Alert.alert("Article", "Open article (placeholder).")}
          />

          <LibraryVideoCard
            title="Assistive Technology: Tools for Independent Living"
            author="Tech Experts Panel"
            durationLabel="VIDEO • 12:20"
            thumbnailUri={THUMB_TECH}
            onPress={() => Alert.alert("Video", "Playback UI only (placeholder).")}
          />

          <View style={styles.bottomPad} />
        </ScrollView>

        <LibraryBottomNav
          active={tab}
          onTabPress={onTab}
          onFabPress={() =>
            Alert.alert("Add", "Create or upload content (placeholder).")
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: libColors.background,
  },
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: libSpacing.screen,
    paddingTop: libSpacing.sm,
    paddingBottom: 120,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: libColors.textPrimary,
    marginBottom: libSpacing.lg,
  },
  bottomPad: {
    height: libSpacing.xl,
  },
});
