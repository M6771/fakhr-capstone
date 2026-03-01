/**
 * Fakhr — Colors
 *
 * DESIGN DIRECTION:
 * - Calm, soft, minimal, mobile-first
 * - Primary: #7FB77E (sage green)
 * - Background: #FAF9F6 (off-white)
 * - Secondary: #5F8F8B (teal)
 * - Text: #2F2F2F (dark gray)
 */

export const colors = {
  // Surfaces — soft, warm, minimal
  background: "#FAF9F6",         // off-white
  backgroundCard: "#FFFFFF",
  backgroundElevated: "#FFFFFF",
  backgroundSecondary: "#EDE7DB", // beige

  // Primary (sage green — calm, natural)
  primary: "#7FB77E",
  primaryLight: "#A8D4A7",
  primaryMuted: "#6A9E69",

  // Secondary (teal — complementary)
  secondary: "#5F8F8B",
  secondaryLight: "#8FBAB7",

  // Text — clear hierarchy
  text: "#2F2F2F",
  textSecondary: "#4A4A4A",
  textMuted: "#6B6B6B",
  textLight: "#8A8A8A",

  // UI — soft borders
  border: "#EDE7DB",
  borderLight: "#F5F3EF",

  // Semantic
  success: "#7FB77E",
  error: "#D9534F",
  errorLight: "#FDECEA",
  warning: "#E8A838",
  info: "#5F8F8B",

  // Specific
  signOut: "#D9534F",
  accent: "#7FB77E",
} as const;
