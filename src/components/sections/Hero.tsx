"use client";

import { useEffect, useRef } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";
import SplitReveal from "@/components/ui/SplitReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import Marquee from "@/components/ui/Marquee";
import type { Dictionary } from "@/data/content";

type HeroProps = {
  dict: Dictionary;
};

export default function Hero({ dict }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const claimRef = useRef<HTMLDivElement>(null);

  // Cursor-follow ambient glow — a soft signal-colored light, not a blob.
  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (!isFine || prefersReducedMotion()) return;

    const glow = glowRef.current;
    const section = sectionRef.current;
    if (!glow || !section) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight * 0.4;
    let gx = x;
    let gy = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const tick = () => {
      gx += (x - gx) * 0.06;
      gy += (y - gy) * 0.06;
      glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll-linked exit parallax on the wordmark + claim.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const wordmark = wordmarkRef.current;
    const claim = claimRef.current;
    if (!section || !wordmark || !claim) return;

    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.to(wordmark, {
        yPercent: -18,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(claim, {
        yPercent: -8,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden bg-ink pt-28 pb-0"
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 w-[46rem] h-[46rem] rounded-full opacity-30 blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, var(--signal) 0%, transparent 70%)",
        }}
      />

      <div style={{ padding: "0 var(--container-pad)" }} className="relative z-10">
        <p className="eyebrow">
          {dict.heroTicker.join(" · ")}
        </p>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div ref={wordmarkRef} style={{ padding: "0 var(--container-pad)" }}>
          <h1 className="font-display font-black leading-[0.86] tracking-tight text-paper select-none">
            <SplitReveal
              text={dict.brand.name}
              by="char"
              className="block text-[16vw] md:text-[15vw] lg:text-[13vw]"
            />
          </h1>
        </div>

        <div
          ref={claimRef}
          style={{ padding: "0 var(--container-pad)" }}
          className="mt-8 md:mt-10 max-w-3xl"
        >
          <p className="font-display font-medium leading-[1.05] tracking-tight text-paper text-[7vw] sm:text-[5vw] md:text-[3.4vw] lg:text-[2.6vw]">
            <SplitReveal text={dict.brand.claim} by="word" delay={0.5} />
          </p>
        </div>

        <div
          style={{ padding: "0 var(--container-pad)" }}
          className="mt-10 md:mt-12 flex flex-col sm:flex-row sm:items-center gap-6"
        >
          <MagneticButton
            href="#contact"
            cursorState="drag"
            className="group inline-flex items-center gap-3 bg-signal text-ink font-semibold rounded-full pl-6 pr-2 py-2 text-base"
          >
            <span>{dict.cta.primaryLabel}</span>
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-ink text-signal group-hover:rotate-45 transition-transform duration-300">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </MagneticButton>

          <p className="eyebrow max-w-xs">{dict.hero.supportingLine}</p>
        </div>
      </div>

      <div className="relative z-10 border-t border-paper/10 py-4">
        <Marquee items={dict.heroTicker} className="eyebrow text-paper/50" />
      </div>
    </section>
  );
}
