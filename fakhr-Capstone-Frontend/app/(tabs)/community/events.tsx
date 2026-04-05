import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getEvents } from "../../../api/community.api";
import {
  cardShadow,
  colors,
  radius,
  sectionSpacing,
  spacing,
  typography,
} from "../../../theme";
import { Event } from "../../../types/community.types";

export default function EventsScreen() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.wrapper} edges={["top"]}>
        <View style={styles.container}>
          <Text style={styles.loadingText}>Loading events...</Text>
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
        <Text style={styles.title}>Upcoming Events</Text>
        {events?.map((event: Event) => (
          <View key={event.id} style={[styles.eventCard, cardShadow]}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDate}>{event.date}</Text>
            <Text style={styles.eventDescription}>{event.description}</Text>
          </View>
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
  title: {
    fontSize: typography.title,
    lineHeight: typography.h1LineHeight,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginBottom: sectionSpacing.default,
  },
  eventCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  eventTitle: {
    fontSize: typography.h3,
    lineHeight: typography.h3LineHeight,
    fontWeight: typography.weightSemibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  eventDate: {
    fontSize: typography.caption,
    lineHeight: typography.captionLineHeight,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  eventDescription: {
    fontSize: typography.caption,
    lineHeight: typography.captionLineHeight,
    color: colors.textSecondary,
  },
});
