import { Stack } from "expo-router";
import React from "react";

/**
 * Community (Circles) stack: feed + advice reply flow.
 */
export default function CommunityStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "#F9F9F9" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="advice" />
    </Stack>
  );
}
