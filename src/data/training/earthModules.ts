export interface TrainingChoice {
  label: string
  correct: boolean
  feedback: string
}

export interface TrainingModuleData {
  id: string
  title: string
  icon: string
  objective: string
  lesson: string
  challenge: string
  choices: TrainingChoice[]
}

export const earthTrainingModules: TrainingModuleData[] = [
  {
    id: 'mission-goals',
    title: 'Comprendre la mission',
    icon: '🎯',
    objective: 'Distinguer les objectifs à court terme et à long terme.',
    lesson: 'À court terme, l’équipage doit réussir le lancement, arriver à destination et sécuriser son habitat. À long terme, il doit rester en bonne santé, entretenir la base et réaliser des expériences scientifiques.',
    challenge: 'Quel est un objectif à court terme au début d’une mission ?',
    choices: [
      { label: 'Vérifier le vaisseau avant le lancement', correct: true, feedback: 'Exact ! C’est une tâche immédiate qui aide à démarrer la mission en sécurité.' },
      { label: 'Construire une ville sur Mars dans dix ans', correct: false, feedback: 'C’est plutôt une idée à long terme, pas une tâche du début de la mission.' },
      { label: 'Ignorer le plan de mission', correct: false, feedback: 'L’équipage doit connaître ses objectifs et vérifier le plan.' },
    ],
  },
  {
    id: 'spacecraft',
    title: 'Vaisseaux et bases',
    icon: '🚀',
    objective: 'Reconnaître les infrastructures utilisées pendant une mission.',
    lesson: 'Une fusée sert au lancement. Un vaisseau transporte l’équipage. Une station spatiale ou une base fournit un lieu de vie et de travail. Un rover est un véhicule qui explore la surface d’un monde.',
    challenge: 'Quel équipement permet d’explorer le sol lunaire ?',
    choices: [
      { label: 'Un rover', correct: true, feedback: 'Oui ! Le rover est un véhicule d’exploration de surface.' },
      { label: 'Une serre seule', correct: false, feedback: 'Une serre aide à produire de la nourriture, mais ne sert pas à conduire sur la surface.' },
      { label: 'Une antenne radio', correct: false, feedback: 'L’antenne permet de communiquer, pas de rouler sur le sol.' },
    ],
  },
  {
    id: 'life-support',
    title: 'Vivre dans l’espace',
    icon: '💧',
    objective: 'Comprendre pourquoi l’air, l’eau, la nourriture et l’énergie sont liés.',
    lesson: 'Dans l’espace, on ne peut pas compter sur l’air extérieur pour respirer. L’habitat doit protéger l’équipage et aider à gérer l’air, l’eau et la température. Une serre peut produire de la nourriture, mais elle utilise de l’eau et de l’énergie.',
    challenge: 'Une serre produit de la nourriture, mais consomme aussi des ressources. Lesquelles ?',
    choices: [
      { label: 'De l’eau et de l’énergie', correct: true, feedback: 'Exact ! Produire de la nourriture demande des ressources.' },
      { label: 'Aucune ressource', correct: false, feedback: 'Même une serre spatiale a besoin d’eau et d’énergie.' },
      { label: 'Seulement des signaux radio', correct: false, feedback: 'La radio sert à communiquer, pas à faire pousser les plantes.' },
    ],
  },
  {
    id: 'space-hazards',
    title: 'Dangers et protection',
    icon: '🛡️',
    objective: 'Repérer quelques dangers spatiaux et choisir une réaction prudente.',
    lesson: 'L’espace peut exposer les astronautes aux radiations, aux rayons ultraviolets, au vide et à de fortes variations de température. Une combinaison et un habitat protègent l’équipage. Lors d’une alerte, il faut suivre les procédures et se mettre à l’abri dans le scénario du jeu.',
    challenge: 'Une alerte de radiation est annoncée pendant une sortie. Que fais-tu ?',
    choices: [
      { label: 'Suivre la procédure et rentrer à l’abri', correct: true, feedback: 'Bonne décision : dans le jeu, l’équipage suit l’alerte et la procédure prévue.' },
      { label: 'Retirer son casque pour mieux entendre', correct: false, feedback: 'Il ne faut jamais retirer l’équipement de protection dans une situation dangereuse.' },
      { label: 'Ignorer l’alerte', correct: false, feedback: 'Les alertes et les communications sont importantes pour la sécurité de l’équipage.' },
    ],
  },
  {
    id: 'training-comms',
    title: 'Entraînement, rover et radio',
    icon: '📻',
    objective: 'Découvrir la préparation physique, les vérifications de sécurité et la conduite simulée d’un rover.',
    lesson: 'Avant une mission, les astronautes s’entraînent à suivre des procédures, à communiquer par radio et à travailler avec des véhicules. Dans ce défi, imagine que tu te prépares à conduire un rover : échauffement, vérification de l’équipement et message radio clair. L’activité est simulée et ne remplace pas une formation professionnelle.',
    challenge: 'Quel est le meilleur plan avant une sortie d’entraînement en rover ?',
    choices: [
      { label: 'S’échauffer, vérifier l’équipement et la radio, puis suivre le parcours simulé avec l’équipe.', correct: true, feedback: 'Exact ! Une bonne préparation associe sécurité, entraînement et communication.' },
      { label: 'Partir immédiatement sans vérifier la radio ni le rover.', correct: false, feedback: 'Il faut vérifier l’équipement et le plan avant de commencer.' },
      { label: 'Conduire vite sans écouter les consignes.', correct: false, feedback: 'La prudence et l’écoute des consignes sont plus importantes que la vitesse.' },
    ],
  },
  {
    id: 'crew-care',
    title: 'Compassion et interdépendance',
    icon: '🤝',
    objective: 'Comprendre que la réussite dépend de l’entraide et de la confiance.',
    lesson: 'Les membres d’un équipage dépendent les uns des autres. Ils partagent les tâches, communiquent et s’aident. La compassion consiste notamment à écouter un coéquipier et à remarquer quand il a besoin de soutien. Les choix d’une personne peuvent aussi affecter tout l’équipage.',
    challenge: 'Un coéquipier est inquiet et fatigué avant une tâche. Quelle est la meilleure première réaction ?',
    choices: [
      { label: 'L’écouter, vérifier comment il va et organiser l’aide de l’équipe', correct: true, feedback: 'Oui. Écouter et coopérer aide l’équipage à prendre une décision ensemble.' },
      { label: 'Se moquer de lui', correct: false, feedback: 'Cela peut isoler le coéquipier et nuire à la confiance.' },
      { label: 'Faire comme si son état ne concernait personne', correct: false, feedback: 'Dans une mission, le bien-être d’un membre peut concerner toute l’équipe.' },
    ],
  },
]
