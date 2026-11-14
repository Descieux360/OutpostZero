import { Rocket } from 'lucide-react'

export function WelcomeScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-7xl">Outpost Zero</h1>
      <p className="mt-5 max-w-prose text-lg leading-relaxed">
        Keep a small lunar research outpost running for seven days. Budget power, protect the crew, and learn how a habitat’s systems depend on each other.
      </p>
      <div className="mt-8">
        <button onClick={onContinue} className="inline-flex items-center gap-2 rounded-md bg-nominal px-5 py-3 font-semibold text-vacuum hover:brightness-110">
          <Rocket size={18} aria-hidden /> Start mission
        </button>
      </div>
      <p className="mt-10 text-sm text-dust">Educational simulation. Not a real mission-operations or astronaut-safety tool.</p>
    </main>
  )
}
