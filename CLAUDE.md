# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build
- `npm run start` — Run production server
- `npm run lint` — Run ESLint (ESLint 9 with Next.js Core Web Vitals + TypeScript rules)

No test framework is configured.

## Architecture

Next.js 16 portfolio site using the App Router, React 19, TypeScript (strict), and Tailwind CSS 4 with class-based dark mode via next-themes.

### Path alias

`@/*` maps to `./src/*`.

### Pages (src/app/)

- `/` — Home with animated rotating text hero, featured projects and posts
- `/blog` — Blog index listing all posts
- `/blog/[slug]` — Individual blog post (uses `generateStaticParams` for static generation)
- `/projects` — Project showcase grid
- `/me` — About page

### Content system

Blog posts are Markdown files in `content/blog/` with YAML frontmatter (`title`, `description`, `date`). Processed via gray-matter → remark → remark-gfm → remark-html. Posts sorted newest-first.

To add a post: create a `.md` file in `content/blog/` with the required frontmatter fields.

### Key data files

- `src/lib/site.ts` — Site metadata, personal info, social links
- `src/lib/projects.ts` — Hardcoded projects array
- `src/lib/blog.ts` — Blog post parsing and retrieval
- `src/lib/format.ts` — Date formatting utility

### Component patterns

Client components are marked with `"use client"`. Server components are the default. The RotatingText component uses a reducer-based state machine for typing animation and handles hydration safety with an `isMounted` guard.

### Styling

Tailwind CSS 4 with the `@theme` directive in `globals.css`. Custom CSS variables handle light/dark theme colors. The `.prose` class styles rendered markdown content. Custom animations: `blink`, `rise-in`, `rise-out`.
