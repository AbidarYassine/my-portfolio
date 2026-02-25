import Link from "next/link";

import { Container } from "@/components/container";
import { RotatingText } from "@/components/rotating-text";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 2);
  const featuredProjects = projects.slice(0, 2);

  return (
    <>
      <section className="border-b border-border">
        <Container className="py-12 sm:py-16">
          <div className="space-y-6">
            <h1 className="flex min-w-0 flex-col items-start gap-3 text-4xl font-semibold tracking-tight sm:flex-row sm:items-center sm:gap-x-3 sm:gap-y-2 md:text-5xl">
              <span className="min-w-0 wrap-break-word">{site.name}</span>
              <span className="inline-flex max-w-full items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium leading-tight text-muted-foreground sm:text-sm">
                <RotatingText items={site.roles} />
              </span>

            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {site.headline}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/projects"
                className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 text-sm font-medium text-accent-foreground transition hover:opacity-90"
              >
                View projects
              </Link>
              <Link
                href="/me"
                className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-card px-5 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                About me
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              Want to customize quickly? Update <code>src/lib/site.ts</code>.
            </p>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-12 sm:py-16">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-5">
              <div className="flex items-end justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Featured projects</h2>
                <Link
                  href="/projects"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  All projects
                </Link>
              </div>

              <div className="space-y-4">
                {featuredProjects.map((p) => (
                  <div
                    key={p.name}
                    className="rounded-xl border border-border bg-card p-5 transition hover:bg-muted"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-base font-semibold tracking-tight">
                          {p.name}
                        </h3>
                        {p.href ? (
                          <a
                            href={p.href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-muted-foreground hover:text-foreground"
                          >
                            Link
                          </a>
                        ) : null}
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {p.description}
                      </p>
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

            <div className="space-y-5">
              <div className="flex items-end justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Latest writing</h2>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  All posts
                </Link>
              </div>

              <div className="space-y-4">
                {latestPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="block rounded-xl border border-border bg-card p-5 transition hover:bg-muted"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-base font-semibold tracking-tight">{p.title}</h3>
                        {p.description ? (
                          <p className="text-sm text-muted-foreground">{p.description}</p>
                        ) : null}
                      </div>
                      {p.date ? (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatDate(p.date)}
                        </span>
                      ) : null}
                    </div>
                  </Link>
                ))}

                {latestPosts.length === 0 ? (
                  <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
                    Add markdown posts in <code>content/blog</code>.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
