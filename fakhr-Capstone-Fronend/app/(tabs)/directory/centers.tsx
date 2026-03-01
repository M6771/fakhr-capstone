import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCenters } from "../../../api/directory.api";
import {
  cardShadow,
  colors,
  radius,
  sectionSpacing,
  spacing,
  typography,
} from "../../../theme";
import { HealthCenter } from "../../../types/directory.types";
import { useState } from "react";
import { getCities, getSpecialties } from "../../../api/directory.api";

export default function CentersScreen() {

  type FilterType = "all" | "public" | "private";
  
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

    // جلب قائمة المدن
    const { data: cities = [] } = useQuery({
      queryKey: ["cities"],
      queryFn: getCities,
    });
  
    //
    const { data: specialties = [] } = useQuery({
      queryKey: ["specialties"],
      queryFn: getSpecialties,
    });
  
    
    const { data: centers, isLoading } = useQuery({
      queryKey: ["centers", filter, selectedCity, selectedTags],
      queryFn: () =>
        getCenters({
          type: filter === "all" ? undefined : filter,
          city: selectedCity || undefined,
          specialties: selectedTags.length > 0 ? selectedTags : undefined,
        }),
    });
      
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  
  const clearFilters = () => {
    setFilter("all");
    setSelectedCity("");
    setSelectedTags([]);
  };

  
  const activeFiltersCount =
    (filter !== "all" ? 1 : 0) +
    (selectedCity ? 1 : 0) +
    selectedTags.length;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.wrapper} edges={["top"]}>
        <View style={styles.container}>
          <Text style={styles.loadingText}>Loading centers...</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.wrapper} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>Health Centers</Text>
        {centers?.map((center: HealthCenter) => (
          <TouchableOpacity
            key={center.id}
            style={[styles.centerCard, cardShadow]}
            onPress={() =>
              router.push(`/(tabs)/directory/center-details?id=${center.id}`)
            }
            activeOpacity={0.85}
          >
            <Text style={styles.centerName}>{center.name}</Text>
            <Text style={styles.centerAddress}>{center.address}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 100,
  },
  loadingText: {
    fontSize: typography.body,
    color: colors.textMuted,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  // loadingText: {
  //   marginTop: 12,
  //   fontSize: 16,
  //   color: "#666",
  // },
  title: {
    fontSize: typography.title,
    lineHeight: typography.h1LineHeight,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginBottom: sectionSpacing.default,
  },
  centerCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  centerName: {
    fontSize: typography.h3,
    lineHeight: typography.h3LineHeight,
    fontWeight: typography.weightSemibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  centerAddress: {
    fontSize: typography.caption,
    lineHeight: typography.captionLineHeight,
    color: colors.textMuted,
  },
    // Styles للفلاتر الجديدة
    advancedFilterBtn: {
      backgroundColor: "#f0f9ff",
      padding: 14,
      borderRadius: 12,
      marginBottom: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#bfdbfe",
    },
    advancedFilterText: {
      color: "#2563eb",
      fontWeight: "600",
      fontSize: 16,
    },
    activeFilters: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 12,
    },
    activeFilterChip: {
      backgroundColor: "#e0e7ff",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    activeFilterText: {
      color: "#4338ca",
      fontSize: 13,
    },
    clearAllText: {
      color: "#dc2626",
      fontWeight: "500",
      paddingVertical: 6,
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: "#fff",
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      padding: 24,
      maxHeight: "80%",
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: 24,
      textAlign: "left",
    },
    filterLabel: {
      fontSize: 17,
      fontWeight: "600",
      color: "#374151",
      marginBottom: 12,
      textAlign: "left",
    },
    cityChip: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 22,
      backgroundColor: "#f3f4f6",
      marginLeft: 8,
    },
    cityChipActive: {
      backgroundColor: "#2563eb",
    },
    cityText: {
      color: "#6b7280",
      fontWeight: "500",
    },
    cityTextActive: {
      color: "#fff",
    },
    tagsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    tagOption: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: "#f3f4f6",
      borderWidth: 1,
      borderColor: "#e5e7eb",
    },
    tagOptionActive: {
      backgroundColor: "#dbeafe",
      borderColor: "#2563eb",
    },
    tagOptionText: {
      color: "#6b7280",
      fontSize: 14,
    },
    tagOptionTextActive: {
      color: "#2563eb",
      fontWeight: "600",
    },
    modalActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 28,
      gap: 12,
    },
    clearBtn: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      alignItems: "center",
    },
    clearBtnText: {
      color: "#6b7280",
      fontWeight: "600",
    },
    applyBtn: {
      flex: 2,
      paddingVertical: 16,
      borderRadius: 14,
      backgroundColor: "#2563eb",
      alignItems: "center",
    },
    applyBtnText: {
      color: "#fff",
      fontWeight: "600",
    },
});
