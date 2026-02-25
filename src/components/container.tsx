import type { ReactNode } from "react";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "mx-auto w-full max-w-5xl min-w-0 px-4 sm:px-6 " + (className ?? "")
      }
    >
      {children}
    </div>
  );
}
