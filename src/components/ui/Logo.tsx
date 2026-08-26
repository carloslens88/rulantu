type LogoProps = {
  className?: string;
  /** "compact" pairs the mark with real text (nav-scale). "full" renders the
   * actual lockup image, mark and wordmark together as designed — used
   * large, where the wordmark's own metallic rendering reads clearly. */
  variant?: "compact" | "full";
};

/**
 * The real RULANTU mark, supplied as a raster lockup (mountain + circuit
 * icon, metallic wordmark). Source assets: public/logo-icon.(png|webp) and
 * public/logo-lockup.(png|webp), extracted from the supplied artwork.
 */
export default function Logo({ className = "", variant = "compact" }: LogoProps) {
  if (variant === "full") {
    return (
      <picture className={className}>
        <source srcSet="/logo-lockup.webp" type="image/webp" />
        <img src="/logo-lockup.png" alt="RULANTU" className="w-full h-auto" />
      </picture>
    );
  }

  return (
    <span className={`inline-flex items-center gap-[0.22em] ${className}`}>
      <picture>
        <source srcSet="/logo-icon.webp" type="image/webp" />
        <img src="/logo-icon.png" alt="" className="h-[0.85em] w-auto shrink-0" />
      </picture>
      <span className="font-display font-black tracking-tight">RULANTU</span>
    </span>
  );
}
