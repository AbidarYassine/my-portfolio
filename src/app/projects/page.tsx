import Link from "next/link";

import { Container } from "@/components/container";
import { projects } from "@/lib/projects";

export default function ProjectsPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="max-w-2xl text-muted-foreground">
            A few things I’ve built.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <div
              key={p.name}
              className="rounded-xl border border-border bg-card p-5 transition hover:bg-muted"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold tracking-tight">{p.name}</h2>
                  <p className="text-sm leading-6 text-muted-foreground">{p.description}</p>
                </div>
                {p.href ? (
                  <Link
                    href={p.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Link
                  </Link>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
