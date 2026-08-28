import Logo from "@/components/ui/Logo";
import Marquee from "@/components/ui/Marquee";
import MagneticButton from "@/components/ui/MagneticButton";
import type { Dictionary, Locale } from "@/data/content";

type FooterProps = {
  dict: Dictionary;
  locale: Locale;
};

export default function Footer({ dict }: FooterProps) {
  return (
    <footer className="relative bg-paper text-ink overflow-hidden">
      <div className="border-y border-ink/12 py-4">
        <Marquee items={dict.heroTicker} className="eyebrow text-stone-soft" />
      </div>

      <div style={{ padding: "clamp(4rem, 10vw, 7rem) var(--container-pad) 3rem" }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <div className="metal-shine md:col-span-7 max-w-2xl rounded-2xl overflow-hidden bg-ink p-8 md:p-10">
            <Logo variant="full" />
          </div>

          <div className="md:col-span-5">
            <p className="eyebrow text-stone-soft mb-4">{dict.footer.explore}</p>
            <nav className="flex flex-col gap-2 mb-8">
              {dict.nav.items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="font-display text-xl md:text-2xl font-medium hover:text-signal transition-colors duration-300 w-fit"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <MagneticButton
              href={dict.brand.instagram}
              external
              className="eyebrow text-stone-soft hover:text-signal transition-colors duration-300"
            >
              Instagram — {dict.brand.instagramHandle}
            </MagneticButton>
          </div>
        </div>

        <p className="mt-10 font-display text-2xl md:text-3xl font-medium max-w-xl">
          {dict.footer.tagline}
        </p>

        <div className="mt-16 flex flex-col sm:flex-row justify-between gap-4 border-t border-ink/12 pt-6 text-sm text-stone-soft">
          <span>
            © {new Date().getFullYear()} {dict.brand.name}. {dict.footer.rights}
          </span>
          <span>{dict.brand.domain}</span>
        </div>
      </div>
    </footer>
  );
}
