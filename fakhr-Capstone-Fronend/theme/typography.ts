/**
 * Fakhr — Typography
 *
 * Clear hierarchy with comfortable line heights
 *
 * HIERARCHY:
 * - Screen titles: display (28px) — main page heading
 * - Section headers: h1 (24px) or h2 (20px) — major sections
 * - Body text: body (16px) — primary content
 * - Helper/caption: caption (14px) minimum — supporting text, labels
 *
 * MINIMUM SIZES:
 * - No fonts smaller than 14px for readable text
 * - overline (12px) and label (13px) reserved for UI-only elements (tab bar, badges)
 * - Always pair fontSize with lineHeight for readability
 */

export const typography = {
  // Screen titles — main page heading
  display: 28,
  displayLineHeight: 34,
  
  // Section headers — major sections
  h1: 24,
  h1LineHeight: 30,
  h2: 20,
  h2LineHeight: 26,
  h3: 18,
  h3LineHeight: 24,
  
  // Body text — primary content
  body: 16,
  bodyLineHeight: 24,
  bodySmall: 15,
  bodySmallLineHeight: 22,
  
  // Helper/caption — supporting text (minimum readable size)
  caption: 14,
  captionLineHeight: 20,
  
  // UI-only — very small elements (tab bar, badges, not for readable text)
  label: 13,
  labelLineHeight: 18,
  overline: 12,
  overlineLineHeight: 16,
  
  // Aliases for consistency
  title: 28, // Same as display
  titleSmall: 22,
  section: 18, // Same as h3
  
  // Font weights
  weightRegular: "400" as const,
  weightMedium: "500" as const,
  weightSemibold: "600" as const,
  weightBold: "700" as const,
} as const;
