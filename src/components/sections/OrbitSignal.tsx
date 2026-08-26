"use client";

import { useEffect, useRef } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";

// A small closed circuit loop — lives in the Hero's empty right-side
// space rather than over the wordmark. Right-angle bends echo the logo;
// the nodes sit at its corners.
const LOOP = "M0,70 L0,10 L110,10 L110,130 L45,130 L45,70 Z";
const NODES = [
  { x: 0, y: 10 },
  { x: 110, y: 10 },
  { x: 110, y: 130 },
  { x: 45, y: 70 },
];

/**
 * Ambient, continuous — not a one-shot intro. A short bright segment
 * travels endlessly around a small circuit loop parked in the Hero's dead
 * space, like a quiet signal circulating in the background. Large screens
 * only (the empty space it lives in doesn't exist below lg), and static
 * (no travel) under reduced motion rather than hidden — it's a background
 * detail, not decoration that needs full motion to read.
 */
export default function OrbitSignal({ className = "" }: { className?: string }) {
  const pulseRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const pulse = pulseRef.current;
    if (!pulse) return;

    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pulse,
        { strokeDashoffset: 0 },
        { strokeDashoffset: -1, duration: 5.5, ease: "none", repeat: -1 }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <svg
      aria-hidden="true"
      viewBox="-10 -10 130 150"
      className={`hidden lg:block pointer-events-none ${className}`}
    >
      <path d={LOOP} fill="none" stroke="var(--paper)" strokeOpacity="0.12" strokeWidth="1.25" />
      <path
        ref={pulseRef}
        d={LOOP}
        fill="none"
        stroke="var(--signal)"
        strokeWidth="1.5"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="0.09 0.91"
        opacity={0.9}
      />
      {NODES.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="3.5" fill="var(--ink)" stroke="var(--paper)" strokeOpacity="0.35" strokeWidth="1.25" />
      ))}
    </svg>
  );
}
