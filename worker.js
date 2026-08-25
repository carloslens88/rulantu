// Sits in front of the static assets for two reasons: redirect
// www.rulantu.com to the apex domain, and hold the /api/contact endpoint
// that sends the contact form via Resend. Everything else falls straight
// through to the static export. This is the entirety of the "backend" —
// stateless, no database, two routes.
//
// Note: the www redirect can't be exercised via `wrangler dev` locally —
// with multiple custom_domain routes configured, the local simulator pins
// the Host header to the first route regardless of what the client sends.
// Production edge routing sets it correctly per the domain actually hit.

const FROM = "RULANTU <hello@rulantu.com>";
const TO = "support@rulantu.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default worker;
