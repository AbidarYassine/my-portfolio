"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const ANIM_MS = 420;

export function RotatingText({
  items,
  intervalMs = 2600,
  className,
}: {
  items: readonly string[];
  intervalMs?: number;
  className?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);

  const currentRef = useRef(0);

  useEffect(() => {
    currentRef.current = currentIndex;
  }, [currentIndex]);

  const widest = useMemo(() => {
    let best = "";
    for (const s of items) if (s.length > best.length) best = s;
    return best;
  }, [items]);

  useEffect(() => {
    if (items.length <= 1) return;

    // Respect reduced motion.
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const id = window.setInterval(() => {
      setNextIndex((existing) => {
        if (existing !== null) return existing;
        return (currentRef.current + 1) % items.length;
      });
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [intervalMs, items.length]);

  useEffect(() => {
    if (nextIndex === null) return;

    const t = window.setTimeout(() => {
      setCurrentIndex(nextIndex);
      setNextIndex(null);
    }, ANIM_MS);

    return () => window.clearTimeout(t);
  }, [nextIndex]);

  const current = items[currentIndex] ?? "";
  const next = nextIndex === null ? null : (items[nextIndex] ?? "");

  return (
    <span
      className={
        "relative inline-block max-w-full align-baseline whitespace-normal break-words " +
        (className ?? "")
      }
    >
      {/* Layout stabilizer (prevents width jumps). */}
      <span aria-hidden className="invisible block max-w-full whitespace-normal break-words">
        {widest}
      </span>

      <span className="absolute inset-0 block max-w-full whitespace-normal break-words">
        <span className={next ? "block animate-rise-out" : "block"}>{current}</span>

        {next ? (
          <span className="absolute inset-0 block animate-rise-in">{next}</span>
        ) : null}
      </span>
    </span>
  );
}
