export type Project = {
  name: string;
  description: string;
  tags: string[];
  href?: string;
};

export const projects: Project[] = [
  {
    name: "Personal Portfolio",
    description:
      "A clean, fast, dark/light themed portfolio built with Next.js App Router and Tailwind CSS.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    href: "https://github.com/your-handle/portfolio",
  },
  {
    name: "API Observability Dashboard",
    description:
      "A dashboard to trace requests end-to-end, track SLIs, and reduce MTTR with actionable alerts.",
    tags: ["React", "Node.js", "Postgres"],
    href: "https://github.com/your-handle/observability-dashboard",
  },
  {
    name: "Realtime Team Kanban",
    description:
      "Realtime collaboration with presence, optimistic UI updates, and conflict-safe persistence.",
    tags: ["WebSockets", "Prisma", "Redis"],
    href: "https://github.com/your-handle/realtime-kanban",
  },
];
