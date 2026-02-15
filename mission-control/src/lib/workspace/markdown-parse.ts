export interface ChecklistItem {
  section: string;
  text: string;
  checked: boolean;
}

export function parseChecklistItems(markdown: string): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  let currentSection = "General";

  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^#{2,6}\s+(.+)/);
    if (heading) {
      currentSection = heading[1].trim();
      continue;
    }

    const match = line.match(/^\s*-\s*\[(x| )\]\s+(.+)/i);
    if (!match) continue;

    items.push({
      section: currentSection,
      checked: match[1].toLowerCase() === "x",
      text: match[2].trim(),
    });
  }

  return items;
}

export function parseBulletItems(markdown: string, sectionName?: string): string[] {
  const result: string[] = [];
  let inSection = !sectionName;

  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^#{1,6}\s+(.+)/);
    if (heading && sectionName) {
      inSection = heading[1].toLowerCase().includes(sectionName.toLowerCase());
      continue;
    }

    if (!inSection) continue;
    const match = line.match(/^\s*-\s+(.+)/);
    if (match && !match[1].startsWith("[")) {
      result.push(match[1].trim());
    }
  }

  return result;
}

export function firstHeading(markdown: string): string | null {
  const line = markdown.split(/\r?\n/).find((row) => /^#\s+/.test(row));
  return line ? line.replace(/^#\s+/, "").trim() : null;
}

export function compactWhitespace(input: string, maxLen = 160): string {
  const normalized = input.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLen) return normalized;
  return `${normalized.slice(0, maxLen - 3)}...`;
}
