import { Container } from "@/components/container";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-2 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a className="hover:text-foreground" href={site.links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="hover:text-foreground" href={site.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="hover:text-foreground" href={site.links.email}>
            Email
          </a>
        </div>
      </Container>
    </footer>
  );
}
