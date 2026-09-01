// Sits in front of the static assets for three reasons: redirect
// www.rulantu.com to the apex domain, hold the /api/contact endpoint that
// sends the contact form via Resend, and /api/chat, a small assistant
// running on Workers AI. Everything else falls straight through to the
// static export. This is the entirety of the "backend" — stateless, no
// database, three routes.
//
// Note: the www redirect can't be exercised via `wrangler dev` locally —
// with multiple custom_domain routes configured, the local simulator pins
// the Host header to the first route regardless of what the client sends.
// Production edge routing sets it correctly per the domain actually hit.

const FROM = "RULANTU <hello@rulantu.com>";
const TO = "support@rulantu.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CHAT_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";

const SYSTEM_PROMPT = `You are the website assistant for RULANTU (rulantu.com), a digital agency whose claim is "We make brands impossible to ignore." RULANTU builds a business's entire digital presence as one accountable partner — strategy, branding, web design, development, content, SEO, and launch & growth — so the client isn't coordinating a designer, developer, copywriter, SEO specialist and marketing agency separately. Core line: "You bring the idea. We build everything around it."

Services: Strategy, Branding, Web Design, Development, Content, SEO, Launch & Growth.
Process: We understand -> We define -> We design -> We build -> We launch -> We grow.

Packages (starting points, not fixed prices — always scoped to the actual business):
- RULANTU START: a digital presence that means business. Brand direction & messaging, website design & development, foundational SEO, launch on your domain.
- RULANTU GROW (most popular): web, brand and visibility working together. Everything in START, plus a full brand identity system, content & conversion strategy, ongoing SEO & performance tuning.
- RULANTU PRO: the complete digital operation. Everything in GROW, plus automation & integrations, ongoing maintenance & iteration, quarterly growth reviews.

Other ways to reach RULANTU: book a call (https://cal.com/rulantu-kibqiw/15min), WhatsApp, Instagram (@rulantu_com), or the contact form on this page.

Answer questions about RULANTU's services, process and packages using only the facts above. Never invent a specific price, timeline, or commitment — for those, or anything needing a real conversation, point them to booking a call or the contact form. Be confident, human, concise — a few sentences, not an essay. No corporate filler. Reply in whichever language the visitor writes in (English or Spanish).`;

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = request.headers.get("host") || "";

    if (host.toLowerCase() === "www.rulantu.com") {
      url.protocol = "https:";
      url.hostname = "rulantu.com";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return json({ ok: false, error: "method_not_allowed" }, 405);
      }
      return handleContact(request, env);
    }

    if (url.pathname === "/api/chat") {
      if (request.method !== "POST") {
        return json({ ok: false, error: "method_not_allowed" }, 405);
      }
      return handleChat(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_body" }, 400);
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return json({ ok: false, error: "missing_fields" }, 400);
  }
  if (!EMAIL_RE.test(email) || name.length > 200 || message.length > 5000) {
    return json({ ok: false, error: "invalid_input" }, 400);
  }

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: TO,
      reply_to: email,
      subject: `New project inquiry from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });

  if (!resendRes.ok) {
    return json({ ok: false, error: "send_failed" }, 502);
  }

  return json({ ok: true });
}

async function handleChat(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_body" }, 400);
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  // Keep only the last few turns and cap message length — this is a
  // free-tier inference budget (10k neurons/day), not a reason to let
  // someone script an essay-length conversation through it.
  const messages = incoming
    .slice(-8)
    .map((m) => ({
      role: m && m.role === "assistant" ? "assistant" : "user",
      content: typeof (m && m.content) === "string" ? m.content.trim().slice(0, 600) : "",
    }))
    .filter((m) => m.content.length > 0);

  if (messages.length === 0) {
    return json({ ok: false, error: "empty" }, 400);
  }

  try {
    const result = await env.AI.run(CHAT_MODEL, {
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 300,
      temperature: 0.4,
    });

    const reply = typeof result?.response === "string" ? result.response.trim() : "";
    if (!reply) {
      return json({ ok: false, error: "empty_response" }, 502);
    }
    return json({ ok: true, reply });
  } catch {
    return json({ ok: false, error: "ai_failed" }, 502);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default worker;
