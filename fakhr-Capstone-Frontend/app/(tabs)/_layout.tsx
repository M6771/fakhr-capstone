import { Tabs } from "expo-router";
import React from "react";
import { MainTabBar } from "../../components/navigation/MainTabBar";

/**
 * Main tabs: Home, Discover, (+ FAB), Circles (community), Settings (profile).
 * Directory, bookings, library, and legacy routes remain available via href: null.
 */
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <MainTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="discover" options={{ title: "Discover" }} />
      <Tabs.Screen
        name="community"
        options={{ title: "Circles", tabBarLabel: "Circles" }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Settings", tabBarLabel: "Settings" }}
      />

      <Tabs.Screen name="directory" options={{ href: null }} />
      <Tabs.Screen name="bookings" options={{ href: null }} />
      <Tabs.Screen name="library" options={{ href: null }} />
      <Tabs.Screen name="documents" options={{ href: null }} />
      <Tabs.Screen name="plan" options={{ href: null }} />
      <Tabs.Screen name="resources" options={{ href: null }} />
      <Tabs.Screen name="services" options={{ href: null }} />
      <Tabs.Screen name="professionals" options={{ href: null }} />
    </Tabs>
  );
}
