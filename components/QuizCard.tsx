import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming, Easing, runOnJS } from "react-native-reanimated";
import type { QuizQuestion } from "../types";

interface QuizCardProps {
  question: QuizQuestion;
  onComplete: (correct: boolean, selectedIndex: number) => void;
  isLastExercise?: boolean;
  questionIndex?: number;
  totalQuestions?: number;
}

export default function QuizCard({ question, onComplete, isLastExercise, questionIndex, totalQuestions }: QuizCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const shake = useSharedValue(0);

  const isCorrect = selectedIndex === question.correctIndex;

  const shakeAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelectedIndex(idx);
  };

  const handleConfirm = () => {
    if (selectedIndex === null) return;
    if (selectedIndex !== question.correctIndex) {
      shake.value = withSequence(
        withTiming(-10, { duration: 50, easing: Easing.inOut(Easing.ease) }),
        withTiming(10, { duration: 50, easing: Easing.inOut(Easing.ease) }),
        withTiming(-10, { duration: 50, easing: Easing.inOut(Easing.ease) }),
        withTiming(10, { duration: 50, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 50, easing: Easing.inOut(Easing.ease) }),
      );
    }
    setShowResult(true);
  };

  const handleNext = () => {
    onComplete(isCorrect, selectedIndex!);
  };

  const getOptionStyle = (idx: number) => {
    if (!showResult || selectedIndex === null) {
      return selectedIndex === idx ? "border-primary bg-primary/10" : "border-transparent bg-surface";
    }
    if (idx === question.correctIndex) return "border-green-500 bg-green-500/10";
    if (idx === selectedIndex && !isCorrect) return "border-red-500 bg-red-500/10";
    return "border-transparent bg-surface opacity-50";
  };

  const getOptionTextStyle = (idx: number) => {
    if (!showResult) return selectedIndex === idx ? "text-white" : "text-gray-300";
    if (idx === question.correctIndex) return "text-green-400";
    if (idx === selectedIndex && !isCorrect) return "text-red-400";
    return "text-gray-500";
  };

  return (
    <Animated.View className="bg-surface rounded-2xl p-5" style={shakeAnim}>
      <View className="flex-row items-start mb-4">
        <Text className="text-2xl mr-2 mt-0.5">📝</Text>
        <View className="flex-1 mr-2">
          <Text className="text-white font-bold text-lg leading-6 break-words">
            {question.question}
          </Text>
        </View>
        {totalQuestions !== undefined && questionIndex !== undefined && (
          <View className="bg-[#1E1E2E] rounded-lg px-2 py-1 min-w-[36px] items-center">
            <Text className="text-gray-500 text-xs font-bold">
              {questionIndex + 1}/{totalQuestions}
            </Text>
          </View>
        )}
      </View>

      {question.options.map((opt, idx) => (
        <TouchableOpacity
          key={idx}
          className={`flex-row items-center p-4 mb-2 rounded-xl border-2 ${getOptionStyle(idx)}`}
          onPress={() => handleSelect(idx)}
          disabled={showResult}
        >
          <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
            showResult && idx === question.correctIndex
              ? "bg-green-500"
              : showResult && idx === selectedIndex && !isCorrect
              ? "bg-red-500"
              : selectedIndex === idx
              ? "bg-primary"
              : "bg-surface-light"
          }`}>
            <Text className="text-white font-bold text-sm">
              {showResult && idx === question.correctIndex ? "✓" : 
               showResult && idx === selectedIndex && !isCorrect ? "✗" :
               String.fromCharCode(65 + idx)}
            </Text>
          </View>
          <View className="flex-1">
            <Text className={`text-sm font-medium leading-5 ${getOptionTextStyle(idx)}`}>
              {opt}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {showResult && (
        <View className={`mt-3 rounded-xl p-3 ${isCorrect ? "bg-green-500/10" : "bg-red-500/10"}`}>
          <Text className={`font-bold ${isCorrect ? "text-green-400" : "text-red-400"}`}>
            {isCorrect ? "✅ Correto!" : "❌ Incorreto!"}
          </Text>
          {!isCorrect && (
            <Text className="text-gray-300 text-sm mt-1">
              Resposta correta: {question.options[question.correctIndex]}
            </Text>
          )}
        </View>
      )}

      <TouchableOpacity
        className={`mt-4 py-3 rounded-xl items-center ${
          selectedIndex !== null && !showResult ? "bg-primary" : "bg-surface-light"
        }`}
        disabled={selectedIndex === null}
        onPress={showResult ? handleNext : handleConfirm}
      >
        <Text className={`font-bold ${
          selectedIndex !== null ? "text-white" : "text-gray-500"
        }`}>
          {showResult
            ? isLastExercise
              ? "Finalizar Lição 🏆"
              : "Continuar →"
            : "Confirmar Resposta"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
