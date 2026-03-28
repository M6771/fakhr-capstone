/**
 * Care Path screen — design tokens (matches provided mockups)
 */
export const carePathColors = {
  background: "#F5F6FA",
  primary: "#7C82A1",
  success: "#22C55E",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  card: "#FFFFFF",
  inputBg: "#F1F3F9",
  progressTrack: "#E5E7EB",
  skipButtonBg: "#F1F3F9",
  badgeBg: "#E5E7EB",
  starEmpty: "#D1D5DB",
} as const;

export const carePathRadii = {
  card: 20,
  button: 12,
  input: 12,
  pill: 999,
  sm: 8,
} as const;

export const carePathSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const carePathShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 4,
};

export const carePathShadowSoft = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 6,
  elevation: 3,
};
