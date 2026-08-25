import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page not found — RULANTU",
  robots: { index: false, follow: false },
};

// This route sits outside [[...locale]] (Next resolves /_not-found at the
// true root), so it doesn't inherit that segment's layout. It must NOT
// render its own <html>/<body> — Next already synthesizes a minimal shell
// for this route (there's no top-level app/layout.tsx, deliberately, so
// [[...locale]]/layout.tsx can set <html lang> per locale) and nesting a
// second <html> here would produce invalid, broken markup.
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-ink text-paper text-center px-6">
      <p className="eyebrow text-stone">404</p>
      <h1 className="font-display text-4xl font-bold">Page not found.</h1>
      <p className="text-stone max-w-sm">
        The page you&rsquo;re looking for doesn&rsquo;t exist — or moved.
      </p>
      <Link href="/" className="mt-2 text-signal font-medium underline">
        Back to RULANTU
      </Link>
    </div>
  );
}
