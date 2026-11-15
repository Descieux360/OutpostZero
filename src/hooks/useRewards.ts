import { useCallback, useEffect, useState } from "react";
import {
  DAILY_BONUS,
  REWARD_TASKS,
  SHOP_REWARDS,
  type RewardPurchase,
  type RewardsState,
} from "../types/rewards";

const STORAGE_KEY = "space-academy-rewards-v1";

export function getRewardsDayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createInitialState(dayKey = getRewardsDayKey()): RewardsState {
  return {
    stars: 0,
    dayKey,
    completedTasks: [],
    bonusClaimed: false,
    purchases: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeStars(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(999_999, Math.floor(value)));
}

function normalizePurchases(value: unknown): RewardPurchase[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((entry): entry is Record<string, unknown> => isRecord(entry))
    .filter((entry) => typeof entry.id === "string" && typeof entry.title === "string")
    .map((entry) => ({
      id: entry.id as string,
      title: entry.title as string,
      icon: typeof entry.icon === "string" ? entry.icon : "⭐",
      cost: normalizeStars(entry.cost),
      at: typeof entry.at === "number" && Number.isFinite(entry.at) ? entry.at : Date.now(),
    }))
    .slice(0, 12);
}

export function normalizeRewardsState(value: unknown): RewardsState {
  const today = getRewardsDayKey();
  if (!isRecord(value)) return createInitialState(today);

  const isSameDay = value.dayKey === today;
  const knownTaskIds = new Set(REWARD_TASKS.map((task) => task.id));
  const completedTasks =
    isSameDay && Array.isArray(value.completedTasks)
      ? [...new Set(value.completedTasks.filter((id): id is string => typeof id === "string" && knownTaskIds.has(id)))]
      : [];

  return {
    stars: normalizeStars(value.stars),
    dayKey: today,
    completedTasks,
    bonusClaimed: isSameDay && value.bonusClaimed === true,
    purchases: normalizePurchases(value.purchases),
  };
}

function loadRewards(): RewardsState {
  if (typeof window === "undefined") return createInitialState();

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? normalizeRewardsState(JSON.parse(stored)) : createInitialState();
  } catch {
    return createInitialState();
  }
}

function saveRewards(state: RewardsState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // La cagnotte reste utilisable pour la session si le stockage est indisponible.
  }
}

export default function useRewards() {
  const [rewards, setRewards] = useState<RewardsState>(loadRewards);

  useEffect(() => {
    saveRewards(rewards);
  }, [rewards]);

  // Les tâches se renouvellent à minuit, même si l'application reste ouverte.
  useEffect(() => {
    const resetForNewDay = () => {
      setRewards((current) => {
        const today = getRewardsDayKey();
        if (current.dayKey === today) return current;
        return { ...current, dayKey: today, completedTasks: [], bonusClaimed: false };
      });
    };

    const interval = window.setInterval(resetForNewDay, 60_000);
    window.addEventListener("focus", resetForNewDay);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", resetForNewDay);
    };
  }, []);

  /** Valide une tâche et crédite les étoiles. */
  const completeTask = useCallback((taskId: string) => {
    const task = REWARD_TASKS.find((entry) => entry.id === taskId);
    if (!task) return;

    setRewards((current) => {
      if (current.completedTasks.includes(taskId)) return current;

      const completedTasks = [...current.completedTasks, taskId];
      const allTasksDone = REWARD_TASKS.every((entry) => completedTasks.includes(entry.id));
      const bonus = allTasksDone && !current.bonusClaimed ? DAILY_BONUS : 0;

      return {
        ...current,
        stars: current.stars + task.stars + bonus,
        completedTasks,
        bonusClaimed: current.bonusClaimed || bonus > 0,
      };
    });
  }, []);

  /** Échange des étoiles contre une récompense. */
  const redeemReward = useCallback((rewardId: string) => {
    const reward = SHOP_REWARDS.find((entry) => entry.id === rewardId);
    if (!reward) return;

    setRewards((current) => {
      if (current.stars < reward.cost) return current;

      const purchase: RewardPurchase = {
        id: reward.id,
        title: reward.title,
        icon: reward.icon,
        cost: reward.cost,
        at: Date.now(),
      };

      return {
        ...current,
        stars: current.stars - reward.cost,
        purchases: [purchase, ...current.purchases].slice(0, 12),
      };
    });
  }, []);

  return { rewards, completeTask, redeemReward, addCoins };
}
