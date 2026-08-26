type CircuitNodeProps = {
  className?: string;
};

/**
 * The small ring-and-dot connector mark from the logo's circuit-trace
 * detailing, as a reusable accent. Colored via `currentColor` so it
 * inherits whatever text color context it's dropped into.
 */
export default function CircuitNode({ className = "" }: CircuitNodeProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}
