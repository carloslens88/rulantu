export type Locale = "en" | "es";
export const locales: Locale[] = ["en", "es"];
export const defaultLocale: Locale = "en";

export type Service = {
  index: string;
  title: string;
  description: string;
};

export type ProcessStep = {
  index: string;
  title: string;
  description: string;
};

export type Package = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  includes: string[];
  featured?: boolean;
};

export type Dictionary = {
  brand: {
    name: string;
    claim: string;
    domain: string;
    instagram: string;
    instagramHandle: string;
    contactEmail: string;
    /** Digits only (country code + number, no + or spaces) — feeds wa.me links. */
    whatsapp: string;
    /** Human-readable version of the same number, for display. */
    whatsappDisplay: string;
  };
  metaDescription: string;
  nav: {
    items: { label: string; href: string }[];
    startProject: string;
    openMenu: string;
    closeMenu: string;
  };
  heroTicker: string[];
  hero: {
    supportingLine: string;
  };
  philosophy: {
    eyebrow: string;
    lines: string[];
    body: string;
    tag: string;
  };
  servicesIntro: {
    eyebrow: string;
    title: string[];
    body: string;
  };
  services: Service[];
  processIntro: {
    eyebrow: string;
    title: string[];
  };
  process: ProcessStep[];
  packagesIntro: {
    eyebrow: string;
    title: string[];
    body: string;
    popularLabel: string;
    talkPrefix: string;
  };
  packages: Package[];
  differentiation: {
    eyebrow: string;
    title: string;
    before: { label: string; items: string[] };
    after: { label: string; items: string[] };
    body: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    body: string;
    primaryLabel: string;
  };
  contactForm: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    sentMessage: string;
    errorPrefix: string;
  };
  footer: {
    tagline: string;
    rights: string;
    getInTouch: string;
  };
  contact: {
    eyebrow: string;
    whatsappLabel: string;
    instagramLabel: string;
    emailLabel: string;
  };
};

const brandShared = {
  name: "RULANTU",
  domain: "rulantu.com",
  instagram: "https://www.instagram.com/rulantu_com",
  instagramHandle: "@rulantu_com",
  // Contact form submissions (via Resend, see worker.js) land here.
  contactEmail: "support@rulantu.com",
  // TODO before launch: replace with the real WhatsApp Business number —
  // digits only, country code first, no "+" or spaces (e.g. "34600000000").
  whatsapp: "000000000",
  // TODO before launch: keep this in sync with the number above, formatted for display.
  whatsappDisplay: "+00 000 00 00 00",
};

