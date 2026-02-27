import Link from "next/link";

import { Container } from "@/components/container";
import { MobileNav } from "@/components/mobile-nav";
import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 min-w-0 items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold tracking-tight">
            {site.name}
          </Link>
          <div className="hidden md:block">
            <NavLinks />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MobileNav />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
