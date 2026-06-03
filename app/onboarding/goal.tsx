import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import type { UserGoalType } from "../../types";

const GOALS: { type: UserGoalType; icon: string; title: string; desc: string }[] = [
  {
    type: "chords",
    icon: "🎸",
    title: "Quero tocar meus acordes favoritos",
    desc: "Foco em acordes do dia a dia para tocar músicas simples",
  },
  {
    type: "solo",
    icon: "⚡",
    title: "Quero soltar solos incríveis",
    desc: "Técnica de solo, escalas e improvisação",
  },
  {
    type: "rhythm",
    icon: "🥁",
    title: "Quero ser um mestre do ritmo",
    desc: "Ritmo, percussão e acompanhamento",
  },
  {
    type: "complete",
    icon: "🏆",
    title: "Quero aprender tudo",
    desc: "Trilha completa: do básico ao avançado",
  },
];

export default function OnboardingGoal() {
  const [selected, setSelected] = useState<UserGoalType | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-5 pt-4">
        <View className="flex-row items-center mb-2">
          <View className="h-1 flex-1 bg-primary rounded-full" />
          <View className="h-1 flex-1 bg-primary rounded-full ml-1" />
          <View className="h-1 flex-1 bg-surface-light rounded-full ml-1" />
        </View>
        <Text className="text-gray-400 text-sm mt-2">Passo 2 de 3</Text>
      </View>

      <View className="flex-1 px-5 pt-6">
        <Text className="text-white text-2xl font-bold">
          Qual seu objetivo?
        </Text>
        <Text className="text-gray-400 mt-2 mb-6">
          Escolha o que mais combina com você
        </Text>

        {GOALS.map((goal) => (
          <TouchableOpacity
            key={goal.type}
            className={`flex-row items-center p-4 mb-3 rounded-2xl border-2 ${
              selected === goal.type
                ? "border-primary bg-primary/10"
                : "border-transparent bg-surface"
            }`}
            onPress={() => setSelected(goal.type)}
          >
            <Text className="text-3xl mr-4">{goal.icon}</Text>
            <View className="flex-1">
              <Text className="text-white font-bold">{goal.title}</Text>
              <Text className="text-gray-400 text-sm mt-1">{goal.desc}</Text>
            </View>
            <View
              className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                selected === goal.type ? "border-primary" : "border-gray-500"
              }`}
            >
              {selected === goal.type && (
                <View className="w-3 h-3 rounded-full bg-primary" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View className="px-5 pb-10">
        <TouchableOpacity
          className={`py-4 rounded-2xl items-center ${
            selected ? "bg-primary" : "bg-surface-light"
          }`}
          disabled={!selected}
          onPress={() => router.push(`/onboarding/confirm?goal=${selected}`)}
        >
          <Text
            className={`font-bold text-lg ${
              selected ? "text-white" : "text-gray-500"
            }`}
          >
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
