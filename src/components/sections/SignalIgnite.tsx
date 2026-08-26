"use client";

import { useEffect, useRef } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";

// Short circuit-trace paths, contained to the space just before the
// wordmark starts — they never cross the letters themselves. Right-angle
// bends echo the logo's detailing; each ends at the same ignition point.
const IGNITE = { x: 80, y: 220 };
const PATHS = [
  "M 80,10 L 80,110 L 40,110 L 40,170 L 80,220",
  "M 0,270 L 60,270 L 60,235 L 80,220",
  "M 20,410 L 20,310 L 105,310 L 105,255 L 80,220",
  "M 195,40 L 195,135 L 128,135 L 128,195 L 80,220",
];

// A node dot at the first bend of each path — the ring-and-dot detail
// from the logo, marking where each trace turns toward the ignition point.
const NODES = [
  { x: 80, y: 110 },
  { x: 60, y: 270 },
  { x: 20, y: 310 },
  { x: 195, y: 135 },
];

/**
 * The site's opening move: a small cluster of circuit traces — confined to
 * the empty space just left of the wordmark, never crossing the letters —
 * converges and pings, a beat before "RULANTU" reveals. One-shot, desktop
 * + fine-pointer only; see globals.css for why reduced-motion and small
 * screens hide it via CSS rather than relying on the JS check alone.
 */
export default function SignalIgnite() {
  const svgRef = useRef<SVGSVGElement>(null);
  const flashRef = useRef<SVGCircleElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const svg = svgRef.current;
    const flash = flashRef.current;
    const ring = ringRef.current;
    if (!svg || !flash || !ring) return;

    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("[data-trace]"));
    const nodes = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-node]"));
    const { gsap } = getGsap();
    const origin = `${IGNITE.x}px ${IGNITE.y}px`;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      tl.fromTo(
        paths,
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.5, stagger: 0.09, ease: "power2.inOut" }
      )
        .fromTo(
          nodes,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.2, stagger: 0.09, ease: "back.out(3)" },
          "<"
        )
        .fromTo(
          flash,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.2, ease: "power2.out", transformOrigin: origin },
          "-=0.1"
        )
        .to(flash, { scale: 1.8, opacity: 0, duration: 0.45, ease: "power2.out", transformOrigin: origin }, "<")
        .fromTo(
          ring,
          { scale: 0.3, opacity: 0.9 },
          { scale: 5, opacity: 0, duration: 0.7, ease: "power1.out", transformOrigin: origin },
          "<"
        )
        .to(svg, { opacity: 0, duration: 0.4, ease: "power1.out" }, "-=0.3");
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
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          opacity={0.8}
        />
      ))}
      {NODES.map((n, i) => (
        <circle
          key={i}
          data-node
          cx={n.x}
          cy={n.y}
          r="4"
          fill="var(--ink)"
          stroke="var(--signal)"
          strokeWidth="1.5"
          opacity={0}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      ))}
      <circle
        ref={ringRef}
        cx={IGNITE.x}
        cy={IGNITE.y}
        r="14"
        fill="none"
        stroke="var(--signal)"
        strokeWidth="1.5"
        opacity="0"
      />
      <circle ref={flashRef} cx={IGNITE.x} cy={IGNITE.y} r="8" fill="var(--signal)" opacity="0" />
    </svg>
  );
}
