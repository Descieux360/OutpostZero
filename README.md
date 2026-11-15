# Space Academy

Application éducative React + TypeScript pour entraîner de jeunes astronautes à prendre des décisions de mission. Le projet réutilise le simulateur lunaire **Outpost Zero** comme niveau de survie sur la Lune.

## Parcours du jeu

1. **Terre — Formation de l’astronaute junior** : choix d’un profil, objectifs de mission, vaisseaux et bases, support-vie, dangers, radio, préparation physique et rover simulé, compassion et interdépendance de l’équipage. Chaque module comprend un défi.
2. **Lune — Survie à l’avant-poste** : reprise du simulateur existant de 30 jours pour gérer l’énergie, l’oxygène, l’eau et la nourriture.
3. **Mars — Mission de survie** : simulation courte où il faut équilibrer énergie, recyclage, serre et moral de l’équipage.

Un examen est requis pour valider chaque niveau. Il faut obtenir au moins 80 % pour débloquer le suivant. La progression est enregistrée dans `localStorage`.

## Lancer le projet

```bash
npm install
npm run dev
```

## Vérifier le projet

```bash
npm run build
npm run lint
```

## Images et ressources

L’image de couverture de l’accueil est `public/space-academy-hero.jpg`, récupérée depuis l’image publique de la page de référence. L’ancien `public/hero.png` est conservé dans le projet. Les pages de sélection utilisent aussi des illustrations intégrées (émojis et CSS). Des animations CSS légères (étoiles, entrée des panneaux, flottement des planètes et évolution des jauges) sont incluses ; elles respectent le réglage système « réduire les animations ».

## Données NASA DONKI (facultatif)

```bash
cp .env.example .env
# Ajouter la clé NASA et la période souhaitée dans .env
npm run fetch:donki
```

Le jeu lit le fichier DONKI sauvegardé et ne fait pas d’appel API au moment de jouer. Les quantités de ressources du jeu sont des unités simplifiées à des fins éducatives — pas des valeurs NASA, des procédures opérationnelles ou des consignes de sécurité réelles.

## Déploiement

Le fichier `vercel.json` réécrit les routes vers `index.html`, ce qui permet d’utiliser les routes de l’application React Router sur Vercel.
