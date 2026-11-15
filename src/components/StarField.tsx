import { useMemo } from "react";

interface Star {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const STAR_COLORS = ["#ffffff", "#ffd76a", "#8cdfff"];

/** Fond étoilé animé, généré une seule fois au montage. */
export default function StarField({ count = 90 }: { count?: number }) {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 4,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={
            {
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              "--duration": `${s.duration}s`,
              "--delay": `${s.delay}s`,
              "--star-color": s.color,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
