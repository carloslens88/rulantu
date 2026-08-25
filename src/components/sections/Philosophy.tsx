"use client";

import { useEffect, useRef } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";
import Reveal from "@/components/ui/Reveal";
import type { Dictionary } from "@/data/content";

type PhilosophyProps = {
  dict: Dictionary;
};

export default function Philosophy({ dict }: PhilosophyProps) {
  const { philosophy } = dict;
  const wrapRef = useRef<HTMLDivElement>(null);
  const wordsHostRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const host = wordsHostRef.current;
    if (!wrap || !host) return;

    const words = Array.from(host.querySelectorAll<HTMLElement>("[data-word]"));

    if (prefersReducedMotion()) {
      words.forEach((w) => (w.style.opacity = "1"));
      return;
    }

    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.set(words, { opacity: 0.12 });
      gsap.to(words, {
        opacity: 1,
        stagger: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top 75%",
          end: "bottom 40%",
          scrub: 0.4,
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="philosophy"
      className="relative bg-paper text-ink py-28 md:py-40"
      style={{ padding: "clamp(6rem, 14vw, 10rem) var(--container-pad)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8">
        <div className="md:col-span-4">
          <Reveal>
            <p className="eyebrow text-stone-soft">{philosophy.eyebrow}</p>
          </Reveal>
        </div>

        <div className="md:col-span-8">
          <h2 className="font-display font-bold leading-[0.98] tracking-tight text-[9vw] md:text-[4.4vw]">
            {philosophy.lines.map((line, i) => (
              <Reveal key={line} delay={i * 0.08}>
                <span className="block">{line}</span>
              </Reveal>
            ))}
          </h2>
        </div>
      </div>

      <div ref={wrapRef} className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-8">
        <div className="md:col-span-4" />
        <p
          ref={wordsHostRef}
          className="md:col-span-7 font-body text-2xl md:text-3xl leading-snug"
        >
          {philosophy.body.split(" ").map((word, i) => (
            <span key={i} data-word className="inline-block mr-[0.3em]">
              {word}
            </span>
          ))}
        </p>
      </div>

      <div className="mt-20 md:mt-28 border-t border-ink/15 pt-10">
        <Reveal>
          <p className="font-display text-xl md:text-2xl font-medium">
            {philosophy.tag}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
