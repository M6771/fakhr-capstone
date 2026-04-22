import { Tabs } from "expo-router";
import React from "react";
import { MainTabBar } from "../../components/navigation/MainTabBar";

/**
 * Main app tabs: Home, Directory (Centers & Professionals), Bookings, Profile.
 * Library, Community, and legacy routes stay available with href: null.
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
      <Tabs.Screen name="directory" options={{ title: "Directory" }} />
      <Tabs.Screen name="bookings" options={{ title: "Bookings" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />

      <Tabs.Screen name="library" options={{ href: null }} />
      <Tabs.Screen name="community" options={{ href: null }} />
      <Tabs.Screen name="documents" options={{ href: null }} />
      <Tabs.Screen name="plan" options={{ href: null }} />
      <Tabs.Screen name="resources" options={{ href: null }} />
      <Tabs.Screen name="services" options={{ href: null }} />
      <Tabs.Screen name="professionals" options={{ href: null }} />
    </Tabs>
  );
}
