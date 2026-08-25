"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import MagneticButton from "@/components/ui/MagneticButton";
import { localePath, type Dictionary, type Locale } from "@/data/content";

type NavProps = {
  dict: Dictionary;
  locale: Locale;
};

export default function Nav({ dict, locale }: NavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const otherLocale: Locale = locale === "en" ? "es" : "en";
  const otherHref = localePath(otherLocale);
  const otherLabel = otherLocale.toUpperCase();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-ink/85 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div
        className="flex items-center justify-between"
        style={{ padding: "1.1rem var(--container-pad)" }}
      >
        <a href="#top" data-cursor="link" className="relative z-10">
          <Logo className="text-xl md:text-2xl text-paper" />
        </a>

        <nav className="hidden md:flex items-center gap-9">
          {dict.nav.items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-cursor="link"
              className="eyebrow text-paper/80 hover:text-signal transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          <a
            href={otherHref}
            hrefLang={otherLocale}
            data-cursor="link"
            className="eyebrow text-paper/60 hover:text-signal transition-colors duration-300"
          >
            {otherLabel}
          </a>
          <MagneticButton
            href="#contact"
            className="inline-flex items-center gap-2 border border-paper/25 rounded-full px-5 py-2 text-sm font-medium text-paper hover:border-signal hover:text-signal transition-colors duration-300"
          >
            {dict.nav.startProject}
          </MagneticButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
          className="md:hidden relative z-10 w-10 h-10 flex flex-col items-center justify-center gap-1.5"
        >
          <span
            className={`block h-px w-6 bg-paper transition-transform duration-300 ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-paper transition-transform duration-300 ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`md:hidden fixed inset-0 bg-ink transition-opacity duration-400 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col justify-center h-full gap-8 px-8">
          {dict.nav.items.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display text-4xl font-bold text-paper"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {item.label}
            </a>
          ))}
          <div className="mt-4 flex items-center gap-6">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="inline-flex w-fit items-center gap-2 border border-signal rounded-full px-6 py-3 text-signal font-medium"
            >
              {dict.nav.startProject}
            </a>
            <a
              href={otherHref}
              hrefLang={otherLocale}
              className="eyebrow text-paper/60"
            >
              {otherLabel}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
