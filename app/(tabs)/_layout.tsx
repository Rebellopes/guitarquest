import { Tabs } from "expo-router";
import { Text, View } from "react-native";

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    home: "🎸",
    settings: "⚙️",
    tuner: "🎵",
  };

  return (
    <View className="items-center justify-center">
      <Text className={`text-2xl ${focused ? "opacity-100" : "opacity-50"}`}>
        {icons[name] || "?"}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1E1E2E",
          borderTopColor: "#2A2A3D",
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#6C63FF",
        tabBarInactiveTintColor: "#6B7280",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tuner-screen"
        options={{
          title: "Afinador",
          tabBarIcon: ({ focused }) => <TabIcon name="tuner" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Config",
          tabBarIcon: ({ focused }) => <TabIcon name="settings" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
