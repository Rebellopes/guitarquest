import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming, Easing, useSharedValue } from "react-native-reanimated";
import type { Exercise } from "../types";

interface PracticeExerciseProps {
  exercise: Exercise;
  onComplete: () => void;
  isLastExercise?: boolean;
}

export default function PracticeExercise({ exercise, onComplete, isLastExercise }: PracticeExerciseProps) {
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [practiced, setPracticed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const toggleTimer = () => {
    if (timerActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimerActive(false);
    } else {
      setTimerActive(true);
      timerRef.current = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <View className="bg-surface rounded-2xl p-4">
      <View className="flex-row items-center mb-4">
        <Text className="text-2xl mr-2">🎯</Text>
        <Text className="text-white font-bold text-lg flex-1">{exercise.title}</Text>
      </View>

      <Text className="text-gray-300 leading-6 mb-4">{exercise.instructions}</Text>

      {exercise.diagramUrl && (
        <View className="bg-background rounded-xl p-4 items-center mb-4">
          <Image
            source={{ uri: exercise.diagramUrl }}
            className="w-full h-40"
            resizeMode="contain"
          />
          <Text className="text-gray-400 text-xs mt-2">Diagrama de referência</Text>
        </View>
      )}

      <View className="flex-row items-center justify-between bg-background rounded-xl p-4 mb-4">
        <View className="items-center flex-1">
          <Text className="text-gray-400 text-xs mb-1">Prática</Text>
          <Animated.View style={pulseStyle}>
            <Text className="text-3xl">🎸</Text>
          </Animated.View>
        </View>
        <View className="items-center flex-1">
          <Text className="text-gray-400 text-xs mb-1">Tempo</Text>
          <Text className="text-white text-2xl font-bold font-mono">
            {formatTime(timerSeconds)}
          </Text>
          <TouchableOpacity
            onPress={toggleTimer}
            className="mt-1 bg-surface-light px-3 py-1 rounded-lg"
          >
            <Text className="text-primary text-xs font-bold">
              {timerActive ? "Pausar ⏸" : "Iniciar ⏱"}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => setPracticed(true)}
          className={`flex-1 items-center ${practiced ? "opacity-50" : ""}`}
          disabled={practiced}
        >
          <Text className="text-gray-400 text-xs mb-1">Status</Text>
          <View className={`w-12 h-12 rounded-full items-center justify-center ${practiced ? "bg-green-600" : "bg-surface-light"}`}>
            <Text className="text-white text-xl">{practiced ? "✓" : "?"}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {exercise.tips && (
        <View className="mb-4">
          <TouchableOpacity
            onPress={() => setShowTips(!showTips)}
            className="flex-row items-center bg-background rounded-xl p-3"
          >
            <Text className="text-accent font-bold text-xs flex-1">💡 Dica do Mestre</Text>
            <Text className="text-gray-400 text-sm">{showTips ? "▲" : "▼"}</Text>
          </TouchableOpacity>
          {showTips && (
            <View className="bg-background rounded-b-xl px-3 pb-3 -mt-1">
              <Text className="text-gray-300 text-sm">{exercise.tips}</Text>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity
        className={`py-4 rounded-xl items-center ${practiced ? "bg-green-600" : "bg-surface-light"}`}
        disabled={!practiced}
        onPress={onComplete}
      >
        <Text className={`font-bold ${practiced ? "text-white" : "text-gray-500"}`}>
          {isLastExercise ? "Finalizar Lição 🏆" : "Já pratiquei! ✓"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
