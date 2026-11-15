import { useEffect } from "react";
import { playSound } from "../audio/soundEffects";
import { buildLevelNarration, buildSceneNarration, getLevelNarrative } from "../data/narrative";
import { LEVELS, type LevelId } from "../types/game";
import SpaceBackground from "./SpaceBackground";
import "./earth-level.css";

interface FutureLevelScreenProps {
  levelId: LevelId;
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  narrationEnabled: boolean;
  narrationSupported: boolean;
  isSpeaking: boolean;
  onToggleNarration: () => void;
  speak: (text: string) => void;
  stopNarration: () => void;
}

export default function FutureLevelScreen({
  levelId,
  onBack,
  soundEnabled,
  onToggleSound,
  narrationEnabled,
  narrationSupported,
  isSpeaking,
  onToggleNarration,
  speak,
  stopNarration,
}: FutureLevelScreenProps) {
  const level = LEVELS.find((item) => item.id === levelId) ?? LEVELS[1];
  const narrative = getLevelNarrative(levelId);
  const fullNarration = buildLevelNarration(levelId);

  // Lecture automatique du chapitre dès l'ouverture du niveau.
  useEffect(() => {
    if (!narrationEnabled || !narrationSupported) return;

    speak(fullNarration);
  }, [fullNarration, narrationEnabled, narrationSupported, speak]);

  useEffect(() => {
    return () => stopNarration();
  }, [stopNarration]);

  function handleBack() {
    playSound("back");
    stopNarration();
    onBack();
  }

  return (
    <div className="future-level-page">
      <SpaceBackground variant="levels" />

      <header className="future-level-header">
        <button className="future-level-back" type="button" onClick={handleBack}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m14.5 5-7 7 7 7M8 12h12" />
          </svg>
          Retour à la carte
        </button>

        <div className="earth-header-tools">
          <button
            className={`earth-sound-button earth-narration-button${isSpeaking ? " is-speaking" : ""}`}
            type="button"
            aria-label={narrationEnabled ? "Couper la lecture automatique" : "Activer la lecture automatique"}
            aria-pressed={narrationEnabled && narrationSupported}
            disabled={!narrationSupported}
            title={
              narrationSupported
                ? "Lecture automatique du récit"
                : "Lecture vocale non disponible sur ce navigateur"
            }
            onClick={() => {
              playSound("toggle");
              onToggleNarration();
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 5h16v11H9l-5 4V5Z" />
              <path d="M8 9h8M8 12h5" />
            </svg>
          </button>

          <button
            className="earth-sound-button"
            type="button"
            aria-label={soundEnabled ? "Couper les effets sonores" : "Activer les effets sonores"}
            aria-pressed={soundEnabled}
            onClick={onToggleSound}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z" />
              {soundEnabled ? (
                <>
                  <path d="M15 9a4 4 0 0 1 0 6" />
                  <path d="M17.5 6.5a7.5 7.5 0 0 1 0 11" />
                </>
              ) : (
                <path d="m15.5 9.5 5 5m0-5-5 5" />
              )}
            </svg>
          </button>
        </div>
      </header>

      <main className="future-level-content">
        <p className="earth-section-kicker">PROCHAIN CHAPITRE · NIVEAU {level.id}</p>
        <h1>{level.title}</h1>
        <p className="future-level-intro">{narrative.intro}</p>

        <div className="future-level-actions">
          <button
            className="earth-primary-button"
            type="button"
            disabled={!narrationSupported}
            onClick={() => speak(fullNarration)}
          >
            <span aria-hidden="true">🔊</span> Écouter l'histoire
          </button>
          <button className="earth-quiet-button" type="button" onClick={handleBack}>
            Retour aux niveaux
          </button>
        </div>

        <ol className="future-scenes" aria-label={`Récit du niveau ${level.id}`}>
          {narrative.scenes.map((scene, index) => (
            <li key={scene.id} className="future-scene">
              <div className="future-scene-copy">
                <span className="future-scene-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>{scene.title}</h2>
                <p>{scene.text}</p>
              </div>
              <button
                className="future-scene-listen"
                type="button"
                disabled={!narrationSupported}
                aria-label={`Écouter la scène : ${scene.title}`}
                onClick={() => speak(buildSceneNarration(scene))}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z" />
                  <path d="M15 9a4 4 0 0 1 0 6" />
                  <path d="M17.5 6.5a7.5 7.5 0 0 1 0 11" />
                </svg>
                Écouter
              </button>
            </li>
          ))}
        </ol>

        <p className="future-level-note">
          Le récit de ce niveau est disponible dès maintenant. Son aventure jouable sera ajoutée à la prochaine étape de
          Space Academy.
        </p>
      </main>
    </div>
  );
}
