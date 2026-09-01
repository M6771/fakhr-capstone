import { Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { MainTabBar } from "../../components/navigation/MainTabBar";

/**
 * Main tabs: Home, Discover, (+ FAB), Circles (community), Settings (profile).
 */
export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={(props) => <MainTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen name="index" options={{ title: t("tabs.home") }} />
      <Tabs.Screen name="discover" options={{ title: t("tabs.discover") }} />
      <Tabs.Screen
        name="community"
        options={{ title: t("tabs.circles"), tabBarLabel: t("tabs.circles") }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarLabel: t("tabs.profile"),
        }}
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
