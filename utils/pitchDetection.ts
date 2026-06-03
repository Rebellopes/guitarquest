import { YIN } from "pitchfinder";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const GUITAR_STRINGS = [
  { name: "E4", frequency: 329.63, string: 1, label: "E" },
  { name: "B3", frequency: 246.94, string: 2, label: "B" },
  { name: "G3", frequency: 196.0, string: 3, label: "G" },
  { name: "D3", frequency: 146.83, string: 4, label: "D" },
  { name: "A2", frequency: 110.0, string: 5, label: "A" },
  { name: "E2", frequency: 82.41, string: 6, label: "E" },
];

const detectPitch = YIN({ sampleRate: 44100, threshold: 0.1, probabilityThreshold: 0.1 });

function detectFrequency(buffer: Float32Array, sampleRate: number): number {
  const freq = detectPitch(buffer);
  return freq ?? 0;
}

function frequencyToNote(freq: number): { note: string; cents: number; midi: number } {
  if (freq <= 0) return { note: "--", cents: 0, midi: 0 };
  const midi = 12 * (Math.log(freq / 440) / Math.log(2)) + 69;
  const roundedMidi = Math.round(midi);
  const note = NOTES[roundedMidi % 12] + Math.floor(roundedMidi / 12 - 1);
  const cents = Math.round((midi - roundedMidi) * 100);
  return { note, cents, midi: roundedMidi };
}

function findClosestString(freq: number): { string: number; label: string; targetFreq: number; cents: number } | null {
  if (freq <= 0) return null;
  let closest = null;
  let minCents = Infinity;
  for (const s of GUITAR_STRINGS) {
    const cents = 1200 * Math.log(freq / s.frequency) / Math.log(2);
    const absCents = Math.abs(cents);
    if (absCents < minCents) {
      minCents = absCents;
      closest = { string: s.string, label: s.label, targetFreq: s.frequency, cents: Math.round(cents) };
    }
  }
  if (closest && minCents > 50) return null;
  return closest;
}

function findClosestStringLoose(freq: number): { string: number; label: string; targetFreq: number; cents: number } | null {
  if (freq <= 0) return null;
  let closest = null;
  let minCents = Infinity;
  for (const s of GUITAR_STRINGS) {
    const cents = 1200 * Math.log(freq / s.frequency) / Math.log(2);
    const absCents = Math.abs(cents);
    if (absCents < minCents) {
      minCents = absCents;
      closest = { string: s.string, label: s.label, targetFreq: s.frequency, cents: Math.round(cents) };
    }
  }
  return closest;
}

function getTuningStatus(cents: number): "tuned" | "sharp" | "flat" | null {
  if (Math.abs(cents) <= 5) return "tuned";
  if (cents > 5) return "sharp";
  if (cents < -5) return "flat";
  return null;
}

export { detectFrequency, frequencyToNote, findClosestString, findClosestStringLoose, getTuningStatus, GUITAR_STRINGS };
