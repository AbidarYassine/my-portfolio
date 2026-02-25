"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/me", label: "Me" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
] as const;

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 text-sm">
      {links.map((l) => {
        const active = pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));

        return (
          <Link
            key={l.href}
            href={l.href}
            className={
              "rounded-md px-3 py-2 transition hover:bg-muted " +
              (active ? "bg-muted text-foreground" : "text-muted-foreground")
            }
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
