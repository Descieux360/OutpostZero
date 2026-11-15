import { Rocket } from 'lucide-react'

interface WelcomeScreenProps {
  onContinue: () => void
}

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  return (
    <main className="home-hero relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#06143D] bg-[url('/space-academy-hero.jpg')] bg-cover bg-center font-sans">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#06143D]/55 via-[#06143D]/10 to-[#06143D]/65" />
      <section className="home-hero-content animate-enter relative z-10 mx-auto my-auto flex w-full max-w-5xl flex-col items-center px-5 py-16 text-center">
        <p className="mb-4 rounded-full border border-cyan-100/25 bg-[#06143D]/50 px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-cyan-100 shadow-lg backdrop-blur-sm sm:text-sm">Ta mission commence ici</p>
        <h1 className="text-5xl font-black leading-[.95] tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,.65)] sm:text-7xl md:text-8xl">SPACE<br className="sm:hidden" /> ACADEMY</h1>
        <button onClick={onContinue} className="home-play-button mt-9 inline-flex items-center justify-center gap-3 rounded-2xl border border-white/20 bg-gradient-to-r from-orange-500 to-orange-400 px-9 py-4 text-xl font-black tracking-[.12em] text-white shadow-[0_10px_35px_rgba(249,115,22,.35)] transition hover:scale-105 hover:from-orange-400 hover:to-yellow-400 focus-visible:outline focus-visible:outline-4 focus-visible:outline-cyan-200 active:scale-95">
          <Rocket size={24} aria-hidden /> JOUER
        </button>
      </section>
      <footer className="relative z-10 px-5 pb-7 pt-5 text-center">
        <p className="text-base font-black tracking-wide text-yellow-200 drop-shadow-[0_2px_8px_rgba(0,0,0,.9)] sm:text-lg">Deviens un astronaute en jouant !</p>
      </footer>
    </main>
  )
}
