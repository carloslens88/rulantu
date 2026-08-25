"use client";

import { useEffect, useRef } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";

type SplitRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  /** Stagger unit: word-level reveal reads calmer for long lines. */
  by?: "word" | "char";
};

/**
 * Wraps each word (or char) in an overflow-hidden mask and animates it up
 * into view with a stagger — the hero's kinetic-typography entrance.
 */
export default function SplitReveal({
  text,
  className = "",
  delay = 0,
  by = "word",
}: SplitRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const pieces = Array.from(el.querySelectorAll<HTMLElement>("[data-piece]"));

    if (prefersReducedMotion()) {
      pieces.forEach((p) => {
        p.style.transform = "translateY(0)";
        p.style.opacity = "1";
      });
      return;
    }

    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pieces,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          delay,
          ease: "power4.out",
          stagger: by === "word" ? 0.08 : 0.02,
        }
      );
    });

    return () => ctx.revert();
  }, [delay, by]);

  const units = by === "word" ? text.split(" ") : text.split("");

  return (
    <span ref={ref} className={className} aria-label={text}>
      {units.map((unit, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-top"
          aria-hidden="true"
        >
          <span data-piece className="inline-block will-change-transform">
            {unit === " " ? " " : unit}
            {by === "word" && i < units.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
