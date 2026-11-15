import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router'
import { BriefingScreen } from '../features/mission/BriefingScreen'
import { MissionProvider, useMission } from '../features/mission/MissionContext'
import { MissionPage } from '../features/mission/MissionPage'
import { WelcomeScreen } from '../features/mission/WelcomeScreen'
import { AppLayout } from './AppLayout'
import { LessonPage } from '../features/lessons/LessonPage'
import { LessonsPage } from '../features/lessons/LessonsPage'
import { AcademyProgressProvider, useAcademyProgress } from '../features/academy/AcademyProgressContext'
import { LevelSelectionScreen } from '../features/academy/LevelSelectionScreen'
import { KnowledgeExamScreen, AcademyCompleteScreen } from '../features/academy/KnowledgeExamScreen'
import { EarthTrainingScreen } from '../features/training/EarthTrainingScreen'
import { MarsMissionScreen } from '../features/mars/MarsMissionScreen'

function WelcomeRoute() {
  const navigate = useNavigate()
  return <WelcomeScreen onContinue={() => navigate('/levels')} />
}

function EarthTrainingRoute() {
  const { earthPassed } = useAcademyProgress()
  if (earthPassed) return <Navigate to="/levels" replace />
  return <EarthTrainingScreen />
}

function BriefingRoute() {
  const { earthPassed } = useAcademyProgress()
  const { dispatch } = useMission()
  const navigate = useNavigate()
  if (!earthPassed) return <Navigate to="/levels" replace />
  return <BriefingScreen onBegin={() => { dispatch({ type: 'RESTART' }); dispatch({ type: 'START' }); navigate('/mission') }} />
}

function MissionRoute() {
  const { earthPassed } = useAcademyProgress()
  const { state } = useMission()
  if (!earthPassed) return <Navigate to="/levels" replace />
  if (state.missionStatus === 'briefing') return <Navigate to="/briefing" replace />
  return <MissionPage />
}

function CompleteRoute() {
  const { marsPassed } = useAcademyProgress()
  return marsPassed ? <AcademyCompleteScreen /> : <Navigate to="/levels" replace />
}

function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24">
      <h1 className="text-3xl font-bold text-white">Page introuvable</h1>
      <p className="mt-3">Cette adresse n’existe pas dans Space Academy.</p>
      <Link to="/" className="mt-6 inline-block rounded-md bg-nominal px-5 py-3 font-semibold text-vacuum">Retour à l’accueil</Link>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AcademyProgressProvider>
        <MissionProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<WelcomeRoute />} />
              <Route path="/levels" element={<LevelSelectionScreen />} />
              <Route path="/training/earth" element={<EarthTrainingRoute />} />
              <Route path="/exam/:levelId" element={<KnowledgeExamScreen />} />
              <Route path="/briefing" element={<BriefingRoute />} />
              <Route path="/mission" element={<MissionRoute />} />
              <Route path="/mars" element={<MarsMissionScreen />} />
              <Route path="/complete" element={<CompleteRoute />} />
              <Route path="/learn" element={<LessonsPage />} />
              <Route path="/learn/:cardId" element={<LessonPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </MissionProvider>
      </AcademyProgressProvider>
    </BrowserRouter>
  )
}
