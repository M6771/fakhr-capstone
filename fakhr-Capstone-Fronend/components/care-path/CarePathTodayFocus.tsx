import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  carePathColors,
  carePathRadii,
  carePathSpacing,
} from "./carePathTheme";
import { CarePathCard } from "./CarePathCard";
import { CarePathStarRating } from "./CarePathStarRating";

type Props = {
  title: string;
  description: string;
  badge?: string;
  notes: string;
  onNotesChange: (t: string) => void;
  rating: number;
  onRatingChange: (n: number) => void;
  onDone?: () => void;
  onSkip?: () => void;
};

export function CarePathTodayFocus({
  title,
  description,
  badge = "PRIORITY",
  notes,
  onNotesChange,
  rating,
  onRatingChange,
  onDone,
  onSkip,
}: Props) {
  return (
    <CarePathCard accentLeft style={styles.cardOuter}>
      <View style={styles.headRow}>
        <Text style={styles.taskTitle}>{title}</Text>
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.desc}>{description}</Text>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.doneBtn,
            pressed && styles.btnPressed,
          ]}
          onPress={onDone}
        >
          <Ionicons
            name="checkmark"
            size={18}
            color={carePathColors.card}
          />
          <Text style={styles.doneBtnText}>Done</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.skipBtn,
            pressed && styles.btnPressed,
          ]}
          onPress={onSkip}
        >
          <Ionicons
            name="ban-outline"
            size={18}
            color={carePathColors.textPrimary}
          />
          <Text style={styles.skipBtnText}>Skip</Text>
        </Pressable>
      </View>

      <Text style={styles.notesLabel}>Notes</Text>
      <TextInput
        style={styles.notesInput}
        placeholder="How did it feel?"
        placeholderTextColor={carePathColors.textSecondary}
        value={notes}
        onChangeText={onNotesChange}
        multiline
        textAlignVertical="top"
      />

      <View style={styles.ratingRow}>
        <Text style={styles.ratingLabel}>Helpfulness?</Text>
        <CarePathStarRating value={rating} onChange={onRatingChange} />
      </View>
    </CarePathCard>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    marginBottom: carePathSpacing.lg,
  },
  headRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: carePathSpacing.sm,
    marginBottom: carePathSpacing.sm,
  },
  taskTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: carePathColors.textPrimary,
  },
  badge: {
    backgroundColor: carePathColors.badgeBg,
    paddingHorizontal: carePathSpacing.md,
    paddingVertical: carePathSpacing.xs,
    borderRadius: carePathRadii.pill,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: carePathColors.textSecondary,
  },
  desc: {
    fontSize: 15,
    lineHeight: 22,
    color: carePathColors.textSecondary,
    marginBottom: carePathSpacing.lg,
  },
  actions: {
    flexDirection: "row",
    gap: carePathSpacing.md,
    marginBottom: carePathSpacing.lg,
  },
  doneBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: carePathSpacing.sm,
    backgroundColor: carePathColors.primary,
    paddingVertical: carePathSpacing.md,
    borderRadius: carePathRadii.button,
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: carePathColors.card,
  },
  skipBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: carePathSpacing.sm,
    backgroundColor: carePathColors.skipButtonBg,
    paddingVertical: carePathSpacing.md,
    borderRadius: carePathRadii.button,
  },
  skipBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: carePathColors.textPrimary,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  notesLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: carePathColors.textPrimary,
    marginBottom: carePathSpacing.sm,
  },
  notesInput: {
    minHeight: 88,
    backgroundColor: carePathColors.inputBg,
    borderRadius: carePathRadii.input,
    paddingHorizontal: carePathSpacing.lg,
    paddingVertical: carePathSpacing.md,
    fontSize: 15,
    color: carePathColors.textPrimary,
    marginBottom: carePathSpacing.lg,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: carePathColors.textPrimary,
  },
});
