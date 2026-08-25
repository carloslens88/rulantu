import LogoMark from "@/components/ui/LogoMark";

type LogoProps = {
  className?: string;
  /** Set false to render the wordmark alone (e.g. inside the footer's giant
   * lockup, where the mark would read as oversized). */
  withMark?: boolean;
};

/**
 * Typographic wordmark — the primary mark until the supplied logo asset
 * replaces it. Swap point: drop the real mark into /public and render it
 * here instead of this <span> + <LogoMark>.
 */
export default function Logo({ className = "", withMark = true }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-[0.18em] ${className}`}>
      {withMark && <LogoMark className="h-[0.78em] w-[0.78em] shrink-0" />}
      <span className="font-display font-black tracking-tight">RULANTU</span>
    </span>
  );
}
