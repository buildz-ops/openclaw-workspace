import { parseChecklistItems } from "@/lib/workspace/markdown-parse";
import { TaskCard } from "@/lib/types/mission";

function priorityFromSection(section: string): TaskCard["priority"] {
  const lower = section.toLowerCase();
  if (lower.includes("high")) return "high";
  if (lower.includes("medium")) return "medium";
  if (lower.includes("low")) return "low";
  return "unknown";
}

function statusFromSection(section: string): TaskCard["status"] {
  const lower = section.toLowerCase();
  if (lower.includes("in progress")) return "in-progress";
  if (lower.includes("blocked")) return "blocked";
  if (lower.includes("done")) return "done";
  if (lower.includes("ready")) return "ready";
  return "unknown";
}

function cleanTaskText(text: string): string {
  return text
    .replace(/^\([^)]*\)\s*/, "")
    .replace(/^@[^:]+:\s*/, "")
    .trim();
}

export function parseQueueTasks(markdown: string): TaskCard[] {
  const checks = parseChecklistItems(markdown);
  return checks.map((item, index) => ({
    id: `queue-${index + 1}`,
    title: cleanTaskText(item.text),
    category: item.section,
    priority: priorityFromSection(item.section),
    status: item.checked ? "done" : statusFromSection(item.section),
  }));
}
