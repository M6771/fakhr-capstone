import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../../api/users.api";

// Design system colors
const colors = {
  bgApp: "#FAF9F6",
  bgCard: "#FFFFFF",
  primary: "#7FB77E",
  text: "#2F2F2F",
  textSecondary: "#4A4A4A",
  textMuted: "#8A8A8A",
  border: "rgba(0, 0, 0, 0.06)",
  signOut: "#D9534F",
};

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Fetch current user profile from API
  const { data: currentUser, isLoading, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!user, // Only fetch if user is logged in
    retry: false,
  });

  const handleSignOut = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  // Use API data if available, fallback to context user, then defaults
  const userName = currentUser?.name || user?.name || "Guest User";
  const userEmail = currentUser?.email || user?.email || "Not signed in";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Loading State
  if (isLoading && user) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.pageTitle}>Profile</Text>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Note: If there's an error fetching fresh data, we'll still show the profile
  // using cached data from AuthContext (user object)

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.pageTitle}>Profile</Text>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userInitials}</Text>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
        </View>

        {/* Profile Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="person-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{userName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="mail-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userEmail}</Text>
            </View>
          </View>
        </View>

        {/* Settings Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Settings</Text>

          <Pressable
            style={({ pressed }) => [
              styles.settingsRow,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => router.push("/(tabs)/profile/settings")}
          >
            <View style={styles.settingsIcon}>
              <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
            </View>
            <Text style={styles.settingsText}>App Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={({ pressed }) => [
              styles.settingsRow,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => router.push("/(tabs)/profile/manage-children")}
          >
            <View style={styles.settingsIcon}>
              <Ionicons name="people-outline" size={20} color={colors.textSecondary} />
            </View>
            <Text style={styles.settingsText}>Manage Children</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>
        </View>

        {/* Sign Out Button */}
        <Pressable
          onPress={handleSignOut}
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.signOut} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgApp,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 24,
  },
  // Avatar Section
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  userName: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 15,
    color: colors.textMuted,
  },
  // Card
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  // Info Row
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  // Settings Row
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.bgApp,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  settingsText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  // Sign Out
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${colors.signOut}10`,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.signOut,
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
  },
});
