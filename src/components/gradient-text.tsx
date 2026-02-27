"use client";

import { useSyncExternalStore } from "react";

interface GradientTextProps {
  text: string;
  className?: string;
  /** Delay before the text fades in (ms) */
  delay?: number;
}

export function GradientText({
  text,
  className,
  delay = 0,
}: GradientTextProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <span
      className={className}
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      <span
        className="gradient-sweep"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--muted-foreground) 0%, var(--foreground) 30%, var(--foreground) 50%, var(--muted-foreground) 70%, var(--muted-foreground) 100%)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animationName: mounted ? "gradient-sweep" : "none",
          animationDuration: "4s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          animationDelay: `${delay + 600}ms`,
        }}
      >
        {text}
      </span>
    </span>
  );
}
