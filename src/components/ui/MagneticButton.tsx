"use client";

import { useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  cursorState?: "link" | "drag";
  external?: boolean;
};

/**
 * A link whose visual body is pulled toward the cursor within a radius,
 * and springs back on leave. Strength is deliberately restrained — this is
 * a nudge, not a chase.
 */
export default function MagneticButton({
  href,
  children,
  className = "",
  cursorState = "link",
  external = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${relX * 0.35}px, ${relY * 0.35}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  };

  return (
    <a
      ref={ref}
      href={href}
      data-cursor={cursorState}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      {children}
    </a>
  );
}
