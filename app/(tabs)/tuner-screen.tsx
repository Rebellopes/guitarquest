import { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AudioRecorder, AudioManager } from "react-native-audio-api";
import { detectFrequency, findClosestString, findClosestStringLoose, GUITAR_STRINGS } from "../../utils/pitchDetection";

type RecorderStatus = "initializing" | "ready" | "error" | "no-module";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

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

export default function TunerScreen() {
  const [status, setStatus] = useState<RecorderStatus>("initializing");
  const [errorMsg, setErrorMsg] = useState("");
  const [frequency, setFrequency] = useState(0);
  const [closestFreq, setClosestFreq] = useState(0);
  const [detectedString, setDetectedString] = useState<number | null>(null);
  const [cents, setCents] = useState(0);
  const [selectedString, setSelectedString] = useState<number>(6);
  const [numFrames, setNumFrames] = useState(0);
  const [bufferCount, setBufferCount] = useState(0);
  const recorderRef = useRef<AudioRecorder | null>(null);

  const lastUpdateRef = useRef(0);
  const latestDataRef = useRef({ freq: 0, match: null as { string: number; label: string; targetFreq: number; cents: number } | null });

  const onAudioData = useCallback((event: any) => {
    try {
      const audioBuffer = event.buffer;
      const buffer = audioBuffer?.getChannelData?.(0);
      if (!buffer || buffer.length < 100) return;
      const sampleRate = audioBuffer?.sampleRate || event.sampleRate || 44100;
      const freq = detectFrequency(buffer, sampleRate);
      if (freq <= 0) return;

      const match = findClosestString(freq);
      const loose = match || findClosestStringLoose(freq);

      latestDataRef.current = { freq: Math.round(freq), match: loose };

      setNumFrames(event.numFrames || 0);
      setBufferCount((c) => c + 1);

      const now = Date.now();
      if (now - lastUpdateRef.current < 120) return;
      lastUpdateRef.current = now;

      setFrequency(Math.round(freq));
      if (loose) {
        setClosestFreq(Math.round(loose.targetFreq));
        setDetectedString(loose.string);
        setCents(loose.cents);
      } else {
        setDetectedString(null);
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
        { sampleRate: 44100, bufferLength: 4096, channelCount: 1 },
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
  const detectedNoteName = freqToNoteName(closestFreq || frequency);
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
            {detectedNoteName}
          </Text>

          {detectedString ? (
            <View className="items-center">
              <Text className="text-gray-400 text-sm mb-1">
                Corda {detectedString} · alvo: {closestFreq} Hz
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
              {frequency > 0 && (
                <Text className="text-gray-600 text-sm mt-1">{frequency} Hz</Text>
              )}
            </View>
          )}
        </View>

        <View className="flex-row justify-between px-2 pb-4">
          {[...GUITAR_STRINGS].reverse().map((s) => {
            const isSelected = selectedString === s.string;
            const isPlaying = detectedString === s.string;
            const fillColor = isPlaying ? deviationColor : "transparent";
            const borderColor = isSelected ? "#6C63FF" : (isPlaying ? deviationColor : "#2A2A3D");
            return (
              <TouchableOpacity key={s.string} onPress={() => setSelectedString(s.string)} className="items-center">
                <Text className="text-gray-500 text-xs mb-1">{s.string}ª</Text>
                <View className="w-12 h-12 rounded-full items-center justify-center border-2"
                  style={{ backgroundColor: fillColor + "30", borderColor }}>
                  <Text className="text-base font-bold" style={{ color: isPlaying || isSelected ? "#fff" : "#6B7280" }}>
                    {s.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="bg-surface rounded-2xl px-5 py-4 mb-4">
          <Text className="text-gray-400 text-sm">Alvo: {targetString?.label} ({targetString?.string}ª corda)</Text>
          <Text className="text-gray-400 text-sm">Detectado: {frequency} Hz · frames: {numFrames} · buffers: {bufferCount}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
