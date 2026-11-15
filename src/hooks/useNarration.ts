import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "space-academy-narration-v1";

/**
 * Détecte et priorise les voix de synthèse vocale.
 * - Essaie d'abord une voix japonaise (style anime)
 * - Cherche ensuite des voix connues du style anime (Hatsune Miku, Vocaloid, etc.)
 * - Ajuste le pitch/rate pour approcher le style anime si nécessaire
 */
function getAnimeVoice(synth: SpeechSynthesis): {
  voice: SpeechSynthesisVoice | null;
  isJapanese: boolean;
  isAnimeNamed: boolean;
} {
  const allVoices = synth.getVoices();

  // 1. Priorité : voix japonaise (langue startsWith "ja")
  const japaneseVoice = allVoices.find(
    (voice) => voice.lang.toLowerCase().startsWith("ja")
  );

  // 2. Priorité : voix célèbres d'anime / Vocaloid par nom
  const animeVoiceNames = [
    "Hatsune Miku",
    "Megurine Luka",
    "Kagamine Rin",
    "Kagamine Len",
    "Meiko",
    "Kaito",
    "IA",
    "Arpachia",
    "Camellia",
    "Nijigen",
    "Anime",
    "Vocaloid",
    "Utattemita",
  ];

  const animeNamedVoice = allVoices.find((voice) =>
    animeVoiceNames.some((name) =>
      voice.name.toLowerCase().includes(name.toLowerCase())
    )
  );

  // 3. Si aucune voix japonaise ni nommée, prendre la première voix disponible
  //    et on ajuster pitch/rate plus tard
  const fallbackVoice = allVoices[0] || null;

  return {
    voice: animeNamedVoice || japaneseVoice || fallbackVoice,
    isJapanese: !!japaneseVoice,
    isAnimeNamed: !!animeNamedVoice,
  };
}

/** Découpe un texte long en phrases pour éviter les coupures de la synthèse vocale. */
function splitIntoChunks(text: string, maxLength = 180): string[] {
  const sentences = text.split(/(?<=[.!?…])\s+/).filter(Boolean);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (candidate.length > maxLength && current) {
      chunks.push(current);
      current = sentence;
    } else {
      current = candidate;
    }
  }

  if (current) chunks.push(current);
  return chunks.length > 0 ? chunks : [text];
}

/**
 * Lecture automatique du récit et des consignes (synthèse vocale du navigateur).
 * Le choix du joueur est mémorisé, comme les effets sonores.
 * La voix tente d'être au style "anime" (ja-JP ou voix connue).
 */
export default function useNarration() {
  const synth = window.speechSynthesis;

  const [narrationEnabled, setNarrationEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return window.localStorage.getItem(STORAGE_KEY) !== "off";
    } catch {
      return true;
    }
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const supported = typeof synth !== "undefined" && synth !== null;

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Mise à jour du localStorage quand l'utilisateur change le réglage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, narrationEnabled ? "on" : "off");
    } catch {
      // Garde le réglage en mémoire pour la session.
    }
  }, [narrationEnabled]);

  // Recharge les voix quand la liste change (navigateur, langue, etc.)
  useEffect(() => {
    if (supported) {
      // Force le navigateur à fournir la liste complète des voix
      // Certains navigateurs reportent les voix après un court délai
      const timer = setTimeout(() => {
        synth.getVoices(); // populate
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [supported]);

  // Arrêter la lecture en cours quand la narration est désactivée
  useEffect(() => {
    if (!narrationEnabled) {
      try {
        synth.cancel();
      } catch {
        // ignored
      }
    }
  }, [narrationEnabled]);

  /** Lecture d'un texte avec tentative de voix "anime". */
  const speak = useCallback(
    (text: string) => {
      if (!supported) return;

      const cleanText = text.replace(/\s+/g, " ").trim();
      if (!cleanText) return;

      synth.cancel();

      // Détecte la meilleure voix "anime" disponible
      const { voice, isJapanese, isAnimeNamed } = getAnimeVoice(synth);

      const chunks = splitIntoChunks(cleanText);

      chunks.forEach((chunk, index) => {
        const utterance = new SpeechSynthesisUtterance(chunk);

        // Langue : japonais si on a une voix japonaise, français sinon
        utterance.lang = isJapanese ? "ja-JP" : "fr-FR";

        // --- Style anime : pitch et rate ---
        if (isAnimeNamed) {
          // Voix connue (Miku, etc.) : très aiguë, rapide
          utterance.rate = 1.25;
          utterance.pitch = 1.5;
        } else if (isJapanese) {
          // Voix japonaise : légèrement rapide, plus aigu
          utterance.rate = 1.1;
          utterance.pitch = 1.25;
        } else {
          // Voix par défaut ajustée pour "approcher" le style anime
          utterance.rate = 1.15;
          utterance.pitch = 1.35;
        }
        utterance.volume = 1;

        // Applique la voix détectée
        if (voice) utterance.voice = voice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          if (index === chunks.length - 1) setIsSpeaking(false);
        };
        utterance.onerror = () => {
          if (index === chunks.length - 1) setIsSpeaking(false);
        };

        utteranceRef.current = utterance;
        synth.speak(utterance);
      });
    },
    [supported],
  );

  const toggleNarration = useCallback(() => {
    setNarrationEnabled((current) => !current);
  }, []);

  useEffect(() => {
    if (!narrationEnabled) {
      try {
        synth.cancel();
      } catch {
        // ignored
      }
    }
  }, [narrationEnabled]);

  useEffect(() => {
    return () => {
      try {
        synth.cancel();
      } catch {
        // ignored
      }
    };
  }, [supported]);

  return {
    narrationEnabled,
    narrationSupported: supported,
    isSpeaking,
    toggleNarration,
    speak,
    stopNarration: () => synth.cancel(),
  };
}