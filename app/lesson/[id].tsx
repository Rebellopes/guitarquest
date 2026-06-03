import { useState, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useProgressStore } from "../../store";
import { getLessonById, LESSONS } from "../../data/lessons";
import { useShare } from "../../utils/useShare";
import ShareCard from "../../components/ShareCard";
import QuizCard from "../../components/QuizCard";
import PracticeExercise from "../../components/PracticeExercise";
import YouTubePlayer from "../../components/YouTubePlayer";
import StarPowerBanner from "../../components/StarPowerBanner";
import { useGoalStore } from "../../store";
import type { Exercise } from "../../types";

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLessonById(id || "");
  const { completeLesson, completedLessons, recordExerciseResult, exerciseResults, streakData } = useProgressStore();

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [isRefazendo, setIsRefazendo] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const listRef = useRef<FlatList>(null);
  const { shareCardRef, share } = useShare();
  const goal = useGoalStore((s) => s.goal);

  if (!lesson) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-white text-xl">Lição não encontrada</Text>
        <TouchableOpacity
          className="mt-4 bg-primary py-3 px-6 rounded-2xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const alreadyCompleted = completedLessons.includes(lesson.id) && !isRefazendo;
  const exercises = lesson.exercises;
  const currentExercise = exercises[currentExerciseIndex];
  const allExercisesDone = completedExercises.size === exercises.length;

  const currentIndex = LESSONS.findIndex((l) => l.id === lesson.id);
  const nextLesson = LESSONS[currentIndex + 1];
  const isLast = !nextLesson;

  const handleExerciseComplete = (exerciseId: string, correct?: boolean, selectedIndex?: number) => {
    if (correct !== undefined && selectedIndex !== undefined) {
      recordExerciseResult(lesson.id, exerciseId, correct, selectedIndex);
    }
    setCompletedExercises((prev) => new Set(prev).add(exerciseId));
    if (currentExerciseIndex < exercises.length - 1) {
      const nextIdx = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIdx);
      setTimeout(() => {
        listRef.current?.scrollToIndex({ index: nextIdx, animated: true });
      }, 100);
    } else {
      setShowCompletionModal(true);
    }
  };

  const handleCompleteLesson = () => {
    completeLesson(lesson.id, nextLesson?.id || lesson.id);
    setShowCompletionModal(false);
    router.back();
  };

  const handleRefazer = () => {
    setIsRefazendo(true);
    setCurrentExerciseIndex(0);
    setCompletedExercises(new Set());
  };

  const goToExercise = useCallback((index: number) => {
    setCurrentExerciseIndex(index);
    listRef.current?.scrollToIndex({ index, animated: true });
  }, []);

  const renderExercise = useCallback(
    ({ item }: { item: Exercise }) => {
      const screenWidth = Dimensions.get("window").width;
      if (item.type === "quiz" && item.quizData) {
        return (
          <View style={{ width: screenWidth }} className="px-5">
            <QuizCard
              question={item.quizData}
              onComplete={(correct, selectedIndex) => handleExerciseComplete(item.id, correct, selectedIndex)}
              isLastExercise={completedExercises.size + 1 === exercises.length}
              questionIndex={exercises.indexOf(item)}
              totalQuestions={exercises.length}
            />
          </View>
        );
      }

      if (item.type === "practice") {
        return (
          <View style={{ width: screenWidth }} className="px-5">
            <PracticeExercise
              exercise={item}
              onComplete={() => handleExerciseComplete(item.id)}
              isLastExercise={completedExercises.size + 1 === exercises.length}
            />
          </View>
        );
      }

      return null;
    },
    [completedExercises.size, exercises.length],
  );

  const onScrollToIndexFailed = useCallback((info: any) => {
    listRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
  }, []);

  const correctCount = exercises.filter(
    (ex) => exerciseResults[lesson.id]?.[ex.id]?.correct === true
  ).length;

  const wrongCount = exercises.filter(
    (ex) => exerciseResults[lesson.id]?.[ex.id]?.correct === false
  ).length;

  if (alreadyCompleted) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="px-5 pt-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-primary text-lg">← Voltar</Text>
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-gray-400 text-xs">{lesson.module}</Text>
          </View>
        </View>

        <View className="px-5 mt-4">
          <View className="bg-green-600/20 rounded-2xl p-4 items-center border border-green-600">
            <Text className="text-2xl mb-1">✅</Text>
            <Text className="text-green-400 font-bold text-lg">
              Lição Concluída
            </Text>
            <Text className="text-gray-400 text-xs mt-1">
              Você já completou esta lição
            </Text>
          </View>
        </View>

        <View className="px-5 mt-4">
          <Text className="text-white text-2xl font-bold">{lesson.title}</Text>
          <Text className="text-gray-400 mt-1 text-sm">{lesson.description}</Text>
        </View>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 40,
          }}
          renderItem={({ item: exercise }) => {
            const result = exerciseResults[lesson.id]?.[exercise.id];
            const isCorrect = result?.correct === true;
            const isWrong = result?.correct === false;

            return (
              <View key={exercise.id} className="bg-surface rounded-2xl p-4 mb-4">
                <View className="flex-row items-center mb-3">
                  <Text className="text-2xl mr-2">
                    {exercise.type === "quiz" ? "📝" : "🎯"}
                  </Text>
                  <Text className="text-white font-bold text-lg flex-1">
                    {exercise.title}
                  </Text>
                  {isCorrect && (
                    <View className="bg-green-600 rounded-full px-2 py-0.5">
                      <Text className="text-white text-xs font-bold">✓</Text>
                    </View>
                  )}
                  {isWrong && (
                    <View className="bg-red-600 rounded-full px-2 py-0.5">
                      <Text className="text-white text-xs font-bold">✗</Text>
                    </View>
                  )}
                </View>

                <Text className="text-gray-300 text-sm leading-5 mb-3">
                  {exercise.instructions}
                </Text>

                {exercise.type === "quiz" && exercise.quizData && (
                  <View className="bg-background rounded-xl p-4">
                    <View className="flex-row items-center mb-2">
                      <Text className="text-gray-200 font-bold flex-1">
                        {exercise.quizData.question}
                      </Text>
                      {isWrong && (
                        <View className="bg-red-500/20 rounded-lg px-2 py-1">
                          <Text className="text-red-400 text-xs font-bold">ERRADO</Text>
                        </View>
                      )}
                    </View>
                    {exercise.quizData.options.map((opt, idx) => {
                      const isSelectedWrong = isWrong && result?.selectedIndex === idx;
                      return (
                        <View
                          key={idx}
                          className={`flex-row items-center p-3 mb-1 rounded-lg ${
                            idx === exercise.quizData!.correctIndex
                              ? "bg-green-500/10"
                              : isSelectedWrong
                              ? "bg-red-500/10"
                              : ""
                          }`}
                        >
                          <View
                            className={`w-6 h-6 rounded-full items-center justify-center mr-3 ${
                              idx === exercise.quizData!.correctIndex
                                ? "bg-green-500"
                                : isSelectedWrong
                                ? "bg-red-500"
                                : "bg-surface-light"
                            }`}
                          >
                            <Text className="text-white text-xs font-bold">
                              {idx === exercise.quizData!.correctIndex ? "✓" : 
                               isSelectedWrong ? "✗" :
                               String.fromCharCode(65 + idx)}
                            </Text>
                          </View>
                          <Text
                            className={`text-sm ${
                              idx === exercise.quizData!.correctIndex
                                ? "text-green-400 font-bold"
                                : isSelectedWrong
                                ? "text-red-400 font-bold"
                                : "text-gray-400"
                            }`}
                          >
                            {opt}
                            {isSelectedWrong && (
                              <Text className="text-red-400 text-xs"> (sua resposta)</Text>
                            )}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}

                {exercise.tips && (
                  <View className="mt-3 bg-background rounded-xl p-3">
                    <Text className="text-accent font-bold text-xs">💡 DICA</Text>
                    <Text className="text-gray-300 text-sm mt-1">{exercise.tips}</Text>
                  </View>
                )}
              </View>
            );
          }}
        />

        <View className="px-5 py-6 flex-row gap-4">
          <TouchableOpacity
            className="flex-1 bg-surface border border-gray-600 py-4 rounded-2xl items-center"
            onPress={() => router.back()}
          >
            <Text className="text-white font-bold">Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-primary py-4 rounded-2xl items-center"
            onPress={handleRefazer}
          >
            <Text className="text-white font-bold">Refazer 🔄</Text>
          </TouchableOpacity>
        </View>

        <View className="absolute -left-96" pointerEvents="none">
          <View ref={shareCardRef} collapsable={false}>
            <ShareCard
              streak={streakData.currentStreak}
              completedLessons={completedLessons.length}
              goal={goal || "complete"}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-5 pt-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-primary text-lg">← Voltar</Text>
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-gray-400 text-xs">{lesson.module}</Text>
        </View>
        <Text className="text-gray-500 text-xs">
          {currentExerciseIndex + 1}/{exercises.length}
        </Text>
      </View>

      <View className="px-5 mt-4">
        <Text className="text-white text-2xl font-bold">{lesson.title}</Text>
        <Text className="text-gray-400 mt-1 text-sm">{lesson.description}</Text>
      </View>

      {lesson.videoUrl && (
        <View className="px-5 mt-4">
          <YouTubePlayer videoUrl={lesson.videoUrl} />
        </View>
      )}

      {exercises.length > 0 && (
        <View className="px-5 mt-4">
          <View className="flex-row items-center">
            <View className="flex-1 h-1 bg-surface-light rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${(completedExercises.size / exercises.length) * 100}%` }}
              />
            </View>
          </View>
        </View>
      )}

      <FlatList
        ref={listRef}
        data={exercises}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
        renderItem={renderExercise}
        onScrollToIndexFailed={onScrollToIndexFailed}
        initialScrollIndex={0}
      />

      <Modal
        visible={showCompletionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCompletionModal(false)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center px-5">
          <View className="bg-surface rounded-3xl p-5 w-full max-w-sm">
            <View className="items-center mb-4">
              <Text className="text-4xl mb-2">🏆</Text>
              <Text className="text-white text-xl font-bold">
                Lição Concluída!
              </Text>
              <Text className="text-gray-400 text-xs text-center mt-1">
                {lesson.title}
              </Text>
            </View>

            <View className="flex-row justify-between bg-background rounded-2xl px-4 py-3 mb-4">
              <View className="items-center flex-1">
                <Text className="text-green-400 text-xl font-bold">{correctCount}</Text>
                <Text className="text-gray-500 text-[10px]">Corretas</Text>
              </View>
              <View className="w-px bg-surface-light self-stretch" />
              <View className="items-center flex-1">
                <Text className="text-red-400 text-xl font-bold">{wrongCount}</Text>
                <Text className="text-gray-500 text-[10px]">Erradas</Text>
              </View>
              <View className="w-px bg-surface-light self-stretch" />
              <View className="items-center flex-1">
                <Text className="text-primary text-xl font-bold">{exercises.length}</Text>
                <Text className="text-gray-500 text-[10px]">Total</Text>
              </View>
            </View>

            <StarPowerBanner
              currentStreak={streakData.currentStreak + (alreadyCompleted ? 0 : 1)}
              longestStreak={streakData.longestStreak}
              onShare={share}
            />

            <TouchableOpacity
              className="w-full mt-5 bg-primary py-4 rounded-xl items-center"
              onPress={handleCompleteLesson}
            >
              <Text className="text-white font-bold">
                {isLast ? "Finalizar 🏆" : "Continuar →"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View className="absolute -left-96" pointerEvents="none">
        <View ref={shareCardRef} collapsable={false}>
          <ShareCard
            streak={streakData.currentStreak}
            completedLessons={completedLessons.length}
            goal={goal || "complete"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
