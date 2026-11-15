import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, XCircle } from 'lucide-react'
import { exams } from '../../data/training/exams'
import { useAcademyProgress, type AcademyLevelId } from './AcademyProgressContext'
import { useMission } from '../mission/MissionContext'

const labels: Record<string, string> = { earth: 'Earth', moon: 'Moon' }

export function KnowledgeExamScreen() {
  const { levelId } = useParams<{ levelId: AcademyLevelId }>()
  const navigate = useNavigate()
  const progress = useAcademyProgress()
  const { state: missionState } = useMission()
  const level = levelId && levelId in exams ? (levelId as AcademyLevelId) : null
  const questions = level ? exams[level] : []
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [finished, setFinished] = useState(false)
  const [recorded, setRecorded] = useState(false)
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null)

  if (!level) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-white">
        <h1 className="text-3xl font-black">Exam Not Found</h1>
        <Link to="/levels" className="mt-5 inline-block text-cyan-300">
          Return to Mission Map
        </Link>
      </main>
    )
  }

  if (level === 'moon' && missionState.missionStatus !== 'completed') {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-black text-white">Lunar Exam Locked</h1>
        <p className="mt-3 text-slate-300">Complete the 30-day Lunar Outpost Zero survival mission first.</p>
        <Link to="/briefing" className="mt-5 inline-block rounded-xl bg-cyan-500 px-5 py-3 font-black text-slate-950">
          Go to Lunar Mission
        </Link>
      </main>
    )
  }

  const finishExam = (finalAnswers: number[]) => {
    const correct = questions.reduce(
      (score, question, questionIndex) => score + (finalAnswers[questionIndex] === question.answer ? 1 : 0),
      0
    )
    const score = Math.round((correct / questions.length) * 100)
    const passed = score >= 80
    setResult({ score, passed })
    setFinished(true)
    if (passed && !recorded) {
      progress.completeLevel(level)
      setRecorded(true)
    }
  }

  const answer = (choiceIndex: number) => {
    if (finished) return
    const nextAnswers = [...answers, choiceIndex]
    setAnswers(nextAnswers)
    if (index === questions.length - 1) finishExam(nextAnswers)
    else setIndex(index + 1)
  }

  const retry = () => {
    setIndex(0)
    setAnswers([])
    setFinished(false)
    setRecorded(false)
    setResult(null)
  }

  if (finished && result) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-12">
        <section className="rounded-3xl border border-slate-700 bg-slate-900 p-7 text-center sm:p-10">
          {result.passed ? <CheckCircle2 size={54} className="mx-auto text-emerald-300" /> : <XCircle size={54} className="mx-auto text-amber-300" />}
          <p className="mt-4 text-sm font-black uppercase tracking-widest text-cyan-300">{labels[level] || level} Level Exam</p>
          <h1 className="mt-2 text-3xl font-black text-white">{result.passed ? 'Level Passed!' : 'Needs a Little More Practice'}</h1>
          <p className="mt-3 text-lg text-slate-200">
            Your Score: <strong>{result.score}%</strong> · Passing Grade: 80%
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {result.passed ? (
              <button onClick={() => navigate('/levels')} className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-black text-slate-950">
                Continue <ArrowRight size={17} />
              </button>
            ) : (
              <button onClick={retry} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-black text-white">
                <RotateCcw size={17} /> Try Again
              </button>
            )}
            {!result.passed && (
              <Link to="/levels" className="rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-200">
                Back to Map
              </Link>
            )}
          </div>
        </section>
      </main>
    )
  }

  const question = questions[index]
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <Link to="/levels" className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white">
        <ArrowLeft size={16} /> Back
      </Link>
      <section className="mt-6 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-9">
        <p className="text-sm font-black uppercase tracking-widest text-cyan-300">Exam · {labels[level] || level} Level</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>
        <p className="mt-3 text-sm font-bold text-slate-400">
          Question {index + 1} of {questions.length}
        </p>
        <h1 className="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl">{question?.prompt}</h1>
        <div className="mt-7 grid gap-3">
          {question?.choices.map((choice, choiceIndex) => (
            <button
              key={choice}
              onClick={() => answer(choiceIndex)}
              className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-left font-bold text-slate-100 transition hover:border-cyan-300 hover:bg-cyan-950/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
            >
              {choice}
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

export function AcademyCompleteScreen() {
  const progress = useAcademyProgress()
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <section className="rounded-3xl border border-amber-500/40 bg-slate-900 p-8 text-center">
        <div className="text-5xl">🚀</div>
        <p className="mt-4 text-sm font-black uppercase tracking-widest text-amber-300">Mission Accomplished</p>
        <h1 className="mt-2 text-4xl font-black text-white">You Completed Space Academy!</h1>
        <p className="mt-4 text-slate-300">You have completed both Earth training and the 30-day Lunar Outpost Zero mission.</p>
        <p className="mt-5 font-black text-amber-200">
          Stars Earned: {Object.values(progress.stars).reduce((sum, value) => sum + value, 0)}
        </p>
        <Link to="/levels" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-black text-white">
          Return to Map <ArrowRight size={17} />
        </Link>
      </section>
    </main>
  )
}