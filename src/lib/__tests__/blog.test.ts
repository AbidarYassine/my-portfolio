import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getAllPostSlugs,
  getAllPosts,
  getPostBySlug,
} from "@/lib/blog";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function writeTempPost(filename: string, content: string) {
  fs.writeFileSync(path.join(BLOG_DIR, filename), content, "utf8");
}

function removeTempPost(filename: string) {
  const p = path.join(BLOG_DIR, filename);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

// --- Helpers to create frontmatter content ---
function makePost(frontmatter: Record<string, string>, body = "") {
  const fm = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: "${v}"`)
    .join("\n");
  return `---\n${fm}\n---\n\n${body}`;
}

// Temp files created during tests
const tempFiles: string[] = [];

function createTempPost(filename: string, content: string) {
  writeTempPost(filename, content);
  tempFiles.push(filename);
}

beforeEach(() => {
  tempFiles.length = 0;
});

afterEach(() => {
  for (const f of tempFiles) {
    removeTempPost(f);
  }
});

// ---------- getAllPostSlugs ----------

describe("getAllPostSlugs", () => {
  it("returns slugs for existing .md files", () => {
    const slugs = getAllPostSlugs();
    expect(slugs).toContain("welcome");
    expect(slugs).toContain("engineering-notes");
  });

  it("strips the .md extension from filenames", () => {
    const slugs = getAllPostSlugs();
    for (const slug of slugs) {
      expect(slug).not.toMatch(/\.md$/);
    }
  });

  it("includes .mdx files", () => {
    createTempPost("test-mdx-post.mdx", makePost({ title: "MDX Post" }));

    const slugs = getAllPostSlugs();
    expect(slugs).toContain("test-mdx-post");
  });

  it("strips the .mdx extension from filenames", () => {
    createTempPost("test-mdx-strip.mdx", makePost({ title: "MDX" }));

    const slugs = getAllPostSlugs();
    expect(slugs).not.toContain("test-mdx-strip.mdx");
    expect(slugs).toContain("test-mdx-strip");
  });

  it("ignores non-markdown files", () => {
    createTempPost("readme.txt", "not a post");

    const slugs = getAllPostSlugs();
    expect(slugs).not.toContain("readme");
    expect(slugs).not.toContain("readme.txt");
  });

  it("returns an empty array when the blog directory does not exist", () => {
    const original = fs.existsSync;
    vi.spyOn(fs, "existsSync").mockImplementation((p) => {
      if (p === BLOG_DIR) return false;
      return original.call(fs, p);
    });

    const slugs = getAllPostSlugs();
    expect(slugs).toEqual([]);

    vi.restoreAllMocks();
  });
});

// ---------- getAllPosts ----------

describe("getAllPosts", () => {
  it("returns an array of post metadata objects", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThanOrEqual(2);

    for (const post of posts) {
      expect(post).toHaveProperty("slug");
      expect(post).toHaveProperty("title");
      expect(post).toHaveProperty("description");
      expect(post).toHaveProperty("date");
    }
  });

  it("returns posts sorted newest-first by date", () => {
    const posts = getAllPosts();

    for (let i = 1; i < posts.length; i++) {
      const prevTime = posts[i - 1].date
        ? new Date(posts[i - 1].date).getTime()
        : 0;
      const currTime = posts[i].date
        ? new Date(posts[i].date).getTime()
        : 0;
      expect(prevTime).toBeGreaterThanOrEqual(currTime);
    }
  });

  it("uses slug as title when title is missing from frontmatter", () => {
    createTempPost(
      "test-no-title.md",
      makePost({ description: "desc", date: "2020-01-01" }),
    );

    // Remove the title key — rewrite without it
    writeTempPost(
      "test-no-title.md",
      `---\ndescription: "desc"\ndate: "2020-01-01"\n---\n\nBody`,
    );

    const posts = getAllPosts();
    const post = posts.find((p) => p.slug === "test-no-title");
    expect(post).toBeDefined();
    expect(post!.title).toBe("test-no-title");
  });

  it("defaults description to empty string when missing", () => {
    createTempPost(
      "test-no-desc.md",
      `---\ntitle: "No Desc"\ndate: "2020-01-01"\n---\n\nBody`,
    );

    const posts = getAllPosts();
    const post = posts.find((p) => p.slug === "test-no-desc");
    expect(post).toBeDefined();
    expect(post!.description).toBe("");
  });

  it("defaults date to empty string when missing", () => {
    createTempPost(
      "test-no-date.md",
      `---\ntitle: "No Date"\ndescription: "desc"\n---\n\nBody`,
    );

    const posts = getAllPosts();
    const post = posts.find((p) => p.slug === "test-no-date");
    expect(post).toBeDefined();
    expect(post!.date).toBe("");
  });

  it("does not include html in the metadata", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      expect(post).not.toHaveProperty("html");
    }
  });
});

// ---------- getPostBySlug ----------

describe("getPostBySlug", () => {
  it("returns a full blog post with html for a valid slug", async () => {
    const post = await getPostBySlug("welcome");

    expect(post).not.toBeNull();
    expect(post!.slug).toBe("welcome");
    expect(post!.title).toBe("Welcome");
    expect(post!.html).toContain("<h1>");
    expect(post!.html).toContain("Welcome");
  });

  it("returns null for a non-existent slug", async () => {
    const post = await getPostBySlug("this-slug-does-not-exist");
    expect(post).toBeNull();
  });

  it("processes markdown to html correctly", async () => {
    createTempPost(
      "test-markdown.md",
      makePost(
        { title: "MD Test", description: "test", date: "2020-01-01" },
        "## Heading Two\n\nA paragraph with **bold** text.",
      ),
    );

    const post = await getPostBySlug("test-markdown");
    expect(post).not.toBeNull();
    expect(post!.html).toContain("<h2>");
    expect(post!.html).toContain("<strong>bold</strong>");
    expect(post!.html).toContain("<p>");
  });

  it("processes GFM features (tables, strikethrough)", async () => {
    createTempPost(
      "test-gfm.md",
      makePost(
        { title: "GFM", description: "test", date: "2020-01-01" },
        "| A | B |\n|---|---|\n| 1 | 2 |\n\n~~deleted~~",
      ),
    );

    const post = await getPostBySlug("test-gfm");
    expect(post).not.toBeNull();
    expect(post!.html).toContain("<table>");
    expect(post!.html).toContain("<del>deleted</del>");
  });

  it("resolves .mdx files by slug", async () => {
    createTempPost(
      "test-mdx-resolve.mdx",
      makePost(
        { title: "MDX Resolve", description: "mdx", date: "2020-01-01" },
        "# MDX Content",
      ),
    );

    const post = await getPostBySlug("test-mdx-resolve");
    expect(post).not.toBeNull();
    expect(post!.title).toBe("MDX Resolve");
    expect(post!.html).toContain("MDX Content");
  });

  it("prefers .md over .mdx when both exist", async () => {
    createTempPost(
      "test-prefer-md.md",
      makePost({ title: "From MD", description: "", date: "2020-01-01" }, "MD version"),
    );
    createTempPost(
      "test-prefer-md.mdx",
      makePost({ title: "From MDX", description: "", date: "2020-01-01" }, "MDX version"),
    );

    const post = await getPostBySlug("test-prefer-md");
    expect(post).not.toBeNull();
    expect(post!.title).toBe("From MD");
  });

  it("falls back to slug for title when frontmatter title is missing", async () => {
    createTempPost(
      "test-fallback-title.md",
      `---\ndescription: "desc"\ndate: "2020-01-01"\n---\n\nContent`,
    );

    const post = await getPostBySlug("test-fallback-title");
    expect(post).not.toBeNull();
    expect(post!.title).toBe("test-fallback-title");
  });

  it("handles posts with empty body", async () => {
    createTempPost(
      "test-empty-body.md",
      makePost({ title: "Empty", description: "d", date: "2020-01-01" }),
    );

    const post = await getPostBySlug("test-empty-body");
    expect(post).not.toBeNull();
    expect(post!.html.trim()).toBe("");
  });

  it("handles posts with no frontmatter at all", async () => {
    createTempPost("test-bare.md", "# Just markdown\n\nNo frontmatter here.");

    const post = await getPostBySlug("test-bare");
    expect(post).not.toBeNull();
    expect(post!.title).toBe("test-bare");
    expect(post!.description).toBe("");
    expect(post!.date).toBe("");
    expect(post!.html).toContain("Just markdown");
  });
});
