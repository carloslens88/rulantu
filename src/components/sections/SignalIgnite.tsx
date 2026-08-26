"use client";

import { useEffect, useRef } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";

// Four circuit-trace paths converging on one point — echoes the logo's
// circuit detailing. Right-angle bends, hand-placed rather than generated,
// so they read as deliberate traces rather than random lines.
const PATHS = [
  "M 350,0 L 350,80 L 250,80 L 250,180 L 350,250",
  "M 1000,180 L 700,180 L 700,220 L 450,220 L 350,250",
  "M 300,500 L 300,380 L 420,380 L 420,300 L 350,250",
  "M 0,320 L 150,320 L 150,260 L 280,260 L 350,250",
];

/**
 * The site's opening move: on load, four traces converge on one point and
 * ignite it — a beat before the wordmark reveals — then fade, leaving just
 * the ambient glow. One-shot; runs once on mount, skipped entirely under
 * reduced motion (the wordmark still reveals normally either way).
 */
export default function SignalIgnite() {
  const svgRef = useRef<SVGSVGElement>(null);
  const flashRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const svg = svgRef.current;
    const flash = flashRef.current;
    if (!svg || !flash) return;

    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("[data-trace]"));
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      tl.fromTo(
        paths,
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.6, stagger: 0.08, ease: "power2.inOut" }
      )
        .fromTo(
          flash,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.25, ease: "power2.out", transformOrigin: "350px 250px" },
          "-=0.15"
        )
        .to(flash, { scale: 2.4, opacity: 0, duration: 0.5, ease: "power2.out" })
        .to(svg, { opacity: 0, duration: 0.4, ease: "power1.out" }, "<");
    }, svg);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox="0 0 1000 500"
      preserveAspectRatio="xMidYMid slice"
      className="signal-ignite pointer-events-none absolute inset-0 w-full h-full"
    >
      {PATHS.map((d, i) => (
        <path
          key={i}
          data-trace
          d={d}
          fill="none"
          stroke="var(--signal)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          opacity={0.85}
        />
      ))}
      <circle ref={flashRef} cx="350" cy="250" r="10" fill="var(--signal)" opacity="0" />
    </svg>
  );
}
