/** Fakhr Library — design tokens (matches mockup) */
export const libColors = {
  background: "#F5F6FA",
  primary: "#7C82A1",
  success: "#22C55E",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  card: "#FFFFFF",
  chip: "#E5E7EB",
  searchBg: "#E5E7EB",
  pillInactiveBg: "#E5E7EB",
  videoBadge: "rgba(0,0,0,0.72)",
  infographicBadge: "#E5E7EB",
} as const;

export const libRadii = {
  card: 24,
  pill: 999,
  sm: 12,
  md: 16,
  fab: 999,
} as const;

export const libSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  screen: 20,
} as const;

export const libShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 12,
  elevation: 5,
};

export const libShadowSoft = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 3,
};

export const libFabShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.12,
  shadowRadius: 10,
  elevation: 8,
};
