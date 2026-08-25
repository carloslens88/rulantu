import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Philosophy from "@/components/sections/Philosophy";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Packages from "@/components/sections/Packages";
import Differentiation from "@/components/sections/Differentiation";
import CTA from "@/components/sections/CTA";
import { getDictionary, resolveLocale, generateLocaleParams } from "@/data/content";

export { generateLocaleParams as generateStaticParams };

type Props = {
  params: Promise<{ locale?: string[] }>;
};

export default async function Home({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  return (
    <>
      <Nav dict={dict} locale={locale} />
      <main>
        <Hero dict={dict} />
        <Philosophy dict={dict} />
        <Services dict={dict} />
        <Process dict={dict} />
        <Packages dict={dict} />
        <Differentiation dict={dict} />
        <CTA dict={dict} />
      </main>
      <Footer dict={dict} locale={locale} />
    </>
  );
}
