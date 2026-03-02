"use client";

import { useState } from "react";

const resumes = [
  { label: "Français", lang: "FR", file: "/Yassine_Abidar_Resume_FR.pdf" },
  { label: "English", lang: "EN", file: "/Yassine_Abidar_Resume_EN.pdf" },
] as const;

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function ResumeDownload() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <DownloadIcon />
        Download Resume
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 z-10 mt-2 w-44 rounded-md border border-border bg-card shadow-lg">
          {resumes.map((r) => (
            <a
              key={r.lang}
              href={r.file}
              download
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground transition first:rounded-t-md last:rounded-b-md hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              <DownloadIcon />
              {r.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
