import { Redirect } from "expo-router";
import { useGoalStore } from "../store";

export default function Index() {
  const hasCompletedOnboarding = useGoalStore((s) => s.hasCompletedOnboarding);

  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/onboarding" />;
}
