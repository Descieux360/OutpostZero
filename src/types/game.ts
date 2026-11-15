/** Écrans disponibles à cette étape du projet. */
export type Screen = "home" | "missions" | "earth-level" | "coming-soon" | "rewards";

export type LevelId = 1 | 2 | 3;
export type LevelTheme = "moon" | "lunar-base" | "mars" | "secret";
export type HomePanel = "learn" | "options" | "ranking";

export interface LevelInfo {
  id: LevelId;
  title: string;
  subtitle: string;
  icon: string;
  theme: LevelTheme;
}

export interface GameProgress {
  completedLevels: LevelId[];
  starsByLevel: Record<LevelId, number>;
}

export const LEVELS: LevelInfo[] = [
  {
    id: 1,
    title: "Terre → Lune",
    subtitle: "Prépare la mission, décolle et voyage vers la Lune.",
    icon: "🌕",
    theme: "moon",
  },
  {
    id: 2,
    title: "Survie sur la Lune",
    subtitle: "Installe l'avant-poste et gère les ressources.",
    icon: "🌕",
    theme: "lunar-base",
  },
  {
    id: 3,
    title: "Survie sur Mars",
    subtitle: "Installe ta base et survis à une longue mission.",
    icon: "🔴",
    theme: "mars",
  },
];

/** Bonus indépendant des trois niveaux principaux. */
export const SECRET_MISSION = {
  title: "Mission secrète",
  subtitle: "Un niveau bonus à découvrir plus tard.",
  theme: "secret" as const,
};
