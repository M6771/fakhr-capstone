import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  DirectoryBottomNav,
  DirectoryFilterChips,
  type FilterChipId,
  DirectoryHeader,
  DirectoryListingCard,
  DirectorySearchBar,
  DirectorySectionHeader,
  dirColors,
  dirSpacing,
} from "../../../components/centers-directory";

type Listing = {
  id: string;
  imageUri: string;
  rating: number;
  title: string;
  status: "open" | "busy";
  subtitle: string;
  location: string;
  tags: string[];
  maxVisibleTags?: number;
};

const MOCK_LISTINGS: Listing[] = [
  {
    id: "1",
    imageUri:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    rating: 4.8,
    title: "Al-Amal Specialized Center",
    status: "open",
    subtitle: "Rehabilitation & Therapy",
    location: "King Fahd Rd, Riyadh (1.2 km)",
    tags: [
      "Speech Therapy",
      "Physiotherapy",
      "Occupational Therapy",
      "Pediatrics",
      "Mental Health",
    ],
    maxVisibleTags: 2,
  },
  {
    id: "2",
    imageUri:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80",
    rating: 4.9,
    title: "Dr. Sara Ahmed",
    status: "busy",
    subtitle: "Consultant Pediatrician",
    location: "Olaya District, Riyadh (3.5 km)",
    tags: ["Family Counseling", "Child Psychology"],
  },
  {
    id: "3",
    imageUri:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    rating: 4.7,
    title: "Elite Wellness Center",
    status: "open",
    subtitle: "Comprehensive Care",
    location: "Al Malqa, Riyadh (2.1 km)",
    tags: ["Occupational Therapy", "Sports Therapy"],
  },
];

export default function CentersProfessionalsScreen() {
  const [query, setQuery] = useState("");
  const [filterActive, setFilterActive] = useState<FilterChipId>("near");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_LISTINGS;
    return MOCK_LISTINGS.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.subtitle.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.flex}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <DirectoryHeader />
          <DirectorySearchBar value={query} onChangeText={setQuery} />
          <DirectoryFilterChips
            activeId={filterActive}
            onSelect={setFilterActive}
            onDropdown={(id) =>
              Alert.alert(
                "Filter",
                `${id === "pediatrics" ? "Pediatrics" : "Therapy"} options coming soon.`
              )
            }
          />
          <DirectorySectionHeader
            title="Featured Centers"
            onAction={() =>
              Alert.alert("View all", "Full directory list coming soon.")
            }
          />
          {filtered.map((item) => (
            <DirectoryListingCard
              key={item.id}
              imageUri={item.imageUri}
              rating={item.rating}
              title={item.title}
              status={item.status}
              subtitle={item.subtitle}
              location={item.location}
              tags={item.tags}
              maxVisibleTags={item.maxVisibleTags}
              onPress={() =>
                Alert.alert(item.title, "Details screen can open here.")
              }
            />
          ))}
        </ScrollView>
        <DirectoryBottomNav active="directory" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: dirColors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: dirSpacing.screen,
    paddingBottom: 100,
  },
});
