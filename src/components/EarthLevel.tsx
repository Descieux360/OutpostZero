import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { playSound } from "../audio/soundEffects";
import { EARTH_STEP_NARRATIONS } from "../data/narrative";
import "./earth-level.css";

interface EarthLevelProps {
  bestStars: number;
  onBack: () => void;
  onComplete: (stars: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  narrationEnabled: boolean;
  narrationSupported: boolean;
  isSpeaking: boolean;
  onToggleNarration: () => void;
  speak: (text: string) => void;
  stopNarration: () => void;
}

const STEPS = [
  { title: "Astronaute", heading: "Sélection de l'astronaute junior", intro: "Choisis le rôle qui accompagnera ton équipage.", short: "Équipage" },
  { title: "Mission", heading: "Objectifs de mission", intro: "La Terre est le point de départ. La Lune est notre premier grand objectif.", short: "Mission" },
  { title: "Préparation", heading: "Préparation au départ", intro: "Entraîne-toi, pilote le rover et vérifie la navette.", short: "Prépa" },
  { title: "Académie", heading: "Apprendre sur Terre", intro: "Lis les fiches de sécurité avant de partir dans l'espace.", short: "Académie" },
  { title: "Quiz", heading: "Test de connaissances", intro: "Réponds au quiz pour obtenir tes étoiles de mission.", short: "Quiz" },
  { title: "Décollage", heading: "Prêt pour le départ", intro: "Tout est vérifié. Il ne reste qu'à lancer la fusée.", short: "Décollage" },
];

const CREW_ROLES = [
  { id: "explorer", title: "Explorateur", icon: "🧭", description: "Observe les planètes et repère les dangers." },
  { id: "pilot", title: "Pilote", icon: "🚀", description: "Prends les commandes du rover et de la navette." },
  { id: "engineer", title: "Ingénieur", icon: "🔧", description: "Vérifie les outils, les réserves et les systèmes." },
] as const;

type CrewRole = (typeof CREW_ROLES)[number]["id"];

const TRAINING_ACTIVITIES = [
  { id: "fitness", title: "Sport", icon: "🏃", description: "Prépare ton corps à la vie dans l'espace." },
  { id: "rover", title: "Rover", icon: "🛻", description: "Suis le parcours d'entraînement." },
  { id: "shuttle", title: "Navette", icon: "🛰️", description: "Effectue les vérifications de prévol." },
] as const;

type TrainingId = (typeof TRAINING_ACTIVITIES)[number]["id"];

const PREFLIGHT_ITEMS = [
  { id: "suit", title: "Combinaison", detail: "Visière fermée et joints vérifiés." },
  { id: "oxygen", title: "Oxygène", detail: "Réserve d'air prête pour l'équipage." },
  { id: "navigation", title: "Navigation", detail: "Trajet Terre-Lune chargé dans l'ordinateur." },
] as const;

type PreflightId = (typeof PREFLIGHT_ITEMS)[number]["id"];

const LESSONS = [
  {
    id: "vacuum",
    title: "Vide et combinaison",
    icon: "🧑‍🚀",
    summary: "Pourquoi porte-t-on une combinaison ?",
    body: "L'espace ne contient presque pas d'air. La combinaison garde autour de l'astronaute l'air respirable, une pression adaptée et une température plus sûre.",
    fact: "Dans le vide spatial, on ne peut pas respirer sans équipement.",
  },
  {
    id: "radiation",
    title: "Rayonnements UV",
    icon: "☀️",
    summary: "Le Soleil est une source d'énergie, mais aussi de rayons UV.",
    body: "L'atmosphère terrestre filtre une grande partie des ultraviolets. En mission, une visière et des protections adaptées aident à protéger les astronautes.",
    fact: "La visière protège les yeux de la lumière intense et des UV.",
  },
  {
    id: "food",
    title: "Nourriture et réserves",
    icon: "🥕",
    summary: "Une portion par jour et des réserves bien organisées.",
    body: "Les repas spatiaux sont emballés pour rester propres et faciles à ranger. L'eau est précieuse. En apesanteur, les miettes peuvent flotter jusque dans les équipements.",
    fact: "On planifie les portions et l'eau avant le départ pour éviter le gaspillage.",
  },
  {
    id: "radio",
    title: "Radio et communications",
    icon: "📡",
    summary: "Comment parler quand il n'y a pas d'air ?",
    body: "La voix passe par un microphone et devient un signal radio. Les ondes radio peuvent voyager dans le vide entre la navette et le centre spatial.",
    fact: "Le son a besoin d'un milieu comme l'air, mais les ondes radio voyagent dans le vide.",
  },
  {
    id: "hazards",
    title: "Dangers de l'espace",
    icon: "⚠️",
    summary: "Froid, roches, rayonnements et absence d'air.",
    body: "Une mission prépare l'équipage aux températures extrêmes, aux poussières et aux petits objets qui filent dans l'espace. La combinaison et les procédures de sécurité sont essentielles.",
    fact: "L'équipage suit des procédures et reste en contact radio avec la mission.",
  },
] as const;

type LessonId = (typeof LESSONS)[number]["id"];

const QUIZ_QUESTIONS = [
  {
    prompt: "Quelle est notre planète de départ ?",
    answers: ["Mars", "La Terre", "La Lune"],
    correct: 1,
    explanation: "Exact ! Notre mission commence sur Terre.",
  },
  {
    prompt: "Qu'est-ce qui aide à protéger l'astronaute du vide et du froid ?",
    answers: ["Une combinaison spatiale", "Un parapluie", "Un simple manteau"],
    correct: 0,
    explanation: "Oui ! La combinaison fournit un environnement protégé.",
  },
  {
    prompt: "Quel moyen permet de transmettre la voix dans l'espace ?",
    answers: ["Un cri", "Un sifflet", "La radio"],
    correct: 2,
    explanation: "Bien joué ! Les ondes radio voyagent dans le vide.",
  },
] as const;

const ROVER_ROUTE = ["up", "right", "up"] as const;
const ROVER_DIRECTIONS = [
  { id: "left", label: "Tourner à gauche", symbol: "←" },
  { id: "up", label: "Avancer", symbol: "↑" },
  { id: "right", label: "Tourner à droite", symbol: "→" },
] as const;

export default function EarthLevel({
  bestStars,
  onBack,
  onComplete,
  soundEnabled,
  onToggleSound,
  narrationEnabled,
  narrationSupported,
  isSpeaking,
  onToggleNarration,
  speak,
  stopNarration,
}: EarthLevelProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [role, setRole] = useState<CrewRole | null>(null);
  const [trainingActivity, setTrainingActivity] = useState<TrainingId>("fitness");
  const [training, setTraining] = useState<Record<TrainingId, boolean>>({
    fitness: false,
    rover: false,
    shuttle: false,
  });
  const [sportRounds, setSportRounds] = useState(0);
  const [roverStep, setRoverStep] = useState(0);
  const [roverMessage, setRoverMessage] = useState("Suis la route avec les flèches.");
  const [preflight, setPreflight] = useState<Record<PreflightId, boolean>>({
    suit: false,
    oxygen: false,
    navigation: false,
  });
  const [selectedLesson, setSelectedLesson] = useState<LessonId>("vacuum");
  const [readLessons, setReadLessons] = useState<LessonId[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizResults, setQuizResults] = useState<boolean[]>([]);
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizFailed, setQuizFailed] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizStars, setQuizStars] = useState(0);
  const [finished, setFinished] = useState(false);

  const allTrainingComplete = TRAINING_ACTIVITIES.every((activity) => training[activity.id]);
  const allLessonsRead = readLessons.length === LESSONS.length;
  const allPreflightChecked = PREFLIGHT_ITEMS.every((item) => preflight[item.id]);
  const completedTrainingCount = TRAINING_ACTIVITIES.filter((activity) => training[activity.id]).length;
  const currentQuestion = QUIZ_QUESTIONS[quizIndex];
  const activeLesson = LESSONS.find((lesson) => lesson.id === selectedLesson) ?? LESSONS[0];
  const selectedRole = CREW_ROLES.find((crewRole) => crewRole.id === role);
  const earnedQuizScore = quizResults.filter(Boolean).length;
  const visibleBestStars = finished ? Math.max(bestStars, quizStars) : bestStars;

  const canContinue =
    (stepIndex === 0 && role !== null) ||
    stepIndex === 1 ||
    (stepIndex === 2 && allTrainingComplete) ||
    (stepIndex === 3 && allLessonsRead);

  const continueHint =
    !canContinue && stepIndex === 0
      ? "Choisis un rôle d'astronaute pour débloquer Continuer."
      : !canContinue && stepIndex === 2
        ? "Termine les 3 activités de préparation : Sport, Rover et Navette."
        : !canContinue && stepIndex === 3
          ? "Ouvre les 5 fiches et clique sur « J'ai compris » pour chacune."
          : stepIndex === 2
            ? `${completedTrainingCount}/3 activités terminées`
            : stepIndex === 3
              ? `${readLessons.length}/${LESSONS.length} leçons lues`
              : "";

  function continueToNextStep() {
    if (!canContinue || stepIndex >= 4) return;
    playSound("confirm");
    const nextStep = stepIndex + 1;
    setStepIndex(nextStep);
    setMaxStep((current) => Math.max(current, nextStep));
  }

  function markLessonRead() {
    const alreadyRead = readLessons.includes(selectedLesson);
    playSound(alreadyRead ? "click" : "confirm");
    setReadLessons((current) => (current.includes(selectedLesson) ? current : [...current, selectedLesson]));
  }

  function doFitnessRound() {
    if (training.fitness) return;
    const nextRound = Math.min(3, sportRounds + 1);
    setSportRounds(nextRound);
    if (nextRound === 3) {
      playSound("success");
      setTraining((current) => ({ ...current, fitness: true }));
    } else {
      playSound("click");
    }
  }

  function driveRover(direction: string) {
    if (training.rover) return;
    if (direction !== ROVER_ROUTE[roverStep]) {
      playSound("error");
      setRoverStep(0);
      setRoverMessage("Oups, le rover a raté le chemin. Recommence depuis le départ.");
      return;
    }

    const nextStep = roverStep + 1;
    setRoverStep(nextStep);
    if (nextStep === ROVER_ROUTE.length) {
      playSound("success");
      setTraining((current) => ({ ...current, rover: true }));
      setRoverMessage("Parcours réussi ! Le rover est prêt pour la mission.");
    } else {
      playSound("step");
      setRoverMessage(`Bonne direction ! Étape ${nextStep} sur ${ROVER_ROUTE.length}.`);
    }
  }

  function handleRoverKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keyDirection: Record<string, string> = {
      ArrowUp: "up",
      ArrowLeft: "left",
      ArrowRight: "right",
    };
    const direction = keyDirection[event.key];
    if (!direction) return;
    event.preventDefault();
    driveRover(direction);
  }

  function togglePreflight(itemId: PreflightId) {
    playSound("click");
    setPreflight((current) => ({ ...current, [itemId]: !current[itemId] }));
  }

  function validatePreflight() {
    if (!allPreflightChecked) return;
    playSound("success");
    setTraining((current) => ({ ...current, shuttle: true }));
  }

  function checkQuizAnswer() {
    if (quizChoice === null || quizChecked) return;
    const isCorrect = quizChoice === currentQuestion.correct;
    playSound(isCorrect ? "success" : "error");
    setQuizResults((current) => [...current, isCorrect]);
    setQuizChecked(true);
  }

  function advanceQuiz() {
    if (!quizChecked) return;
    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      playSound("click");
      setQuizIndex((current) => current + 1);
      setQuizChoice(null);
      setQuizChecked(false);
      return;
    }

    const score = quizResults.filter(Boolean).length;
    if (score >= 2) {
      playSound("star");
      setQuizStars(score);
      setQuizPassed(true);
      setMaxStep(5);
      setStepIndex(5);
    } else {
      playSound("error");
      setQuizFailed(true);
    }
  }

  function restartQuiz() {
    playSound("back");
    setQuizIndex(0);
    setQuizChoice(null);
    setQuizResults([]);
    setQuizChecked(false);
    setQuizFailed(false);
  }

  function launchMission() {
    if (!quizPassed || finished) return;
    playSound("launch");
    onComplete(quizStars);
    setFinished(true);
  }

  function handleBack() {
    playSound("back");
    stopNarration();
    onBack();
  }

  const currentStep = STEPS[stepIndex];
  const pageProgress = finished ? 100 : ((stepIndex + 1) / STEPS.length) * 100;
  const stepNarration = EARTH_STEP_NARRATIONS[stepIndex] ?? `${currentStep.heading}. ${currentStep.intro}`;
  const lastCompletionRef = useRef(false);

  // Lecture automatique de la consigne et de l'histoire à chaque nouvelle étape.
  useEffect(() => {
    if (!narrationEnabled || !narrationSupported || finished) return;

    speak(stepNarration);
  }, [finished, narrationEnabled, narrationSupported, speak, stepNarration]);

  useEffect(() => {
    if (!finished || !narrationEnabled || !narrationSupported || lastCompletionRef.current) return;

    lastCompletionRef.current = true;
    speak("Mission accomplie ! Le décollage est réussi. Le niveau 2, Survie sur la Lune, est maintenant déverrouillé.");
  }, [finished, narrationEnabled, narrationSupported, speak]);

  useEffect(() => {
    return () => stopNarration();
  }, [stopNarration]);

  return (
    <div className="earth-level-page">
      <div className="earth-level-scene" aria-hidden="true">
        <picture>
          <source
            media="(max-width: 700px), (orientation: portrait)"
            srcSet="/images/space-academy-earth-training-mobile.jpg"
          />
          <img src="/images/space-academy-earth-training.jpg" alt="" fetchPriority="high" />
        </picture>
        <div className="earth-level-scene-shade" />
      </div>

      <div className="earth-level-shell">
        <header className="earth-game-header">
          <button className="earth-exit-button" type="button" onClick={handleBack}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m14.5 5-7 7 7 7M8 12h12" />
            </svg>
            <span>Carte des niveaux</span>
          </button>

          <div className="earth-game-brand">
            <span>SPACE ACADEMY · MISSION TERRE</span>
            <h1>Niveau 1 <strong>Terre</strong></h1>
          </div>

          <div className="earth-header-tools">
            <button
              className={`earth-sound-button earth-narration-button${isSpeaking ? " is-speaking" : ""}`}
              type="button"
              aria-label={narrationEnabled ? "Couper la lecture automatique" : "Activer la lecture automatique"}
              aria-pressed={narrationEnabled && narrationSupported}
              disabled={!narrationSupported}
              title={
                narrationSupported
                  ? "Lecture automatique du récit et des consignes"
                  : "Lecture vocale non disponible sur ce navigateur"
              }
              onClick={() => {
                playSound("toggle");
                onToggleNarration();
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 5h16v11H9l-5 4V5Z" />
                <path d="M8 9h8M8 12h5" />
              </svg>
            </button>

            <button
              className="earth-sound-button"
              type="button"
              aria-label={soundEnabled ? "Couper les effets sonores" : "Activer les effets sonores"}
              aria-pressed={soundEnabled}
              onClick={onToggleSound}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z" />
                {soundEnabled ? (
                  <>
                    <path d="M15 9a4 4 0 0 1 0 6" />
                    <path d="M17.5 6.5a7.5 7.5 0 0 1 0 11" />
                  </>
                ) : (
                  <path d="m15.5 9.5 5 5m0-5-5 5" />
                )}
              </svg>
            </button>

            <div className="earth-star-total" aria-label={`${visibleBestStars} étoiles gagnées sur 3`}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3L7 14.2l-5-4.9 6.9-1L12 2Z" />
              </svg>
              <span>{visibleBestStars}/3</span>
            </div>
          </div>
        </header>

        <div className="earth-top-progress">
          <div className="earth-top-progress-labels">
            <span>Progression de la mission</span>
            <span>Étape {finished ? STEPS.length : stepIndex + 1} / {STEPS.length}</span>
          </div>
          <div className="earth-top-progress-track" role="progressbar" aria-label="Progression du niveau Terre" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pageProgress}>
            <span style={{ width: `${pageProgress}%` }} />
          </div>
        </div>

        <nav className="earth-stepper" aria-label="Étapes du niveau Terre">
          {STEPS.map((step, index) => (
            <button
              key={step.short}
              className={`earth-step-button${index === stepIndex && !finished ? " is-current" : ""}${index < maxStep || finished ? " is-done" : ""}`}
              type="button"
              disabled={index > maxStep}
              aria-current={index === stepIndex && !finished ? "step" : undefined}
              onClick={() => {
                playSound("click");
                setStepIndex(index);
              }}
            >
              <span className="earth-step-number">{index < maxStep || finished ? "✓" : index + 1}</span>
              <span className="earth-step-label">{step.short}</span>
            </button>
          ))}
        </nav>

        <main className="earth-level-main">
          {finished ? (
            <section className="earth-completion-panel" role="status" aria-labelledby="earth-completion-title">
              <span className="earth-completion-rocket" aria-hidden="true">🚀</span>
              <p className="earth-section-kicker">MISSION ACCOMPLIE</p>
              <h2 id="earth-completion-title">Décollage réussi !</h2>
              <p>
                Bravo{selectedRole ? `, ${selectedRole.title.toLowerCase()}` : ""} !
                La mission Terre est validée et l'avant-poste lunaire se rapproche.
              </p>
              <div className="earth-completion-stars" aria-label={`${Math.max(bestStars, quizStars)} étoiles gagnées`}>
                {Array.from({ length: 3 }, (_, index) => (
                  <svg key={index} className={index < Math.max(bestStars, quizStars) ? "is-earned" : ""} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3L7 14.2l-5-4.9 6.9-1L12 2Z" />
                  </svg>
                ))}
              </div>
              <p className="earth-unlock-note">Niveau 2 · Survie sur la Lune déverrouillé</p>
              <button className="earth-primary-button" type="button" onClick={handleBack}>Retour à la carte</button>
            </section>
          ) : (
            <section className="earth-console" aria-labelledby="earth-step-title">
              <header className="earth-console-header">
                <div>
                  <p className="earth-section-kicker">{currentStep.title} · ÉTAPE {stepIndex + 1}</p>
                  <h2 id="earth-step-title">{currentStep.heading}</h2>
                  <p>{currentStep.intro}</p>
                </div>
                <div className="earth-console-tools">
                  <span className="earth-console-location">CENTRE SPATIAL · TERRE</span>
                  <button
                    className="earth-listen-button"
                    type="button"
                    disabled={!narrationSupported}
                    title={
                      narrationSupported
                        ? "Écouter la consigne de cette étape"
                        : "Lecture vocale non disponible sur ce navigateur"
                    }
                    onClick={() => speak(stepNarration)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z" />
                      <path d="M15 9a4 4 0 0 1 0 6" />
                      <path d="M17.5 6.5a7.5 7.5 0 0 1 0 11" />
                    </svg>
                    <span>Écouter</span>
                  </button>
                </div>
              </header>

              <div className="earth-console-body" key={stepIndex}>
                {stepIndex === 0 && (
                  <div className="earth-crew-step">
                    <div className="earth-role-grid" role="group" aria-label="Choisir un rôle d'astronaute">
                      {CREW_ROLES.map((crewRole) => (
                        <button
                          key={crewRole.id}
                          className={`earth-role-card${role === crewRole.id ? " is-selected" : ""}`}
                          type="button"
                          aria-pressed={role === crewRole.id}
                          onClick={() => {
                            playSound("select");
                            setRole(crewRole.id);
                          }}
                        >
                          <span className="earth-role-icon" aria-hidden="true">{crewRole.icon}</span>
                          <span className="earth-role-copy">
                            <strong>{crewRole.title}</strong>
                            <span>{crewRole.description}</span>
                          </span>
                          <span className="earth-role-select">{role === crewRole.id ? "Choisi ✓" : "Choisir"}</span>
                        </button>
                      ))}
                    </div>
                    <p className="earth-hint" role="status" aria-live="polite">
                      {selectedRole
                        ? `${selectedRole.title} rejoint l'équipage.`
                        : "Sélectionne un rôle pour former ton équipage junior."}
                    </p>
                  </div>
                )}

                {stepIndex === 1 && (
                  <div className="earth-mission-step">
                    <div className="earth-mission-route" aria-label="Trajet Terre, Lune puis Mars">
                      <div className="earth-route-stop is-origin">
                        <span aria-hidden="true">🌍</span>
                        <strong>Terre</strong>
                        <small>Départ</small>
                      </div>
                      <span className="earth-route-arrow" aria-hidden="true">➜</span>
                      <div className="earth-route-stop is-near">
                        <span aria-hidden="true">🌕</span>
                        <strong>Lune</strong>
                        <small>Objectif à court terme</small>
                      </div>
                      <span className="earth-route-arrow" aria-hidden="true">➜</span>
                      <div className="earth-route-stop is-far">
                        <span aria-hidden="true">🔴</span>
                        <strong>Mars</strong>
                        <small>Objectif à long terme</small>
                      </div>
                    </div>
                    <div className="earth-objective-row">
                      <div className="earth-objective">
                        <span>OBJECTIF IMMÉDIAT</span>
                        <strong>Préparer le départ vers la Lune</strong>
                      </div>
                      <div className="earth-objective">
                        <span>VISION LONG TERME</span>
                        <strong>Construire une base sur Mars</strong>
                      </div>
                    </div>
                    <div className="earth-equipment-row" aria-label="Équipements de mission">
                      <span>🚀 Fusée</span><span>🛰️ Navette</span><span>🛻 Rover</span><span>🏠 Avant-poste</span>
                    </div>
                  </div>
                )}

                {stepIndex === 2 && (
                  <div className="earth-training-step">
                    <div className="earth-training-tabs" role="group" aria-label="Activités de préparation">
                      {TRAINING_ACTIVITIES.map((activity) => (
                        <button
                          key={activity.id}
                          className={`earth-training-tab${trainingActivity === activity.id ? " is-active" : ""}${training[activity.id] ? " is-complete" : ""}`}
                          type="button"
                          aria-pressed={trainingActivity === activity.id}
                          onClick={() => {
                            playSound("click");
                            setTrainingActivity(activity.id);
                          }}
                        >
                          <span aria-hidden="true">{activity.icon}</span>
                          <span>{activity.title}</span>
                          <span className="earth-training-tab-status" aria-label={training[activity.id] ? "Terminé" : "À faire"}>
                            {training[activity.id] ? "✓" : "·"}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="earth-training-panel">
                      {trainingActivity === "fitness" && (
                        <div className="earth-activity-copy">
                          <div className="earth-activity-heading"><span aria-hidden="true">🏃</span><div><h3>Sport des astronautes</h3><p>Fais trois mouvements d'échauffement pour préparer ta mission.</p></div></div>
                          <div className="earth-rep-counter"><strong>{sportRounds}</strong><span>/ 3 mouvements</span></div>
                          <div className="earth-small-progress" role="progressbar" aria-label="Mouvements d'échauffement" aria-valuemin={0} aria-valuemax={3} aria-valuenow={sportRounds}><span style={{ width: `${(sportRounds / 3) * 100}%` }} /></div>
                          <button className="earth-secondary-button" type="button" disabled={training.fitness} onClick={doFitnessRound}>
                            {training.fitness ? "Entraînement validé ✓" : "Faire un mouvement"}
                          </button>
                        </div>
                      )}

                      {trainingActivity === "rover" && (
                        <div className="earth-activity-copy">
                          <div className="earth-activity-heading"><span aria-hidden="true">🛻</span><div><h3>Conduite du rover</h3><p>Rejoins le fanion en suivant la séquence : avancer, droite, avancer.</p></div></div>
                          <div className="earth-rover-track" aria-label={`Parcours : ${roverStep} étape sur 3 terminée`}>
                            {ROVER_ROUTE.map((direction, index) => (
                              <span key={`${direction}-${index}`} className={index < roverStep ? "is-passed" : ""}>
                                {index < roverStep ? "✓" : direction === "up" ? "↑" : "→"}
                              </span>
                            ))}
                            <span className="earth-rover-flag" aria-hidden="true">⚑</span>
                          </div>
                          <div className="earth-rover-controls" role="group" aria-label="Commandes du rover" tabIndex={0} onKeyDown={handleRoverKeyDown}>
                            {ROVER_DIRECTIONS.map((direction) => (
                              <button key={direction.id} type="button" aria-label={direction.label} disabled={training.rover} onClick={() => driveRover(direction.id)}>
                                {direction.symbol}
                              </button>
                            ))}
                          </div>
                          <p className="earth-hint" role="status" aria-live="polite">{roverMessage}</p>
                        </div>
                      )}

                      {trainingActivity === "shuttle" && (
                        <div className="earth-activity-copy">
                          <div className="earth-activity-heading"><span aria-hidden="true">🛰️</span><div><h3>Prévol de la navette</h3><p>Coche chaque vérification avant d'autoriser le départ.</p></div></div>
                          <div className="earth-preflight-list">
                            {PREFLIGHT_ITEMS.map((item) => (
                              <label key={item.id} className={`earth-preflight-item${preflight[item.id] ? " is-checked" : ""}`}>
                                <input type="checkbox" checked={preflight[item.id]} disabled={training.shuttle} onChange={() => togglePreflight(item.id)} />
                                <span><strong>{item.title}</strong><small>{item.detail}</small></span>
                              </label>
                            ))}
                          </div>
                          <button className="earth-secondary-button" type="button" disabled={!allPreflightChecked || training.shuttle} onClick={validatePreflight}>
                            {training.shuttle ? "Navette vérifiée ✓" : "Valider le prévol"}
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="earth-training-count" role="status" aria-live="polite">
                      Préparation : {completedTrainingCount} / {TRAINING_ACTIVITIES.length} activités terminées
                    </p>
                  </div>
                )}

                {stepIndex === 3 && (
                  <div className="earth-academy-step">
                    <div className="earth-lesson-grid" role="group" aria-label="Leçons de préparation spatiale">
                      {LESSONS.map((lesson) => (
                        <button
                          key={lesson.id}
                          className={`earth-lesson-button${selectedLesson === lesson.id ? " is-active" : ""}${readLessons.includes(lesson.id) ? " is-read" : ""}`}
                          type="button"
                          aria-pressed={selectedLesson === lesson.id}
                          onClick={() => {
                            playSound("select");
                            setSelectedLesson(lesson.id);
                          }}
                        >
                          <span aria-hidden="true">{lesson.icon}</span>
                          <span>{lesson.title}</span>
                          <span className="earth-lesson-check" aria-hidden="true">{readLessons.includes(lesson.id) ? "✓" : ""}</span>
                        </button>
                      ))}
                    </div>
                    <article className="earth-lesson-detail" aria-live="polite">
                      <p className="earth-lesson-summary">{activeLesson.summary}</p>
                      <h3>{activeLesson.title}</h3>
                      <p>{activeLesson.body}</p>
                      <div className="earth-science-fact"><strong>À retenir</strong><span>{activeLesson.fact}</span></div>
                      <button className="earth-secondary-button" type="button" onClick={markLessonRead}>
                        {readLessons.includes(activeLesson.id) ? "Leçon retenue ✓" : "J'ai compris"}
                      </button>
                    </article>
                    <p className="earth-training-count" role="status" aria-live="polite">
                      Leçons lues : {readLessons.length} / {LESSONS.length}
                    </p>
                  </div>
                )}

                {stepIndex === 4 && (
                  <div className="earth-quiz-step">
                    {quizFailed ? (
                      <div className="earth-quiz-result earth-quiz-result--retry" role="status">
                        <span aria-hidden="true">🪐</span>
                        <h3>Encore un petit entraînement !</h3>
                        <p>Tu as obtenu {earnedQuizScore} / {QUIZ_QUESTIONS.length}. Relis les fiches puis réessaie.</p>
                        <button className="earth-secondary-button" type="button" onClick={restartQuiz}>Recommencer le quiz</button>
                      </div>
                    ) : (
                      <>
                        <div className="earth-quiz-counter">
                          <span>QUESTION {quizIndex + 1} / {QUIZ_QUESTIONS.length}</span>
                          <div role="progressbar" aria-label="Progression du quiz" aria-valuemin={0} aria-valuemax={QUIZ_QUESTIONS.length} aria-valuenow={quizIndex + (quizChecked ? 1 : 0)}>
                            <span style={{ width: `${((quizIndex + (quizChecked ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%` }} />
                          </div>
                        </div>
                        <h3 className="earth-question-title">{currentQuestion.prompt}</h3>
                        <div className="earth-answer-list" role="group" aria-label="Choisir une réponse">
                          {currentQuestion.answers.map((answer, index) => {
                            const isCorrect = index === currentQuestion.correct;
                            const isChosen = quizChoice === index;
                            let answerState = "";
                            if (quizChecked && isCorrect) answerState = " is-correct";
                            else if (quizChecked && isChosen) answerState = " is-wrong";
                            else if (isChosen) answerState = " is-chosen";

                            return (
                              <button
                                key={answer}
                                className={`earth-answer${answerState}`}
                                type="button"
                                aria-pressed={isChosen}
                                disabled={quizChecked}
                                onClick={() => {
                                  playSound("select");
                                  setQuizChoice(index);
                                }}
                              >
                                <span className="earth-answer-letter">{String.fromCharCode(65 + index)}</span>
                                <span>{answer}</span>
                                {quizChecked && isCorrect && <span className="earth-answer-mark" aria-hidden="true">✓</span>}
                              </button>
                            );
                          })}
                        </div>
                        <p className={`earth-quiz-feedback${quizChecked ? (quizResults[quizResults.length - 1] ? " is-correct" : " is-wrong") : ""}`} role="status" aria-live="polite">
                          {quizChecked ? (quizResults[quizResults.length - 1] ? currentQuestion.explanation : "Pas tout à fait. La bonne réponse est indiquée en vert.") : "Choisis une réponse puis valide."}
                        </p>
                        <div className="earth-quiz-actions">
                          {quizChecked ? (
                            <button className="earth-primary-button" type="button" onClick={advanceQuiz}>
                              {quizIndex === QUIZ_QUESTIONS.length - 1 ? "Voir les résultats" : "Question suivante"}
                            </button>
                          ) : (
                            <button className="earth-primary-button" type="button" disabled={quizChoice === null} onClick={checkQuizAnswer}>Valider la réponse</button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {stepIndex === 5 && (
                  <div className="earth-launch-step">
                    <div className="earth-launch-visual" aria-hidden="true"><span>🚀</span></div>
                    <div className="earth-launch-copy">
                      <p className="earth-section-kicker">ÉQUIPAGE : {selectedRole ? selectedRole.title.toUpperCase() : "JUNIOR"}</p>
                      <h3>Cap sur la Lune !</h3>
                      <p>Entraînement validé, fiches étudiées et quiz réussi avec {quizStars} / 3 bonnes réponses. Prêt à décoller ?</p>
                      <div className="earth-launch-checks"><span>✓ Équipage prêt</span><span>✓ Navette vérifiée</span><span>✓ Destination chargée</span></div>
                    </div>
                  </div>
                )}
              </div>

              <footer className="earth-console-footer">
                <span
                  className={`earth-footer-hint${!canContinue && stepIndex < 4 ? " is-warning" : ""}`}
                  id="earth-continue-hint"
                  role="status"
                  aria-live="polite"
                >
                  {continueHint}
                </span>
                <div className="earth-footer-actions">
                  {stepIndex > 0 && stepIndex < 5 && (
                    <button className="earth-quiet-button" type="button" onClick={() => {
                      playSound("back");
                      setStepIndex((current) => current - 1);
                    }}>Précédent</button>
                  )}
                  {stepIndex < 4 && (
                    <button
                      className="earth-primary-button"
                      type="button"
                      disabled={!canContinue}
                      aria-describedby="earth-continue-hint"
                      onClick={continueToNextStep}
                    >Continuer</button>
                  )}
                  {stepIndex === 5 && (
                    <button className="earth-launch-button" type="button" onClick={launchMission}>
                      <span aria-hidden="true">🚀</span> Décollage !
                    </button>
                  )}
                </div>
              </footer>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}