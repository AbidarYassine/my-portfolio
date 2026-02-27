"use client";

import { useSyncExternalStore } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
  /** Delay between each character in ms (default 40) */
  charDelay?: number;
  /** Initial delay before animation starts in ms (default 0) */
  startDelay?: number;
}

export function TextReveal({
  text,
  className,
  charDelay = 40,
  startDelay = 0,
}: TextRevealProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={`${i}-${char}`}
          aria-hidden
          className="inline-block"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            filter: mounted ? "blur(0px)" : "blur(4px)",
            transition: `opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease`,
            transitionDelay: `${startDelay + i * charDelay}ms`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
