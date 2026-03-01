import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { getChildren, Child } from "../../../api/children.api";

// Design system colors
const colors = {
  bgApp: "#FAF9F6",
  bgCard: "#FFFFFF",
  primary: "#7FB77E",
  primaryLight: "#E8F5E8",
  secondary: "#5F8F8B",
  text: "#2F2F2F",
  textSecondary: "#4A4A4A",
  textMuted: "#8A8A8A",
  border: "rgba(0, 0, 0, 0.06)",
  error: "#D9534F",
};

// Color palette for children avatars
const CHILD_COLORS = [
  "#7FB77E",
  "#FF69B4",
  "#5F8F8B",
  "#E8A838",
  "#7B68EE",
  "#D9534F",
];

// Helper function to calculate age from date of birth
const calculateAge = (dateOfBirth?: string): number | undefined => {
  if (!dateOfBirth) return undefined;
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function ManageChildrenScreen() {
  const router = useRouter();

  // Fetch children from API
  const { data: children = [], isLoading, error, refetch } = useQuery({
    queryKey: ["children"],
    queryFn: getChildren,
    retry: false,
  });

  // Map children data to include color and formatted data
  const childrenWithColor = React.useMemo(() => {
    return children.map((child, index) => {
      // Handle diagnosis - backend now returns array, but handle both cases for safety
      let diagnoses: string[] = [];
      if (Array.isArray(child.diagnosis)) {
        // Backend returns as array
        diagnoses = child.diagnosis;
      } else if (child.diagnoses && Array.isArray(child.diagnoses)) {
        // Use diagnoses alias if available
        diagnoses = child.diagnoses;
      } else if (child.diagnosis && typeof child.diagnosis === "string") {
        // Fallback: if it's a string, try to parse it as JSON array, otherwise split by comma
        try {
          const parsed = JSON.parse(child.diagnosis);
          diagnoses = Array.isArray(parsed) ? parsed : [child.diagnosis];
        } catch {
          // If not JSON, split by comma or use as single item
          diagnoses = child.diagnosis.split(",").map((d: string) => d.trim()).filter(Boolean);
        }
      }

      // Handle medications - backend returns string, frontend expects array of objects
      let medications: Array<{ name: string; dosage?: string; frequency?: string }> = [];
      if (child.medications) {
        if (typeof child.medications === "string") {
          try {
            const parsed = JSON.parse(child.medications);
            medications = Array.isArray(parsed) ? parsed : [];
          } catch {
            // If not JSON, treat as single medication name
            medications = [{ name: child.medications }];
          }
        } else if (Array.isArray(child.medications)) {
          medications = child.medications;
        }
      }

      // Handle allergies - backend now returns array, but handle both cases for safety
      let allergies: string[] = [];
      if (Array.isArray(child.allergies)) {
        // Backend returns as array
        allergies = child.allergies;
      } else if (child.allergies && typeof child.allergies === "string") {
        // Fallback: if it's a string, try to parse it as JSON array, otherwise split by comma
        try {
          const parsed = JSON.parse(child.allergies);
          allergies = Array.isArray(parsed) ? parsed : [child.allergies];
        } catch {
          // If not JSON, split by comma or use as single item
          allergies = child.allergies.split(",").map((a: string) => a.trim()).filter(Boolean);
        }
      }

      const age = child.age || calculateAge(child.dateOfBirth);
      const color = CHILD_COLORS[index % CHILD_COLORS.length];
      
      return {
        ...child,
        diagnoses,
        age,
        color,
        dateOfBirth: child.dateOfBirth,
        medications,
        allergies,
      };
    });
  }, [children]);

  const handleAddChild = () => {
    router.push("/(tabs)/profile/add-child" as any);
  };

  const handleViewChild = (childId: string) => {
    // Navigate to view child details
    router.push({
      pathname: "/(tabs)/profile/child-details" as any,
      params: { id: childId },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Manage Children</Text>
        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.7 }]}
          onPress={handleAddChild}
        >
          <Ionicons name="add" size={24} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <View>
            {/* Pull to refresh will be handled by React Query */}
          </View>
        }
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={colors.secondary} />
          <Text style={styles.infoText}>
            Add your children&apos;s profiles to get personalized recommendations and
            track their progress.
          </Text>
        </View>

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading children...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
            <Text style={styles.errorText}>Failed to load children</Text>
            <Text style={styles.errorSubtext}>
              {error instanceof Error ? error.message : "Please try again"}
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.retryButton,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => refetch()}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {/* Children List */}
        {!isLoading && !error && childrenWithColor.length > 0 ? (
          <View style={styles.childrenList}>
            {childrenWithColor.map((child) => (
              <Pressable
                key={child.id}
                style={({ pressed }) => [
                  styles.childCard,
                  pressed && { transform: [{ scale: 0.98 }] },
                ]}
                onPress={() => handleViewChild(child.id)}
              >
                {/* Child Avatar */}
                <View
                  style={[
                    styles.childAvatar,
                    { backgroundColor: `${child.color}20` },
                  ]}
                >
                  <Text style={[styles.childAvatarText, { color: child.color }]}>
                    {child.name.split(" ").map((n) => n[0]).join("")}
                  </Text>
                </View>

                {/* Child Info */}
                <View style={styles.childInfo}>
                  <View style={styles.childNameRow}>
                    <Text style={styles.childName}>{child.name}</Text>
                    <View style={styles.ageBadge}>
                      <Text style={styles.ageBadgeText}>{child.age} yrs</Text>
                    </View>
                  </View>

                  {/* Diagnosis Tags */}
                  {child.diagnoses && child.diagnoses.length > 0 && (
                    <View style={styles.diagnosisTags}>
                      {child.diagnoses.map((diagnosis, idx) => (
                        <View key={`${diagnosis}-${idx}`} style={styles.diagnosisTag}>
                          <Text style={styles.diagnosisTagText}>{diagnosis}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Medical Summary */}
                  <View style={styles.medicalSummary}>
                    {child.medications && child.medications.length > 0 && (
                      <View style={styles.medicalItem}>
                        <Ionicons
                          name="medkit-outline"
                          size={14}
                          color={colors.textMuted}
                        />
                        <Text style={styles.medicalItemText}>
                          {child.medications.length} medication
                          {child.medications.length !== 1 ? "s" : ""}
                        </Text>
                      </View>
                    )}
                    {child.allergies && child.allergies.length > 0 && (
                      <View style={styles.medicalItem}>
                        <Ionicons
                          name="warning-outline"
                          size={14}
                          color={colors.error}
                        />
                        <Text style={[styles.medicalItemText, { color: colors.error }]}>
                          {child.allergies.length} allerg
                          {child.allergies.length !== 1 ? "ies" : "y"}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Arrow */}
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textMuted}
                />
              </Pressable>
            ))}
          </View>
        ) : !isLoading && !error ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="people-outline" size={40} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No Children Added</Text>
            <Text style={styles.emptySubtitle}>
              Add your child&apos;s profile to get started with personalized care
              recommendations.
            </Text>
          </View>
        ) : null}

        {/* Add Child Button */}
        <Pressable
          style={({ pressed }) => [
            styles.addChildButton,
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleAddChild}
        >
          <View style={styles.addChildIcon}>
            <Ionicons name="add" size={24} color={colors.primary} />
          </View>
          <View style={styles.addChildContent}>
            <Text style={styles.addChildTitle}>Add a Child</Text>
            <Text style={styles.addChildSubtitle}>
              Include medical records, medications & allergies
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>

        {/* Medical Records Info */}
        <View style={styles.mrInfoCard}>
          <Text style={styles.mrInfoTitle}>Medical Records Include:</Text>
          <View style={styles.mrInfoList}>
            <View style={styles.mrInfoItem}>
              <Ionicons name="medical-outline" size={18} color={colors.primary} />
              <Text style={styles.mrInfoItemText}>Diagnosis Information</Text>
            </View>
            <View style={styles.mrInfoItem}>
              <Ionicons name="medkit-outline" size={18} color={colors.primary} />
              <Text style={styles.mrInfoItemText}>Current Medications</Text>
            </View>
            <View style={styles.mrInfoItem}>
              <Ionicons name="warning-outline" size={18} color={colors.error} />
              <Text style={styles.mrInfoItemText}>Allergies & Sensitivities</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgApp,
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
    backgroundColor: colors.bgCard,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  // Info Card
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: `${colors.secondary}10`,
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.secondary,
    lineHeight: 20,
  },
  // Children List
  childrenList: {
    gap: 12,
    marginBottom: 20,
  },
  childCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  childAvatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  childAvatarText: {
    fontSize: 18,
    fontWeight: "700",
  },
  childInfo: {
    flex: 1,
  },
  childNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  childName: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.text,
  },
  ageBadge: {
    backgroundColor: colors.bgApp,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ageBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
  },
  diagnosisTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  diagnosisTag: {
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  diagnosisTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.primary,
  },
  medicalSummary: {
    flexDirection: "row",
    gap: 12,
  },
  medicalItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  medicalItemText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
  },
  // Add Child Button
  addChildButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: `${colors.primary}30`,
    borderStyle: "dashed",
  },
  addChildIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  addChildContent: {
    flex: 1,
  },
  addChildTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 4,
  },
  addChildSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
  },
  // MR Info Card
  mrInfoCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  mrInfoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 14,
  },
  mrInfoList: {
    gap: 12,
  },
  mrInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  mrInfoItemText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  // Loading & Error States
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  errorSubtext: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
