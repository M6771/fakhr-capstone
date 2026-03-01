import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="manage-children" />
      <Stack.Screen name="add-child" />
      <Stack.Screen name="child-details" />
      <Stack.Screen name="edit-child" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
