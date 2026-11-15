export type SoundName =
  | "click"
  | "select"
  | "back"
  | "confirm"
  | "success"
  | "error"
  | "star"
  | "launch"
  | "step"
  | "toggle"
  | "coin"
  | "bonus"
  | "purchase"
  | "woosh"
  | "hum"
  | "echo";

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let soundEnabled = true;

/** Active ou coupe les effets sonores. */
export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  if (!enabled && audioContext && audioContext.state === "running") {
    void audioContext.suspend();
  }
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

function getAudioContext(): AudioContext | null {
  if (!soundEnabled || typeof window === "undefined") return null;

  if (!audioContext) {
    const AudioContextConstructor =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextConstructor) return null;

    try {
      audioContext = new AudioContextConstructor();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.9;
      masterGain.connect(audioContext.destination);
    } catch {
      return null;
    }
  }

  return audioContext;
}

function getOutput(context: AudioContext): AudioNode {
  return masterGain ?? context.destination;
}


interface ToneOptions {
  frequency: number;
  endFrequency?: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  delay?: number;
  attack?: number;
  detune?: number;
}

/** Joue un tone avec options enrichies. */
function playTone(context: AudioContext, options: ToneOptions) {
  const {
    frequency,
    endFrequency,
    duration,
    type = "sine",
    volume = 0.07,
    delay = 0,
    attack = 0.008,
    detune = 0,
  } = options;

  const start = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.detune.setValueAtTime(detune, start);

  if (endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), start + duration);
  }

  // Enveloppe plus naturelle : attack + sustain + release
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration + 0.1);

  oscillator.connect(gain).connect(getOutput(context));
  oscillator.start(start);
  oscillator.stop(start + duration + 0.15);
}

/** Joue un bruit filtré avec glissando de fréquence (effet "whoosh"). */
function playWhoosh(context: AudioContext, options: { duration: number; volume?: number; delay?: number; filterFrom?: number; filterTo?: number; filterType?: "lowpass" | "highpass" | "bandpass"; q?: number }) {
  const {
    duration,
    volume = 0.08,
    delay = 0,
    filterFrom = 800,
    filterTo = 100,
    filterType = "lowpass",
    q = 1,
  } = options;

  const start = context.currentTime + delay;
  const frameCount = Math.ceil(context.sampleRate * duration);
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }

  const source = context.createBufferSource();
  source.buffer = buffer;

  const filter = context.createBiquadFilter();
  filter.type = filterType;
  filter.Q.value = q !== undefined ? q : 1;
  filter.frequency.setValueAtTime(filterFrom, start);
  filter.frequency.exponentialRampToValueAtTime(filterTo, start + duration);

  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  source.connect(filter).connect(gain).connect(getOutput(context));
  source.start(start);
  source.stop(start + duration + 0.05);
}

function playBell(context: AudioContext, options: { frequency: number; duration: number; volume: number; delay?: number }) {
  const { frequency, duration, volume, delay = 0 } = options;

  playTone(context, { frequency, duration, type: "sine", volume, delay, attack: 0.005, detune: -12 });
  playTone(context, {
    frequency: frequency * 2.01,
    duration: duration * 0.65,
    type: "sine",
    volume: volume * 0.32,
    delay,
    attack: 0.004,
    detune: -12,
  });
  playTone(context, {
    frequency: frequency * 3.02,
    duration: duration * 0.35,
    type: "sine",
    volume: volume * 0.15,
    delay,
    attack: 0.004,
    detune: -12,
  });
}

