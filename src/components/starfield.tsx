"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  twinkleSpeed: number;
  phase: number;
  hasGlow: boolean;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  vx: number;
  vy: number;
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animationId: number;
    let stars: Star[] = [];
    let particles: Particle[] = [];

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = canvas!.offsetWidth * dpr;
      canvas!.height = canvas!.offsetHeight * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    }

    function init() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      const isMobile = w < 640;
      const starCount = isMobile ? 45 : 70;
      const particleCount = isMobile ? 6 : 12;

      stars = Array.from({ length: starCount }, () => {
        const hasGlow = Math.random() < 0.2; // 20% of stars get a soft glow halo
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          radius: hasGlow ? Math.random() * 2.5 + 1.5 : Math.random() * 2 + 0.6,
          baseOpacity: Math.random() * 0.5 + 0.2,
          twinkleSpeed: Math.random() * 0.6 + 0.2,
          phase: Math.random() * Math.PI * 2,
          hasGlow,
        };
      });

      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 2.5 + 2,
        opacity: Math.random() * 0.2 + 0.08,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.15,
      }));
    }

    function draw(time: number) {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      ctx!.clearRect(0, 0, w, h);

      const isDark = document.documentElement.classList.contains("dark");

      // Stars
      for (const star of stars) {
        const twinkle = prefersReducedMotion
          ? star.baseOpacity
          : star.baseOpacity *
            (0.4 + 0.6 * ((Math.sin(time * 0.001 * star.twinkleSpeed + star.phase) + 1) / 2));

        // Glow halo for brighter stars
        if (star.hasGlow && twinkle > 0.2) {
          const gradient = ctx!.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.radius * 6
          );
          if (isDark) {
            gradient.addColorStop(0, `rgba(180, 200, 255, ${twinkle * 0.4})`);
            gradient.addColorStop(1, "rgba(180, 200, 255, 0)");
          } else {
            gradient.addColorStop(0, `rgba(60, 80, 120, ${twinkle * 0.2})`);
            gradient.addColorStop(1, "rgba(60, 80, 120, 0)");
          }
          ctx!.beginPath();
          ctx!.arc(star.x, star.y, star.radius * 6, 0, Math.PI * 2);
          ctx!.fillStyle = gradient;
          ctx!.fill();
        }

        // Star dot
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        if (isDark) {
          ctx!.fillStyle = `rgba(220, 230, 255, ${twinkle})`;
        } else {
          ctx!.fillStyle = `rgba(40, 50, 80, ${twinkle * 0.6})`;
        }
        ctx!.fill();
      }

      // Floating particles — very subtle, slow drift
      for (const p of particles) {
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
        }

        const gradient = ctx!.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.radius * 4
        );
        if (isDark) {
          gradient.addColorStop(0, `rgba(160, 180, 255, ${p.opacity})`);
          gradient.addColorStop(1, "rgba(160, 180, 255, 0)");
        } else {
          gradient.addColorStop(0, `rgba(80, 100, 140, ${p.opacity * 0.5})`);
          gradient.addColorStop(1, "rgba(80, 100, 140, 0)");
        }
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx!.fillStyle = gradient;
        ctx!.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    animationId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
