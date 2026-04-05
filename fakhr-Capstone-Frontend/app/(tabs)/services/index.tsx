import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "../../../api/services.api";

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
};

export default function ServicesScreen() {
  const router = useRouter();

  // Fetch services from API
  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
    retry: false,
  });

  const handleServicePress = (serviceId: string) => {
    router.push({
      pathname: "/(tabs)/services/service-details",
      params: { id: serviceId },
    });
  };

  // Calculate stats from services data
  const totalProviders = services.reduce((acc, s) => acc + s.providers, 0);
  const avgRating = services.length > 0
    ? services.reduce((acc, s) => acc + s.rating, 0) / services.length
    : 0;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="grid" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Services</Text>
            <Text style={styles.subtitle}>
              Browse available services for your child
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{services.length}</Text>
            <Text style={styles.statLabel}>Services</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalProviders}</Text>
            <Text style={styles.statLabel}>Providers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{avgRating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading services...</Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
            <Text style={styles.errorText}>Failed to load services</Text>
            <Text style={styles.errorSubtext}>Please try again later</Text>
          </View>
        )}

        {/* Services List */}
        {!isLoading && !error && (
          <>
            <Text style={styles.sectionTitle}>All Services</Text>
            <View style={styles.servicesList}>
              {services.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="grid-outline" size={48} color={colors.textMuted} />
                  <Text style={styles.emptyText}>No services available</Text>
                </View>
              ) : (
                services.map((service) => (
            <Pressable
              key={service.id}
              style={({ pressed }) => [
                styles.serviceCard,
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
              onPress={() => handleServicePress(service.id)}
            >
              {/* Service Icon */}
              <View
                style={[
                  styles.serviceIconWrap,
                  { backgroundColor: `${service.color}15` },
                ]}
              >
                <Ionicons
                  name={service.icon as any}
                  size={26}
                  color={service.color}
                />
              </View>

              {/* Service Info */}
              <View style={styles.serviceInfo}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{service.category}</Text>
                  </View>
                </View>
                <Text style={styles.serviceDescription} numberOfLines={2}>
                  {service.description}
                </Text>
                <View style={styles.serviceMeta}>
                  <View style={styles.ratingWrap}>
                    <Ionicons name="star" size={14} color="#F5A623" />
                    <Text style={styles.ratingText}>{service.rating}</Text>
                  </View>
                  <View style={styles.metaDot} />
                  <Ionicons
                    name="person-outline"
                    size={14}
                    color={colors.textMuted}
                  />
                  <Text style={styles.providersText}>
                    {service.providers} providers
                  </Text>
                </View>
              </View>

              {/* Arrow */}
              <View style={styles.arrowWrap}>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textMuted}
                />
              </View>
                </Pressable>
                ))
              )}
            </View>
          </>
        )}
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
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  // Stats Row
  statsRow: {
    flexDirection: "row",
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  // Section
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  // Services List
  servicesList: {
    gap: 12,
  },
  serviceCard: {
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
  serviceIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  categoryBadge: {
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.primary,
    textTransform: "uppercase",
  },
  serviceDescription: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: 8,
  },
  serviceMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textMuted,
    marginHorizontal: 4,
  },
  providersText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  arrowWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.bgApp,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
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
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textMuted,
  },
});
