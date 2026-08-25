"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import type { Dictionary } from "@/data/content";

type PackagesProps = {
  dict: Dictionary;
};

export default function Packages({ dict }: PackagesProps) {
  const { packagesIntro, packages } = dict;
  const [openId, setOpenId] = useState<string>(
    packages.find((p) => p.featured)?.id ?? packages[0].id
  );

  return (
    <section
      id="packages"
      className="relative bg-ink text-paper"
      style={{ padding: "clamp(6rem, 14vw, 10rem) var(--container-pad)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-x-8 mb-16 md:mb-20">
        <div className="md:col-span-4">
          <Reveal>
            <p className="eyebrow">{packagesIntro.eyebrow}</p>
          </Reveal>
        </div>
        <div className="md:col-span-8">
          <Reveal>
            <h2 className="font-display font-bold leading-[0.95] tracking-tight text-[9vw] md:text-[3.6vw]">
              {packagesIntro.title[0]}
              <br />
              {packagesIntro.title[1]}
            </h2>
            <p className="mt-6 max-w-lg text-stone leading-relaxed">
              {packagesIntro.body}
            </p>
          </Reveal>
        </div>
      </div>

      <div className="border-t border-paper/12">
        {packages.map((pkg) => {
          const isOpen = openId === pkg.id;
          return (
            <div key={pkg.id} className="border-b border-paper/12">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? "" : pkg.id)}
                aria-expanded={isOpen}
                data-cursor="link"
                className="w-full text-left py-8 md:py-10 flex flex-col md:flex-row md:items-center gap-4 md:gap-8"
              >
                <span
                  className={`eyebrow shrink-0 w-16 transition-colors duration-300 ${
                    isOpen ? "text-signal" : "text-stone"
                  }`}
                >
                  {pkg.featured ? packagesIntro.popularLabel : "—"}
                </span>
                <h3 className="font-display font-bold tracking-tight text-[8vw] md:text-[3vw] leading-none flex-1">
                  {pkg.name}
                </h3>
                <span className="hidden md:block text-stone max-w-xs shrink-0">
                  {pkg.tagline}
                </span>
                <span
                  aria-hidden="true"
                  className={`shrink-0 w-9 h-9 rounded-full border border-paper/25 flex items-center justify-center transition-transform duration-400 ${
                    isOpen ? "rotate-45 border-signal text-signal" : "text-paper"
                  }`}
                >
                  +
                </span>
              </button>

              <div
                className="grid transition-[grid-template-rows] duration-500 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div className="pb-10 md:pl-24 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    <p className="text-lg md:text-xl leading-relaxed text-paper/90 max-w-md">
                      {pkg.description}
                    </p>
                    <ul className="space-y-3">
                      {pkg.includes.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-stone">
                          <span aria-hidden="true" className="text-signal mt-1.5">
                            —
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pb-10 md:pl-24">
                    <MagneticButton
                      href="#contact"
                      className="inline-flex items-center gap-2 text-signal font-medium border-b border-signal pb-0.5"
                    >
                      {packagesIntro.talkPrefix} {pkg.name.split(" ")[1]}
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
