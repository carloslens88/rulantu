type MarqueeProps = {
  items: readonly string[];
  className?: string;
};

/** Infinite CSS-driven ticker. Duplicated once so the loop is seamless. */
export default function Marquee({ items, className = "" }: MarqueeProps) {
  const content = (
    <>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6 whitespace-nowrap">{item}</span>
          <span aria-hidden="true" className="text-signal">
            ●
          </span>
        </span>
      ))}
    </>
  );

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div className="marquee-track">
        <div className="flex items-center shrink-0">{content}</div>
        <div className="flex items-center shrink-0">{content}</div>
      </div>
    </div>
  );
}
