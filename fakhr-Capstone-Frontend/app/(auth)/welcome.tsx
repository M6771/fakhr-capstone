import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Feature Row Component
const FeatureRow = ({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) => (
  <View style={styles.featureRow}>
    <View style={styles.featureIconContainer}>
      <Ionicons name={icon as any} size={24} color="#D99E8E" />
    </View>
    <View style={styles.featureText}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureSubtitle}>{subtitle}</Text>
    </View>
  </View>
);

export default function WelcomeScreen() {
  const router = useRouter();

  // Note: This screen is pre-authentication, so we can't fetch centers data
  // The health center card will navigate to the centers screen after login
  const handleGetStarted = () => {
    router.replace("/(auth)/register");
  };

  const handleAlreadyHaveAccount = () => {
    router.push("/(auth)/login");
  };

  const handleViewCenters = () => {
    // Navigate to login first, then user can access centers
    router.push("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        {/* App Branding */}
        <View style={styles.brandingSection}>
          <Text style={styles.appName}>Fakhr</Text>
          <Text style={styles.subtitle}>You&apos;re not alone.</Text>
          <Text style={styles.subtitle}>We&apos;ll guide you step by step.</Text>
        </View>

        {/* Feature Card */}
        <View style={styles.featureCard}>
          <FeatureRow
            icon="checkmark-circle"
            title="Stay Organized"
            subtitle="Track documents, renewals, and tasks in one calm space"
          />
          <View style={styles.featureDivider} />
          <FeatureRow
            icon="map"
            title="Get Guidance"
            subtitle="Follow your personalized care path week by week"
          />
          <View style={styles.featureDivider} />
          <FeatureRow
            icon="people"
            title="Find Community"
            subtitle="Connect with parents who understand your journey"
          />
        </View>

        {/* Health Centers Card */}
        <TouchableOpacity
          style={styles.healthCenterCard}
          onPress={handleViewCenters}
          activeOpacity={0.8}
        >
          <View style={styles.healthCenterCardContent}>
            <View style={styles.healthCenterIconContainer}>
              <Ionicons name="medical" size={28} color="#D99E8E" />
            </View>
            <View style={styles.healthCenterText}>
              <Text style={styles.healthCenterTitle}>Find Health Centers</Text>
              <Text style={styles.healthCenterSubtitle}>
                Discover specialized centers near you
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="rgba(51,51,51,0.3)" />
          </View>
        </TouchableOpacity>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGetStarted}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleAlreadyHaveAccount}
          >
            <Text style={styles.secondaryButtonText}>
              I already have an account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          Educational support only — not medical diagnosis.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6E4DE",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 40,
  },
  brandingSection: {
    alignItems: "center",
    marginBottom: 48,
  },
  appName: {
    fontSize: 42,
    fontWeight: "700",
    color: "#333333",
    letterSpacing: 2,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(51,51,51,0.55)",
    marginBottom: 4,
    textAlign: "center",
  },
  featureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F6E4DE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(51,51,51,0.55)",
    lineHeight: 20,
  },
  featureDivider: {
    height: 1,
    backgroundColor: "rgba(51,51,51,0.08)",
    marginVertical: 20,
    marginLeft: 64,
  },
  actionsSection: {
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: "#D99E8E",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(51,51,51,0.55)",
  },
  footerText: {
    fontSize: 12,
    fontWeight: "400",
    color: "rgba(51,51,51,0.55)",
    textAlign: "center",
    lineHeight: 18,
  },
  // Health Center Card
  healthCenterCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#D99E8E",
  },
  healthCenterCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  healthCenterIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F6E4DE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  healthCenterText: {
    flex: 1,
  },
  healthCenterTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  healthCenterSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(51,51,51,0.55)",
    lineHeight: 20,
  },
});
