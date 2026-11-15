import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router'
import { BriefingScreen } from '../features/mission/BriefingScreen'
import { MissionProvider, useMission } from '../features/mission/MissionContext'
import { MissionPage } from '../features/mission/MissionPage'
import { WelcomeScreen } from '../features/mission/WelcomeScreen'
import { AppLayout } from './AppLayout'
import { LessonPage } from '../features/lessons/LessonPage'
import { LessonsPage } from '../features/lessons/LessonsPage'
import { AcademyProgressProvider } from '../features/academy/AcademyProgressContext'
import { LevelSelectionScreen } from '../features/academy/LevelSelectionScreen'
import { KnowledgeExamScreen, AcademyCompleteScreen } from '../features/academy/KnowledgeExamScreen'
import { EarthTrainingScreen } from '../features/training/EarthTrainingScreen'

function WelcomeRoute() {
  const navigate = useNavigate()
  return <WelcomeScreen onContinue={() => navigate('/levels')} />
}

function EarthTrainingRoute() {
  return <EarthTrainingScreen />
}

function BriefingRoute() {
  const { dispatch } = useMission()
  const navigate = useNavigate()

  return (
    <BriefingScreen
      onBegin={() => {
        dispatch({ type: 'RESTART' })
        dispatch({ type: 'START' })
        navigate('/mission')
      }}
    />
  )
}

function MissionRoute() {
  const { state } = useMission()

  // Redirect to briefing if the mission has not been started yet
  if (state.missionStatus !== 'active') {
    return <Navigate to="/briefing" replace />
  }

  return <MissionPage />
}

function CompleteRoute() {
  return <AcademyCompleteScreen />
}

function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-white">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-slate-300">That address doesn’t exist in Space Academy.</p>
      <Link to="/" className="mt-6 inline-block rounded-xl bg-cyan-500 px-5 py-3 font-black text-slate-950">
        Back to start
      </Link>
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