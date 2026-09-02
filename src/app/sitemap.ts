import type { MetadataRoute } from "next";
import { locales, defaultLocale, localePath } from "@/data/content";

export const dynamic = "force-static";

const siteUrl = "https://rulantu.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    ...Object.fromEntries(locales.map((locale) => [locale, `${siteUrl}${localePath(locale)}`])),
    "x-default": `${siteUrl}${localePath(defaultLocale)}`,
  };

  return locales.map((locale) => ({
    url: `${siteUrl}${localePath(locale)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === defaultLocale ? 1 : 0.9,
    alternates: { languages },
  }));
}
