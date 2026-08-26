"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

type Node = { x: number; y: number; vx: number; vy: number };
type Pulse = { a: number; b: number; t: number; speed: number; delay: number };

const MAX_DIST = 190;
const MOUSE_RADIUS = 170;
const PULSE_COUNT = 5;

/**
 * The Hero's living background: a generative field of nodes connected by
 * right-angle circuit traces (not straight diagonals — the elbow bend is
 * what keeps this reading as "circuit" rather than a generic "AI network"
 * particle graphic). Nodes drift slowly, the cursor disturbs the field
 * within a radius, and a handful of signal pulses continuously travel
 * along active connections. One canvas, no dependencies.
 *
 * Desktop + fine-pointer only (see the className on the wrapping element
 * in Hero.tsx). Reduced motion: draws one static frame — no drift, no
 * cursor reaction, no pulses — rather than nothing at all.
 */
export default function HeroCircuitField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let raf = 0;
    let mouseX = -9999;
    let mouseY = -9999;

    const style = getComputedStyle(document.documentElement);
    const paperRGB = "244, 241, 234";
    const signalRGB = hexToRgb(style.getPropertyValue("--signal").trim()) ?? "255, 90, 31";

    function hexToRgb(hex: string) {
      const m = hex.replace("#", "");
      if (m.length !== 6) return null;
      const r = parseInt(m.slice(0, 2), 16);
      const g = parseInt(m.slice(2, 4), 16);
      const b = parseInt(m.slice(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initNodes() {
      const density = 16000;
      const count = Math.max(28, Math.min(64, Math.floor((width * height) / density)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
      }));
      pulses = Array.from({ length: PULSE_COUNT }, () => spawnPulse());
    }

    function spawnPulse(): Pulse {
      const a = Math.floor(Math.random() * nodes.length);
      return { a, b: a, t: 0, speed: 0.006 + Math.random() * 0.008, delay: Math.random() * 200 };
    }

    // Deterministic elbow choice so the bend doesn't flicker as nodes drift.
    function elbow(i: number, j: number, x1: number, y1: number, x2: number, y2: number) {
      return (i + j) % 2 === 0 ? { ex: x2, ey: y1 } : { ex: x1, ey: y2 };
    }

    function pointOnPath(x1: number, y1: number, x2: number, y2: number, ex: number, ey: number, t: number) {
      const d1 = Math.hypot(ex - x1, ey - y1);
      const d2 = Math.hypot(x2 - ex, y2 - ey);
      const total = d1 + d2 || 1;
      const dist = t * total;
      if (dist <= d1) {
        const p = d1 === 0 ? 0 : dist / d1;
        return { x: x1 + (ex - x1) * p, y: y1 + (ey - y1) * p };
      }
      const p = d2 === 0 ? 0 : (dist - d1) / d2;
      return { x: ex + (x2 - ex) * p, y: ey + (y2 - ey) * p };
    }

    function frame() {
      ctx!.clearRect(0, 0, width, height);

      if (!reduced) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
          n.x = Math.max(0, Math.min(width, n.x));
          n.y = Math.max(0, Math.min(height, n.y));

          const dx = n.x - mouseX;
          const dy = n.y - mouseY;
          const d = Math.hypot(dx, dy);
          if (d < MOUSE_RADIUS && d > 0.01) {
            const force = (1 - d / MOUSE_RADIUS) * 0.28;
            n.x += (dx / d) * force;
            n.y += (dy / d) * force;
          }
        }
      }

      // connections
      const active: { i: number; j: number; x1: number; y1: number; x2: number; y2: number; ex: number; ey: number; alpha: number }[] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist > MAX_DIST) continue;

          const { ex, ey } = elbow(i, j, a.x, a.y, b.x, b.y);
          const midDist = Math.min(Math.hypot(ex - mouseX, ey - mouseY), Math.hypot(a.x - mouseX, a.y - mouseY));
          const proximity = reduced ? 0 : Math.max(0, 1 - midDist / MOUSE_RADIUS);
          const base = (1 - dist / MAX_DIST) * 0.14;
          const alpha = base + proximity * 0.35;

          ctx!.strokeStyle = `rgba(${paperRGB}, ${alpha.toFixed(3)})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(ex, ey);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();

          active.push({ i, j, x1: a.x, y1: a.y, x2: b.x, y2: b.y, ex, ey, alpha });
        }
      }

      // nodes
      for (const n of nodes) {
        ctx!.fillStyle = `rgba(${paperRGB}, 0.35)`;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx!.fill();
      }

      // traveling signal pulses, riding whichever active connections they're assigned to
      if (!reduced && active.length > 0) {
        for (const p of pulses) {
          if (p.delay > 0) {
            p.delay -= 1;
            continue;
          }
          const conn = active.find((c) => c.i === p.a && c.j === p.b) ?? active[Math.floor(Math.random() * active.length)];
          p.a = conn.i;
          p.b = conn.j;
          p.t += p.speed;
          if (p.t >= 1) {
            Object.assign(p, spawnPulse());
            continue;
          }
          const pt = pointOnPath(conn.x1, conn.y1, conn.x2, conn.y2, conn.ex, conn.ey, p.t);
          const glowAlpha = Math.sin(p.t * Math.PI);
          ctx!.fillStyle = `rgba(${signalRGB}, ${(glowAlpha * 0.9).toFixed(3)})`;
          ctx!.beginPath();
          ctx!.arc(pt.x, pt.y, 2.2, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      if (!reduced) raf = requestAnimationFrame(frame);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }

    function onResize() {
      resize();
      initNodes();
    }

    resize();
    initNodes();
    frame();

    if (!reduced) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}
