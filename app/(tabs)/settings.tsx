import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStudyPlanStore, useProgressStore } from "../../store";
import {
  requestNotificationPermission,
  scheduleDailyNotifications,
  cancelAllNotifications,
} from "../../utils/notifications";

const DAYS = [
  { label: "D", value: 0, name: "Dom" },
  { label: "S", value: 1, name: "Seg" },
  { label: "T", value: 2, name: "Ter" },
  { label: "Q", value: 3, name: "Qua" },
  { label: "Q", value: 4, name: "Qui" },
  { label: "S", value: 5, name: "Sex" },
  { label: "S", value: 6, name: "Sáb" },
];

export default function SettingsScreen() {
  const { plan, updatePlan } = useStudyPlanStore();
  const streakData = useProgressStore((s) => s.streakData);
  const [saved, setSaved] = useState(false);
  const [hourText, setHourText] = useState(plan.startTime.split(":")[0]);
  const [minuteText, setMinuteText] = useState(plan.startTime.split(":")[1]);

  const toggleDay = (day: number) => {
    const days = plan.daysOfWeek.includes(day)
      ? plan.daysOfWeek.filter((d) => d !== day)
      : [...plan.daysOfWeek, day].sort();
    updatePlan({ daysOfWeek: days });
  };

  const applyTime = () => {
    let h = parseInt(hourText, 10);
    let m = parseInt(minuteText, 10);
    if (isNaN(h) || h < 0) h = 0;
    if (h > 23) h = 23;
    if (isNaN(m) || m < 0) m = 0;
    if (m > 59) m = 59;
    const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    updatePlan({ startTime: time });
    setHourText(String(h).padStart(2, "0"));
    setMinuteText(String(m).padStart(2, "0"));
  };

  const save = async () => {
    applyTime();
    if (plan.daysOfWeek.length === 0) return;
    if (plan.notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(
          "Permissão necessária",
          "Ative as notificações nas configurações do sistema para receber lembretes.",
        );
      }
      await scheduleDailyNotifications(plan, streakData.currentStreak);
    } else {
      await cancelAllNotifications();
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleNotifications = async (v: boolean) => {
    updatePlan({ notificationsEnabled: v });
    if (v) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        updatePlan({ notificationsEnabled: false });
        Alert.alert(
          "Permissão necessária",
          "Ative as notificações nas configurações do sistema para receber lembretes.",
        );
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-5 pt-4">
        <Text className="text-white text-2xl font-bold mb-6">Configurações ⚙️</Text>

        <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Plano de Estudos</Text>
        <View className="bg-surface rounded-2xl p-5 mb-6">
          <Text className="text-white text-sm font-bold mb-3">Dias da Semana</Text>
          <View className="flex-row justify-between">
            {DAYS.map((d) => {
              const active = plan.daysOfWeek.includes(d.value);
              return (
                <TouchableOpacity
                  key={d.value}
                  onPress={() => toggleDay(d.value)}
                  className={`w-10 h-10 rounded-full items-center justify-center ${active ? "bg-primary" : "bg-surface-light"}`}
                >
                  <Text className={`text-xs font-bold ${active ? "text-white" : "text-gray-400"}`}>{d.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text className="text-white text-sm font-bold mt-5 mb-3">Horário</Text>
          <View className="flex-row items-center justify-center space-x-4">
            <View className="items-center">
              <Text className="text-gray-500 text-xs mb-1">Hora</Text>
              <TextInput
                className="bg-surface-light text-white text-3xl font-bold w-20 text-center rounded-xl py-2"
                value={hourText}
                onChangeText={(t) => { setHourText(t); }}
                onBlur={applyTime}
                onSubmitEditing={applyTime}
                keyboardType="number-pad"
                maxLength={2}
                selectTextOnFocus
              />
            </View>
            <Text className="text-white text-3xl font-bold mt-5">:</Text>
            <View className="items-center">
              <Text className="text-gray-500 text-xs mb-1">Min</Text>
              <TextInput
                className="bg-surface-light text-white text-3xl font-bold w-20 text-center rounded-xl py-2"
                value={minuteText}
                onChangeText={(t) => { setMinuteText(t); }}
                onBlur={applyTime}
                onSubmitEditing={applyTime}
                keyboardType="number-pad"
                maxLength={2}
                selectTextOnFocus
              />
            </View>
          </View>

          <TouchableOpacity className="bg-primary py-4 rounded-xl items-center mt-5" onPress={save}>
            <Text className="text-white font-bold">{saved ? "Salvo ✓" : "Salvar Plano"}</Text>
          </TouchableOpacity>
          {plan.daysOfWeek.length === 0 && (
            <Text className="text-red-400 text-xs text-center mt-2">Selecione ao menos 1 dia</Text>
          )}
        </View>

        <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Preferências</Text>
        <View className="bg-surface rounded-2xl p-5 mb-6">
          <SettingRow label="Notificações" value={plan.notificationsEnabled} onChange={toggleNotifications} />
          <View className="h-px bg-surface-light my-3" />
          <SettingRow label="Som" value={plan.soundEnabled} onChange={(v) => updatePlan({ soundEnabled: v })} />
          <View className="h-px bg-surface-light my-3" />
          <SettingRow label="Vibração" value={plan.vibrationEnabled} onChange={(v) => updatePlan({ vibrationEnabled: v })} />
        </View>

        <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Sobre</Text>
        <View className="bg-surface rounded-2xl p-5 mb-10">
          <AboutRow label="Versão" value="1.0.0" />
          <View className="h-px bg-surface-light my-3" />
          <AboutRow label="Licenças" value="MIT" />
          <View className="h-px bg-surface-light my-3" />
          <AboutRow label="Contato" value="guitarquest@app.com" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-white">{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#2A2A3D", true: "#6C63FF" }}
        thumbColor={value ? "#fff" : "#6B7280"}
      />
    </View>
  );
}

function AboutRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-gray-400">{label}</Text>
      <Text className="text-gray-500 text-sm">{value}</Text>
    </View>
  );
}
