export interface ExamQuestion {
  prompt: string
  choices: string[]
  answer: number
  explanation: string
}

export const exams = {
  earth: [
    { prompt: 'What is the main purpose of a rocket?', choices: ['To launch a payload or spacecraft', 'To grow plants', 'To filter water in a base'], answer: 0, explanation: 'A rocket provides the thrust needed for launch.' },
    { prompt: 'Which vehicle explores a surface like the Moon?', choices: ['A rover', 'A space station', 'An antenna'], answer: 0, explanation: 'A rover is designed to travel across and explore a surface.' },
    { prompt: 'Why does a base need a life-support system?', choices: ['To manage air and other crew needs', 'To create stars', 'To replace the radio'], answer: 0, explanation: 'Life support helps maintain a habitable environment.' },
    { prompt: 'A space greenhouse can produce food. What else does it use in the game?', choices: ['Water and energy', 'Only rocks', 'No resources'], answer: 0, explanation: 'The greenhouse shows a trade-off: it produces food but also uses resources.' },
    { prompt: 'During a radiation alert in the scenario, what should the crew do?', choices: ['Follow safety procedures and take shelter', 'Ignore the alert', 'Remove their spacesuits'], answer: 0, explanation: 'The game teaches players to take alerts seriously and follow the planned procedures.' },
    { prompt: 'Before a rover training exercise, what should you do?', choices: ['Warm up, check your equipment, and listen to instructions', 'Leave without checking anything', 'Ignore communications'], answer: 0, explanation: 'Preparation includes training, equipment checks, and following procedures.' },
    { prompt: 'What kind of radio message helps the team most?', choices: ['A brief, clear message with the situation and what is needed', 'A message with no details', 'No message'], answer: 0, explanation: 'Clear communication helps the team understand the situation and provide support.' },
    { prompt: 'What does interdependence mean for a crew?', choices: ['Crew members rely on one another', 'Everyone works without communicating', 'One person does every task'], answer: 0, explanation: 'The crew shares responsibilities and relies on everyone working together.' },
    { prompt: 'A crewmate seems worried. What is a compassionate response?', choices: ['Listen and work with them to find a solution', 'Ignore them', 'Blame them right away'], answer: 0, explanation: 'Listening and offering support builds trust and teamwork.' },
  ],
  moon: [
    { prompt: 'Why must a lunar habitat provide a protected environment?', choices: ['The Moon has no breathable air for the crew', 'The Moon has too many oceans', 'To keep the radio from working'], answer: 0, explanation: 'The crew cannot breathe the lunar environment, so the habitat must protect them.' },
    { prompt: 'What can a hydroponic greenhouse produce in the game?', choices: ['Food', 'Rocket fuel at no cost', 'Radio communications'], answer: 0, explanation: 'The greenhouse produces food, but also uses water and energy.' },
    { prompt: 'A radiation alert arrives. What is the safest choice in the game?', choices: ['Take shelter according to procedure', 'Continue the outdoor activity without checking', 'Turn off the radio'], answer: 0, explanation: 'The game asks players to respond to the alert and protect the crew.' },
    { prompt: 'What is a rover used for?', choices: ['Exploring the surface', 'Making oxygen without a system', 'Replacing the habitat'], answer: 0, explanation: 'A rover is used to travel across and explore the terrain.' },
    { prompt: 'If energy is running low, which systems could be affected?', choices: ['Life support and the greenhouse', 'Only the visible stars', 'No systems'], answer: 0, explanation: 'In the simulation, several systems depend on energy, creating a gameplay trade-off.' },
  ],
  mars: [
    { prompt: 'Pourquoi faut-il planifier les réserves avant une mission lointaine ?', choices: ['Le ravitaillement peut être difficile ou retardé', 'Les ressources n’ont jamais de limite', 'Pour éviter de communiquer'], answer: 0, explanation: 'La simulation enseigne à planifier car les ressources et le ravitaillement sont limités.' },
    { prompt: 'La poussière martienne gêne les panneaux solaires. Que faut-il faire ?', choices: ['Évaluer l’énergie et choisir une action de maintenance ou d’économie', 'Ignorer les réserves', 'Arrêter le support-vie'], answer: 0, explanation: 'Il faut comparer les besoins énergétiques et protéger les systèmes essentiels.' },
    { prompt: 'Pourquoi garder un habitat protégé ?', choices: ['Pour fournir un environnement de vie à l’équipage', 'Pour servir de rover', 'Pour produire des étoiles'], answer: 0, explanation: 'L’habitat sert de lieu de vie et de protection dans la simulation.' },
    { prompt: 'Un membre de l’équipage est en difficulté. Que doit faire l’équipe ?', choices: ['Communiquer, s’entraider et organiser les tâches', 'Le laisser seul sans vérifier', 'Cacher le problème'], answer: 0, explanation: 'La coopération et le soutien sont essentiels à la mission.' },
    { prompt: 'Dans Space Academy, les quantités de ressources sont-elles des consignes réelles ?', choices: ['Non, ce sont des unités simplifiées de jeu', 'Oui, elles remplacent une formation professionnelle', 'Oui, elles servent à piloter une vraie base'], answer: 0, explanation: 'Les ressources du jeu sont simplifiées à des fins pédagogiques.' },
  ],
} satisfies Record<'earth' | 'moon' | 'mars', ExamQuestion[]>
