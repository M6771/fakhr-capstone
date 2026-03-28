import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  dirColors,
  dirRadii,
  dirShadow,
  dirSpacing,
} from "./directoryTheme";

export type ListingStatus = "open" | "busy";

export type DirectoryListingCardProps = {
  imageUri: string;
  rating: number;
  title: string;
  status: ListingStatus;
  subtitle: string;
  location: string;
  tags: string[];
  /** Show first N tags, then "+X more" for the rest */
  maxVisibleTags?: number;
  onPress?: () => void;
  onBookPress?: () => void;
  onPhonePress?: () => void;
};

const DEFAULT_VISIBLE = 2;

export function DirectoryListingCard({
  imageUri,
  rating,
  title,
  status,
  subtitle,
  location,
  tags,
  maxVisibleTags = DEFAULT_VISIBLE,
  onPress,
  onBookPress,
  onPhonePress,
}: DirectoryListingCardProps) {
  const visible = tags.slice(0, maxVisibleTags);
  const rest = Math.max(0, tags.length - maxVisibleTags);

  const statusStyle =
    status === "open" ? styles.badgeOpen : styles.badgeBusy;
  const statusLabel = status === "open" ? "OPEN" : "BUSY";

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={14} color={dirColors.star} />
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={[styles.statusPill, statusStyle]}>
            <Text
              style={[
                styles.statusText,
                status === "open"
                  ? styles.statusOpenText
                  : styles.statusBusyText,
              ]}
            >
              {statusLabel}
            </Text>
          </View>
        </View>

        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>

        <View style={styles.locRow}>
          <Ionicons
            name="location-outline"
            size={16}
            color={dirColors.textSecondary}
          />
          <Text style={styles.locText} numberOfLines={2}>
            {location}
          </Text>
        </View>

        <View style={styles.tagsRow}>
          {visible.map((t) => (
            <View key={t} style={styles.tag}>
              <Text style={styles.tagText} numberOfLines={1}>
                {t}
              </Text>
            </View>
          ))}
          {rest > 0 ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>+{rest} more</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
            ]}
            onPress={() => {
              if (onBookPress) {
                onBookPress();
              } else {
                Alert.alert("Book", "Appointment booking coming soon.");
              }
            }}
          >
            <Text style={styles.primaryBtnText}>Book Appointment</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.phoneBtn,
              pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
            ]}
            onPress={() => {
              if (onPhonePress) {
                onPhonePress();
              } else {
                Alert.alert("Call", "Phone action coming soon.");
              }
            }}
          >
            <Ionicons
              name="call-outline"
              size={22}
              color={dirColors.primary}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: dirColors.card,
    borderRadius: dirRadii.card,
    overflow: "hidden",
    marginBottom: dirSpacing.xl,
    ...dirShadow,
  },
  cardPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.99 }],
  },
  imageWrap: {
    height: 160,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: dirRadii.card,
    borderTopRightRadius: dirRadii.card,
  },
  ratingBadge: {
    position: "absolute",
    top: dirSpacing.md,
    right: dirSpacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: dirColors.ratingBadgeBg,
    paddingHorizontal: dirSpacing.sm,
    paddingVertical: 6,
    borderRadius: dirRadii.sm,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "700",
    color: dirColors.textPrimary,
  },
  body: {
    padding: dirSpacing.lg,
    borderBottomLeftRadius: dirRadii.card,
    borderBottomRightRadius: dirRadii.card,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: dirSpacing.sm,
    marginBottom: dirSpacing.xs,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: dirColors.textPrimary,
  },
  statusPill: {
    paddingHorizontal: dirSpacing.sm,
    paddingVertical: 4,
    borderRadius: dirRadii.pill,
  },
  badgeOpen: {
    backgroundColor: dirColors.openBg,
  },
  badgeBusy: {
    backgroundColor: dirColors.busyBg,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  statusOpenText: {
    color: dirColors.openText,
  },
  statusBusyText: {
    color: dirColors.busyText,
  },
  subtitle: {
    fontSize: 14,
    color: dirColors.textSecondary,
    marginBottom: dirSpacing.sm,
  },
  locRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: dirSpacing.md,
  },
  locText: {
    flex: 1,
    fontSize: 13,
    color: dirColors.textSecondary,
    lineHeight: 18,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: dirSpacing.sm,
    marginBottom: dirSpacing.lg,
  },
  tag: {
    backgroundColor: dirColors.chip,
    paddingHorizontal: dirSpacing.md,
    paddingVertical: 6,
    borderRadius: dirRadii.pill,
    maxWidth: "100%",
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
    color: dirColors.textPrimary,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: dirSpacing.md,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: dirColors.primary,
    paddingVertical: dirSpacing.md + 2,
    borderRadius: dirRadii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: dirColors.card,
  },
  phoneBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: dirColors.phoneBorder,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: dirColors.card,
  },
});
