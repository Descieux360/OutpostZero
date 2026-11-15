export interface ExamQuestion {
  prompt: string
  choices: string[]
  answer: number
  explanation: string
}

export const exams = {
  earth: [
    { prompt: 'À quoi sert principalement une fusée ?', choices: ['À lancer une charge ou un vaisseau', 'À faire pousser des plantes', 'À filtrer l’eau dans une base'], answer: 0, explanation: 'La fusée fournit la poussée nécessaire au lancement.' },
    { prompt: 'Quel véhicule explore une surface comme celle de la Lune ?', choices: ['Un rover', 'Une station spatiale', 'Une antenne'], answer: 0, explanation: 'Le rover est conçu pour se déplacer et explorer une surface.' },
    { prompt: 'Pourquoi une base a-t-elle besoin d’un système de support-vie ?', choices: ['Pour gérer l’air et d’autres besoins de l’équipage', 'Pour créer des étoiles', 'Pour remplacer la radio'], answer: 0, explanation: 'Le support-vie aide à maintenir un environnement habitable.' },
    { prompt: 'Une serre spatiale peut produire de la nourriture. Que consomme-t-elle aussi dans le jeu ?', choices: ['De l’eau et de l’énergie', 'Des roches seulement', 'Aucune ressource'], answer: 0, explanation: 'La serre illustre un compromis : elle produit de la nourriture, mais utilise des ressources.' },
    { prompt: 'Lors d’une alerte de radiation dans le scénario, que doit faire l’équipage ?', choices: ['Suivre la procédure de sécurité et se mettre à l’abri', 'Ignorer l’alerte', 'Retirer sa combinaison'], answer: 0, explanation: 'Le jeu enseigne à prendre les alertes au sérieux et à appliquer les procédures prévues.' },
    { prompt: 'Avant une sortie d’entraînement en rover, que faut-il faire ?', choices: ['S’échauffer, vérifier le matériel et écouter les consignes', 'Partir sans contrôle', 'Ignorer les communications'], answer: 0, explanation: 'La préparation combine entraînement, vérification et respect des procédures.' },
    { prompt: 'Quel message radio aide le mieux l’équipe ?', choices: ['Un message bref, précis, avec la situation et le besoin', 'Un message sans détails', 'Aucun message'], answer: 0, explanation: 'Une communication claire permet à l’équipe de comprendre et d’aider.' },
    { prompt: 'Que signifie l’interdépendance dans un équipage ?', choices: ['Les membres comptent les uns sur les autres', 'Chaque personne travaille sans communiquer', 'Une personne fait toutes les tâches'], answer: 0, explanation: 'L’équipage partage les responsabilités et dépend de la coopération de chacun.' },
    { prompt: 'Un coéquipier semble inquiet. Quelle attitude montre de la compassion ?', choices: ['L’écouter et chercher avec lui une solution', 'L’ignorer', 'Le blâmer immédiatement'], answer: 0, explanation: 'Écouter et proposer du soutien favorise la confiance et le travail d’équipe.' },
  ],
  moon: [
    { prompt: 'Pourquoi un habitat lunaire doit-il fournir un environnement protégé ?', choices: ['La Lune n’a pas d’air respirable pour l’équipage', 'La Lune a trop d’océans', 'Pour empêcher la radio de fonctionner'], answer: 0, explanation: 'L’équipage ne peut pas respirer l’environnement lunaire : l’habitat doit le protéger.' },
    { prompt: 'Que peut produire une serre hydroponique dans le jeu ?', choices: ['De la nourriture', 'Du carburant de fusée sans coût', 'Des communications radio'], answer: 0, explanation: 'La serre produit de la nourriture, mais consomme aussi de l’eau et de l’énergie.' },
    { prompt: 'Une alerte de radiation arrive. Quelle décision est la plus prudente dans le jeu ?', choices: ['Mettre l’équipage à l’abri selon la procédure', 'Continuer la sortie sans vérifier', 'Éteindre la radio'], answer: 0, explanation: 'Le jeu demande de réagir à l’alerte et de protéger l’équipage.' },
    { prompt: 'À quoi sert le rover ?', choices: ['À explorer la surface', 'À fabriquer de l’oxygène sans système', 'À remplacer l’habitat'], answer: 0, explanation: 'Le rover sert à se déplacer et à explorer le terrain.' },
    { prompt: 'Si l’énergie manque, quels systèmes peuvent être affectés ?', choices: ['Le support-vie et la serre', 'Seulement les étoiles visibles', 'Aucun système'], answer: 0, explanation: 'Dans la simulation, plusieurs systèmes dépendent de l’énergie : c’est un compromis de jeu.' },
  ],
  mars: [
    { prompt: 'Pourquoi faut-il planifier les réserves avant une mission lointaine ?', choices: ['Le ravitaillement peut être difficile ou retardé', 'Les ressources n’ont jamais de limite', 'Pour éviter de communiquer'], answer: 0, explanation: 'La simulation enseigne à planifier car les ressources et le ravitaillement sont limités.' },
    { prompt: 'La poussière martienne gêne les panneaux solaires. Que faut-il faire ?', choices: ['Évaluer l’énergie et choisir une action de maintenance ou d’économie', 'Ignorer les réserves', 'Arrêter le support-vie'], answer: 0, explanation: 'Il faut comparer les besoins énergétiques et protéger les systèmes essentiels.' },
    { prompt: 'Pourquoi garder un habitat protégé ?', choices: ['Pour fournir un environnement de vie à l’équipage', 'Pour servir de rover', 'Pour produire des étoiles'], answer: 0, explanation: 'L’habitat sert de lieu de vie et de protection dans la simulation.' },
    { prompt: 'Un membre de l’équipage est en difficulté. Que doit faire l’équipe ?', choices: ['Communiquer, s’entraider et organiser les tâches', 'Le laisser seul sans vérifier', 'Cacher le problème'], answer: 0, explanation: 'La coopération et le soutien sont essentiels à la mission.' },
    { prompt: 'Dans Space Academy, les quantités de ressources sont-elles des consignes réelles ?', choices: ['Non, ce sont des unités simplifiées de jeu', 'Oui, elles remplacent une formation professionnelle', 'Oui, elles servent à piloter une vraie base'], answer: 0, explanation: 'Les ressources du jeu sont simplifiées à des fins pédagogiques.' },
  ],
} satisfies Record<'earth' | 'moon' | 'mars', ExamQuestion[]>
