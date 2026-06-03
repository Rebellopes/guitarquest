# GuitarQuest 🎸

Aprenda guitarra com uma jornada personalizada, feita pra você.

## Stack

- **React Native** via Expo SDK 55 (managed workflow)
- **NativeWind v4** (Tailwind CSS for RN)
- **Zustand v5** + persist (MMKV)
- **react-native-audio-api** (tuner)

## Requisitos

- Node.js 20+
- Android Studio com Android SDK
- `ANDROID_HOME` configurado (ex: `$HOME/Android/Sdk`)

## Rodar

```bash
npm install
ANDROID_HOME=$HOME/Android/Sdk npx expo run:android
```

## Build

```bash
ANDROID_HOME=$HOME/Android/Sdk npx expo run:android
```

O APK debug é gerado em `android/app/build/outputs/apk/debug/app-debug.apk`.

## Estrutura

```
app/          → telas (Expo Router)
components/   → componentes reutilizáveis
store/        → Zustand store + persist
utils/        → lógica (pitch detection, etc.)
types/        → tipos TypeScript
assets/       → imagens, fontes
```

## Tuner

O afinador usa o algoritmo YIN (`pitchfinder`) com:
- Buffer de 8192 amostras (186ms) para precisão nas cordas graves
- Filtro passa-baixa a 500 Hz antes da detecção
- Filtro mediano nos últimos 5 valores de Hz
- Modo manual: trava numa corda e compara contra a frequência alvo
