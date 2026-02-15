import { NextResponse } from "next/server";
import {
  fileMtime,
  listFilesRecursive,
  parseNumber,
  readFileIfExists,
} from "@/lib/workspace/fs-utils";
import { parseBulletItems } from "@/lib/workspace/markdown-parse";
import { buildMeta } from "@/lib/workspace/meta";
import { workspacePath } from "@/lib/workspace/paths";
import { parseQueueTasks } from "@/lib/workspace/queue";
import { ContentItem, ContentPipeline, MissionApiResponse } from "@/lib/types/mission";

function extractMoney(markdown: string, label: string): number {
  const regex = new RegExp(`${label}\\s*[:=]\\s*([^\\n]+)`, "i");
  return parseNumber(markdown.match(regex)?.[1]) ?? 0;
}

export async function GET() {
  try {
    const memoryDir = workspacePath("memory");
    const notesDir = workspacePath("notes");
    const queuePath = workspacePath("tasks", "QUEUE.md");
    const proactivePath = workspacePath("notes", "areas", "proactive-tracker.md");
    const revenuePath = workspacePath("notes", "areas", "revenue.md");

    const memoryDocs = listFilesRecursive(memoryDir, ".md");
    const noteDocs = listFilesRecursive(notesDir, ".md");
    const intakesDocs = [...memoryDocs, ...noteDocs];

    const linked = intakesDocs.filter((file) => {
      const content = readFileIfExists(file) || "";
      return /\[[^\]]+\]\([^)]+\)/.test(content);
    }).length;

    const queueMarkdown = readFileIfExists(queuePath);
    const queueTasks = queueMarkdown ? parseQueueTasks(queueMarkdown) : [];

    const proactiveMarkdown = readFileIfExists(proactivePath);
    const scheduleLines = proactiveMarkdown
      ? [
          ...parseBulletItems(proactiveMarkdown, "Reverse Prompting Schedule"),
          ...parseBulletItems(proactiveMarkdown, "Active Patterns"),
        ]
      : [];

    const revenueMarkdown = readFileIfExists(revenuePath);

    const recentItems: ContentItem[] = intakesDocs
      .map((file) => ({
        id: file,
        title: file.split("/").pop() || file,
        status: file.includes("memory") ? "memory" : "notes",
        sourcePath: file,
        updatedAt: fileMtime(file) || new Date(0).toISOString(),
      }))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 8);

    const data: ContentPipeline = {
      intakes: {
        total: intakesDocs.length,
        linked,
        orphaned: Math.max(intakesDocs.length - linked, 0),
      },
      tasks: {
        total: queueTasks.length,
        completed: queueTasks.filter((task) => task.status === "done").length,
        pending: queueTasks.filter((task) => task.status !== "done").length,
      },
      scheduled: {
        total: scheduleLines.length,
        thisWeek: scheduleLines.length,
        thisMonth: scheduleLines.length,
      },
      revenue: {
        totalEarned: revenueMarkdown ? extractMoney(revenueMarkdown, "total") : 0,
        pendingPayment: revenueMarkdown ? extractMoney(revenueMarkdown, "pending") : 0,
        paidOut: revenueMarkdown ? extractMoney(revenueMarkdown, "paid") : 0,
        breakdown: [],
      },
      recentItems,
    };

    const source: string[] = [];
    if (memoryDocs.length > 0) source.push(memoryDir);
    if (noteDocs.length > 0) source.push(notesDir);
    if (queueMarkdown) source.push(queuePath);
    if (proactiveMarkdown) source.push(proactivePath);
    if (revenueMarkdown) source.push(revenuePath);

    const response: MissionApiResponse<ContentPipeline> = {
      meta: buildMeta(
        source.length > 0 ? "ok" : "unavailable",
        source,
        source.length === 0 ? "No pipeline source files found." : undefined,
      ),
      data,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        meta: buildMeta("unavailable", [], "Failed to read content pipeline."),
        data: {
          intakes: { total: 0, linked: 0, orphaned: 0 },
          tasks: { total: 0, completed: 0, pending: 0 },
          scheduled: { total: 0, thisWeek: 0, thisMonth: 0 },
          revenue: { totalEarned: 0, pendingPayment: 0, paidOut: 0, breakdown: [] },
          recentItems: [],
        },
        error: String(error),
      },
      { status: 500 },
    );
  }
}
