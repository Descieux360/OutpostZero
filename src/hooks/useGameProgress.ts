import { useCallback, useEffect, useState } from "react";
import type { GameProgress, LevelId } from "../types/game";

const STORAGE_KEY = "space-academy-progress-v1";
const LEVEL_IDS: LevelId[] = [1, 2, 3];

const INITIAL_PROGRESS: GameProgress = {
  completedLevels: [],
  starsByLevel: { 1: 0, 2: 0, 3: 0 },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function clampStars(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(3, Math.floor(value)));
}

function normalizeProgress(value: unknown): GameProgress {
  if (!isRecord(value)) return INITIAL_PROGRESS;

  const completedIds = Array.isArray(value.completedLevels) ? value.completedLevels : [];
  const storedStars = isRecord(value.starsByLevel) ? value.starsByLevel : {};
  const completedLevels: LevelId[] = [];

  // Ignore corrupt or out-of-order saves so a locked level cannot be skipped.
  for (const levelId of LEVEL_IDS) {
    const previousIsComplete = levelId === 1 || completedLevels.includes((levelId - 1) as LevelId);
    if (completedIds.includes(levelId) && previousIsComplete) completedLevels.push(levelId);
  }

  const starsByLevel = { 1: 0, 2: 0, 3: 0 };
  for (const levelId of LEVEL_IDS) {
    if (completedLevels.includes(levelId)) {
      starsByLevel[levelId] = clampStars(storedStars[String(levelId)]);
    }
  }

  return { completedLevels, starsByLevel };
}

export function isLevelUnlocked(progress: GameProgress, levelId: LevelId): boolean {
  return levelId === 1 || progress.completedLevels.includes((levelId - 1) as LevelId);
}

export function recordLevelResult(
  progress: GameProgress,
  levelId: LevelId,
  earnedStars: number,
): GameProgress {
  if (!isLevelUnlocked(progress, levelId)) return progress;

  return {
    completedLevels: [...new Set([...progress.completedLevels, levelId])].sort(),
    starsByLevel: {
      ...progress.starsByLevel,
      [levelId]: Math.max(progress.starsByLevel[levelId], clampStars(earnedStars)),
    },
  };
}

function loadProgress(): GameProgress {
  if (typeof window === "undefined") return INITIAL_PROGRESS;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? normalizeProgress(JSON.parse(stored)) : INITIAL_PROGRESS;
  } catch {
    return INITIAL_PROGRESS;
  }
}

function saveProgress(progress: GameProgress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // The game remains usable when browser storage is unavailable.
  }
}

export default function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const completeLevel = useCallback((levelId: LevelId, earnedStars: number) => {
    setProgress((current) => recordLevelResult(current, levelId, earnedStars));
  }, []);

  return { progress, completeLevel };
}