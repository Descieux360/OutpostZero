# Spécification narrative — Space Academy

## 1. Objectif

Space Academy est un jeu éducatif spatial pour enfants. Cette spécification décrit :

1. le **récit** des trois niveaux, y compris les niveaux 2 et 3 qui n'ont pas encore de gameplay ;
2. la **lecture automatique** du récit et des consignes par synthèse vocale.

Le récit sert de fil conducteur entre les niveaux et prépare les futures mécaniques de jeu.

## 2. Ton et public

- Public : enfants de 7 à 11 ans, lecture accompagnée possible.
- Ton : bienveillant, enthousiaste, jamais anxiogène.
- Phrases courtes (une idée par phrase) pour la lecture à voix haute.
- Vocabulaire scientifique expliqué dans le contexte (oxygène, gravité, serre, rayonnement).
- Pas de peur, pas de compte à rebours stressant, pas de violence.

## 3. Personnages

| Personnage | Rôle narratif |
| --- | --- |
| L'apprenti astronaute (le joueur) | Héros de la mission, choisit son rôle et ses actions. |
| Le centre spatial | Voix des consignes, rappelle les règles de sécurité. |
| L'équipage junior | Explorateur, pilote et ingénieur, selon le rôle choisi. |
| La voix de la mission | Narration automatique, décrit les étapes et félicite le joueur. |

## 4. Structure narrative

| Niveau | Titre | Chapitre | État |
| --- | --- | --- | --- |
| 1 | Terre → Lune | Préparer le départ et décoller | Jouable |
| 2 | Survie sur la Lune | Installer un avant-poste et gérer les ressources | Récit disponible |
| 3 | Survie sur Mars | Voyager, construire une base et survivre | Récit disponible |
| Bonus | Mission secrète | Chapitre à découvrir plus tard | Verrouillé |

Chaque niveau suit le schéma : **arrivée → installation → ressources → imprévu → découverte**.

## 5. Scripts

Les textes source sont dans `src/data/narrative.ts` (source de vérité). Résumé :

### Niveau 1 — Terre → Lune

- **Introduction** : bienvenue au centre spatial, former un équipage, vérifier la navette, décoller.
- **Scènes** : l'équipage, la route de la mission, l'entraînement, les fiches de sécurité, le quiz, le décollage.
- **Narration des étapes** : six textes courts alignés sur les six étapes jouables (`EARTH_STEP_NARRATIONS`).

### Niveau 2 — Survie sur la Lune

- **Introduction** : la fusée se pose sur la Lune, sol gris, ciel noir, construire un abri sûr.
- **Scènes** : alunissage, avant-poste, ressources, nuit lunaire, exploration du sol.
- **Thèmes scientifiques** : vide, combinaison, énergie solaire, recyclage de l'eau, durée du jour lunaire.

### Niveau 3 — Survie sur Mars

- **Introduction** : long voyage vers la planète rouge, peu de ressources, base à construire.
- **Scènes** : voyage, atterrissage, base martienne, serre, tempête de poussière, données scientifiques.
- **Thèmes scientifiques** : atmosphère fine, recyclage, photosynthèse, poussière, météo martienne.

## 6. Lecture automatique

### 6.1 Comportement attendu

- La synthèse vocale lit le récit et les consignes **automatiquement** quand la lecture est activée.
- Niveau 1 : à chaque changement d'étape, la consigne de l'étape est lue.
- Niveaux 2 et 3 : le chapitre complet est lu à l'ouverture, et chaque scène peut être réécoutée.
- Une commande « Écouter » permet de relancer manuellement la lecture courante.
- Activer/désactiver la lecture coupe immédiatement la voix en cours.

### 6.2 Réglages

- Interrupteur **« Lecture automatique »** dans les paramètres (`HomePanelDialog`).
- Le choix est mémorisé dans `localStorage` (`space-academy-narration-v1`), comme les effets sonores.
- Valeur par défaut : activée.
- La lecture vocale est indépendante des effets sonores : couper les bips ne coupe pas la voix.

### 6.3 Voix et découpage

- Langue : `fr-FR` ; voix française du navigateur si disponible.
- Vitesse : `0.95` ; hauteur : `1.02`.
- Les textes longs sont découpés par phrases (< 180 caractères) pour éviter les coupures.
- Une nouvelle lecture annule la précédente.

### 6.4 Accessibilité et robustesse

- Boutons avec `aria-label`, `aria-pressed` et `title` explicites.
- Si `speechSynthesis` n'est pas disponible : boutons désactivés, message « Lecture vocale non disponible sur ce navigateur ».
- Aucune erreur bloquante si la voix échoue : le jeu continue silencieusement.
- La navigation au clavier reste possible ; la lecture ne capture pas le focus.
- La voix est coupée en quittant un niveau.

## 7. Critères d'acceptation

- [ ] L'interrupteur de lecture apparaît dans les paramètres et son état est conservé après rechargement.
- [ ] Au niveau 1, changer d'étape lance la lecture de la nouvelle consigne (si activé).
- [ ] Aux niveaux 2 et 3, le récit complet est lu à l'ouverture (si activé).
- [ ] Chaque scène des niveaux 2 et 3 possède un bouton « Écouter ».
- [ ] Désactiver la lecture coupe la voix immédiatement.
- [ ] Le jeu reste utilisable si la synthèse vocale n'est pas disponible.
- [ ] `npx tsc --noEmit` et `npm run build` passent.

## 8. Fichiers concernés

| Fichier | Rôle |
| --- | --- |
| `src/data/narrative.ts` | Textes du récit et narration des étapes. |
| `src/hooks/useNarration.ts` | Synthèse vocale, réglage persistant, découpage. |
| `src/App.tsx` | Branchement global de la lecture. |
| `src/components/EarthLevel.tsx` | Lecture automatique des étapes du niveau 1. |
| `src/components/FutureLevelScreen.tsx` | Récit et lecture des niveaux 2 et 3. |
| `src/components/HomePanelDialog.tsx` | Interrupteur « Lecture automatique ». |
| `src/components/earth-level.css` | Styles des commandes de lecture et du récit. |
