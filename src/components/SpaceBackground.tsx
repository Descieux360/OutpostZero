import StarField from "./StarField";

type BackgroundVariant = "home" | "levels";

const BACKGROUND_IMAGES: Record<BackgroundVariant, { desktop: string; mobile: string }> = {
  home: {
    desktop: "/images/space-academy-hero.jpg",
    mobile: "/images/space-academy-hero-mobile.jpg",
  },
  levels: {
    desktop: "/images/space-academy-levels.jpg",
    mobile: "/images/space-academy-levels-mobile.jpg",
  },
};

export default function SpaceBackground({ variant = "home" }: { variant?: BackgroundVariant }) {
  const images = BACKGROUND_IMAGES[variant];

  return (
    <div className={`space-scene${variant === "levels" ? " space-scene--levels" : ""}`} aria-hidden="true">
      <picture className="space-scene-picture">
        <source
          media="(max-width: 680px), (orientation: portrait)"
          srcSet={images.mobile}
        />
        <img
          className="space-scene-image"
          src={images.desktop}
          alt=""
          fetchPriority="high"
        />
      </picture>
      <div className="space-scene-shade" />
      <StarField count={34} />
    </div>
  );
}