"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/me", label: "Me" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
] as const;

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card text-foreground transition hover:bg-muted"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <MenuIcon />
      </button>

      {open ? (
        <div className="fixed inset-x-0 top-14 z-50 border-b border-border bg-background/95 backdrop-blur-md px-4 pb-4 pt-2">
          {links.map((l) => {
            const active =
              pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));

            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={
                  "block rounded-lg px-4 py-3 text-base font-medium transition hover:bg-muted " +
                  (active ? "bg-muted text-foreground" : "text-muted-foreground")
                }
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
