import { useState } from "react";
import HomeScreen from "./components/HomeScreen";
import EarthLevel from "./components/EarthLevel";
import FutureLevelScreen from "./components/FutureLevelScreen";
import MissionSelection from "./components/MissionSelection";
import RewardsScreen from "./components/RewardsScreen";
import useGameProgress from "./hooks/useGameProgress";
import useNarration from "./hooks/useNarration";
import useRewards from "./hooks/useRewards";
import useSoundEffects from "./hooks/useSoundEffects";
import type { LevelId, Screen } from "./types/game";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedMission, setSelectedMission] = useState<LevelId | null>(null);
  const [rewardsReturnScreen, setRewardsReturnScreen] = useState<Screen>("home");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const { progress, completeLevel } = useGameProgress();
  const { rewards, completeTask, redeemReward, addCoins } = useRewards();
  const { soundEnabled, toggleSound } = useSoundEffects();
  const {
    narrationEnabled,
    narrationSupported,
    isSpeaking,
    toggleNarration,
    speak,
    stopNarration,
  } = useNarration();

  const startMission = (levelId: LevelId) => {
    setSelectedMission(levelId);
    setScreen("earth-level");
  };

  const openRewards = () => {
    setRewardsReturnScreen(screen);
    setScreen("rewards");
  };

  const giveLevelReward = () => {
    addCoins(1);
  };

  return (
    <div className={`app-shell${reducedMotion ? " is-reduced-motion" : ""}${highContrast ? " is-high-contrast" : ""}`}>
      {screen === "home" ? (
        <HomeScreen
          onPlay={() => setScreen("missions")}
          reducedMotion={reducedMotion}
          highContrast={highContrast}
          onToggleReducedMotion={() => setReducedMotion((value) => !value)}
          onToggleHighContrast={() => setHighContrast((value) => !value)}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          narrationEnabled={narrationEnabled}
          narrationSupported={narrationSupported}
          onToggleNarration={toggleNarration}
          stars={rewards.stars}
          onOpenRewards={openRewards}
        />
      ) : screen === "missions" ? (
        <MissionSelection
          selectedMission={selectedMission}
          onSelectMission={setSelectedMission}
          onStartMission={startMission}
          onBack={() => setScreen("home")}
          progress={progress}
          reducedMotion={reducedMotion}
          highContrast={highContrast}
          onToggleReducedMotion={() => setReducedMotion((value) => !value)}
          onToggleHighContrast={() => setHighContrast((value) => !value)}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          narrationEnabled={narrationEnabled}
          narrationSupported={narrationSupported}
          onToggleNarration={toggleNarration}
        />
      ) : screen === "earth-level" ? (
        <EarthLevel
          bestStars={progress.starsByLevel[1]}
          onBack={() => setScreen("missions")}
          onComplete={(stars) => {
            completeLevel(1, stars);
            giveLevelReward();
          }}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          narrationEnabled={narrationEnabled}
          narrationSupported={narrationSupported}
          isSpeaking={isSpeaking}
          onToggleNarration={toggleNarration}
          speak={speak}
          stopNarration={stopNarration}
        />
      ) : screen === "rewards" ? (
        <RewardsScreen
          rewards={rewards}
          onCompleteTask={completeTask}
          onRedeemReward={redeemReward}
          onBack={() => setScreen(rewardsReturnScreen === "missions" ? "missions" : "home")}
        />
      ) : (
        <FutureLevelScreen
          levelId={selectedMission ?? 1}
          onBack={() => setScreen("missions")}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          narrationEnabled={narrationEnabled}
          narrationSupported={narrationSupported}
          isSpeaking={isSpeaking}
          onToggleNarration={toggleNarration}
          speak={speak}
          stopNarration={stopNarration}
        />
      )}
    </div>
  );
}