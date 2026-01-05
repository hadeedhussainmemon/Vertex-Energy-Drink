"use client";

import { useSoundContext } from "@/context/SoundContext";

export default function useSound() {
  const { playHover, playClick, playWhoosh, startAmbientHum, stopAmbientHum } = useSoundContext();
  return { playHover, playClick, playWhoosh, startAmbientHum, stopAmbientHum };
}
