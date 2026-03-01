import { Stack } from "expo-router";
import { colors, typography } from "../../../theme";

/**
 * Directory Stack Layout — Directory screens with back button
 */
export default function DirectoryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.primary,
        headerShadowVisible: false,
        headerBackTitle: "",
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="centers"
        options={{
          headerShown: true,
          headerTitle: "Health Centers",
          headerTitleStyle: {
            fontSize: typography.h2,
            fontWeight: typography.weightBold,
            color: colors.text,
          },
        }}
      />
      <Stack.Screen
        name="professionals"
        options={{
          headerShown: true,
          headerTitle: "Professionals",
          headerTitleStyle: {
            fontSize: typography.h2,
            fontWeight: typography.weightBold,
            color: colors.text,
          },
        }}
      />
      <Stack.Screen
        name="center-details"
        options={{
          headerShown: true,
          headerTitle: "Center Details",
          headerTitleStyle: {
            fontSize: typography.h2,
            fontWeight: typography.weightBold,
            color: colors.text,
          },
        }}
      />
      <Stack.Screen
        name="professional-details"
        options={{
          headerShown: true,
          headerTitle: "Professional Details",
          headerTitleStyle: {
            fontSize: typography.h2,
            fontWeight: typography.weightBold,
            color: colors.text,
          },
        }}
      />
      <Stack.Screen
        name="helpCenter"
        options={{
          headerShown: false, // We have a custom header in the component
        }}
      />
    </Stack>
  );
}
