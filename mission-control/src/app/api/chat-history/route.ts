import { NextResponse } from "next/server";
import { readFileIfExists } from "@/lib/workspace/fs-utils";
import { buildMeta } from "@/lib/workspace/meta";
import { workspacePath } from "@/lib/workspace/paths";
import { MissionApiResponse } from "@/lib/types/mission";

interface HistoryMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function parseMessages(markdown: string): HistoryMessage[] {
  const rows: HistoryMessage[] = [];
  const regex = /^\[(.+?)\]\s*(User|Assistant|System):\s*(.+)$/i;

  for (const line of markdown.split(/\r?\n/)) {
    const match = line.match(regex);
    if (!match) continue;

    const role = match[2].toLowerCase() as HistoryMessage["role"];
    rows.push({
      role,
      timestamp: match[1],
      content: match[3].trim(),
    });
  }

  return rows;
}

export async function GET() {
  try {
    const memoryPath = workspacePath("memory", `${todayIso()}.md`);
    const markdown = readFileIfExists(memoryPath);
    const messages = markdown ? parseMessages(markdown) : [];

    const response: MissionApiResponse<{ messages: HistoryMessage[] }> = {
      meta: buildMeta(
        messages.length > 0 ? "ok" : markdown ? "partial" : "unavailable",
        markdown ? [memoryPath] : [],
        messages.length === 0 ? "No structured chat-history entries found in daily memory." : undefined,
      ),
      data: { messages },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        meta: buildMeta("unavailable", [], "Failed to read chat history."),
        data: { messages: [] },
        error: String(error),
      },
      { status: 500 },
    );
  }
}
