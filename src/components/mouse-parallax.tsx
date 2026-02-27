"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  const rafRef = useRef<number | undefined>(undefined);
  const targetRef = useRef({ rotateX: 0, rotateY: 0 });
  const currentRef = useRef({ rotateX: 0, rotateY: 0 });

  const animate = useCallback(() => {
    const cur = currentRef.current;
    const tgt = targetRef.current;
    const lerp = 0.08;

    cur.rotateX += (tgt.rotateX - cur.rotateX) * lerp;
    cur.rotateY += (tgt.rotateY - cur.rotateY) * lerp;

    if (
      Math.abs(tgt.rotateX - cur.rotateX) > 0.01 ||
      Math.abs(tgt.rotateY - cur.rotateY) > 0.01
    ) {
      setStyle({ rotateX: cur.rotateX, rotateY: cur.rotateY });
      rafRef.current = requestAnimationFrame(animate);
    } else {
      cur.rotateX = tgt.rotateX;
      cur.rotateY = tgt.rotateY;
      setStyle({ rotateX: cur.rotateX, rotateY: cur.rotateY });
    }
  }, []);

  useEffect(() => {
    // Skip on touch-only devices or reduced motion
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(hover: none)").matches
    ) return;

    const el = containerRef.current;
    if (!el) return;

    function handleMouseMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (e.clientX - centerX) / (rect.width / 2); // -1 to 1
      const y = (e.clientY - centerY) / (rect.height / 2); // -1 to 1

      targetRef.current = {
        rotateX: -y * intensity,
        rotateY: x * intensity,
      };

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    function handleMouseLeave() {
      targetRef.current = { rotateX: 0, rotateY: 0 };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate, intensity]);

  // Clear raf ref after each frame so next mousemove can restart
  useEffect(() => {
    rafRef.current = undefined;
  });

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
