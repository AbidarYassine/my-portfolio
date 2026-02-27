import Link from "next/link";

import { Container } from "@/components/container";
import { formatDate } from "@/lib/format";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog",
  description: "Writing about software engineering, systems, and product building.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <Container className="py-12 sm:py-16">
      <div className="space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
          <p className="max-w-2xl text-muted-foreground">
            Notes on engineering, craft, and building.
          </p>
        </div>

        <div className="space-y-4">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group block rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold tracking-tight">{p.title}</h2>
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

          {posts.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
              No posts yet. Add markdown files to <code>content/blog</code>.
            </div>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
