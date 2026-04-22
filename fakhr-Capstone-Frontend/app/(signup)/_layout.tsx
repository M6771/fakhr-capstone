import { Stack } from "expo-router";
import React from "react";

/**
 * Signup stack (React Navigation Stack via Expo Router): Create Account → Child Profile → Step 3.
 */
export default function SignupStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "#F9F9F9" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="child-profile-setup" />
      <Stack.Screen name="step-three" />
    </Stack>
  );
}
