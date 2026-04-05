import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getCenterDetails } from "../../../api/directory.api";
import { colors, sectionSpacing, spacing, typography } from "../../../theme";

export default function CenterDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();

  const { data: center, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["center", id],
    queryFn: () => getCenterDetails(id as string),
    enabled: !!id && id !== "undefined",
    retry: 1,
  });
  
  const handleCall = () => {
    if (center?.phone) {
      Linking.openURL(`tel:${center.phone}`);
    }
  };

  const handleEmail = () => {
    if (center?.email) {
      Linking.openURL(`mailto:${center.email}`);
    }
  };

  const handleOpenGoogleMaps = () => {
    if (!center?.address) return;
    const fullAddress = center.city ? `${center.address}, ${center.city}` : center.address;
    const encodedAddress = encodeURIComponent(fullAddress);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    Linking.openURL(googleMapsUrl);
  };

  const handleOpenGoogleSearch = () => {
    const query = center?.city ? `${center.name} ${center.city}` : center?.name || "";
    if (!query.trim()) return;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    Linking.openURL(searchUrl);
  };
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <View style={styles.starsContainer}>
        {[...Array(fullStars)].map((_, i) => (
          <Text key={`full-${i}`} style={styles.starFilled}>★</Text>
        ))}
        {hasHalfStar && <Text style={styles.starHalf}>★</Text>}
        {[...Array(emptyStars)].map((_, i) => (
          <Text key={`empty-${i}`} style={styles.starEmpty}>☆</Text>
        ))}
        <Text style={styles.ratingNumber}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.wrapper} edges={["top"]}>
        <View style={styles.container}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !center) {
    return (
      <SafeAreaView style={styles.wrapper} edges={["top"]}>
        <View style={[styles.container, styles.emptyState]}>
          <Ionicons name="medical-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>
            {isError ? "Failed to load center" : "Center not found"}
          </Text>
          <Text style={styles.emptyText}>
            {isError ? (error?.message || "Please try again later.") : "This center may no longer be available."}
          </Text>
          <View style={styles.errorActions}>
            {isError && (
              <Pressable onPress={() => refetch()} style={styles.retryButton}>
                <Ionicons name="refresh" size={18} color="#FFFFFF" />
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            )}
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>{center.name}</Text>
          {center.type && (
            <View style={[styles.typeBadge, center.type === "public" ? styles.publicBadge : styles.privateBadge]}>
              <Text style={[styles.typeBadgeText, center.type === "public" ? styles.publicText : styles.privateText]}>
                {center.type}
              </Text>
            </View>
          )}
        </View>

        {center.address && (
          <Pressable onPress={handleOpenGoogleMaps} style={styles.locationRow}>
            <Ionicons name="location-outline" size={20} color={colors.primary} />
            <View style={styles.locationContent}>
              <Text style={styles.address}>{center.address}{center.city ? `, ${center.city}` : ""}</Text>
              <Text style={styles.openInMapsHint}>Tap to open in Google Maps</Text>
            </View>
            <Ionicons name="open-outline" size={18} color={colors.primary} />
          </Pressable>
        )}

        <Pressable onPress={handleOpenGoogleSearch} style={styles.googleSearchRow}>
          <Ionicons name="search" size={20} color={colors.primary} />
          <View style={styles.locationContent}>
            <Text style={styles.googleSearchText}>View more info on Google</Text>
            <Text style={styles.openInMapsHint}>Search for reviews, website & more</Text>
          </View>
          <Ionicons name="open-outline" size={18} color={colors.primary} />
        </Pressable>

        {center.phone && (
          <Pressable onPress={handleCall} style={styles.actionRow}>
            <Ionicons name="call-outline" size={20} color={colors.primary} />
            <Text style={styles.phone}>{String(center.phone)}</Text>
          </Pressable>
        )}

        {center.email && (
          <Pressable onPress={handleEmail} style={styles.actionRow}>
            <Ionicons name="mail-outline" size={20} color={colors.primary} />
            <Text style={styles.email}>{center.email}</Text>
          </Pressable>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Operating Hours</Text>
          <View style={styles.hoursRow}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={styles.hoursText}>
              {center.operatingHours || "Contact the center for operating hours"}
            </Text>
          </View>
        </View>

        {center.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{center.description}</Text>
          </View>
        )}

        {center.specialties && center.specialties.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specialties</Text>
            <View style={styles.servicesContainer}>
              {center.specialties.map((s) => (
                <View key={s} style={styles.serviceChip}>
                  <Text style={styles.serviceChipText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {center.address && (
          <Pressable onPress={handleOpenGoogleMaps} style={styles.mapLinkBtn}>
            <Ionicons name="map-outline" size={20} color={colors.primary} />
            <Text style={styles.mapLinkText}>Open in Google Maps</Text>
          </Pressable>
        )}
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
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: typography.body,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  errorActions: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: typography.body,
  },
  titleSection: {
    marginBottom: sectionSpacing.default,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  email: {
    fontSize: typography.body,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  title: {
    fontSize: typography.title,
    lineHeight: typography.h1LineHeight,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginBottom: sectionSpacing.default,
  },
  address: {
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
    color: colors.text,
  },
  phone: {
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#374151",
    fontWeight: "500",
  },
  header: {
    padding: 20,
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  // title: {
  //   fontSize: 26,
  //   fontWeight: "bold",
  //   color: "#1f2937",
  //   marginBottom: 12,
  // },
  typeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  publicBadge: {
    backgroundColor: "#dcfce7",
  },
  privateBadge: {
    backgroundColor: "#fef3c7",
  },
  typeBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  publicText: {
    color: "#15803d",
  },
  privateText: {
    color: "#b45309",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  description: {
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
    color: colors.textSecondary,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.backgroundCard || "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationContent: {
    flex: 1,
  },
  openInMapsHint: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 2,
  },
  googleSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.backgroundCard || "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  googleSearchText: {
    fontSize: typography.body,
    fontWeight: typography.weightSemibold,
    color: colors.text,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#1f2937",
  },
  infoLink: {
    fontSize: 16,
    color: "#2563eb",
    textDecorationLine: "underline",
  },
  actionsContainer: {
    padding: 20,
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  ratingContainer: {
    marginTop: 12,
  },
  ratingText: {
    fontSize: 16,
    color: "#f59e0b",
    fontWeight: "600",
  },

    headerMeta: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 12,
      marginTop: 8,
    },
    starsContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    starFilled: {
      fontSize: 18,
      color: "#f59e0b",
    },
    starHalf: {
      fontSize: 18,
      color: "#fcd34d",
    },
    starEmpty: {
      fontSize: 18,
      color: "#d1d5db",
    },
    ratingNumber: {
      marginLeft: 6,
      fontSize: 16,
      fontWeight: "600",
      color: "#1f2937",
    },
    servicesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    serviceChip: {
      backgroundColor: "#dbeafe",
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#93c5fd",
    },
    serviceChipText: {
      color: "#1e40af",
      fontSize: 14,
      fontWeight: "500",
    },
    hoursRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
    },
    hoursText: {
      flex: 1,
      fontSize: typography.body,
      lineHeight: typography.bodyLineHeight,
      color: colors.text,
    },
    cityText: {
      fontSize: 14,
      color: "#6b7280",
      marginTop: 2,
    },
    mapLinkBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: spacing.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      backgroundColor: "#f0fdf4",
      borderRadius: 8,
      alignSelf: "flex-start",
      borderWidth: 1,
      borderColor: "#86efac",
    },
    mapLinkText: {
      color: "#15803d",
      fontWeight: "500",
      fontSize: 14,
    },
    secondaryButton: {
      backgroundColor: "#f0fdf4",
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#86efac",
      marginTop: 12,
    },
    secondaryButtonText: {
      color: "#15803d",
      fontSize: 16,
      fontWeight: "600",
    },
    reviewCard: {
      backgroundColor: "#f9fafb",
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: "#e5e7eb",
    },
    reviewHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    reviewerName: {
      fontSize: 16,
      fontWeight: "600",
      color: "#1f2937",
    },
    reviewRating: {
      flexDirection: "row",
    },
    reviewStars: {
      fontSize: 14,
      color: "#f59e0b",
    },
    reviewComment: {
      fontSize: 14,
      color: "#4b5563",
      lineHeight: 20,
      marginBottom: 8,
    },
    reviewDate: {
      fontSize: 12,
      color: "#9ca3af",
    },
});
