import { useCallback, useEffect, useState } from "react";
import { playSound, setSoundEnabled } from "../audio/soundEffects";

const STORAGE_KEY = "space-academy-sound-v1";

function loadSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;

  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

/** Gère l'activation des effets sonores et mémorise le choix du joueur. */
export default function useSoundEffects() {
  const [soundEnabled, setEnabled] = useState(loadSoundEnabled);

  useEffect(() => {
    setSoundEnabled(soundEnabled);

    try {
      window.localStorage.setItem(STORAGE_KEY, soundEnabled ? "on" : "off");
    } catch {
      // Le réglage reste actif pour la session si le stockage est indisponible.
    }
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    const nextValue = !soundEnabled;
    setSoundEnabled(nextValue);
    setEnabled(nextValue);

    if (nextValue) playSound("toggle");
  }, [soundEnabled]);

  return { soundEnabled, toggleSound };
}
