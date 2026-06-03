import { useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, Easing } from "react-native-reanimated";

interface StarPowerBannerProps {
  currentStreak: number;
  longestStreak: number;
  onShare?: () => void;
}

const MILESTONES = [
  { days: 1, label: "Primeiro dia!", icon: "🌟", color: "#CD7F32" },
  { days: 7, label: "Uma semana!", icon: "⭐", color: "#C0C0C0" },
  { days: 30, label: "Um mês!", icon: "💫", color: "#FFD700" },
  { days: 60, label: "Dois meses!", icon: "🔥", color: "#FFD700" },
  { days: 100, label: "Centenário!", icon: "👑", color: "#B9F2FF" },
];

export default function StarPowerBanner({ currentStreak, longestStreak, onShare }: StarPowerBannerProps) {
  const pulse = useSharedValue(1);

  const milestone = useMemo(() => {
    for (let i = MILESTONES.length - 1; i >= 0; i--) {
      if (currentStreak >= MILESTONES[i].days) return MILESTONES[i];
    }
    return null;
  }, [currentStreak]);

  const nextMilestone = useMemo(() => {
    for (const m of MILESTONES) {
      if (currentStreak < m.days) return m;
    }
    return null;
  }, [currentStreak]);

  const isMilestone = milestone && currentStreak > 0;

  useEffect(() => {
    if (isMilestone) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
      );
    }
  }, [isMilestone]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  if (currentStreak === 0) {
    return (
      <View className="bg-surface rounded-2xl p-4 flex-row items-center">
        <Text className="text-3xl mr-3">🌱</Text>
        <View className="flex-1">
          <Text className="text-white font-bold">Comece seu Ritmo hoje!</Text>
          <Text className="text-gray-400 text-xs mt-1">
            Pratique hoje para iniciar sua sequência
          </Text>
        </View>
        {onShare && (
          <TouchableOpacity onPress={onShare} className="bg-primary px-3 py-2 rounded-xl ml-2">
            <Text className="text-white text-xs font-bold">Compartilhar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View className="bg-surface rounded-2xl p-4">
      <View className="flex-row items-center">
        <Animated.Text className="text-4xl mr-3" style={pulseStyle}>
          {milestone?.icon || "⭐"}
        </Animated.Text>
        <View className="flex-1">
          <Text className="text-white font-bold text-lg">
            {currentStreak} dias seguidos!
          </Text>
          {milestone && (
            <Text className="text-xs font-bold mt-0.5" style={{ color: milestone.color }}>
              {milestone.label} {milestone.icon}
            </Text>
          )}
        </View>
        {onShare && (
          <TouchableOpacity onPress={onShare} className="bg-primary px-3 py-2 rounded-xl ml-2">
            <Text className="text-white text-xs font-bold">Compartilhar</Text>
          </TouchableOpacity>
        )}
      </View>

      {nextMilestone && currentStreak < 100 && (
        <View className="mt-3 bg-background rounded-xl p-3 flex-row items-center">
          <Text className="text-xl mr-2">{nextMilestone.icon}</Text>
          <View className="flex-1">
            <Text className="text-gray-400 text-xs">
              Próximo marco: {nextMilestone.days} dias
            </Text>
            <View className="h-1.5 bg-surface-light rounded-full mt-1 overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, (currentStreak / nextMilestone.days) * 100)}%`,
                  backgroundColor: nextMilestone.color,
                }}
              />
            </View>
          </View>
          <Text className="text-gray-500 text-xs ml-2">
            {nextMilestone.days - currentStreak} restantes
          </Text>
        </View>
      )}

      <View className="flex-row items-end justify-between mt-4 px-1">
        {[1, 7, 30, 60, 100].map((day) => {
          const reached = currentStreak >= day;
          const m = MILESTONES.find((m) => m.days === day);
          return (
            <View key={day} className="items-center" style={{ width: 52 }}>
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  reached ? "" : "bg-[#1E1E2E]"
                }`}
                style={reached ? { backgroundColor: m?.color + "30" } : { borderWidth: 1, borderColor: "#2A2A3D" }}
              >
                <Text className="text-lg">{reached ? m?.icon : ""}</Text>
              </View>
              <Text
                className={`text-xs mt-1.5 font-bold ${
                  reached ? (m ? { color: m.color } : "text-white") : "text-gray-600"
                }`}
                style={reached && m ? { color: m.color } : {}}
              >
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
