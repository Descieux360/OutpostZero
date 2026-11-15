export default function GameLogo() {
  return (
    <div className="game-logo">
      <h1 className="game-logo-title">
        <span className="game-logo-space">SPACE</span>
        <span className="game-logo-academy">ACADEMY</span>
      </h1>
      <p className="game-logo-slogan">
        <svg className="slogan-mark" viewBox="0 0 26 26" fill="none" aria-hidden="true">
          <circle cx="13" cy="13" r="5.5" stroke="currentColor" strokeWidth="1.8" />
          <ellipse cx="13" cy="13" rx="11" ry="4.4" transform="rotate(-28 13 13)" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="21.4" cy="7.5" r="1.8" fill="currentColor" />
        </svg>
        <span>Deviens un astronaute en jouant !</span>
      </p>
    </div>
  );
}