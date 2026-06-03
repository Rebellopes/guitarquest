import { useEffect, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useGoalStore, useProgressStore } from "../../store";
import { getFilteredLessons } from "../../data/lessons";
import { useShare } from "../../utils/useShare";
import ShareCard from "../../components/ShareCard";
import WeeklyCalendar from "../../components/WeeklyCalendar";
import StarPowerBanner from "../../components/StarPowerBanner";
import type { Lesson } from "../../types";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 6) return "Boa madrugada";
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
};

function LessonCard({
  lesson,
  status,
}: {
  lesson: Lesson;
  status: "locked" | "available" | "completed";
}) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === "available") {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.6, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [status, pulseAnim]);

  return (
    <TouchableOpacity
      disabled={isLocked}
      onPress={() => router.push(`/lesson/${lesson.id}`)}
      className={`flex-row items-center p-4 mb-3 rounded-2xl ${
        isLocked
          ? "bg-surface opacity-50"
          : isCompleted
          ? "bg-surface border border-green-600"
          : "bg-surface"
      }`}
      style={
        status === "available"
          ? { borderWidth: 1, borderColor: "#6C63FF", opacity: pulseAnim as any }
          : undefined
      }
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
          isCompleted
            ? "bg-green-600"
            : isLocked
            ? "bg-surface-light"
            : "bg-primary"
        }`}
      >
        <Text className="text-white text-lg">
          {isCompleted ? "✓" : isLocked ? "🔒" : "▶"}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-white font-semibold">{lesson.title}</Text>
        <Text className="text-gray-400 text-xs mt-1">
          {lesson.module}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const goal = useGoalStore((s) => s.goal);
  const { completedLessons, currentLessonId, streakData } = useProgressStore();
  const { shareCardRef, share } = useShare();
  const listRef = useRef<FlatList>(null);

  const lessons = getFilteredLessons(goal || "complete");
  const completedCount = lessons.filter((l) =>
    completedLessons.includes(l.id)
  ).length;
  const progress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  const getStatus = (lesson: Lesson): "locked" | "available" | "completed" => {
    if (completedLessons.includes(lesson.id)) return "completed";
    if (lesson.id === currentLessonId) return "available";

    const currentIndex = lessons.findIndex((l) => l.id === currentLessonId);
    const lessonIndex = lessons.findIndex((l) => l.id === lesson.id);
    if (lessonIndex <= currentIndex) return "available";
    return "locked";
  };

  const currentIndex = lessons.findIndex((l) => l.id === currentLessonId);

  useEffect(() => {
    if (currentIndex >= 0) {
      setTimeout(() => {
        listRef.current?.scrollToIndex({ index: currentIndex, animated: true, viewPosition: 0.5 });
      }, 300);
    }
  }, [currentIndex]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-5 pt-4">
        <Text className="text-gray-400 text-sm">{greeting()},</Text>
        <Text className="text-white text-2xl font-bold">Guitarrista! 🎸</Text>
      </View>

      <View className="mx-5 mt-4 bg-surface rounded-2xl p-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-white text-lg font-bold">Sua Trilha</Text>
          <Text className="text-primary font-bold">
            {completedCount}/{lessons.length}
          </Text>
        </View>
        <View className="h-2 bg-surface-light rounded-full overflow-hidden">
          <View
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>

      <View className="mx-5 mt-3">
        <StarPowerBanner
          currentStreak={streakData.currentStreak}
          longestStreak={streakData.longestStreak}
          onShare={share}
        />
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

      <FlatList
        ref={listRef}
        data={lessons}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<WeeklyCalendar />}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 100,
        }}
        renderItem={({ item }) => (
          <LessonCard lesson={item} status={getStatus(item)} />
        )}
        onScrollToIndexFailed={(info) => {
          listRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
        }}
      />
    </SafeAreaView>
  );
}
