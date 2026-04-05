import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProfessionalDetails } from "../../../api/directory.api";
import { colors, sectionSpacing, spacing, typography } from "../../../theme";

export default function ProfessionalDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { data: professional, isLoading, error } = useQuery({
    queryKey: ["professional", id],
    queryFn: () => getProfessionalDetails(id as string),
    enabled: !!id,
    retry: false,
  });

  const handleCall = () => {
    if (professional?.phone) {
      Linking.openURL(`tel:${professional.phone}`);
    }
  };

  const handleEmail = () => {
    if (professional?.email) {
      Linking.openURL(`mailto:${professional.email}`);
    }
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
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Professional Profile</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading professional details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !professional) {
    return (
      <SafeAreaView style={styles.wrapper} edges={["top"]}>
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Professional Profile</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
          <Text style={styles.errorText}>Professional not found</Text>
          <Text style={styles.errorSubtext}>
            {error ? "Failed to load professional details" : "The professional you're looking for doesn't exist"}
          </Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Professional Profile</Text>
        <Pressable style={styles.shareBtn}>
          <Ionicons name="share-outline" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{professional?.name}</Text>
        
        {/* Specialty */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialty</Text>
          <View style={styles.specialtyBadge}>
            <Text style={styles.specialtyText}>{professional?.specialty}</Text>
          </View>
        </View>

        {/* Rating */}
        {professional?.rating !== undefined && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rating</Text>
            {renderStars(professional.rating)}
          </View>
        )}

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          {professional?.phone && (
            <TouchableOpacity style={styles.infoRow} onPress={handleCall}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoLink}>📞 {professional.phone}</Text>
            </TouchableOpacity>
          )}
          {professional?.email && (
            <TouchableOpacity style={styles.infoRow} onPress={handleEmail}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoLink}>✉️ {professional.email}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Location */}
        {(professional?.city || professional?.address) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            {professional?.address && (
              <Text style={styles.infoValue}>📍 {professional.address}</Text>
            )}
            {professional?.city && (
              <Text style={styles.cityText}>{professional.city}</Text>
            )}
          </View>
        )}

        {/* Center */}
        {professional?.centerName && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Center</Text>
            <Text style={styles.infoValue}>🏥 {professional.centerName}</Text>
          </View>
        )}

        {/* Description */}
        {professional?.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{professional.description}</Text>
          </View>
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
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.backgroundCard,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.text,
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.backgroundCard,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: {
    width: 40,
  },
  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 100,
  },
  // Hero Section
  heroSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  heroAvatar: {
    width: 100,
    height: 100,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    position: "relative",
  },
  heroAvatarText: {
    fontSize: 32,
    fontWeight: "700",
  },
  verifiedBadgeLarge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.background,
  },
  professionalName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: sectionSpacing.default,
  },
  section: {
    marginBottom: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightSemibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  specialtyBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#dbeafe",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: typography.body,
    color: "#1d4ed8",
    fontWeight: "600",
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
    color: colors.text,
  },
  infoRow: {
    marginBottom: spacing.md,
  },
  infoLabel: {
    fontSize: typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.body,
    color: colors.text,
    lineHeight: typography.bodyLineHeight,
  },
  infoLink: {
    fontSize: typography.body,
    color: "#2563eb",
    textDecorationLine: "underline",
  },
  cityText: {
    fontSize: typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  // Quick Info Card
  quickInfoCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  quickInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 8,
  },
  quickInfoContent: {
    flex: 1,
  },
  quickInfoLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 2,
  },
  quickInfoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  quickInfoDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  bioText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  // Services
  servicesList: {
    gap: 10,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  serviceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  serviceText: {
    fontSize: 15,
    color: colors.text,
  },
  // Education
  educationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
  },
  educationText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  // Certifications
  certificationsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  certificationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: `${colors.primary}12`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  certificationText: {
    fontSize: 13,
    color: colors.text,
  },
  // Languages
  languagesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  languageBadge: {
    backgroundColor: colors.backgroundCard,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  languageText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  // Contact
  contactList: {
    gap: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contactText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  // Loading & Error States
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
