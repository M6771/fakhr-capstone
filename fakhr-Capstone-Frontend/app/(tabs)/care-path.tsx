import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Design system colors
const colors = {
  bgApp: "#FAF9F6",
  bgCard: "#FFFFFF",
  primary: "#7FB77E",
  text: "#2F2F2F",
  textSecondary: "#4A4A4A",
  textMuted: "#8A8A8A",
  border: "rgba(0, 0, 0, 0.06)",
};

// Mock services data
const SERVICES = [
  {
    id: "1",
    name: "Speech Therapy",
    description: "Improve communication and language skills",
    icon: "chatbubble-outline",
  },
  {
    id: "2",
    name: "Occupational Therapy",
    description: "Develop daily living and motor skills",
    icon: "hand-left-outline",
  },
  {
    id: "3",
    name: "Behavioral Therapy",
    description: "Address behavioral challenges with proven techniques",
    icon: "heart-outline",
  },
  {
    id: "4",
    name: "Physical Therapy",
    description: "Enhance movement and physical development",
    icon: "fitness-outline",
  },
  {
    id: "5",
    name: "Educational Support",
    description: "Academic assistance and learning strategies",
    icon: "school-outline",
  },
  {
    id: "6",
    name: "Family Counseling",
    description: "Support for the whole family",
    icon: "people-outline",
  },
];

export default function ServicesScreen() {
  const router = useRouter();

  const handleServicePress = (service: (typeof SERVICES)[0]) => {
    Alert.alert(
      service.name,
      `${service.description}\n\nService details page coming soon.`
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Services</Text>
        <Text style={styles.subtitle}>
          Browse available services for your child
        </Text>

        <View style={styles.servicesList}>
          {SERVICES.map((service) => (
            <Pressable
              key={service.id}
              style={({ pressed }) => [
                styles.serviceCard,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => handleServicePress(service)}
            >
              <View style={styles.serviceIcon}>
                <Ionicons
                  name={service.icon as any}
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View style={styles.serviceContent}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>
                  {service.description}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textMuted}
              />
            </Pressable>
          ))}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  servicesList: {
    gap: 12,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  serviceContent: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
