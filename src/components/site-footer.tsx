import { Container } from "@/components/container";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-3 py-12 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          <a className="transition hover:text-foreground" href={site.links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="transition hover:text-foreground" href={site.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="transition hover:text-foreground" href={site.links.email}>
            Email
          </a>
        </div>
      </Container>
    </footer>
  );
}
