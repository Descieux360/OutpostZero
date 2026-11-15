import { useState } from "react";
import { playSound } from "../audio/soundEffects";
import type { HomePanel } from "../types/game";
import { formatStarsCount } from "../types/rewards";
import GameLogo from "./GameLogo";
import HomePanelDialog from "./HomePanelDialog";
import NavigationMenu from "./NavigationMenu";
import PlayButton from "./PlayButton";
import SpaceBackground from "./SpaceBackground";

interface HomeScreenProps {
  onPlay: () => void;
  reducedMotion: boolean;
  highContrast: boolean;
  onToggleReducedMotion: () => void;
  onToggleHighContrast: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  narrationEnabled: boolean;
  narrationSupported: boolean;
  onToggleNarration: () => void;
  stars: number;
  onOpenRewards: () => void;
}

export default function HomeScreen({
  onPlay,
  reducedMotion,
  highContrast,
  onToggleReducedMotion,
  onToggleHighContrast,
  soundEnabled,
  onToggleSound,
  narrationEnabled,
  narrationSupported,
  onToggleNarration,
  stars,
  onOpenRewards,
}: HomeScreenProps) {
  const [activePanel, setActivePanel] = useState<HomePanel | null>(null);

  function handlePlay() {
    playSound("confirm");
    onPlay();
  }

  function handleOpenRewards() {
    playSound("coin");
    onOpenRewards();
  }

  function openPanel(panel: HomePanel) {
    playSound("click");
    setActivePanel(panel);
  }

  return (
    <div className="home-page">
      <SpaceBackground />

      <header className="home-header">
        <GameLogo />
      </header>

      <main className="home-main" aria-label="Accueil de Space Academy">
        <div className="home-actions">
          <PlayButton onClick={handlePlay} />
          <button className="home-rewards-button" type="button" onClick={handleOpenRewards}>
            <span className="home-rewards-icon" aria-hidden="true">
              🌟
            </span>
            <span className="home-rewards-copy">
              <strong>Mes récompenses</strong>
              <small>Tâches du jour & cadeaux à gagner</small>
            </span>
            <span className="home-rewards-stars">{formatStarsCount(stars)}</span>
          </button>
        </div>
      </main>

      <NavigationMenu onOpen={openPanel} />

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
