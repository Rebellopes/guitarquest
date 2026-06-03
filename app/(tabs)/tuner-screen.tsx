import { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AudioRecorder, AudioManager } from "react-native-audio-api";
import { detectFrequency, findClosestString, findClosestStringLoose, getRMS, GUITAR_STRINGS } from "../../utils/pitchDetection";
import type { StringMatch } from "../../utils/pitchDetection";

type RecorderStatus = "initializing" | "ready" | "error" | "no-module";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const STABILITY_HISTORY = 5;
const RMS_THRESHOLD = 0.008;
const UI_THROTTLE_MS = 30;

function freqToNoteName(freq: number): string {
  if (freq <= 0) return "--";
  const midi = 12 * (Math.log(freq / 440) / Math.log(2)) + 69;
  return NOTES[Math.round(midi) % 12];
}

function getDeviationColor(cents: number): string {
  const abs = Math.abs(cents);
  if (abs <= 5) return "#06D6A0";
  if (abs <= 15) return "#FFD166";
  return "#EF476F";
}

function getDeviationLabel(cents: number): string {
  const abs = Math.abs(cents);
  if (abs <= 5) return "Afinado!";
  if (cents > 0) return "Aperte a corda ↑";
  return "Afrouxe a corda ↓";
}

function getDeviationBg(cents: number): string {
  const abs = Math.abs(cents);
  if (abs <= 5) return "bg-[#06D6A0]/20";
  if (abs <= 15) return "bg-[#FFD166]/20";
  return "bg-[#EF476F]/20";
}

function getStableString(history: number[]): number | null {
  if (history.length === 0) return null;
  const counts: Record<number, number> = {};
  for (const s of history) {
    counts[s] = (counts[s] || 0) + 1;
  }
  let best = history[0];
  let bestCount = 0;
  for (const [str, count] of Object.entries(counts)) {
    if (count > bestCount) {
      bestCount = count;
      best = Number(str);
    }
  }
  return best;
}

