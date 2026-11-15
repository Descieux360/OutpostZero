import { useEffect, useRef, useState } from "react";
import { playSound } from "../audio/soundEffects";
import SpaceBackground from "./SpaceBackground";
import {
  DAILY_BONUS,
  REWARD_TASKS,
  SHOP_REWARDS,
  formatStars,
  formatStarsCount,
  type RewardTask,
  type ShopReward,
  type RewardsState,
} from "../types/rewards";
import "./rewards.css";

interface RewardsScreenProps {
  rewards: RewardsState;
  onCompleteTask: (taskId: string) => void;
  onRedeemReward: (rewardId: string) => void;
  onBack: () => void;
}

interface Feedback {
  type: "success" | "error";
  text: string;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
});

export default function RewardsScreen({
  rewards,
  onCompleteTask,
  onRedeemReward,
  onBack,
}: RewardsScreenProps) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [earned, setEarned] = useState<{ amount: number; key: number } | null>(null);
  const feedbackTimer = useRef<number | null>(null);
  const earnedTimer = useRef<number | null>(null);

  const completedCount = rewards.completedTasks.length;
  const progressPercent = (completedCount / REWARD_TASKS.length) * 100;
  const allTasksDone = completedCount === REWARD_TASKS.length;

  useEffect(() => {
    const clearFeedback = () => {
      if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
      if (earnedTimer.current) window.clearTimeout(earnedTimer.current);
    };

    return () => {
      clearFeedback();
    };
  }, []);

  function showFeedback(nextFeedback: Feedback) {
    setFeedback(nextFeedback);

    if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = window.setTimeout(() => setFeedback(null), 3400);
  }

  function showEarned(amount: number) {
    setEarned({ amount, key: Date.now() });

    if (earnedTimer.current) window.clearTimeout(earnedTimer.current);
    earnedTimer.current = window.setTimeout(() => setEarned(null), 2600);
  }

  function handleCompleteTask(task: RewardTask) {
    if (rewards.completedTasks.includes(task.id)) return;

    const completesDay =
      !rewards.bonusClaimed &&
      REWARD_TASKS.every((entry) => entry.id === task.id || rewards.completedTasks.includes(entry.id));
    const bonus = completesDay ? DAILY_BONUS : 0;

    playSound(completesDay ? "bonus" : "coin");
    onCompleteTask(task.id);
    showEarned(task.stars + bonus);
    showFeedback({
      type: "success",
      text: completesDay
        ? `Super ! +${formatStars(task.stars)} et bonus du jour +${formatStars(bonus)} !`
        : `Bravo ! +${formatStars(task.stars)} ajouté à ta cagnotte.`,
    });
  }

  function handleRedeem(reward: ShopReward) {
    if (rewards.stars < reward.cost) {
      playSound("error");
      showFeedback({
        type: "error",
        text: `Il te manque ${formatStars(reward.cost - rewards.stars)} pour cette récompense.`,
      });
      return;
    }

    playSound("purchase");
    onRedeemReward(reward.id);
    showFeedback({ type: "success", text: `Récompense débloquée : ${reward.title} !` });
  }

  return (
    <div className="rewards-page level-page">
      <SpaceBackground variant="levels" />

      <header className="level-topbar rewards-topbar">
        <div className="level-topbar-actions">
          <button
            className="level-nav-button"
            type="button"
            onClick={() => {
              playSound("back");
              onBack();
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m14.5 5-7 7 7 7M8 12h12" />
            </svg>
            <span>Retour</span>
          </button>
        </div>

        <p className="mission-brand">
          SPACE <strong>ACADEMY</strong>
        </p>

        <span className="rewards-topbar-badge">🌟 Récompenses</span>
      </header>

      <main className="rewards-main">
        <section className="rewards-hero" aria-labelledby="rewards-title">
          <div className="rewards-hero-copy">
            <p className="level-kicker">TABLEAU DES RÉCOMPENSES</p>
            <h1 id="rewards-title">Garde la maison, remporte des ⭐ !</h1>
            <p>
              Termine les tâches du jour pour remplir ta cagnotte d'étoiles, puis échange tes étoiles contre de vraies récompenses avec un adulte.
            </p>
            <div className="rewards-daily-goal">
              <div className="rewards-daily-labels">
                <span>Tâches du jour</span>
                <span>{completedCount} / {REWARD_TASKS.length}</span>
              </div>
              <div
                className="rewards-progress-track"
                role="progressbar"
                aria-label="Progression des tâches du jour"
                aria-valuemin={0}
                aria-valuemax={REWARD_TASKS.length}
                aria-valuenow={completedCount}
              >
                <span style={{ width: `${progressPercent}%` }} />
              </div>
              <p className={`rewards-bonus-chip${rewards.bonusClaimed ? " is-claimed" : ""}`}>
                {rewards.bonusClaimed
                  ? "Bonus du jour gagné ✓"
                  : `Termine les ${REWARD_TASKS.length} tâches : bonus de ${formatStars(
                      DAILY_BONUS,
                    )} !`}
              </p>
            </div>
          </div>

          <div className="rewards-wallet" aria-live="polite">
            <span className="rewards-wallet-icon" aria-hidden="true">
              ⭐
            </span>
            <span className="rewards-wallet-label">Ma cagnotte</span>
            <strong className="rewards-wallet-amount">
              {formatStarsCount(rewards.stars)}
            </strong>
            {earned && (
              <span key={earned.key} className="rewards-wallet-earned" aria-hidden="true">
                +{formatStars(earned.amount)}
              </span>
            )}
            <span className="rewards-wallet-note">
              {allTasksDone
                ? "Toutes les tâches sont faites. Reviens demain !"
                : "Chaque tâche terminée ajoute des ⭐."}
            </span>
          </div>
        </section>

        <div className="rewards-columns">
          <section className="rewards-section" aria-labelledby="rewards-tasks-title">
            <header className="rewards-section-header">
              <div>
                <p className="rewards-section-kicker">À FAIRE AUJOURD'HUI</p>
                <h2 id="rewards-tasks-title">Mes tâches</h2>
              </div>
              <span className="rewards-section-hint">Nouvelles chaque jour</span>
            </header>

            <div className="rewards-task-list">
              {REWARD_TASKS.map((task) => {
                const done = rewards.completedTasks.includes(task.id);

                return (
                  <article key={task.id} className={`rewards-task${done ? " is-done" : ""}`}>
                    <span className="rewards-task-icon" aria-hidden="true">
                      {task.icon}
                    </span>
                    <div className="rewards-task-copy">
                      <strong>{task.title}</strong>
                      <span>{done ? "Validée aujourd'hui ✓" : "Je peux la faire maintenant"}</span>
                    </div>
                    <span className="rewards-task-value">{formatStars(task.stars)}</span>
                    <button
                      className="rewards-task-button"
                      type="button"
                      disabled={done}
                      onClick={() => handleCompleteTask(task)}
                    >
                      {done ? "Fait ✓" : "Je l'ai fait"}
                    </button>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rewards-section" aria-labelledby="rewards-shop-title">
            <header className="rewards-section-header">
              <div>
                <p className="rewards-section-kicker">AVEC MES ⭐</p>
                <h2 id="rewards-shop-title">Mes récompenses</h2>
              </div>
              <span className="rewards-section-hint">À valider avec un adulte</span>
            </header>

            <div className="rewards-shop-list">
              {SHOP_REWARDS.map((reward) => {
                const affordable = rewards.stars >= reward.cost;

                return (
                  <article
                    key={reward.id}
                    className={`rewards-shop-card${affordable ? " is-affordable" : " is-locked"}`}
                  >
                    <span className="rewards-shop-icon" aria-hidden="true">
                      {reward.icon}
                    </span>
                    <div className="rewards-shop-copy">
                      <strong>{reward.title}</strong>
                      <span>{reward.description}</span>
                    </div>
                    <div className="rewards-shop-footer">
                      <span className="rewards-shop-cost">{formatStars(reward.cost)}</span>
                      <button
                        className="rewards-shop-button"
                        type="button"
                        disabled={!affordable}
                        onClick={() => handleRedeem(reward)}
                      >
                        {affordable ? "Échanger" : `Manque ${formatStars(
                          reward.cost - rewards.stars,
                        )}`}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        {rewards.purchases.length > 0 && (
          <section className="rewards-history" aria-labelledby="rewards-history-title">
            <header className="rewards-section-header">
              <div>
                <p className="rewards-section-kicker">DÉJÀ OBTENU</p>
                <h2 id="rewards-history-title">Mes récompenses débloquées</h2>
              </div>
            </header>
            <ul className="rewards-history-list">
              {rewards.purchases.map((purchase, index) => (
                <li key={`${purchase.id}-${purchase.at}-${index}`}>
                  <span aria-hidden="true">{purchase.icon}</span>
                  <strong>{purchase.title}</strong>
                  <span className="rewards-history-date">{DATE_FORMATTER.format(new Date(purchase.at))}</span>
                  <span className="rewards-history-cost">{formatStars(purchase.cost)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="rewards-parent-note">
          Astuce parents : confirmez la tâche avec votre enfant avant de cliquer. La cagnotte et les
          tâches sont enregistrées sur cet appareil.
        </p>
      </main>

      {feedback && (
        <p className={`rewards-feedback is-${feedback.type}`} role="status" aria-live="polite">
          {feedback.text}
        </p>
      )}
    </div>
  );
}