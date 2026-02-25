export function formatDate(iso: string) {
  const date = new Date(iso);

  // Avoid throwing on invalid dates (e.g. empty frontmatter).
  if (Number.isNaN(date.getTime())) return iso;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}
