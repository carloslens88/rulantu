"use client";

import { useEffect, useRef } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";
import Reveal from "@/components/ui/Reveal";
import CircuitNode from "@/components/ui/CircuitNode";
import type { Dictionary } from "@/data/content";

type ProcessProps = {
  dict: Dictionary;
};

export default function Process({ dict }: ProcessProps) {
  const { processIntro, process } = dict;
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const fill = lineFillRef.current;
    if (!wrap || !fill) return;

    if (prefersReducedMotion()) {
      fill.style.height = "100%";
      wrap.querySelectorAll<HTMLElement>("[data-step]").forEach((s) => s.classList.add("is-active"));
      return;
    }

    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        fill,
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top 55%",
            end: "bottom 65%",
            scrub: 0.4,
          },
        }
      );

      const steps = Array.from(wrap.querySelectorAll<HTMLElement>("[data-step]"));
      steps.forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 60%",
          toggleClass: { targets: step, className: "is-active" },
        });
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      className="relative bg-paper text-ink"
      style={{ padding: "clamp(6rem, 14vw, 10rem) var(--container-pad)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <Reveal>
              <p className="eyebrow text-stone-soft">{processIntro.eyebrow}</p>
              <h2 className="mt-4 font-display font-bold leading-[0.95] tracking-tight text-[9vw] md:text-[3.6vw]">
                {processIntro.title[0]}
                <br />
                {processIntro.title[1]}
              </h2>
            </Reveal>
          </div>
        </div>

        <div ref={wrapRef} className="md:col-span-7 relative pl-10 md:pl-14">
          {/* The trace: a straight climb, lit from below as you scroll — a
              small signal-dot rides the leading edge, and the final step
              (the summit) gets the same glow treatment as the logo's peak. */}
          <div className="absolute left-0 top-2 bottom-2 w-px bg-ink/12">
            <div
              ref={lineFillRef}
              className="absolute left-0 top-0 w-px bg-signal"
              style={{ height: "0%" }}
            >
              <div
                aria-hidden="true"
                className="absolute -left-[3px] bottom-0 w-[7px] h-[7px] rounded-full bg-signal shadow-[0_0_10px_2px_var(--signal)]"
              />
            </div>
          </div>

          {process.map((step, i) => (
            <div
              key={step.index}
              data-step
              data-summit={i === process.length - 1 ? "true" : undefined}
              className="process-step relative pb-16 last:pb-0 transition-opacity duration-500"
            >
              <CircuitNode className="process-node absolute -left-10 md:-left-14 top-0 w-5 h-5 md:w-6 md:h-6 text-ink/25 transition-colors duration-500" />
              <span className="eyebrow process-index transition-colors duration-500">
                {step.index}
              </span>
              <h3 className="mt-2 font-display font-bold text-[7vw] md:text-[2.6vw] leading-tight tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 max-w-md text-stone-soft leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .process-step { opacity: 0.4; }
        .process-step.is-active { opacity: 1; }
        .process-step.is-active .process-node { color: var(--signal); }
        .process-step.is-active .process-index { color: var(--signal-dim); }
        .process-step[data-summit].is-active .process-node {
          filter: drop-shadow(0 0 6px var(--signal));
        }
      `}</style>
    </section>
  );
}
