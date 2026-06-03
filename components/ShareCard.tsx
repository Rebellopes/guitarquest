import { View, Text } from "react-native";
import { LESSONS } from "../data/lessons";
const totalLessons = LESSONS.length;

function getMilestone(completed: number): string {
  const pct = completed / totalLessons;
  if (pct === 0) return "Primeiros acordes 🎸";
  if (pct >= 1) return "Guitarrista completo! 🏆";
  if (pct >= 0.75) return "Quase lá! 🔥";
  if (pct >= 0.5) return "Metade do caminho! 💪";
  if (pct >= 0.25) return "Tá pegando o jeito! 👍";
  return "Bom começo! 🌱";
}

export default function ShareCard({
  streak,
  completedLessons,
  goal,
}: {
  streak: number;
  completedLessons: number;
  goal: string;
}) {
  return (
    <View className="w-80 bg-gradient-to-br from-[#1E1E2E] to-[#2A1E3D] rounded-3xl p-6 items-center border border-[#6C63FF]/30">
      <Text className="text-4xl mb-2">🎸</Text>
      <Text className="text-white text-xl font-bold mb-1">GuitarQuest</Text>
      <View className="w-full h-px bg-[#6C63FF]/30 my-3" />
      <View className="flex-row justify-around w-full mb-3">
        <View className="items-center">
          <Text className="text-[#FFD166] text-3xl font-bold">{streak}</Text>
          <Text className="text-gray-400 text-xs">🔥 Ritmo</Text>
        </View>
        <View className="items-center">
          <Text className="text-[#06D6A0] text-3xl font-bold">{completedLessons}</Text>
          <Text className="text-gray-400 text-xs">✅ Lições</Text>
        </View>
        <View className="items-center">
          <Text className="text-[#6C63FF] text-3xl font-bold">{totalLessons}</Text>
          <Text className="text-gray-400 text-xs">📚 Total</Text>
        </View>
      </View>
      <Text className="text-gray-300 text-sm text-center">{getMilestone(completedLessons)}</Text>
      <View className="w-full h-1.5 bg-surface-light rounded-full mt-3 overflow-hidden">
        <View className="h-full bg-primary rounded-full" style={{ width: `${(completedLessons / totalLessons) * 100}%` }} />
      </View>
      <Text className="text-gray-500 text-xs mt-4">Estou no dia {streak} de ritmo no GuitarQuest! 🎸</Text>
    </View>
  );
}
