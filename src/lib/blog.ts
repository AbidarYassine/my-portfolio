import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

export type BlogPost = BlogPostMeta & {
  html: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function resolvePostPath(slug: string) {
  const md = path.join(BLOG_DIR, `${slug}.md`);
  if (fs.existsSync(md)) return md;

  const mdx = path.join(BLOG_DIR, `${slug}.mdx`);
  if (fs.existsSync(mdx)) return mdx;

  return null;
}

export function getAllPostSlugs() {
  if (!fs.existsSync(BLOG_DIR)) return [] as string[];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.(md|mdx)$/, ""));
}

export function getAllPosts(): BlogPostMeta[] {
  const slugs = getAllPostSlugs();

  const posts = slugs
    .map((slug) => {
      const fullPath = resolvePostPath(slug);
      if (!fullPath) return null;

      const raw = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(raw);

      const title = typeof data.title === "string" ? data.title : slug;
      const description =
        typeof data.description === "string" ? data.description : "";
      const date = typeof data.date === "string" ? data.date : "";

      return { slug, title, description, date } satisfies BlogPostMeta;
    })
    .filter((p): p is BlogPostMeta => p !== null);

  // Newest first (fallback to stable order when dates are missing).
  posts.sort((a, b) => {
    const aTime = a.date ? new Date(a.date).getTime() : 0;
    const bTime = b.date ? new Date(b.date).getTime() : 0;
    return bTime - aTime;
  });

  return posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const fullPath = resolvePostPath(slug);
  if (!fullPath) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  const processed = await remark().use(remarkGfm).use(remarkHtml).process(content);

  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : "",
    date: typeof data.date === "string" ? data.date : "",
    html: processed.toString(),
  };
}
