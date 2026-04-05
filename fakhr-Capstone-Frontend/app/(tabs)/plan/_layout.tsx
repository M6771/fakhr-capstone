import { Stack } from "expo-router";
import { colors, typography } from "../../../theme";

/**
 * Plan Stack Layout — Care Path screens with back button
 */
export default function PlanLayout() {
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
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="task-details"
        options={{
          headerShown: true,
          headerTitle: "Task Details",
          headerTitleStyle: {
            fontSize: typography.h2,
            fontWeight: typography.weightBold,
            color: colors.text,
          },
        }}
      />
      <Stack.Screen
        name="check-in"
        options={{
          headerShown: true,
          headerTitle: "Daily Check-In",
          headerTitleStyle: {
            fontSize: typography.h2,
            fontWeight: typography.weightBold,
            color: colors.text,
          },
        }}
      />
      <Stack.Screen
        name="progress"
        options={{
          headerShown: true,
          headerTitle: "Progress",
          headerTitleStyle: {
            fontSize: typography.h2,
            fontWeight: typography.weightBold,
            color: colors.text,
          },
        }}
      />
    </Stack>
  );
}
