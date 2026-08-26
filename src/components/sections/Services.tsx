"use client";

import { useEffect, useRef } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";
import Reveal from "@/components/ui/Reveal";
import CircuitNode from "@/components/ui/CircuitNode";
import type { Dictionary } from "@/data/content";

type ServicesProps = {
  dict: Dictionary;
};

export default function Services({ dict }: ServicesProps) {
  const { servicesIntro, services } = dict;
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || prefersReducedMotion()) return;

    const rows = Array.from(list.querySelectorAll<HTMLElement>("[data-row]"));
    const { ScrollTrigger } = getGsap();
    const triggers = rows.map((row) =>
      ScrollTrigger.create({
        trigger: row,
        start: "top 62%",
        end: "bottom 42%",
        toggleClass: { targets: row, className: "is-active" },
      })
    );

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section
      id="what-we-do"
      className="relative bg-ink text-paper"
      style={{ padding: "clamp(6rem, 14vw, 10rem) var(--container-pad)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-x-8">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <Reveal>
              <p className="eyebrow">{servicesIntro.eyebrow}</p>
              <h2 className="mt-4 font-display font-bold leading-[0.95] tracking-tight text-[9vw] md:text-[3.6vw]">
                {servicesIntro.title[0]}
                <br />
                {servicesIntro.title[1]}
              </h2>
              <p className="mt-6 max-w-sm text-stone leading-relaxed">
                {servicesIntro.body}
              </p>
            </Reveal>
          </div>
        </div>

        <div ref={listRef} className="md:col-span-8">
          {services.map((service) => (
            <div
              key={service.index}
              data-row
              className="service-row group border-b border-paper/12 py-8 md:py-10 transition-colors duration-500"
            >
              <div className="flex items-baseline gap-4 md:gap-8">
                <span className="service-index eyebrow shrink-0 inline-flex items-center gap-2 transition-colors duration-500">
                  <CircuitNode className="w-3.5 h-3.5 md:w-4 md:h-4 transition-colors duration-500" />
                  {service.index}
                </span>
                <h3 className="service-title font-display font-bold tracking-tight text-[8vw] md:text-[3.2vw] leading-none transition-colors duration-500">
                  {service.title}
                </h3>
              </div>
              <div className="service-desc grid grid-rows-[0fr] group-[.is-active]:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                <div className="overflow-hidden">
                  <p className="pt-4 md:pl-[3.5rem] max-w-xl text-stone leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .service-index { color: var(--stone-soft); }
        .service-title { color: var(--stone-soft); }
        .service-row.is-active .service-index { color: var(--signal); }
        .service-row.is-active .service-title { color: var(--paper); }
        .service-row.is-active { border-color: color-mix(in srgb, var(--paper) 30%, transparent); }
      `}</style>
    </section>
  );
}
