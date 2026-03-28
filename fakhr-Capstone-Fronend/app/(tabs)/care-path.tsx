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
import {
  CarePathBottomNav,
  type CarePathTabId,
  CarePathStatCard,
  CarePathTaskRow,
  CarePathTodayFocus,
  CarePathWeeklyProgress,
  carePathColors,
  carePathRadii,
  carePathShadowSoft,
  carePathSpacing,
} from "../../components/care-path";

const FOCUS_DATE = new Date(2023, 9, 24);

function formatFocusDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CarePathScreen() {
  const router = useRouter();
  const [progressPercent] = React.useState(75);
  const [notes, setNotes] = React.useState("");
  const [rating, setRating] = React.useState(3);
  const [bottomTab, setBottomTab] = React.useState<CarePathTabId>("home");

  const onTabPress = (id: CarePathTabId) => {
    setBottomTab(id);
    switch (id) {
      case "home":
        router.replace("/(tabs)");
        break;
      case "path":
        break;
      case "stats":
        router.push("/(tabs)/plan/progress");
        break;
      case "profile":
        router.push("/(tabs)/profile");
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.root}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              onPress={() =>
                Alert.alert("Menu", "Navigation menu (placeholder).")
              }
              hitSlop={12}
            >
              <Ionicons name="menu-outline" size={26} color={carePathColors.textPrimary} />
            </Pressable>
            <Text style={styles.headerTitle}>Care Path</Text>
            <Pressable
              style={({ pressed }) => [styles.calendarBtn, pressed && styles.pressed]}
              onPress={() =>
                Alert.alert("Calendar", "Calendar (placeholder).")
              }
            >
              <Ionicons
                name="calendar-outline"
                size={22}
                color={carePathColors.textPrimary}
              />
            </Pressable>
          </View>

          <CarePathWeeklyProgress
            percent={progressPercent}
            supportingText="Almost there! Just 6 more tasks to hit your goal."
          />

          <View style={styles.statsRow}>
            <CarePathStatCard
              icon="flame-outline"
              label="Current Streak"
              value="12 Days"
              trend="+2 days"
            />
            <View style={styles.statsGap} />
            <CarePathStatCard
              icon="checkmark-circle-outline"
              label="Completed"
              value="18/24"
              trend="+3 today"
            />
          </View>

          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Today&apos;s Focus</Text>
            <Text style={styles.sectionDate}>{formatFocusDate(FOCUS_DATE)}</Text>
          </View>

          <CarePathTodayFocus
            title="Morning Mindfulness"
            description="15 minutes of guided meditation to start the day."
            badge="PRIORITY"
            notes={notes}
            onNotesChange={setNotes}
            rating={rating}
            onRatingChange={setRating}
            onDone={() => Alert.alert("Done", "Great job completing this task.")}
            onSkip={() => Alert.alert("Skip", "Task skipped for now.")}
          />

          <CarePathTaskRow
            title="Hydration Goal"
            subtitle="Drink 2.5L throughout the day"
            icon="water-outline"
            completed={false}
            onToggle={() => Alert.alert("Hydration", "Mark complete (placeholder).")}
          />

          <CarePathTaskRow
            title="Short Afternoon Walk"
            subtitle=""
            icon="walk-outline"
            completed
            completedAt="14:30"
          />

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <CarePathBottomNav active={bottomTab} onTabPress={onTabPress} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: carePathColors.background,
  },
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: carePathSpacing.xl,
    paddingTop: carePathSpacing.sm,
    paddingBottom: carePathSpacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: carePathSpacing.xl,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarBtn: {
    width: 44,
    height: 44,
    borderRadius: carePathRadii.sm,
    backgroundColor: carePathColors.card,
    alignItems: "center",
    justifyContent: "center",
    ...carePathShadowSoft,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: carePathColors.textPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: carePathSpacing.xxl,
  },
  statsGap: {
    width: carePathSpacing.md,
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: carePathSpacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: carePathColors.textPrimary,
  },
  sectionDate: {
    fontSize: 13,
    color: carePathColors.textSecondary,
  },
  bottomSpacer: {
    height: carePathSpacing.xxl,
  },
});
