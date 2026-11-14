import { Link } from 'react-router'
import { GraduationCap } from 'lucide-react'
import { learningCards } from '../../data/learningCard'

export function LessonsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="flex items-center gap-3 text-4xl font-bold text-white"><GraduationCap aria-hidden /> Mission lessons</h1>
      <p className="mt-3 max-w-prose">Five short lessons, one for each thing the mission trains. Each statement is labelled so you can tell sourced science from simplified game rules.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {learningCards.map((c) => (
          <li key={c.id}>
            <Link to={`/learn/${c.id}`} className="block h-full rounded-lg border border-line bg-deck p-5 hover:bg-deck-raised">
              <h2 className="text-lg font-semibold text-white">{c.title}</h2>
              <p className="mt-2 text-sm text-dust">{c.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}