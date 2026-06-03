import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function OnboardingWelcome() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-7xl mb-6">🎸</Text>
        <Text className="text-white text-3xl font-bold text-center">
          Bem-vindo ao{" "}
          <Text className="text-primary">GuitarQuest</Text>
        </Text>
        <Text className="text-gray-400 text-center mt-4 text-lg leading-6">
          Sua jornada musical transformada em uma aventura gamificada.
          Aprenda guitarra no seu ritmo, todos os dias.
        </Text>

        <View className="flex-row mt-12 space-x-4">
          <View className="items-center flex-1 bg-surface rounded-2xl p-4">
            <Text className="text-3xl mb-2">📚</Text>
            <Text className="text-white text-xs text-center">
              Trilha Personalizada
            </Text>
          </View>
          <View className="items-center flex-1 bg-surface rounded-2xl p-4">
            <Text className="text-3xl mb-2">⭐</Text>
            <Text className="text-white text-xs text-center">
              Ritmo Diário
            </Text>
          </View>
          <View className="items-center flex-1 bg-surface rounded-2xl p-4">
            <Text className="text-3xl mb-2">🎵</Text>
            <Text className="text-white text-xs text-center">
              Afinador Embutido
            </Text>
          </View>
        </View>
      </View>

      <View className="px-5 pb-10">
        <TouchableOpacity
          className="bg-primary py-4 rounded-2xl items-center"
          onPress={() => router.push("/onboarding/goal")}
        >
          <Text className="text-white font-bold text-lg">Começar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
