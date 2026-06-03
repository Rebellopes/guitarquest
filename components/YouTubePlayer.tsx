import { View, Text } from "react-native";
import YoutubeIframe from "react-native-youtube-iframe";

interface YouTubePlayerProps {
  videoUrl: string;
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
}

export default function YouTubePlayer({ videoUrl }: YouTubePlayerProps) {
  const videoId = getYouTubeId(videoUrl);

  if (!videoId) {
    return (
      <View className="bg-surface rounded-2xl p-4 items-center">
        <Text className="text-2xl mb-2">🎬</Text>
        <Text className="text-gray-400">URL do vídeo inválida</Text>
      </View>
    );
  }

  return (
    <View className="bg-surface rounded-2xl overflow-hidden">
      <View className="w-full" style={{ aspectRatio: 16 / 9 }}>
        <YoutubeIframe
          videoId={videoId}
          height="100%"
          width="100%"
        />
      </View>
    </View>
  );
}
