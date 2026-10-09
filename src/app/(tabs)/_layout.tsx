// app/(tabs)/_layout.tsx
import type { ComponentProps, ReactElement } from "react";
import { router, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Mycolors } from "@/constants/mycolors";
import { useAuthStore } from "@/store/auth.store";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

interface TabConfig {
  name: string;
  title: string;
  icon: IoniconName;
  protected?: boolean;
}

// Single source of truth for tabs. To protect a tab, add `protected: true`.
const TAB_CONFIG: readonly TabConfig[] = [
  { name: "index", title: "Home", icon: "home-outline" },
  { name: "services", title: "Services", icon: "briefcase-outline" },
   { name: "profile", title: "Profile", icon: "person-outline", protected: true },
  { name: "dashboard", title: "Dashboard", icon: "grid-outline", protected: true },
];

export default function TabsLayout(): ReactElement {
  const insets = useSafeAreaInsets();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  // Stops the tab switch before the screen mounts, so there's no flash.
  // ProtectedRoute inside each screen remains the real guard (deep links, router.push).
  const guardTab = (name: string) => ({
    tabPress: (e: { preventDefault: () => void }): void => {
      // While hydrating, let the press through; ProtectedRoute decides once loaded.
      if (!isLoading && !isAuthenticated) {
        e.preventDefault();
        router.push({
          pathname: "/login",
          params: { redirectTo: `/${name}` },
        });
      }
    },
  });

  return (
    <>
      <StatusBar style="light" />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Mycolors.primarycolor,
            borderTopWidth: 0,
            height: 64 + insets.bottom,
            paddingTop: 8,
            paddingBottom: insets.bottom + 6,
            elevation: 0,
          },
          tabBarActiveTintColor: Mycolors.secondarycolor,
          tabBarInactiveTintColor: Mycolors.graycolor,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            marginTop: 2,
          },
          tabBarItemStyle: {
            paddingVertical: 2,
          },
        }}
      >
        {TAB_CONFIG.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            listeners={tab.protected ? guardTab(tab.name) : undefined}
            options={{
              title: tab.title,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name={tab.icon} size={size} color={color} />
              ),
            }}
          />
        ))}
      </Tabs>
    </>
  );
}