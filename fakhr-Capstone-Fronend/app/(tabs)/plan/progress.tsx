import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProgress } from "../../../api/care-path.api";
import {
  cardShadow,
  colors,
  radius,
  sectionSpacing,
  spacing,
  typography,
} from "../../../theme";

export default function ProgressScreen() {
  const { data: progress, isLoading } = useQuery({
    queryKey: ["progress"],
    queryFn: getProgress,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.wrapper} edges={["top"]}>
        <View style={styles.container}>
          <Text style={styles.loadingText}>Loading progress...</Text>
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
        <Text style={styles.title}>Progress Overview</Text>
        <View style={[styles.statCard, cardShadow]}>
          <Text style={styles.statValue}>{progress?.completedTasks || 0}</Text>
          <Text style={styles.statLabel}>Completed Tasks</Text>
        </View>
        <View style={[styles.statCard, cardShadow]}>
          <Text style={styles.statValue}>{progress?.totalTasks || 0}</Text>
          <Text style={styles.statLabel}>Total Tasks</Text>
        </View>
        <View style={[styles.statCard, cardShadow]}>
          <Text style={styles.statValue}>{progress?.completionRate || 0}%</Text>
          <Text style={styles.statLabel}>Completion Rate</Text>
        </View>
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
  statCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    marginBottom: spacing.lg,
    alignItems: "center",
  },
  statValue: {
    fontSize: typography.display + 12,
    lineHeight: typography.displayLineHeight + 14,
    fontWeight: typography.weightBold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});
