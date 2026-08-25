import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/sections/ContactForm";
import ContactChannels from "@/components/ui/ContactChannels";
import type { Dictionary } from "@/data/content";

type CTAProps = {
  dict: Dictionary;
};

export default function CTA({ dict }: CTAProps) {
  const { cta, contact } = dict;

  return (
    <section
      id="contact"
      className="relative bg-ink text-paper"
      style={{ padding: "clamp(6rem, 16vw, 11rem) var(--container-pad)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-8">
        <div className="md:col-span-6">
          <Reveal>
            <p className="eyebrow">{cta.eyebrow}</p>
            <h2 className="mt-4 font-display font-black leading-[0.92] tracking-tight text-[11vw] md:text-[5vw]">
              {cta.title}
            </h2>
            <p className="mt-8 max-w-md text-lg text-stone leading-relaxed">
              {cta.body}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12 max-w-sm border-t border-paper/12 pt-8">
              <p className="eyebrow text-stone mb-1">{contact.eyebrow}</p>
              <ContactChannels dict={dict} />
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-6 md:pt-4">
          <Reveal delay={0.1}>
            <ContactForm dict={dict} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
