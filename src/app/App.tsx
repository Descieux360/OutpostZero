import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router'
import { BriefingScreen } from '../features/mission/BriefingScreen'
import { MissionProvider, useMission } from '../features/mission/MissionContext'
import { MissionPage } from '../features/mission/MissionPage'
import { WelcomeScreen } from '../features/mission/WelcomeScreen'
import { AppLayout } from './AppLayout'
import { LessonPage } from '../features/lessons/LessonPage'
import { LessonsPage } from '../features/lessons/LessonsPage'

function WelcomeRoute() {
  const navigate = useNavigate()
  return <WelcomeScreen onContinue={() => navigate('/briefing')} />
}

function BriefingRoute() {
  const { dispatch } = useMission()
  const navigate = useNavigate()
  return (
    <BriefingScreen
      onBegin={() => {
        dispatch({ type: 'START' })
        navigate('/mission')
      }}
    />
  )
}

function MissionRoute() {
  const { state } = useMission()
  // A refresh or a typed URL resets in-memory state, redirecting to briefing
  if (state.missionStatus === 'briefing') return <Navigate to="/briefing" replace />
  return <MissionPage />
}

function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24">
      <h1 className="text-3xl font-bold text-white">Page not found</h1>
      <p className="mt-3">That address doesn’t exist in Outpost Zero.</p>
      <Link to="/" className="mt-6 inline-block rounded-md bg-nominal px-5 py-3 font-semibold text-vacuum">
        Back to start
      </Link>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <MissionProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<WelcomeRoute />} />
            <Route path="/briefing" element={<BriefingRoute />} />
            <Route path="/mission" element={<MissionRoute />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/learn" element={<LessonsPage />} />
            <Route path="/learn/:cardId" element={<LessonPage />} />
          </Route>
        </Routes>
      </MissionProvider>
    </BrowserRouter>
  )
}