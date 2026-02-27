"use client";

import { useEffect, useRef, useState } from "react";

interface MouseParallaxProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees (default 6) */
  intensity?: number;
}

export function MouseParallax({
  children,
  className,
  intensity = 6,
}: MouseParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({ rotateX: 0, rotateY: 0 });
  useEffect(() => {
    // Skip on touch-only devices or reduced motion
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(hover: none)").matches
    ) return;

    const el = containerRef.current;
    if (!el) return;

    let rafId: number | undefined;
    const target = { rotateX: 0, rotateY: 0 };
    const current = { rotateX: 0, rotateY: 0 };

    function animate() {
      const lerp = 0.08;

      current.rotateX += (target.rotateX - current.rotateX) * lerp;
      current.rotateY += (target.rotateY - current.rotateY) * lerp;

      if (
        Math.abs(target.rotateX - current.rotateX) > 0.01 ||
        Math.abs(target.rotateY - current.rotateY) > 0.01
      ) {
        setStyle({ rotateX: current.rotateX, rotateY: current.rotateY });
        rafId = requestAnimationFrame(animate);
      } else {
        current.rotateX = target.rotateX;
        current.rotateY = target.rotateY;
        setStyle({ rotateX: current.rotateX, rotateY: current.rotateY });
        rafId = undefined;
      }
    }

    function handleMouseMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (e.clientX - centerX) / (rect.width / 2); // -1 to 1
      const y = (e.clientY - centerY) / (rect.height / 2); // -1 to 1

      target.rotateX = -y * intensity;
      target.rotateY = x * intensity;

      if (rafId === undefined) {
        rafId = requestAnimationFrame(animate);
      }
    }

    function handleMouseLeave() {
      target.rotateX = 0;
      target.rotateY = 0;
      if (rafId === undefined) {
        rafId = requestAnimationFrame(animate);
      }
    }

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId !== undefined) cancelAnimationFrame(rafId);
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        perspective: "800px",
      }}
    >
      <div
        style={{
          transform: `rotateX(${style.rotateX}deg) rotateY(${style.rotateY}deg)`,
          transition: "transform 0.1s ease-out",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
