import Logo from "@/components/ui/Logo";
import Marquee from "@/components/ui/Marquee";
import ContactChannels from "@/components/ui/ContactChannels";
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
          <Logo className="md:col-span-7 text-[16vw] md:text-[9vw] leading-none text-ink" />

          <div className="md:col-span-5">
            <p className="eyebrow text-stone-soft mb-1">{dict.footer.getInTouch}</p>
            <ContactChannels dict={dict} />
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
