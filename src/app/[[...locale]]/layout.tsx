import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import CustomCursor from "@/components/layout/CustomCursor";
import {
  getDictionary,
  resolveLocale,
  localePath,
  locales,
  generateLocaleParams,
} from "@/data/content";

export { generateLocaleParams as generateStaticParams };

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = "https://rulantu.com";
const ogLocale: Record<string, string> = { en: "en_US", es: "es_ES" };

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const path = localePath(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${dict.brand.name} — ${dict.brand.claim}`,
      template: `%s — ${dict.brand.name}`,
    },
    description: dict.metaDescription,
    keywords: [
      "digital agency",
      "web design",
      "branding agency",
      "website development",
      "SEO",
      "brand strategy",
      "RULANTU",
    ],
    authors: [{ name: dict.brand.name }],
    creator: dict.brand.name,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(locales.map((l) => [l, localePath(l)])),
    },
    openGraph: {
      // Set explicitly (not relying on opengraph-image.tsx auto-injection) —
      // that convention doesn't reliably cross the [[...locale]] segment
      // boundary from the sibling top-level file.
      images: ["/opengraph-image"],
      type: "website",
      url: path === "/" ? siteUrl : `${siteUrl}${path}`,
      siteName: dict.brand.name,
      title: `${dict.brand.name} — ${dict.brand.claim}`,
      description: dict.metaDescription,
      locale: ogLocale[locale],
    },
    twitter: {
      card: "summary_large_image",
      title: `${dict.brand.name} — ${dict.brand.claim}`,
      description: dict.metaDescription,
      images: ["/opengraph-image"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    icons: {
      icon: "/favicon.svg",
    },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: dict.brand.name,
    url: siteUrl,
    slogan: dict.brand.claim,
    sameAs: [dict.brand.instagram],
    description: dict.metaDescription,
  };

  return (
    <html
      lang={locale}
      className={`${bricolage.variable} ${manrope.variable} ${plexMono.variable} h-full`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full antialiased">
        <div className="grain" aria-hidden="true" />
        <CustomCursor />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
