"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  twinkleSpeed: number;
  phase: number;
}

interface Blob {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  baseX: number;
  baseY: number;
  radius: number;
  color: [number, number, number];
  colorDark: [number, number, number];
  phase: number;
  speed: number;
  orbitRadius: number;
}

export function AuroraBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsCanvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const starsCanvas = starsCanvasRef.current;
    const starsCtx = starsCanvas?.getContext("2d");

    let animationId: number;
    let blobs: Blob[] = [];
    let stars: Star[] = [];

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = canvas!.offsetWidth * dpr;
      canvas!.height = canvas!.offsetHeight * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (starsCanvas && starsCtx) {
        starsCanvas.width = starsCanvas.offsetWidth * dpr;
        starsCanvas.height = starsCanvas.offsetHeight * dpr;
        starsCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      initBlobs();
      initStars();
    }

    function initBlobs() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;

      const configs: Array<{
        color: [number, number, number];
        colorDark: [number, number, number];
        radiusFactor: number;
        cx: number;
        cy: number;
        orbitRadius: number;
      }> = [
        {
          color: [120, 140, 255],
          colorDark: [80, 100, 255],
          radiusFactor: 0.25,
          cx: 0.3,
          cy: 0.3,
          orbitRadius: 80,
        },
        {
          color: [200, 130, 255],
          colorDark: [160, 80, 255],
          radiusFactor: 0.2,
          cx: 0.7,
          cy: 0.4,
          orbitRadius: 60,
        },
        {
          color: [100, 200, 255],
          colorDark: [60, 160, 255],
          radiusFactor: 0.22,
          cx: 0.5,
          cy: 0.7,
          orbitRadius: 70,
        },
        {
          color: [255, 160, 200],
          colorDark: [255, 100, 180],
          radiusFactor: 0.18,
          cx: 0.2,
          cy: 0.6,
          orbitRadius: 50,
        },
        {
          color: [160, 220, 180],
          colorDark: [100, 200, 160],
          radiusFactor: 0.15,
          cx: 0.8,
          cy: 0.25,
          orbitRadius: 55,
        },
      ];

      blobs = configs.map((c, i) => ({
        x: w * c.cx,
        y: h * c.cy,
        targetX: w * c.cx,
        targetY: h * c.cy,
        baseX: w * c.cx,
        baseY: h * c.cy,
        radius: Math.min(w, h) * c.radiusFactor,
        color: c.color,
        colorDark: c.colorDark,
        phase: (i * Math.PI * 2) / configs.length,
        speed: 0.3 + i * 0.08,
        orbitRadius: c.orbitRadius,
      }));
    }

    function initStars() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      const isMobile = w < 640;
      const count = isMobile ? 40 : 80;

      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 1.4 + 0.4,
        baseOpacity: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.8 + 0.3,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function setMousePos(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
        active: true,
      };
    }

    function handleMouseMove(e: MouseEvent) {
      setMousePos(e.clientX, e.clientY);
    }

    function handleTouchMove(e: TouchEvent) {
      const touch = e.touches[0];
      if (touch) setMousePos(touch.clientX, touch.clientY);
    }

    function handlePointerLeave() {
      mouseRef.current.active = false;
    }

    function draw(time: number) {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      ctx!.clearRect(0, 0, w, h);

      const isDark = document.documentElement.classList.contains("dark");
      const t = time * 0.001;
      const mouse = mouseRef.current;

      for (const blob of blobs) {
        // Organic orbit movement
        const orbitX = Math.cos(t * blob.speed + blob.phase) * blob.orbitRadius;
        const orbitY = Math.sin(t * blob.speed * 0.7 + blob.phase) * blob.orbitRadius * 0.6;

        blob.targetX = blob.baseX + orbitX;
        blob.targetY = blob.baseY + orbitY;

        // Mouse attraction
        if (mouse.active && !prefersReducedMotion) {
          const dx = mouse.x - blob.targetX;
          const dy = mouse.y - blob.targetY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 300;
          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 0.4;
            blob.targetX += dx * force;
            blob.targetY += dy * force;
          }
        }

        // Smooth interpolation
        const lerp = prefersReducedMotion ? 1 : 0.03;
        blob.x += (blob.targetX - blob.x) * lerp;
        blob.y += (blob.targetY - blob.y) * lerp;

        // Draw blob with radial gradient
        const [r, g, b] = isDark ? blob.colorDark : blob.color;
        const alpha = isDark ? 0.25 : 0.15;

        const gradient = ctx!.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius
        );
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
        gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx!.beginPath();
        ctx!.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx!.fillStyle = gradient;
        ctx!.fill();
      }

      // Draw stars on the unblurred canvas
      if (starsCtx && starsCanvas) {
        const sw = starsCanvas.offsetWidth;
        const sh = starsCanvas.offsetHeight;
        starsCtx.clearRect(0, 0, sw, sh);

        for (const star of stars) {
          const twinkle = prefersReducedMotion
            ? star.baseOpacity
            : star.baseOpacity *
              (0.3 + 0.7 * ((Math.sin(t * star.twinkleSpeed + star.phase) + 1) / 2));

          starsCtx.beginPath();
          starsCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          starsCtx.fillStyle = isDark
            ? `rgba(220, 230, 255, ${twinkle})`
            : `rgba(60, 70, 110, ${twinkle * 0.5})`;
          starsCtx.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    animationId = requestAnimationFrame(draw);

    const parentEl = canvas.parentElement;
    parentEl?.addEventListener("mousemove", handleMouseMove);
    parentEl?.addEventListener("mouseleave", handlePointerLeave);
    parentEl?.addEventListener("touchmove", handleTouchMove, { passive: true });
    parentEl?.addEventListener("touchend", handlePointerLeave);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      parentEl?.removeEventListener("mousemove", handleMouseMove);
      parentEl?.removeEventListener("mouseleave", handlePointerLeave);
      parentEl?.removeEventListener("touchmove", handleTouchMove);
      parentEl?.removeEventListener("touchend", handlePointerLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ filter: "blur(60px)" }}
        aria-hidden="true"
      />
      <canvas
        ref={starsCanvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
    </>
  );
}
