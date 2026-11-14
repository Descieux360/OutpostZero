import { Link, useParams } from 'react-router'
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import { ClaimBadge } from '../../components/ClaimBadge'
import { getLearningCard, learningCards } from '../../data/learningCard'

export function LessonPage() {
  const { cardId } = useParams()
  const card = cardId ? getLearningCard(cardId) : undefined

  if (!card) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24">
        <h1 className="text-3xl font-bold text-white">Lesson not found</h1>
        <Link to="/learn" className="mt-6 inline-block rounded-md bg-nominal px-5 py-3 font-semibold text-vacuum">All lessons</Link>
      </main>
    )
  }

  const i = learningCards.findIndex((c) => c.id === card.id)
  const prev = learningCards[i - 1]
  const next = learningCards[i + 1]

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-dust hover:text-white"><ArrowLeft size={14} aria-hidden /> All lessons</Link>
      <h1 className="mt-4 text-4xl font-bold text-white">{card.title}</h1>
      <p className="mt-3 text-dust"><span className="font-medium text-regolith">What this teaches:</span> {card.objective}</p>

      <ul className="mt-8 space-y-4">
        {card.claims.map((c, idx) => (
          <li key={idx} className="rounded-lg border border-line bg-deck p-4">
            <ClaimBadge kind={c.kind} />
            <p className="mt-2 max-w-prose leading-relaxed">{c.text}</p>
            {c.citation && (
              <a href={c.citation.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-nominal underline">
                {c.citation.title} <ExternalLink size={12} aria-hidden />
              </a>
            )}
          </li>
        ))}
      </ul>

      <nav aria-label="Lesson navigation" className="mt-10 flex justify-between text-sm">
        {prev ? <Link to={`/learn/${prev.id}`} className="inline-flex items-center gap-1 hover:text-white"><ArrowLeft size={14} aria-hidden /> {prev.title}</Link> : <span />}
        {next ? <Link to={`/learn/${next.id}`} className="inline-flex items-center gap-1 hover:text-white">{next.title} <ArrowRight size={14} aria-hidden /></Link> : <span />}
      </nav>
    </main>
  )
}