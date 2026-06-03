import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useProgressStore } from "../store";

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function formatDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

interface Props {
  completedDates?: Record<string, number>;
}

export default function WeeklyCalendar({ completedDates: _completedDates }: Props) {
  const storeDates = useProgressStore((s) => s.completedDates);
  const completedDates = _completedDates ?? storeDates;
  const [selected, setSelected] = useState<string | null>(null);
  const today = new Date();
  const todayStr = formatDate(today);

  const days: { dateStr: string; label: string; isToday: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      dateStr: formatDate(d),
      label: DAY_LABELS[d.getDay()],
      isToday: formatDate(d) === todayStr,
    });
  }

  const count = selected ? completedDates[selected] || 0 : 0;

  return (
    <View className="bg-surface rounded-2xl p-4 mb-4">
      <Text className="text-white text-sm font-bold mb-3">Últimos 7 dias</Text>
      <View className="flex-row justify-between">
        {days.map((day) => {
          const trained = !!completedDates[day.dateStr];
          return (
            <TouchableOpacity
              key={day.dateStr}
              onPress={() => setSelected(day.dateStr === selected ? null : day.dateStr)}
              className="items-center"
            >
              <Text className="text-gray-400 text-xs mb-1">{day.label}</Text>
              <View
                className={`w-9 h-9 rounded-full items-center justify-center ${
                  trained ? "bg-green-600" : "bg-surface-light"
                } ${day.isToday ? "border-2 border-primary" : ""}`}
              >
                <Text className="text-white text-xs font-bold">
                  {day.dateStr.split("-")[2]}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      {selected && (
        <View className="mt-3 bg-surface-light rounded-xl py-2 px-3">
          <Text className="text-white text-xs text-center">
            {count > 0
              ? `🎸 Treinou ${count} ${count === 1 ? "lição" : "lições"}`
              : "😴 Descansou"}
          </Text>
        </View>
      )}
    </View>
  );
}
