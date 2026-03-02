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
        tags: ["Next.js", "TypeScript", "Tailwind", "Claude Code (skills, Commands, Plugins)"],
        href: "https://github.com/AbidarYassine/my-portfolio",
    },
    {
        name: "Reimbursely — Internal Train Ticket Reimbursement Tool",
        description:
            "An internal productivity tool built for personal and team use to automate train ticket expense management. The application integrates Google OAuth2 for secure authentication and read-only Gmail access to automatically retrieve train ticket emails. It extracts key data, organizes tickets by date, and generates structured monthly reports to streamline reimbursement workflows and eliminate manual tracking.",
        tags: ["Next.js", "Google OAuth2", "Gmail API"],
        href: "https://reimbursely.online/",
    },
    {
        name: "Hssaby — AI-Enhanced Personal Finance Manager",
        description:
            "A personal finance management web app that simplifies tracking and categorizing expenses. Users can log transactions naturally using AI-assisted input (plain text or voice), " +
            "and the system intelligently parses and categorizes them into structured financial records." +
            " Built with a focus on usability, automation, and empowering better financial decisions.",
        tags: ["Spring Boot","Spring AI", "Next.js", "PostgreSQL"],
        href: "https://app.hssaby.com/"
    }
];
