type LogoProps = {
  className?: string;
  /** "compact" pairs the mark with real text (nav-scale). "full" renders the
   * actual lockup image, mark and wordmark together as designed — used
   * large, where the wordmark's own metallic rendering reads clearly. */
  variant?: "compact" | "full";
};

/**
 * The real RULANTU mark, cropped directly from the supplied photo/render —
 * background intentionally left intact rather than cut out (background
 * removal on the metallic/glow art left visible artifacts; this source has
 * none). Its near-black background reads as seamless against the site's
 * ink sections; anywhere lighter, wrap it in a dark card (see Footer).
 * Source assets: public/logo-icon.(jpg|webp), public/logo-lockup.(jpg|webp).
 */
export default function Logo({ className = "", variant = "compact" }: LogoProps) {
  if (variant === "full") {
    return (
      <picture className={className}>
        <source srcSet="/logo-lockup.webp" type="image/webp" />
        <img src="/logo-lockup.jpg" alt="RULANTU" className="w-full h-auto block" />
      </picture>
    );
  }

  return (
    <span className={`inline-flex items-center gap-[0.22em] ${className}`}>
      <picture>
        <source srcSet="/logo-icon.webp" type="image/webp" />
        <img src="/logo-icon.jpg" alt="" className="h-[0.85em] w-auto shrink-0" />
      </picture>
      <span className="font-display font-black tracking-tight">RULANTU</span>
    </span>
  );
}
