"use client";

import { useSoundContext } from "@/context/SoundContext";

export default function useSound() {
  const { playHover, playClick } = useSoundContext();
  return { playHover, playClick };
}
