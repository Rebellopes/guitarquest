import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useGoalStore } from "../../store";
import type { UserGoalType } from "../../types";

const GOAL_LABELS: Record<UserGoalType, { icon: string; title: string }> = {
  chords: { icon: "🎸", title: "Acordes Favoritos" },
  solo: { icon: "⚡", title: "Solos Incríveis" },
  rhythm: { icon: "🥁", title: "Mestre do Ritmo" },
  complete: { icon: "🏆", title: "Trilha Completa" },
};

export default function OnboardingConfirm() {
  const { goal } = useLocalSearchParams<{ goal: UserGoalType }>();
  const goalInfo = GOAL_LABELS[goal] || GOAL_LABELS.complete;

  useEffect(() => {
    if (!goal) router.replace("/onboarding");
  }, [goal]);

  const { setGoal, completeOnboarding } = useGoalStore();

  const handleStart = () => {
    if (goal) {
      setGoal(goal);
      completeOnboarding();
    }
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-5 pt-4">
        <View className="flex-row items-center mb-2">
          <View className="h-1 flex-1 bg-primary rounded-full" />
          <View className="h-1 flex-1 bg-primary rounded-full ml-1" />
          <View className="h-1 flex-1 bg-primary rounded-full ml-1" />
        </View>
        <Text className="text-gray-400 text-sm mt-2">Passo 3 de 3</Text>
      </View>

      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-6xl mb-4">{goalInfo.icon}</Text>
        <Text className="text-white text-2xl font-bold text-center">
          Tudo pronto!
        </Text>
        <Text className="text-gray-400 text-center mt-4 text-lg leading-6">
          Sua trilha será focada em{" "}
          <Text className="text-primary font-bold">{goalInfo.title}</Text>.
          Vamos começar essa jornada musical!
        </Text>
      </View>

      <View className="px-5 pb-10">
        <TouchableOpacity
          className="bg-primary py-4 rounded-2xl items-center"
          onPress={handleStart}
        >
          <Text className="text-white font-bold text-lg">Iniciar Trilha 🚀</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
