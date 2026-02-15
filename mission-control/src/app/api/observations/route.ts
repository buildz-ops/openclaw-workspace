import { NextResponse } from "next/server";
import { compactWhitespace, parseBulletItems } from "@/lib/workspace/markdown-parse";
import { readFileIfExists } from "@/lib/workspace/fs-utils";
import { buildMeta } from "@/lib/workspace/meta";
import { workspacePath } from "@/lib/workspace/paths";
import { MissionApiResponse } from "@/lib/types/mission";

function isoDate(dayShift: number) {
  const date = new Date();
  date.setDate(date.getDate() + dayShift);
  return date.toISOString().slice(0, 10);
}

function extractObservations(markdown: string): string[] {
  const bullets = parseBulletItems(markdown);
  if (bullets.length > 0) {
    return bullets.map((line) => compactWhitespace(line, 140)).slice(0, 18);
  }

  return markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .map((line) => compactWhitespace(line, 140))
    .slice(0, 18);
}

export async function GET() {
  try {
    const todayPath = workspacePath("memory", `${isoDate(0)}.md`);
    const yesterdayPath = workspacePath("memory", `${isoDate(-1)}.md`);

    const today = readFileIfExists(todayPath);
    const yesterday = readFileIfExists(yesterdayPath);

    const observations = [...(today ? extractObservations(today) : []), ...(yesterday ? extractObservations(yesterday) : [])].slice(0, 24);

    const source: string[] = [];
    if (today) source.push(todayPath);
    if (yesterday) source.push(yesterdayPath);

    const response: MissionApiResponse<{ observations: string[] }> = {
      meta: buildMeta(
        observations.length > 0 ? "ok" : source.length > 0 ? "partial" : "unavailable",
        source,
        observations.length === 0 ? "No observation entries found for today/yesterday memory logs." : undefined,
      ),
      data: { observations },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        meta: buildMeta("unavailable", [], "Failed to read observations."),
        data: { observations: [] },
        error: String(error),
      },
      { status: 500 },
    );
  }
}
