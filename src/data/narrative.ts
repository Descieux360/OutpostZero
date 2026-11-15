import type { LevelId } from "../types/game";

export interface NarrativeScene {
  id: string;
  title: string;
  text: string;
}

export interface LevelNarrative {
  intro: string;
  scenes: NarrativeScene[];
}

/**
 * Spécification narrative des trois niveaux de Space Academy.
 * Chaque texte est écrit pour être lu à voix haute (phrases courtes, ton bienveillant).
 */
export const LEVEL_NARRATIVES: Record<LevelId, LevelNarrative> = {
  1: {
    intro:
      "Bienvenue à la Space Academy ! Te voilà au centre spatial de la Terre. Ta mission : former un équipage, vérifier la navette et décoller vers la Lune.",
    scenes: [
      {
        id: "crew",
        title: "Un équipage pour la Lune",
        text: "Chaque mission commence par une équipe. Explorateur, pilote ou ingénieur : choisis le rôle qui te ressemble et prépare-toi à travailler avec les autres.",
      },
      {
        id: "mission",
        title: "La route de la mission",
        text: "La Terre est notre point de départ. La Lune est le premier grand objectif. Plus tard, l'équipage rêvera d'aller encore plus loin, jusqu'à Mars.",
      },
      {
        id: "training",
        title: "L'entraînement",
        text: "Avant de partir, on entraîne son corps, on apprend à conduire le rover et on vérifie chaque système de la navette.",
      },
      {
        id: "academy",
        title: "Les fiches de sécurité",
        text: "Dans l'espace, la combinaison, l'oxygène, la nourriture et la radio sont essentielles. Les fiches de sécurité expliquent comment les utiliser.",
      },
      {
        id: "quiz",
        title: "Le test des connaissances",
        text: "Un petit quiz permet de vérifier ce que tu as appris. Chaque bonne réponse rapproche l'équipage du décollage.",
      },
      {
        id: "launch",
        title: "Le décollage",
        text: "Tout est prêt : l'équipage, la navette et la destination. Il ne reste plus qu'à lancer la fusée et à mettre le cap sur la Lune.",
      },
    ],
  },
  2: {
    intro:
      "La fusée se pose en douceur sur la Lune. Autour de toi, le sol est gris et le ciel reste noir, même en plein jour. Il faut maintenant construire un endroit sûr pour vivre.",
    scenes: [
      {
        id: "landing",
        title: "Alunissage en douceur",
        text: "L'équipage vérifie la combinaison, l'oxygène et la radio. Sur la Lune, il n'y a pas d'air : chaque sortie se prépare avec attention.",
      },
      {
        id: "base",
        title: "Installer l'avant-poste",
        text: "Les astronautes déploient un habitat, des panneaux solaires et une antenne. L'avant-poste devient leur maison loin de la Terre.",
      },
      {
        id: "resources",
        title: "Gérer les ressources",
        text: "L'eau, l'oxygène et l'énergie sont précieux. Il faut les mesurer, les partager et éviter le gaspillage chaque jour.",
      },
      {
        id: "night",
        title: "La nuit lunaire",
        text: "La nuit dure plusieurs jours terrestres et il fait très froid. Les réserves et les batteries doivent tenir jusqu'au retour du Soleil.",
      },
      {
        id: "science",
        title: "Explorer le sol lunaire",
        text: "L'équipage récolte des échantillons de poussière et observe les cratères. Ces découvertes aideront à préparer le grand voyage vers Mars.",
      },
    ],
  },
  3: {
    intro:
      "Cap sur Mars ! Le voyage est long et la planète rouge réserve beaucoup de surprises. L'équipage devra construire une base et survivre avec très peu de ressources.",
    scenes: [
      {
        id: "travel",
        title: "Le long voyage",
        text: "Pendant plusieurs mois, la navette file dans le vide. L'équipage s'entraîne, range le matériel et garde le contact avec la Terre.",
      },
      {
        id: "landing",
        title: "L'atterrissage sur Mars",
        text: "Mars possède une fine atmosphère. La descente doit être précise pour protéger la navette et tout le matériel scientifique.",
      },
      {
        id: "base",
        title: "La base martienne",
        text: "L'habitat est installé près d'un cratère. Les astronautes déploient des panneaux solaires, une antenne et un système de recyclage de l'eau.",
      },
      {
        id: "greenhouse",
        title: "La serre et les ressources",
        text: "Dans la serre, des plantes poussent sous une lumière spéciale. Elles produisent de la nourriture et aident à renouveler l'air.",
      },
      {
        id: "dust",
        title: "La tempête de poussière",
        text: "Parfois, une tempête recouvre les panneaux solaires de poussière. L'équipage doit nettoyer, économiser l'énergie et patienter ensemble.",
      },
      {
        id: "return",
        title: "Les données de la mission",
        text: "Chaque expérience est notée. Grâce à ces données, les prochaines missions martiennes seront plus sûres et plus efficaces.",
      },
    ],
  },
};

/** Narration associée aux six étapes du niveau 1 (Terre). */
export const EARTH_STEP_NARRATIONS: string[] = [
  "Étape 1 : l'astronaute. Choisis ton rôle pour former l'équipage junior. Explorateur, pilote ou ingénieur, chacun a une mission importante.",
  "Étape 2 : la mission. La Terre est le point de départ. La Lune est le premier grand objectif, et Mars reste le rêve de la prochaine aventure.",
  "Étape 3 : la préparation. Entraîne ton corps, conduis le rover sur le parcours et vérifie la navette avant le départ.",
  "Étape 4 : l'académie. Lis les fiches de sécurité pour comprendre la combinaison, l'oxygène, la nourriture, la radio et les dangers de l'espace.",
  "Étape 5 : le quiz. Réponds aux trois questions pour gagner tes étoiles de mission.",
  "Étape 6 : le décollage. Tout est vérifié. Il ne reste plus qu'à lancer la fusée et à mettre le cap sur la Lune.",
];

export function getLevelNarrative(levelId: LevelId): LevelNarrative {
  return LEVEL_NARRATIVES[levelId];
}

/** Texte complet d'un niveau, prêt pour la lecture automatique. */
export function buildLevelNarration(levelId: LevelId): string {
  const narrative = getLevelNarrative(levelId);
  return [narrative.intro, ...narrative.scenes.map((scene) => `${scene.title}. ${scene.text}`)].join(" ");
}

export function buildSceneNarration(scene: NarrativeScene): string {
  return `${scene.title}. ${scene.text}`;
}
