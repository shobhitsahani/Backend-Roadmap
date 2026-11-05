import type { TopicStatus } from "@/types/roadmap";

export function formatWeeks(weeks: number) {
  return weeks.toFixed(1).padStart(4, "0");
}

export function formatPercent(percent: number) {
  return `${Math.round(percent)}%`;
}

export function formatDate(value: string | null) {
  if (!value) return "Not set";
  const [year = 1970, month = 1, day = 1] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function topicStatusLabel(status: TopicStatus) {
  switch (status) {
    case "done":
      return "Complete";
    case "in_progress":
      return "In progress";
    default:
      return "Not started";
  }
}
