"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Drives Lenis inertia scrolling and keeps ScrollTrigger in sync with it.
 * Renders nothing — purely a side-effect provider mounted once in the layout.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = getGsap();
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(() => {});
    };
  }, []);

  return null;
}
