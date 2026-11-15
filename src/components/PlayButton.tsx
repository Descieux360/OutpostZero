interface PlayButtonProps {
  onClick: () => void;
}

export default function PlayButton({ onClick }: PlayButtonProps) {
  return (
    <button
      className="play-button"
      type="button"
      onClick={onClick}
      aria-label="Jouer et choisir une mission"
    >
      <span className="play-button-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M8 5.25c0-.77.84-1.25 1.5-.82l10.02 6.25a1.55 1.55 0 0 1 0 2.64L9.5 19.57c-.66.42-1.5-.05-1.5-.83V5.25Z" />
        </svg>
      </span>
      <span>JOUER</span>
    </button>
  );
}