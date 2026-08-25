// Sits in front of the static assets for exactly one reason: redirect
// www.rulantu.com to the apex domain (canonical, avoids duplicate-content
// SEO). Everything else falls straight through to the static export — this
// is not a backend, there's no state, no logic beyond a hostname check.
//
// Note: this branch can't be exercised via `wrangler dev` locally — with
// multiple custom_domain routes configured, the local simulator pins the
// Host header to the first route regardless of what the client sends.
// Production edge routing sets it correctly per the domain actually hit.
const worker = {
  async fetch(request, env) {
    const host = request.headers.get("host") || "";

    if (host.toLowerCase() === "www.rulantu.com") {
      const url = new URL(request.url);
      url.protocol = "https:";
      url.hostname = "rulantu.com";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};

export default worker;
