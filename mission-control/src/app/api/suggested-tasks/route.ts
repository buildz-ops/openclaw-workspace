import { NextResponse } from "next/server";
import { parseBulletItems } from "@/lib/workspace/markdown-parse";
import { readFileIfExists } from "@/lib/workspace/fs-utils";
import { buildMeta } from "@/lib/workspace/meta";
import { workspacePath } from "@/lib/workspace/paths";
import { MissionApiResponse, TaskCard } from "@/lib/types/mission";

function toTask(title: string, category: string, index: number): TaskCard {
  return {
    id: `${category}-${index + 1}`,
    title,
    category,
    priority: "medium",
    status: "ready",
  };
}

export async function GET() {
  try {
    const proactivePath = workspacePath("notes", "areas", "proactive-tracker.md");
    const recurringPath = workspacePath("notes", "areas", "recurring-patterns.md");

    const proactive = readFileIfExists(proactivePath);
    const recurring = readFileIfExists(recurringPath);

    const ideas = proactive ? parseBulletItems(proactive, "Ideas Queue") : [];
    const behaviors = proactive ? parseBulletItems(proactive, "Behavioral Goals") : [];
    const automations = recurring ? parseBulletItems(recurring, "Proposed Automations") : [];

    const tasks: TaskCard[] = [
      ...ideas.map((item, index) => toTask(item, "Ideas Queue", index)),
      ...automations.map((item, index) => toTask(item, "Proposed Automations", index)),
      ...behaviors.map((item, index) => toTask(item, "Behavioral Goals", index)),
    ];

    const source = [proactivePath, recurringPath].filter((candidate, index) =>
      index === 0 ? Boolean(proactive) : Boolean(recurring),
    );

    const response: MissionApiResponse<{ tasks: TaskCard[] }> = {
      meta: buildMeta(
        tasks.length > 0 ? "ok" : source.length > 0 ? "partial" : "unavailable",
        source,
        tasks.length === 0 ? "No suggested tasks were found in tracker files." : undefined,
      ),
      data: { tasks },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        meta: buildMeta("unavailable", [], "Failed to read suggested tasks."),
        data: { tasks: [] },
        error: String(error),
      },
      { status: 500 },
    );
  }
}
