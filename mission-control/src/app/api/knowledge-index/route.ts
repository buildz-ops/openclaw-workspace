import path from "path";
import { NextResponse } from "next/server";
import { compactWhitespace, firstHeading } from "@/lib/workspace/markdown-parse";
import {
  fileMtime,
  fileSize,
  listFilesRecursive,
  readFileIfExists,
} from "@/lib/workspace/fs-utils";
import { buildMeta } from "@/lib/workspace/meta";
import { workspacePath } from "@/lib/workspace/paths";
import { KnowledgeDoc, MissionApiResponse } from "@/lib/types/mission";

const TARGET_DIRS = [
  workspacePath("memory"),
  workspacePath("notes"),
  workspacePath(".learnings"),
];

function categoryFromPath(filePath: string): string {
  const normalized = filePath.replace(/\\/g, "/");
  if (normalized.includes("/memory/")) return "memory";
  if (normalized.includes("/.learnings/")) return "learnings";
  if (normalized.includes("/notes/")) return "notes";
  return "workspace";
}

function buildDoc(filePath: string): KnowledgeDoc {
  const markdown = readFileIfExists(filePath) || "";
  const title = firstHeading(markdown) || path.basename(filePath);

  const excerptLine = markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.length > 0 && !line.startsWith("#"));

  const tags = Array.from(new Set((markdown.match(/#([a-zA-Z0-9_-]+)/g) || []).map((tag) => tag.slice(1)))).slice(0, 8);

  return {
    id: filePath,
    title,
    category: categoryFromPath(filePath),
    path: filePath,
    modifiedAt: fileMtime(filePath) || new Date(0).toISOString(),
    sizeBytes: fileSize(filePath),
    tags,
    excerpt: compactWhitespace(excerptLine || "", 170),
  };
}

export async function GET() {
  try {
    const docs = TARGET_DIRS.flatMap((dir) => listFilesRecursive(dir, ".md"))
      .map(buildDoc)
      .sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());

    const existingSources = TARGET_DIRS.filter((dir) => listFilesRecursive(dir, ".md").length > 0);

    const response: MissionApiResponse<{ docs: KnowledgeDoc[] }> = {
      meta: buildMeta(
        docs.length > 0 ? "ok" : existingSources.length > 0 ? "partial" : "unavailable",
        existingSources,
        docs.length === 0 ? "No markdown knowledge files found in memory/notes/.learnings." : undefined,
      ),
      data: { docs },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        meta: buildMeta("unavailable", [], "Failed to index knowledge sources."),
        data: { docs: [] },
        error: String(error),
      },
      { status: 500 },
    );
  }
}
