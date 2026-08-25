import { ImageResponse } from "next/og";
import { getDictionary, defaultLocale } from "@/data/content";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A single shared OG image (Next's optional catch-all for [[...locale]] must
// be the last path segment, so a per-locale image route isn't possible here).
const dict = getDictionary(defaultLocale);

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0D0D0E",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#8C8578",
            fontFamily: "monospace",
          }}
        >
          {dict.heroTicker.join(" · ")}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 150,
              fontWeight: 800,
              color: "#F4F1EA",
              letterSpacing: -4,
              lineHeight: 1,
            }}
          >
            {dict.brand.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 46,
              fontWeight: 600,
              color: "#FF3C1F",
              letterSpacing: -1,
            }}
          >
            {dict.brand.claim}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
