import { useRef, useCallback } from "react";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";

export function useShare() {
  const shareCardRef = useRef<any>(null);

  const share = useCallback(async () => {
    try {
      if (!shareCardRef.current) return;
      const uri = await captureRef(shareCardRef.current, {
        format: "png",
        quality: 1,
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "Compartilhar meu progresso no GuitarQuest",
        });
      }
    } catch {}
  }, []);

  return { shareCardRef, share };
}
