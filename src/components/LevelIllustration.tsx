import type { LevelTheme } from "../types/game";

export default function LevelIllustration({ theme }: { theme: LevelTheme }) {
  return (
    <span className={`level-art level-art--${theme}`} aria-hidden="true">
      <span className="level-art-star level-art-star--one" />
      <span className="level-art-star level-art-star--two" />

      {(theme === "moon" || theme === "lunar-base") && (
        <>
          <span className="level-art-crater level-art-crater--one" />
          <span className="level-art-crater level-art-crater--two" />
          <span className="level-art-horizon level-art-horizon--moon" />
          <span className="level-art-habitat">
            <span />
            <span />
            <span />
          </span>
        </>
      )}

      {theme === "mars" && (
        <>
          <span className="level-art-crater level-art-crater--one" />
          <span className="level-art-crater level-art-crater--two" />
          <span className="level-art-crater level-art-crater--three" />
          <span className="level-art-horizon level-art-horizon--mars" />
          <span className="level-art-rover">
            <span />
            <span />
            <span />
          </span>
        </>
      )}

      {theme === "secret" && (
        <>
          <span className="level-art-orbit" />
          <svg className="level-art-rocket" viewBox="0 0 64 84" fill="none">
            <path d="M32 7C21 19 18 33 20 48l12 9 12-9C46 33 43 19 32 7Z" fill="#F7FAFF" stroke="#B9A0FF" strokeWidth="2" />
            <circle cx="32" cy="30" r="7" fill="#39C9FF" stroke="#34217D" strokeWidth="3" />
            <path d="m20 40-10 12 11-3m23-9 10 12-11-3" fill="#FF76B7" stroke="#E756A0" strokeWidth="2" strokeLinejoin="round" />
            <path d="m26 55 6 6 6-6-2 17-4 6-4-6-2-17Z" fill="#FFD21F" />
          </svg>
          <span className="level-art-question">?</span>
        </>
      )}
    </span>
  );
}