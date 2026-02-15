import { NextResponse } from "next/server";
import { readFileIfExists } from "@/lib/workspace/fs-utils";
import { buildMeta } from "@/lib/workspace/meta";
import { workspacePath } from "@/lib/workspace/paths";
import { parseQueueTasks } from "@/lib/workspace/queue";
import { MissionApiResponse, TaskCard } from "@/lib/types/mission";

export async function GET() {
  try {
    const queuePath = workspacePath("tasks", "QUEUE.md");
    const queueMarkdown = readFileIfExists(queuePath);

    const allTasks = queueMarkdown ? parseQueueTasks(queueMarkdown) : [];
    const priorities: TaskCard[] = allTasks.filter((task) => task.status !== "done");

    const response: MissionApiResponse<{ priorities: TaskCard[] }> = {
      meta: buildMeta(
        priorities.length > 0 ? "ok" : queueMarkdown ? "partial" : "unavailable",
        queueMarkdown ? [queuePath] : [],
        priorities.length === 0 ? "No active priorities found in task queue." : undefined,
      ),
      data: { priorities },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        meta: buildMeta("unavailable", [], "Failed to read priorities."),
        data: { priorities: [] },
        error: String(error),
      },
      { status: 500 },
    );
  }
}
