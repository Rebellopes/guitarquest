import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { StudyPlan } from "../types";

const CHANNEL_ID = "guitarquest-study-reminder";
const CHANNEL_NAME = "Lembrete de Estudo";
const today = () => new Date().toISOString().split("T")[0];

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function setupNotificationChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: CHANNEL_NAME,
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#6C63FF",
      sound: "default",
    });
  }
}

export async function scheduleDailyNotifications(
  plan: StudyPlan,
  currentStreak: number,
) {
  if (!plan.notificationsEnabled || plan.daysOfWeek.length === 0) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const [hour, minute] = plan.startTime.split(":").map(Number);

  plan.daysOfWeek.forEach((day) => {
    const weekday = day + 1; // 0=Sun -> 1, 1=Mon -> 2, ... 6=Sat -> 7
    const trigger: Notifications.WeeklyTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday,
      hour,
      minute,
    };
    if (Platform.OS === "android") {
      trigger.channelId = CHANNEL_ID;
    }
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Hora de praticar 🎸",
        body: `Bora praticar? seu ritmo de ${currentStreak} dias está em jogo!`,
        data: { screen: "next-lesson" },
        sound: "default",
      },
      trigger,
    });
  });
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function checkAndCancelTodayNotification(
  lastLessonDate: string | null,
) {
  if (lastLessonDate !== today()) return;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const now = new Date();
  const todayDay = now.getDay(); // 0=Sun, 1=Mon ...

  for (const n of scheduled) {
    const trigger = n.trigger;
    if (
      trigger &&
      typeof trigger === "object" &&
      "type" in trigger &&
      trigger.type === "weekly" &&
      "weekday" in trigger &&
      trigger.weekday === todayDay + 1
    ) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
    // Also handle daily triggers
    if (
      trigger &&
      typeof trigger === "object" &&
      "type" in trigger &&
      trigger.type === "daily"
    ) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }
}

export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export function addNotificationResponseListener(
  onPress: () => void,
): Notifications.EventSubscription {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    if (data?.screen === "next-lesson") {
      onPress();
    }
  });
}