export default function TunerScreen() {
  const [status, setStatus] = useState<RecorderStatus>("initializing");
  const [errorMsg, setErrorMsg] = useState("");
  const [frequency, setFrequency] = useState(0);
  const [cents, setCents] = useState(0);
  const [selectedString, setSelectedString] = useState<number | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);

  const lastUiUpdateRef = useRef(0);
  const stringHistoryRef = useRef<number[]>([]);
  const stableMatchRef = useRef<StringMatch | null>(null);
  const manualLockRef = useRef(false);

  const onAudioData = useCallback((event: any) => {
    try {
      const audioBuffer = event.buffer;
      const buffer = audioBuffer?.getChannelData?.(0);
      if (!buffer || buffer.length < 100) return;
      const sampleRate = audioBuffer?.sampleRate || 44100;

      const rms = getRMS(buffer);
      if (rms < RMS_THRESHOLD) return;

      const freq = detectFrequency(buffer, sampleRate);
      if (freq <= 0) return;

      const match = findClosestString(freq);
      const loose = match || findClosestStringLoose(freq);
      if (!loose) return;

      const history = stringHistoryRef.current;
      history.push(loose.string);
      if (history.length > STABILITY_HISTORY) history.shift();

      const stable = getStableString(history);
      if (!stable) return;

      stableMatchRef.current = loose;

      const now = Date.now();
      if (now - lastUiUpdateRef.current < UI_THROTTLE_MS) return;
      lastUiUpdateRef.current = now;

      setFrequency(Math.round(freq));
      setCents(loose.cents);
      if (!manualLockRef.current) {
        setSelectedString(stable);
      }
    } catch (err) {
      console.warn("[Tuner] onAudioData error:", err);
    }
  }, []);

  const initRecorder = useCallback(async () => {
    try {
      const permission = await AudioManager.requestRecordingPermissions();
      if (permission !== "Granted") {
        setStatus("error");
        setErrorMsg("Permissão do microfone negada");
        return;
      }

      await AudioManager.setAudioSessionActivity(true);

      const recorder = new AudioRecorder();
      recorderRef.current = recorder;
      setStatus("ready");

      recorder.onError((error) => {
        console.warn("[Tuner] Recorder error:", error.message);
      });

      const result = recorder.onAudioReady(
        { sampleRate: 44100, bufferLength: 8192, channelCount: 1 },
        onAudioData
      );
      if (result.status === "error") {
        setStatus("error");
        setErrorMsg(result.message || "Falha ao configurar áudio");
        return;
      }
      recorder.start();
    } catch (e: any) {
      const msg = e?.message || "";
      if (msg.includes("module") || msg.includes("Native") || msg.includes("createAudioRecorder")) {
        setStatus("no-module");
        setErrorMsg("Módulo nativo de áudio não encontrado");
      } else {
        setStatus("error");
        setErrorMsg(msg || "Erro desconhecido");
      }
    }
  }, [onAudioData]);

  useEffect(() => {
    const t = setTimeout(() => initRecorder(), 300);
    return () => {
      clearTimeout(t);
      try {
        const r = recorderRef.current;
        if (r) {
          if (r.isRecording()) r.stop();
          r.clearOnAudioReady();
          r.clearOnError();
        }
        AudioManager.setAudioSessionActivity(false);
      } catch {}
    };
  }, [initRecorder]);

  const targetString = GUITAR_STRINGS.find(s => s.string === selectedString);
  const activeMatch = stableMatchRef.current;
  const showTarget = targetString && selectedString !== null;
  const deviationColor = getDeviationColor(cents);
  const deviationLabel = getDeviationLabel(cents);
  const deviationBg = getDeviationBg(cents);
  const barPosition = (() => {
    const clamped = Math.max(-50, Math.min(50, cents));
    return ((clamped + 50) / 100) * 100;
  })();

  if (status === "initializing") {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-5">
        <Text className="text-4xl mb-4">🎵</Text>
        <Text className="text-white text-lg">Inicializando microfone...</Text>
      </SafeAreaView>
    );
  }

  if (status === "no-module") {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-5">
        <Text className="text-4xl mb-4">⚠️</Text>
        <Text className="text-white text-lg font-bold text-center">Módulo de áudio não disponível</Text>
        <Text className="text-gray-400 text-center mt-2">
          O react-native-audio-api não foi compilado. Reconstrua o app.
        </Text>
        <TouchableOpacity className="bg-primary px-6 py-3 rounded-xl mt-6" onPress={initRecorder}>
          <Text className="text-white font-bold">Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (status === "error") {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-5">
        <Text className="text-4xl mb-4">❌</Text>
        <Text className="text-white text-lg font-bold text-center">Erro: {errorMsg}</Text>
        <TouchableOpacity className="bg-primary px-6 py-3 rounded-xl mt-6" onPress={initRecorder}>
          <Text className="text-white font-bold">Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-8 py-4">
        <Text className="text-white text-2xl font-bold text-center mb-1">Afinador 🎵</Text>

        <View className="flex-1 items-center justify-center">
          <Text className="text-8xl font-bold mb-2" style={{ color: deviationColor }}>
            {activeMatch ? freqToNoteName(activeMatch.targetFreq) : "--"}
          </Text>

          {showTarget ? (
            <View className="items-center">
              <Text className="text-gray-400 text-sm mb-1">
                {targetString!.label} ({targetString!.string}ª corda) · {targetString!.frequency} Hz {manualLockRef.current ? "🔒" : ""}
              </Text>
              <View className="h-2 w-56 bg-surface-light rounded-full overflow-hidden mb-3">
                <View className="h-full rounded-full" style={{ width: 8, marginLeft: `${barPosition}%`, backgroundColor: deviationColor, borderRadius: 4 }} />
              </View>
              <View className={`rounded-xl px-6 py-2 ${deviationBg}`}>
                <Text className="font-bold text-lg" style={{ color: deviationColor }}>
                  {deviationLabel}
                </Text>
              </View>
            </View>
          ) : (
            <View className="items-center mt-4">
              <Text className="text-5xl mb-2">🎸</Text>
              <Text className="text-gray-500">Toque uma corda...</Text>
            </View>
          )}
        </View>

        <View className="flex-row justify-between px-2 pb-4">
          {[...GUITAR_STRINGS].reverse().map((s) => {
            const isTarget = selectedString === s.string;
            const isLocked = manualLockRef.current && isTarget;
            const borderColor = isTarget ? deviationColor : "#2A2A3D";
            const textColor = isTarget ? "#fff" : "#6B7280";
            return (
              <TouchableOpacity key={s.string} className="items-center"
                onPress={() => {
                  if (manualLockRef.current && isTarget) {
                    manualLockRef.current = false;
                  } else {
                    manualLockRef.current = true;
                    setSelectedString(s.string);
                  }
                }}>
                <Text className="text-gray-500 text-xs mb-1">{s.string}ª</Text>
                <View className="w-12 h-12 rounded-full items-center justify-center border-2"
                  style={{ backgroundColor: isTarget ? deviationColor + "20" : "transparent", borderColor }}>
                  <Text className="text-base font-bold" style={{ color: textColor }}>
                    {s.label}
                  </Text>
                </View>
                {isLocked && <Text className="text-[10px] mt-0.5" style={{ color: deviationColor }}>▼</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="bg-surface rounded-2xl px-5 py-4 mb-4">
          <Text className="text-gray-400 text-sm">Alvo: {targetString?.label} ({targetString?.string}ª corda) · {frequency} Hz</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