/** Toutes les recettes de sons, avec des timbres riches "espace/aqueux". */
const SOUND_RECIPES: Record<SoundName, (context: AudioContext) => void> = {
  // Clic d'interface : petit "tac" sec avec résonance légère
  click: (context) => {
    playTone(context, {
      frequency: 1400,
      duration: 0.04,
      type: "sine",
      volume: 0.1,
      attack: 0.001,
    });
    playWhoosh(context, {
      duration: 0.04,
      volume: 0.06,
      filterFrom: 3000,
      filterTo: 800,
      filterType: "lowpass",
    });
  },
  // Sélection : "pop" électronique montant avec corps
  select: (context) => {
    playTone(context, {
      frequency: 330,
      endFrequency: 660,
      duration: 0.12,
      type: "sine",
      volume: 0.1,
      detune: 24,
    });
    playTone(context, {
      frequency: 660,
      duration: 0.1,
      type: "triangle",
      volume: 0.05,
      delay: 0.04,
    });
  },
  // Retour : glissando descendant avec souffle doux et résonance
  back: (context) => {
    playWhoosh(context, {
      duration: 0.2,
      volume: 0.08,
      filterFrom: 1200,
      filterTo: 200,
      filterType: "lowpass",
    });
    playTone(context, {
      frequency: 220,
      duration: 0.2,
      type: "sine",
      volume: 0.08,
    });
  },
  // Confirmation : deux tons chaleureux avec légère detuning
  confirm: (context) => {
    playTone(context, {
      frequency: 392,
      duration: 0.22,
      type: "sine",
      volume: 0.1,
      detune: 5,
    });
    playTone(context, {
      frequency: 523.25,
      duration: 0.26,
      type: "sine",
      volume: 0.09,
      delay: 0.08,
      detune: -5,
    });
  },
  // Réussite : arpège chaleureux avec corps riche
  success: (context) => {
    const notes = [392, 523.25, 659.25, 783.99];
    notes.forEach((frequency, index) => {
      playTone(context, {
        frequency,
        duration: 0.35,
        type: "sine",
        volume: 0.1 - index * 0.015,
        delay: index * 0.08,
        detune: index * 3,
      });
    });
    playTone(context, { frequency: 523.25, duration: 0.2, type: "sine", volume: 0.05 });
  },
  // Erreur : ton grave qui descend, légèrement désaccordé
  error: (context) => {
    playTone(context, {
      frequency: 146.83,
      endFrequency: 98,
      duration: 0.35,
      type: "square",
      volume: 0.06,
      detune: 16,
    });
    playTone(context, {
      frequency: 174.61,
      endFrequency: 130.81,
      duration: 0.35,
      type: "sawtooth",
      volume: 0.05,
      delay: 0.01,
    });
  },
  // Étoile : carillon avec matière, comme de l'eau qui résonne
  star: (context) => {
    for (let i = 0; i < 3; i++) {
      const freq = 1318.5 * Math.pow(2, i * 0.1);
      playTone(context, {
        frequency: freq,
        duration: 0.4,
        type: "sine",
        volume: 0.06,
        delay: i * 0.1,
        detune: i * -10,
      });
    }
    playWhoosh(context, {
      duration: 0.4,
      volume: 0.03,
      filterFrom: 4000,
      filterTo: 800,
      filterType: "lowpass",
      q: 1.2,
    });
  },
  // Décollage : moteur qui monte avec corps basal + souffle
  launch: (context) => {
    playWhoosh(context, {
      duration: 1.2,
      volume: 0.12,
      filterFrom: 120,
      filterTo: 800,
      filterType: "lowpass",
    });
    playTone(context, {
      frequency: 44,
      duration: 1,
      type: "sine",
      volume: 0.08,
    });
    playTone(context, {
      frequency: 55,
      endFrequency: 880,
      duration: 1,
      type: "sawtooth",
      volume: 0.07,
    });
    playTone(context, { frequency: 880, duration: 0.3, type: "triangle", volume: 0.09 });
  },
  // Pas du rover : petit choc mécanique avec résonance
  step: (context) => {
    playTone(context, {
      frequency: 200,
      duration: 0.1,
      type: "sine",
      volume: 0.1,
    });
    playTone(context, {
      frequency: 440,
      duration: 0.08,
      type: "sine",
      volume: 0.06,
      delay: 0.02,
    });
  },
  // Interrupteur : double "clic" avec espace entre les clics
  toggle: (context) => {
    playTone(context, {
      frequency: 523.25,
      duration: 0.04,
      type: "sine",
      volume: 0.1,
    });
    setTimeout(() => {
      playTone(context, {
        frequency: 523.25,
        duration: 0.04,
        type: "sine",
        volume: 0.1,
      });
    }, 40);
    playWhoosh(context, {
      duration: 0.08,
      volume: 0.04,
      filterFrom: 4000,
      filterTo: 2000,
      filterType: "highpass",
    });
  },
  // Pièce gagnée : deux notes avec corps d'eau
  coin: (context) => {
    playTone(context, {
      frequency: 1318.5,
      duration: 0.2,
      type: "sine",
      volume: 0.08,
    });
    playTone(context, {
      frequency: 1975.5,
      duration: 0.3,
      type: "sine",
      volume: 0.07,
      delay: 0.06,
    });
    playWhoosh(context, {
      duration: 0.2,
      volume: 0.03,
      filterFrom: 6000,
      filterTo: 2000,
      filterType: "bandpass",
      q: 1.3,
    });
  },
  // Bonus du jour : petite fanfare chaleureuse
  bonus: (context) => {
    const notes = [392, 523.25, 659.25];
    notes.forEach((frequency, index) => {
      playTone(context, {
        frequency,
        duration: 0.4,
        type: "sine",
        volume: 0.08,
        delay: index * 0.1,
      });
    });
    playTone(context, {
      frequency: 110,
      duration: 0.6,
      type: "sine",
      volume: 0.04,
    });
  },
  // Achat d'une récompense : son d'achat "espace"
  purchase: (context) => {
    playTone(context, {
      frequency: 880,
      duration: 0.2,
      type: "triangle",
      volume: 0.07,
    });
    playWhoosh(context, {
      duration: 0.1,
      volume: 0.05,
      filterFrom: 2000,
      filterTo: 1000,
      filterType: "lowpass",
    });
    playTone(context, {
      frequency: 2000,
      duration: 0.03,
      type: "sine",
      volume: 0.05,
    });
  },
  // Glissando spatial (pour transitions)
  woosh: (context) => {
    playWhoosh(context, {
      duration: 0.8,
      volume: 0.1,
      filterFrom: 800,
      filterTo: 50,
      filterType: "lowpass",
    });
  },
  // Bourdonnement d'énergie spatiale
  hum: (context) => {
    playTone(context, {
      frequency: 110,
      duration: 0.5,
      type: "sine",
      volume: 0.03,
    });
    playTone(context, {
      frequency: 220,
      duration: 0.5,
      type: "sine",
      volume: 0.02,
    });
  },
  // Effet écho léger
  echo: (context) => {
    playTone(context, {
      frequency: 440,
      duration: 0.3,
      type: "sine",
      volume: 0.08,
    });
    setTimeout(() => {
      playTone(context, {
        frequency: 440 * 0.98,
        duration: 0.3,
        type: "sine",
        volume: 0.05,
        delay: 0.1,
      });
    }, 50);
  },
};

export function playSound(name: SoundName) {
  if (!soundEnabled) return;

  const context = getAudioContext();
  if (!context) return;

  const play = () => {
    try {
      SOUND_RECIPES[name](context);
    } catch {
      // Le jeu reste utilisable si l'audio est indisponible.
    }
  };

  if (context.state === "suspended") {
    context.resume().then(play).catch(() => {});
  } else {
    play();
  }
}