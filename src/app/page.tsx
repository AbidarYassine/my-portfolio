import Link from "next/link";

import { AuroraBg } from "@/components/aurora-bg";
import { Container } from "@/components/container";
import { MagneticButton } from "@/components/magnetic-button";
import { MouseParallax } from "@/components/mouse-parallax";
import { GradientText } from "@/components/gradient-text";
import { ScrollFade } from "@/components/scroll-fade";
import { TextReveal } from "@/components/text-reveal";
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
        <AuroraBg />
        <Container className="relative flex min-h-[60vh] sm:min-h-[70vh] items-center justify-center py-20 sm:py-28 md:py-36">
          <MouseParallax>
            <div className="space-y-6 sm:space-y-8 text-center">
              {/* Name heading */}
              <h1 className="flex min-w-0 flex-col items-center gap-3 sm:gap-4">
                <TextReveal
                  text={site.name}
                  className="min-w-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text"
                  charDelay={50}
                />
                <GradientText
                  text="Consultant IT  ·  Java & Spring Boot  ·  DevOps"
                  className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight"
                  delay={800}
                />
              </h1>

              {/* Headline */}
              <p
                className="mx-auto max-w-2xl text-lg leading-7 text-muted-foreground sm:text-xl sm:leading-8"
                style={{
                  opacity: 0,
                  animation: "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                  animationDelay: "1000ms",
                }}
              >
                {site.headline}
              </p>

              {/* Tech stack pills */}
              <div
                className="flex flex-wrap items-center justify-center gap-2"
                style={{
                  opacity: 0,
                  animation: "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                  animationDelay: "1100ms",
                }}
              >
                {site.tech.map((t, i) => (
                  <span
                    key={t}
                    className="rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm transition-colors hover:border-border hover:text-foreground"
                    style={{
                      opacity: 0,
                      animation: "float-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                      animationDelay: `${1200 + i * 80}ms`,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* CTA buttons */}
              <div
                className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row"
                style={{
                  opacity: 0,
                  animation: "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                  animationDelay: "1600ms",
                }}
              >
                <MagneticButton>
                  <Link
                    href="/projects"
                    className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-accent px-8 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02]"
                  >
                    <span
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      style={{
                        backgroundSize: "200% 100%",
                        animation: "shimmer 3s ease-in-out infinite",
                      }}
                    />
                    View projects
                    <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link
                    href="/me"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-card/80 px-8 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-muted hover:scale-[1.02]"
                  >
                    About me
                  </Link>
                </MagneticButton>
              </div>

              {/* Scroll indicator */}
              <div
                className="pt-8"
                style={{
                  opacity: 0,
                  animation: "fade-in 1s ease forwards",
                  animationDelay: "2200ms",
                }}
              >
                <div
                  className="mx-auto flex h-8 w-5 items-start justify-center rounded-full border border-muted-foreground/30 p-1"
                  style={{ animation: "bounce-scroll 2s ease-in-out infinite" }}
                >
                  <div className="h-1.5 w-1 rounded-full bg-muted-foreground/50" />
                </div>
              </div>
            </div>
          </MouseParallax>
        </Container>
      </section>

      <section>
        <Container className="py-12 sm:py-16">
          <div className="grid gap-8 sm:gap-10 md:gap-12 md:grid-cols-2">
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

      <section className="border-t border-border">
        <Container className="py-16 sm:py-20">
          <ScrollFade>
            <div className="mx-auto max-w-xl space-y-6 text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Get in touch
              </h2>
              <p className="text-muted-foreground">
                Have a project in mind or just want to say hello? Feel free to reach out.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href={site.links.email}
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-6 text-sm font-medium text-accent-foreground shadow-sm transition hover:opacity-90"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Send an email
                </a>
                <a
                  href={site.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                  GitHub
                </a>
                <a
                  href={site.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  LinkedIn
                </a>
              </div>
              <p className="pt-4 text-xs text-muted-foreground/60">
                &copy; 2026 ABIDAR Yassine. All rights reserved.
              </p>
            </div>
          </ScrollFade>
        </Container>
      </section>
    </>
  );
}
