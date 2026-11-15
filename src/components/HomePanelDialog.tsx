import { useEffect, useRef } from "react";
import { playSound } from "../audio/soundEffects";
import type { HomePanel } from "../types/game";

interface HomePanelDialogProps {
  panel: HomePanel;
  onClose: () => void;
  reducedMotion: boolean;
  highContrast: boolean;
  onToggleReducedMotion: () => void;
  onToggleHighContrast: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  narrationEnabled: boolean;
  narrationSupported: boolean;
  onToggleNarration: () => void;
}

const PANEL_TITLES: Record<HomePanel, string> = {
  learn: "Petites leçons de l'espace",
  options: "Personnalise ton espace",
  ranking: "Le classement",
};

export default function HomePanelDialog({
  panel,
  onClose,
  reducedMotion,
  highContrast,
  onToggleReducedMotion,
  onToggleHighContrast,
  soundEnabled,
  onToggleSound,
  narrationEnabled,
  narrationSupported,
  onToggleNarration,
}: HomePanelDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function requestClose() {
    playSound("back");
    onClose();
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="academy-dialog"
      aria-labelledby="academy-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) requestClose();
      }}
    >
      <button className="dialog-close" type="button" onClick={requestClose} aria-label="Fermer la fenêtre">
        <span aria-hidden="true">×</span>
      </button>
      <p className="dialog-kicker">SPACE ACADEMY</p>
      <h2 className="dialog-title" id="academy-dialog-title">
        {PANEL_TITLES[panel]}
      </h2>

      {panel === "learn" && (
        <div className="learning-list">
          <div className="learning-fact">
            <span className="learning-fact-number">01</span>
            <p><strong>La Lune</strong> ne brille pas toute seule : elle reflète la lumière du Soleil.</p>
          </div>
          <div className="learning-fact">
            <span className="learning-fact-number">02</span>
            <p><strong>Mars</strong> paraît rouge à cause de la poussière riche en oxyde de fer.</p>
          </div>
          <div className="learning-fact">
            <span className="learning-fact-number">03</span>
            <p><strong>Une serre spatiale</strong> aide les astronautes à faire pousser de la nourriture.</p>
          </div>
        </div>
      )}

      {panel === "options" && (
        <div className="option-list">
          <div className="option-row">
            <div>
              <p>Effets sonores</p>
              <small>Bips, réussites et décollage de la fusée.</small>
            </div>
            <div className="option-actions">
              <button
                className="option-test-button"
                type="button"
                disabled={!soundEnabled}
                onClick={() => playSound("success")}
              >
                Tester
              </button>
              <button
                className="setting-switch"
                type="button"
                role="switch"
                aria-label="Effets sonores"
                aria-checked={soundEnabled}
                onClick={onToggleSound}
              >
                <span />
              </button>
            </div>
          </div>
          <div className="option-row">
            <div>
              <p>Lecture automatique</p>
              <small>
                {narrationSupported
                  ? "La voix raconte l'histoire et les consignes."
                  : "Lecture vocale non disponible sur ce navigateur."}
              </small>
            </div>
            <button
              className="setting-switch"
              type="button"
              role="switch"
              aria-label="Lecture automatique"
              aria-checked={narrationEnabled && narrationSupported}
              disabled={!narrationSupported}
              onClick={onToggleNarration}
            >
              <span />
            </button>
          </div>
          <div className="option-row">
            <div>
              <p>Animations</p>
              <small>Fais scintiller les étoiles et les boutons.</small>
            </div>
            <button
              className="setting-switch"
              type="button"
              role="switch"
              aria-label="Animations de l'espace"
              aria-checked={!reducedMotion}
              onClick={onToggleReducedMotion}
            >
              <span />
            </button>
          </div>
          <div className="option-row">
            <div>
              <p>Contraste renforcé</p>
              <small>Assombris le décor derrière les textes.</small>
            </div>
            <button
              className="setting-switch"
              type="button"
              role="switch"
              aria-label="Contraste renforcé"
              aria-checked={highContrast}
              onClick={onToggleHighContrast}
            >
              <span />
            </button>
          </div>
        </div>
      )}

      {panel === "ranking" && (
        <div className="ranking-empty">
          <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <path d="M15 7h18v11a9 9 0 0 1-18 0V7ZM15 11H7v5a8 8 0 0 0 8 8m18-13h8v5a8 8 0 0 1-8 8M24 27v9m-9 5h18m-15-5h12" />
            <path d="m24 9 1.8 3.7 4.1.6-3 2.9.7 4.1-3.6-1.9-3.6 1.9.7-4.1-3-2.9 4.1-.6L24 9Z" />
          </svg>
          <p>Pas encore de scores à afficher.</p>
          <small>Les performances apparaîtront ici après les premières missions.</small>
        </div>
      )}
    </dialog>
  );
}