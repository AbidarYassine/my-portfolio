import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { formatDate } from "@/lib/format";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Not found" };

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <Container className="py-12 sm:py-16">
      <article className="space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {post.date ? <span>{formatDate(post.date)}</span> : null}
            {post.description ? (
              <span className="hidden md:inline">· {post.description}</span>
            ) : null}
          </div>
        </header>

        <div
          className="prose prose-zinc max-w-none dark:prose-invert prose-headings:tracking-tight prose-a:text-foreground"
          // Content is local markdown from your repo.
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </Container>
  );
}
