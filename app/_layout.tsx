import "../global.css";
import { useEffect, useRef, useState } from "react";
import {
  useFonts,
  Nunito_400Regular,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, AppState, View } from "react-native";
import {
  setupNotificationChannel,
  setupNotificationHandler,
  addNotificationResponseListener,
  checkAndCancelTodayNotification,
} from "../utils/notifications";
import {
  useGoalStore,
  useProgressStore,
  useStudyPlanStore,
} from "../store";

function useHydrated() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const unsub1 = useGoalStore.persist.onFinishHydration(() => checkAll());
    const unsub2 = useProgressStore.persist.onFinishHydration(() => checkAll());
    const unsub3 = useStudyPlanStore.persist.onFinishHydration(() => checkAll());
    function checkAll() {
      if (
        useGoalStore.persist.hasHydrated() &&
        useProgressStore.persist.hasHydrated() &&
        useStudyPlanStore.persist.hasHydrated()
      ) {
        setReady(true);
      }
    }
    checkAll();
    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, []);
  return ready;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Nunito-Regular": Nunito_400Regular,
    "Nunito-Bold": Nunito_700Bold,
  });

  const hydrated = useHydrated();

  const listenerRef = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    setupNotificationChannel();
    setupNotificationHandler();

    listenerRef.current = addNotificationResponseListener(() => {
      const nextLesson = useProgressStore.getState().currentLessonId;
      router.replace(`/lesson/${nextLesson}`);
    });

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        const lastDate = useProgressStore.getState().streakData.lastLessonDate;
        checkAndCancelTodayNotification(lastDate);
      }
    });

    return () => {
      listenerRef.current?.remove();
      sub.remove();
    };
  }, []);

  if (!fontsLoaded || !hydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
