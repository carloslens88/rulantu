type LogoMarkProps = {
  className?: string;
};

/**
 * The RULANTU monogram — a chamfered square badge, cut on one corner so it
 * doesn't read as a generic rounded app icon, with the R set in the same
 * display face as the wordmark it sits beside.
 */
export default function LogoMark({ className = "" }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" role="img">
      <path d="M0 0H100V66L66 100H0V0Z" fill="var(--signal)" />
      <text
        x="30"
        y="74"
        fontFamily="var(--font-display)"
        fontWeight="800"
        fontSize="62"
        fill="var(--ink)"
      >
        R
      </text>
    </svg>
  );
}
