"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  /** How strongly the button pulls toward cursor (default 0.35) */
  strength?: number;
  /** Activation radius in pixels (default 80) */
  radius?: number;
}

export function MagneticButton({
  children,
  className,
  strength = 0.35,
  radius = 80,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const disabled = useRef(false);

  useEffect(() => {
    disabled.current =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(hover: none)").matches;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (disabled.current) return;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        setOffset({ x: dx * strength, y: dy * strength });
      }
    },
    [strength, radius]
  );

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: offset.x === 0 && offset.y === 0
          ? "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
          : "transform 0.15s ease-out",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
