export interface RewardTask {
  id: string;
  title: string;
  icon: string;
  stars: number;
}

export interface ShopReward {
  id: string;
  title: string;
  icon: string;
  description: string;
  cost: number;
}

export interface RewardPurchase {
  id: string;
  title: string;
  icon: string;
  cost: number;
  at: number;
}

export interface RewardsState { coins: number;
  stars: number;
  /** Jour local (AAAA-MM-JJ) auquel correspondent les tâches terminées. */
  dayKey: string;
  completedTasks: string[];
  bonusClaimed: boolean;
  purchases: RewardPurchase[];
}

export const DAILY_BONUS = 3;

/** Nombre d'étoiles maximum pouvant être affichées (3 étoiles = max par niveau). */
export const MAX_STARS_VISIBLE = 3;

/** Mapping : combien d'étoiles rapporte chaque tâche */
export const REWARD_STARS: Record<string, number> = {
  mission: 1,
  lesson: 1,
  rocket: 1,
  draw: 1,
  read: 1,
};

export function getStarLabel(value: number): string {
  // Affiche des "étoiles" pleines avec l'emoji ⭐, coupées si besoin
  const full = Math.min(value, 3);
  const empty = 3 - full;
  return "⭐".repeat(full) + "☆".repeat(empty);
}

export const REWARD_TASKS: RewardTask[] = [
  { id: "mission", title: "Terminer une mission", icon: "🚀", stars: 1 },
  { id: "lesson", title: "Apprendre une leçon", icon: "📚", stars: 1 },
  { id: "rocket", title: "Construire une fusée", icon: "🛸", stars: 1 },
  { id: "draw", title: "Dessiner une planète", icon: "🎨", stars: 1 },
  { id: "read", title: "Lire sur l'espace", icon: "📖", stars: 1 },
];

export const SHOP_REWARDS: ShopReward[] = [
  { id: "badge", title: "Badge astronaute", icon: "🏆", description: "Un badge à accrocher au mur.", cost: 3 },
  { id: "helmet", title: "Casquette astronaute", icon: "🪖", description: "Pour les jeux de rôle dans la chambre.", cost: 5 },
  { id: "model", title: "Modèle de Lune", icon: "🌙", description: "Un modèle en 3D du satellite Terre-Lune.", cost: 7 },
  { id: "telescope", title: "Télescope", icon: "🔭", description: "Observer les étoiles depuis sa fenêtre.", cost: 10 },
  { id: "game", title: "Nouveau jeu spatial", icon: "🎮", description: "Un nouveau niveau à débloquer.", cost: 15 },
];

/** Formate le nombre d'étoiles en affichage "⭐⭐⭐☆☆" (3 positions). */
export function formatStars(value: number): string {
  const full = Math.min(value, 3);
  const empty = 3 - full;
  return "⭐".repeat(full) + "☆".repeat(empty);
}

export function formatStarsCount(value: number): string {
  const clamped = Math.max(0, Math.min(99, Math.floor(value)));
  return clamped > 0 ? `${clamped} ⭐` : "0 ⭐";
}