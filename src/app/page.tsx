import Link from "next/link";

import { Container } from "@/components/container";
import { RotatingText } from "@/components/rotating-text";
import { ScrollFade } from "@/components/scroll-fade";
import { Starfield } from "@/components/starfield";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 2);
  const featuredProjects = projects.slice(0, 2);

  return (
    <>
      <section className="relative overflow-hidden">
        <Starfield />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.03)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.03)_0%,transparent_50%)]" />
        <Container className="relative flex min-h-[60vh] items-center justify-center py-24 sm:py-32">
          <div className="space-y-6 text-center">
            <h1
              className="animate-fade-in-up flex min-w-0 flex-col items-center gap-4 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl"
              style={{ "--delay": "0ms" } as React.CSSProperties}
            >
              <span className="animate-glow min-w-0 wrap-break-word">{site.name}</span>
              <span className="inline-flex max-w-full items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium leading-tight text-muted-foreground sm:text-base">
                <RotatingText items={site.roles} />
              </span>
            </h1>

            <p
              className="animate-fade-in-up mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
              style={{ "--delay": "100ms" } as React.CSSProperties}
            >
              {site.headline}
            </p>

            <div
              className="animate-fade-in-up flex flex-col items-center justify-center gap-3 sm:flex-row"
              style={{ "--delay": "200ms" } as React.CSSProperties}
            >
              <Link
                href="/projects"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-accent px-6 text-sm font-medium text-accent-foreground shadow-sm transition hover:opacity-90"
              >
                View projects
              </Link>
              <Link
                href="/me"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                About me
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-12 sm:py-16">
          <div className="grid gap-12 md:grid-cols-2">
            <ScrollFade>
              <div className="space-y-5">
                <div className="flex items-end justify-between">
                  <h2 className="text-xl font-semibold tracking-tight">Featured projects</h2>
                  <Link
                    href="/projects"
                    className="group flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    All projects
                    <span className="inline-block transition-transform group-hover:translate-x-0.5">&rarr;</span>
                  </Link>
                </div>

                <div className="space-y-4">
                  {featuredProjects.map((p) => (
                    <div
                      key={p.name}
                      className="rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20"
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
                              className="group flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
                            >
                              Visit
                              <svg className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" /></svg>
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
            </ScrollFade>

            <ScrollFade delay={100}>
              <div className="space-y-5">
                <div className="flex items-end justify-between">
                  <h2 className="text-xl font-semibold tracking-tight">Latest writing</h2>
                  <Link
                    href="/blog"
                    className="group flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    All posts
                    <span className="inline-block transition-transform group-hover:translate-x-0.5">&rarr;</span>
                  </Link>
                </div>

                <div className="space-y-4">
                  {latestPosts.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="group block rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-base font-semibold tracking-tight">{p.title}</h3>
                          {p.description ? (
                            <p className="text-sm text-muted-foreground">{p.description}</p>
                          ) : null}
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {p.date ? (
                            <span className="text-xs text-muted-foreground">
                              {formatDate(p.date)}
                            </span>
                          ) : null}
                          <span className="text-muted-foreground transition-transform group-hover:translate-x-0.5">&rarr;</span>
                        </div>
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
            </ScrollFade>
          </div>
        </Container>
      </section>
    </>
  );
}
