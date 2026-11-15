import { useState } from "react";
import { playSound } from "../audio/soundEffects";
import { LEVELS, SECRET_MISSION, type GameProgress, type HomePanel, type LevelId } from "../types/game";
import { isLevelUnlocked } from "../hooks/useGameProgress";
import HomePanelDialog from "./HomePanelDialog";
import LevelIllustration from "./LevelIllustration";
import SpaceBackground from "./SpaceBackground";

interface MissionSelectionProps {
  selectedMission: LevelId | null;
  onSelectMission: (id: LevelId) => void;
  onStartMission: (id: LevelId) => void;
  onBack: () => void;
  progress: GameProgress;
  reducedMotion: boolean;
  highContrast: boolean;
  onToggleReducedMotion: () => void;
  onToggleHighContrast: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  narrationEnabled: boolean;
  narrationSupported: boolean;
  onToggleNarration: () => void;
}

export default function MissionSelection({
  selectedMission,
  onSelectMission,
  onStartMission,
  onBack,
  progress,
  reducedMotion,
  highContrast,
  onToggleReducedMotion,
  onToggleHighContrast,
  soundEnabled,
  onToggleSound,
  narrationEnabled,
  narrationSupported,
  onToggleNarration,
}: MissionSelectionProps) {
  const [activePanel, setActivePanel] = useState<HomePanel | null>(null);
  const selectedLevel = LEVELS.find((level) => level.id === selectedMission);
  const completedCount = progress.completedLevels.length;
  const earnedStarCount = Object.values(progress.starsByLevel).reduce((total, stars) => total + stars, 0);
  const completionPercent = (completedCount / LEVELS.length) * 100;

  function handleBack() {
    playSound("back");
    onBack();
  }

  function openOptions() {
    playSound("click");
    setActivePanel("options");
  }

  return (
    <div className="mission-page level-page">
      <SpaceBackground variant="levels" />

      <header className="level-topbar">
        <div className="level-topbar-actions">
          <button className="level-nav-button" type="button" onClick={handleBack}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m14.5 5-7 7 7 7M8 12h12" />
            </svg>
            <span>Retour</span>
          </button>
          <button className="level-home-button" type="button" onClick={handleBack} aria-label="Accueil">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m3 10 9-7 9 7M5.5 9v11h13V9M9.5 20v-7h5v7" />
            </svg>
            <span>Accueil</span>
          </button>
        </div>
        <p className="mission-brand">
          SPACE <strong>ACADEMY</strong>
        </p>
        <button
          className="level-settings-button"
          type="button"
          aria-label="Ouvrir les paramètres"
          aria-haspopup="dialog"
          onClick={openOptions}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="3.2" />
            <path d="M19.4 13.5a7.8 7.8 0 0 0 0-3l1.4-1.1-1.5-2.6-1.7.6a7.7 7.7 0 0 0-2.5-1.4L14.8 4h-3l-.4 2a7.7 7.7 0 0 0-2.5 1.4l-1.7-.6-1.5 2.6 1.4 1.1a7.8 7.8 0 0 0 0 3l-1.4 1.1 1.5 2.6 1.7-.6a7.7 7.7 0 0 0 2.5 1.4l.4 2h3l.4-2a7.7 7.7 0 0 0 2.5-1.4l1.7.6 1.5-2.6-1.5-1.1Z" />
          </svg>
          <span>Paramètres</span>
        </button>
      </header>

      <main className="level-main">
        <header className="level-heading">
          <p className="level-kicker">CARTE DE MISSION</p>
          <h1>Choisis ton niveau</h1>
          <p>Trois aventures spatiales t'attendent.</p>
          <div className="level-progress">
            <span className="level-progress-label">Progression</span>
            <div
              className="level-progress-track"
              role="progressbar"
              aria-label="Progression des niveaux"
              aria-valuemin={0}
              aria-valuemax={LEVELS.length}
              aria-valuenow={completedCount}
            >
              <span style={{ width: `${completionPercent}%` }} />
            </div>
            <span className="level-progress-count">{completedCount}/{LEVELS.length} niveaux</span>
            <span className="level-progress-stars" role="img" aria-label={`${earnedStarCount} étoiles gagnées sur 9`}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3L7 14.2l-5-4.9 6.9-1L12 2Z" />
              </svg>
              {earnedStarCount}/9
            </span>
          </div>
        </header>

        <div className="level-map" role="group" aria-label="Carte des niveaux">
          <svg className="level-route level-route--wide" viewBox="0 0 1000 280" preserveAspectRatio="none" aria-hidden="true">
            <path className="level-route-glow" d="M110 178 C260 178 340 84 500 84 S740 178 890 178" />
            <path className="level-route-line" d="M110 178 C260 178 340 84 500 84 S740 178 890 178" />
            <circle className="level-route-star" cx="110" cy="178" r="5" />
            <circle className="level-route-star" cx="500" cy="84" r="5" />
            <circle className="level-route-star" cx="890" cy="178" r="5" />
          </svg>
          <svg className="level-route level-route--tall" viewBox="0 0 100 390" preserveAspectRatio="none" aria-hidden="true">
            <path className="level-route-glow" d="M50 64 C50 110 50 144 50 195 S50 280 50 326" />
            <path className="level-route-line" d="M50 64 C50 110 50 144 50 195 S50 280 50 326" />
            <circle className="level-route-star" cx="50" cy="64" r="4" />
            <circle className="level-route-star" cx="50" cy="195" r="4" />
            <circle className="level-route-star" cx="50" cy="326" r="4" />
          </svg>

          {LEVELS.map((level) => {
            const isSelected = selectedMission === level.id;
            const unlocked = isLevelUnlocked(progress, level.id);
            const earnedStars = progress.starsByLevel[level.id];

            return (
              <button
                key={level.id}
                className={`level-node level-node--${level.theme}${unlocked ? " is-unlocked" : " is-locked"}${isSelected ? " is-selected" : ""}`}
                type="button"
                disabled={!unlocked}
                aria-label={`Niveau ${level.id}, ${level.title}, ${unlocked ? "disponible" : "verrouillé"}, ${earnedStars} étoiles sur 3`}
                aria-pressed={isSelected}
                onClick={() => {
                  playSound("select");
                  onSelectMission(level.id);
                  onStartMission(level.id);
                }}
              >
                <span className={`level-node-planet${isSelected ? " is-selected" : ""}`}>
                  <LevelIllustration theme={level.theme} />
                  {!unlocked && (
                    <span className="level-lock" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <rect x="5" y="10" width="14" height="11" rx="2" />
                        <path d="M8 10V7a4 4 0 1 1 8 0v3m-4 4v3" />
                      </svg>
                    </span>
                  )}
                </span>
                <span className="level-node-copy">
                  <span className="level-number">NIVEAU {String(level.id).padStart(2, "0")}</span>
                  <strong>{level.title}</strong>
                  <span className="level-subtitle">{level.subtitle}</span>
                  <span className={`level-state${unlocked ? " is-open" : ""}`}>
                    {unlocked ? "Disponible" : "Termine le niveau précédent"}
                  </span>
                </span>
                <span className="level-stars" role="img" aria-label={`${earnedStars} étoiles gagnées sur 3`}>
                  {Array.from({ length: 3 }, (_, index) => (
                    <svg
                      key={index}
                      className={index < earnedStars ? "is-earned" : ""}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3L7 14.2l-5-4.9 6.9-1L12 2Z" />
                    </svg>
                  ))}
                </span>
              </button>
            );
          })}
        </div>

        <p className="level-status" role="status" aria-live="polite">
          {selectedLevel ? (
            <>Niveau {selectedLevel.id} sélectionné : <strong>{selectedLevel.title}</strong></>
          ) : (
            <>Le niveau 1 est prêt pour ta première aventure.</>
          )}
        </p>

        <button className="bonus-level" type="button" disabled aria-label={`${SECRET_MISSION.title}, niveau bonus verrouillé`}>
          <span className="bonus-level-art">
            <LevelIllustration theme={SECRET_MISSION.theme} />
            <span className="bonus-level-lock" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <rect x="5" y="10" width="14" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 1 1 8 0v3" />
              </svg>
            </span>
          </span>
          <span className="bonus-level-copy">
            <span className="bonus-level-kicker">FUTUR NIVEAU BONUS</span>
            <strong>{SECRET_MISSION.title}</strong>
            <span>{SECRET_MISSION.subtitle}</span>
          </span>
          <span className="bonus-level-tag">À venir</span>
        </button>
      </main>

      {activePanel && (
        <HomePanelDialog
          panel={activePanel}
          onClose={() => setActivePanel(null)}
          reducedMotion={reducedMotion}
          highContrast={highContrast}
          onToggleReducedMotion={onToggleReducedMotion}
          onToggleHighContrast={onToggleHighContrast}
          soundEnabled={soundEnabled}
          onToggleSound={onToggleSound}
          narrationEnabled={narrationEnabled}
          narrationSupported={narrationSupported}
          onToggleNarration={onToggleNarration}
        />
      )}
    </div>
  );
}