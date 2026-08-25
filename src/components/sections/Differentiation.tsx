"use client";

import { useEffect, useRef } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";
import Reveal from "@/components/ui/Reveal";
import type { Dictionary } from "@/data/content";

type DifferentiationProps = {
  dict: Dictionary;
};

export default function Differentiation({ dict }: DifferentiationProps) {
  const { differentiation } = dict;
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const strokes = Array.from(list.querySelectorAll<SVGPathElement>("[data-strike]"));

    if (prefersReducedMotion()) {
      strokes.forEach((s) => s.style.setProperty("stroke-dashoffset", "0"));
      return;
    }

    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        strokes,
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 0.5,
          stagger: 0.14,
          ease: "power2.out",
          scrollTrigger: {
            trigger: list,
            start: "top 70%",
            once: true,
          },
        }
      );
    }, list);

    return () => ctx.revert();
  }, []);

  // A handful of distinct hand-marked squiggle paths, cycled per item so the
  // strikes don't look like one stamped-out asset repeated six times.
  const strikePaths = [
    "M1 12 Q 25 3, 50 11 T 99 9",
    "M1 8 Q 22 16, 48 7 T 99 12",
    "M1 13 Q 30 5, 55 12 T 99 6",
  ];

  return (
    <section
      className="relative bg-paper text-ink"
      style={{ padding: "clamp(6rem, 14vw, 10rem) var(--container-pad)" }}
    >
      <Reveal>
        <p className="eyebrow text-stone-soft">{differentiation.eyebrow}</p>
        <h2 className="mt-4 font-display font-bold leading-[0.95] tracking-tight text-[9vw] md:text-[4.2vw] max-w-4xl">
          {differentiation.title}
        </h2>
      </Reveal>

      <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-8 items-start">
        <div className="md:col-span-5">
          <p className="eyebrow mb-6 text-stone-soft">{differentiation.before.label}</p>
          <ul ref={listRef} className="space-y-7">
            {differentiation.before.items.map((item, i) => (
              <li
                key={item}
                className="relative block w-fit text-xl md:text-2xl text-stone-soft font-display"
                style={{
                  transform: `translateX(${(i % 2) * 8}px) rotate(${i % 2 === 0 ? "-0.8deg" : "0.6deg"})`,
                }}
              >
                <span className="relative z-0">{item}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                  className="absolute -left-[3%] -right-[3%] top-1/2 w-[106%] h-[1.3em] -translate-y-1/2 z-10 pointer-events-none overflow-visible"
                >
                  <path
                    data-strike
                    d={strikePaths[i % strikePaths.length]}
                    fill="none"
                    stroke="var(--signal)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray={1}
                  />
                </svg>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden md:flex md:col-span-2 items-center justify-center pt-16">
          <svg width="48" height="24" viewBox="0 0 48 24" fill="none" aria-hidden="true">
            <path
              d="M2 12H46M46 12L36 2M46 12L36 22"
              stroke="var(--signal)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="md:col-span-5">
          <p className="eyebrow mb-6 text-signal-dim">{differentiation.after.label}</p>
          <Reveal>
            <div className="bg-ink text-paper rounded-2xl p-8 md:p-10">
              <p className="font-display font-bold text-2xl md:text-3xl leading-snug">
                {differentiation.after.items[0]}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 text-lg leading-relaxed text-stone-soft max-w-md">
              {differentiation.body}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
