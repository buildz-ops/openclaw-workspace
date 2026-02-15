import { NextResponse } from "next/server";
import { fileMtime } from "@/lib/workspace/fs-utils";
import { buildMeta } from "@/lib/workspace/meta";
import { readOpenClawConfig } from "@/lib/workspace/openclaw-config";
import { workspacePath } from "@/lib/workspace/paths";
import { AgentSummary, MissionApiResponse } from "@/lib/types/mission";

function ageToStatus(iso: string | null): AgentSummary["status"] {
  if (!iso) return "offline";
  const minutes = (Date.now() - new Date(iso).getTime()) / 60000;
  if (minutes <= 30) return "active";
  if (minutes <= 180) return "idle";
  return "stale";
}

export async function GET() {
  try {
    const sessionPath = workspacePath("SESSION-STATE.md");
    const sessionLastSeen = fileMtime(sessionPath);

    const { path: openclawConfigPath, config } = readOpenClawConfig();
    const primaryModel = config?.agents?.defaults?.model?.primary ?? "unknown";
    const heartbeatModel = config?.agents?.defaults?.heartbeat?.model ?? "unknown";

    const agents: AgentSummary[] = [
      {
        id: "main",
        name: "VEX Main Agent",
        role: "orchestrator",
        status: ageToStatus(sessionLastSeen),
        model: primaryModel,
        lastSeen: sessionLastSeen,
      },
      {
        id: "heartbeat",
        name: "Heartbeat Agent",
        role: "watchdog",
        status: heartbeatModel === "unknown" ? "offline" : "active",
        model: heartbeatModel,
        lastSeen: sessionLastSeen,
      },
    ];

    const sources: string[] = [];
    if (sessionLastSeen) sources.push(sessionPath);
    if (config) sources.push(openclawConfigPath);

    const response: MissionApiResponse<{ agents: AgentSummary[] }> = {
      meta: buildMeta(
        sources.length === 2 ? "ok" : sources.length > 0 ? "partial" : "unavailable",
        sources,
        sources.length < 2 ? "Agent data is partially available due to missing config/session files." : undefined,
      ),
      data: { agents },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        meta: buildMeta("unavailable", [], "Failed to read agent status."),
        data: { agents: [] },
        error: String(error),
      },
      { status: 500 },
    );
  }
}