const en: Dictionary = {
  brand: {
    ...brandShared,
    claim: "We make brands impossible to ignore.",
  },
  metaDescription:
    "RULANTU builds the complete digital presence of a business — strategy, branding, websites, content, SEO and growth, delivered by one accountable partner.",
  nav: {
    items: [
      { label: "Philosophy", href: "#philosophy" },
      { label: "What we do", href: "#what-we-do" },
      { label: "Process", href: "#process" },
      { label: "Packages", href: "#packages" },
      { label: "Contact", href: "#contact" },
    ],
    startProject: "Start a project",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  heroTicker: ["Strategy", "Branding", "Websites", "Growth"],
  hero: {
    supportingLine: "You bring the idea. We build everything around it.",
  },
  philosophy: {
    eyebrow: "Philosophy",
    lines: ["You bring the idea.", "We build everything", "around it."],
    body: "Most businesses don't fail because the idea is weak. They fail because the digital presence is scattered — a freelancer here, a template there, nobody accountable for the whole. RULANTU becomes the one partner responsible for your entire digital presence: strategy, brand, website, content, search, growth. One vision. Nothing lost in translation.",
    tag: "One partner. One vision. Everything around it.",
  },
  servicesIntro: {
    eyebrow: "What we do",
    title: ["The whole", "digital presence."],
    body: "Seven disciplines, one accountable team. Scroll through what RULANTU actually does, end to end.",
  },
  services: [
    {
      index: "01",
      title: "Strategy",
      description:
        "We understand the business, the audience, the competitive landscape and the goals before a single pixel moves.",
    },
    {
      index: "02",
      title: "Branding",
      description:
        "We create or sharpen the visual identity, tone of voice and creative direction your business will carry everywhere.",
    },
    {
      index: "03",
      title: "Web Design",
      description:
        "We design the experience around real users and real business outcomes — not a template with your logo on it.",
    },
    {
      index: "04",
      title: "Development",
      description:
        "We build fast, responsive, technically excellent websites engineered to perform, not just to demo well.",
    },
    {
      index: "05",
      title: "Content",
      description:
        "We write the messaging, structure the pages and build the visuals and conversion paths that turn visits into decisions.",
    },
    {
      index: "06",
      title: "SEO",
      description:
        "We build search visibility into the architecture from day one, so the site is found — not just admired.",
    },
    {
      index: "07",
      title: "Launch & Growth",
      description:
        "We deploy, measure, improve and evolve the digital presence long after launch day. Growth is a process, not an event.",
    },
  ],
  processIntro: {
    eyebrow: "Process",
    title: ["How we", "get there."],
  },
  process: [
    {
      index: "01",
      title: "We understand.",
      description: "Business, audience, ambition. We start by listening.",
    },
    {
      index: "02",
      title: "We define.",
      description: "Positioning, direction, priorities. We decide what matters.",
    },
    {
      index: "03",
      title: "We design.",
      description: "Identity and experience, built as one coherent system.",
    },
    {
      index: "04",
      title: "We build.",
      description: "Fast, clean, technically excellent — engineered to last.",
    },
    {
      index: "05",
      title: "We launch.",
      description: "Live, indexed, measured — the presence goes to work.",
    },
    {
      index: "06",
      title: "We grow.",
      description: "We keep improving what launch day only started.",
    },
  ],
  packagesIntro: {
    eyebrow: "Packages",
    title: ["Three directions.", "One outcome: results."],
    body: "These are starting points, not fixed price tags — every engagement is scoped to the business in front of us.",
    popularLabel: "Popular",
    talkPrefix: "Talk to us about",
  },
  packages: [
    {
      id: "start",
      name: "RULANTU START",
      tagline: "A digital presence that means business.",
      description:
        "For businesses that need to show up online the way they deserve to — clear, credible, fast, and built to grow.",
      includes: [
        "Brand direction & messaging",
        "Website design & development",
        "Foundational SEO setup",
        "Launch on your domain",
      ],
    },
    {
      id: "grow",
      name: "RULANTU GROW",
      tagline: "Web, brand and visibility, working together.",
      description:
        "For businesses ready to compete — a full identity, a considered site, and the strategy and search presence to back it up.",
      includes: [
        "Everything in START",
        "Full brand identity system",
        "Content & conversion strategy",
        "Ongoing SEO & performance tuning",
      ],
      featured: true,
    },
    {
      id: "pro",
      name: "RULANTU PRO",
      tagline: "The complete digital operation.",
      description:
        "For businesses that want a partner, not a project — a complete digital experience with automation, maintenance and continuous growth.",
      includes: [
        "Everything in GROW",
        "Automation & integrations",
        "Ongoing maintenance & iteration",
        "Quarterly growth reviews",
      ],
    },
  ],
  differentiation: {
    eyebrow: "Not another web agency",
    title: "One idea. One partner. Everything around it.",
    before: {
      label: "The usual way",
      items: [
        "A designer for the look",
        "A developer for the build",
        "A copywriter for the words",
        "An SEO specialist for visibility",
        "A marketing agency for growth",
        "You, coordinating all of it",
      ],
    },
    after: {
      label: "The RULANTU way",
      items: ["RULANTU — one team, one project, one outcome."],
    },
    body: "You shouldn't need a project manager just to get a website. RULANTU takes responsibility for the complete digital presence, so you can run the business instead of running the agencies.",
  },
  cta: {
    eyebrow: "Let's talk",
    title: "Let's build something impossible to ignore.",
    body: "Tell us what you're building. We'll tell you how we'd make it unmissable.",
    primaryLabel: "Start the conversation",
  },
  contactForm: {
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@company.com",
    messageLabel: "What are you building?",
    messagePlaceholder: "Tell us about the business and what you need.",
    send: "Send it",
    sending: "Sending…",
    sentMessage: "Got it. We'll be in touch shortly.",
    errorPrefix: "Something went wrong — email us directly at",
  },
  footer: {
    tagline: "We make brands impossible to ignore.",
    rights: "All rights reserved.",
    getInTouch: "Get in touch",
  },
  contact: {
    eyebrow: "Other ways to reach us",
    whatsappLabel: "WhatsApp",
    instagramLabel: "Instagram",
    emailLabel: "Email",
  },
};

const es: Dictionary = {
  brand: {
    ...brandShared,
    claim: "Hacemos marcas imposibles de ignorar.",
  },
  metaDescription:
    "RULANTU construye la presencia digital completa de un negocio — estrategia, branding, sitios web, contenido, SEO y crecimiento — desde un solo socio responsable.",
  nav: {
    items: [
      { label: "Filosofía", href: "#philosophy" },
      { label: "Qué hacemos", href: "#what-we-do" },
      { label: "Proceso", href: "#process" },
      { label: "Paquetes", href: "#packages" },
      { label: "Contacto", href: "#contact" },
    ],
    startProject: "Iniciar un proyecto",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },
  heroTicker: ["Estrategia", "Branding", "Sitios web", "Crecimiento"],
  hero: {
    supportingLine: "Tú traes la idea. Nosotros construimos todo alrededor de ella.",
  },
  philosophy: {
    eyebrow: "Filosofía",
    lines: ["Tú traes la idea.", "Nosotros construimos todo", "alrededor de ella."],
    body: "La mayoría de los negocios no fracasan porque la idea sea débil. Fracasan porque la presencia digital está dispersa: un freelancer aquí, una plantilla allá, nadie responsable del conjunto. RULANTU se convierte en el único socio responsable de toda tu presencia digital: estrategia, marca, sitio web, contenido, buscadores, crecimiento. Una sola visión. Nada se pierde en el camino.",
    tag: "Un socio. Una visión. Todo alrededor de ella.",
  },
  servicesIntro: {
    eyebrow: "Qué hacemos",
    title: ["Toda la", "presencia digital."],
    body: "Siete disciplinas, un solo equipo responsable. Recorre lo que RULANTU realmente hace, de principio a fin.",
  },
  services: [
    {
      index: "01",
      title: "Estrategia",
      description:
        "Entendemos el negocio, la audiencia, el panorama competitivo y los objetivos antes de mover un solo píxel.",
    },
    {
      index: "02",
      title: "Branding",
      description:
        "Creamos o afinamos la identidad visual, el tono de voz y la dirección creativa que tu negocio llevará a todas partes.",
    },
    {
      index: "03",
      title: "Diseño web",
      description:
        "Diseñamos la experiencia alrededor de usuarios reales y resultados reales — no una plantilla con tu logo encima.",
    },
    {
      index: "04",
      title: "Desarrollo",
      description:
        "Construimos sitios rápidos, responsivos y técnicamente excelentes, pensados para rendir — no solo para lucir bien en la demo.",
    },
    {
      index: "05",
      title: "Contenido",
      description:
        "Escribimos los mensajes, estructuramos las páginas y creamos las piezas visuales y los caminos de conversión que convierten visitas en decisiones.",
    },
    {
      index: "06",
      title: "SEO",
      description:
        "Integramos la visibilidad en buscadores en la arquitectura desde el primer día, para que el sitio se encuentre — no solo se admire.",
    },
    {
      index: "07",
      title: "Lanzamiento y crecimiento",
      description:
        "Publicamos, medimos, mejoramos y hacemos evolucionar la presencia digital mucho después del lanzamiento. El crecimiento es un proceso, no un evento.",
    },
  ],
  processIntro: {
    eyebrow: "Proceso",
    title: ["Cómo", "llegamos ahí."],
  },
  process: [
    {
      index: "01",
      title: "Entendemos.",
      description: "Negocio, audiencia, ambición. Empezamos escuchando.",
    },
    {
      index: "02",
      title: "Definimos.",
      description: "Posicionamiento, dirección, prioridades. Decidimos qué importa.",
    },
    {
      index: "03",
      title: "Diseñamos.",
      description: "Identidad y experiencia, construidas como un solo sistema coherente.",
    },
    {
      index: "04",
      title: "Construimos.",
      description: "Rápido, limpio, técnicamente excelente — hecho para durar.",
    },
    {
      index: "05",
      title: "Lanzamos.",
      description: "En vivo, indexado, medido — la presencia entra en acción.",
    },
    {
      index: "06",
      title: "Crecemos.",
      description: "Seguimos mejorando lo que el lanzamiento apenas empezó.",
    },
  ],
  packagesIntro: {
    eyebrow: "Paquetes",
    title: ["Tres direcciones.", "Un mismo objetivo: resultados."],
    body: "Son puntos de partida, no tarifas fijas — cada proyecto se dimensiona según el negocio que tenemos enfrente.",
    popularLabel: "Popular",
    talkPrefix: "Hablemos sobre",
  },
  packages: [
    {
      id: "start",
      name: "RULANTU START",
      tagline: "Una presencia digital que habla en serio.",
      description:
        "Para negocios que necesitan mostrarse en internet como se merecen: claro, creíble, rápido y construido para crecer.",
      includes: [
        "Dirección de marca y mensajes",
        "Diseño y desarrollo del sitio web",
        "Configuración de SEO base",
        "Lanzamiento en tu dominio",
      ],
    },
    {
      id: "grow",
      name: "RULANTU GROW",
      tagline: "Web, marca y visibilidad, trabajando juntas.",
      description:
        "Para negocios listos para competir: una identidad completa, un sitio bien pensado, y la estrategia y presencia en buscadores que lo respaldan.",
      includes: [
        "Todo lo de START",
        "Sistema completo de identidad de marca",
        "Estrategia de contenido y conversión",
        "Optimización continua de SEO y rendimiento",
      ],
      featured: true,
    },
    {
      id: "pro",
      name: "RULANTU PRO",
      tagline: "La operación digital completa.",
      description:
        "Para negocios que quieren un socio, no un proyecto: una experiencia digital completa con automatización, mantenimiento y crecimiento continuo.",
      includes: [
        "Todo lo de GROW",
        "Automatización e integraciones",
        "Mantenimiento e iteración continuos",
        "Revisiones de crecimiento trimestrales",
      ],
    },
  ],
  differentiation: {
    eyebrow: "No somos una agencia web más",
    title: "Una idea. Un socio. Todo alrededor de ella.",
    before: {
      label: "Lo habitual",
      items: [
        "Un diseñador para la imagen",
        "Un desarrollador para construirlo",
        "Un copywriter para los textos",
        "Un especialista en SEO para la visibilidad",
        "Una agencia de marketing para el crecimiento",
        "Tú, coordinando todo",
      ],
    },
    after: {
      label: "La forma RULANTU",
      items: ["RULANTU — un equipo, un proyecto, un resultado."],
    },
    body: "No deberías necesitar un project manager solo para tener un sitio web. RULANTU asume la responsabilidad de toda la presencia digital, para que puedas dirigir el negocio en lugar de coordinar agencias.",
  },
  cta: {
    eyebrow: "Hablemos",
    title: "Construyamos algo imposible de ignorar.",
    body: "Cuéntanos qué estás construyendo. Te contamos cómo lo haríamos imposible de pasar por alto.",
    primaryLabel: "Iniciar la conversación",
  },
  contactForm: {
    nameLabel: "Nombre",
    namePlaceholder: "Tu nombre",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "tu@empresa.com",
    messageLabel: "¿Qué estás construyendo?",
    messagePlaceholder: "Cuéntanos sobre el negocio y qué necesitas.",
    send: "Enviar",
    sending: "Enviando…",
    sentMessage: "Listo. Nos pondremos en contacto pronto.",
    errorPrefix: "Algo salió mal — escríbenos directamente a",
  },
  footer: {
    tagline: "Hacemos marcas imposibles de ignorar.",
    rights: "Todos los derechos reservados.",
    getInTouch: "Hablemos",
  },
  contact: {
    eyebrow: "Otras formas de escribirnos",
    whatsappLabel: "WhatsApp",
    instagramLabel: "Instagram",
    emailLabel: "Correo",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, es };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** `/` for the default locale, `/es` etc. for the rest — matches the
 * `[[...locale]]` route: English is unprefixed, other locales get a
 * leading path segment. */
export function localePath(locale: Locale): string {
  return locale === defaultLocale ? "/" : `/${locale}`;
}

/** Resolves the `[[...locale]]` catch-all's route param back to a Locale,
 * falling back to the default for `/` (where the param is undefined) or
 * any unrecognized segment. */
export function resolveLocale(segments?: string[]): Locale {
  const value = segments?.[0];
  return (locales as string[]).includes(value ?? "") ? (value as Locale) : defaultLocale;
}

/** Shared `generateStaticParams` for every file under `[[...locale]]` —
 * import and re-export as `generateStaticParams` from layout/page/metadata
 * route files so the whole segment's static params stay in one place. */
export function generateLocaleParams(): { locale: string[] }[] {
  return locales.map((locale) =>
    locale === defaultLocale ? { locale: [] } : { locale: [locale] }
  );
}
