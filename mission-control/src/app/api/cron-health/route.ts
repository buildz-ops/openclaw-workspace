import { NextResponse } from "next/server";
import { buildMeta } from "@/lib/workspace/meta";
import { fileMtime } from "@/lib/workspace/fs-utils";
import { workspacePath } from "@/lib/workspace/paths";
import { CronJob, MissionApiResponse } from "@/lib/types/mission";

function ageStatus(lastRun: string | null, healthyMinutes: number, staleMinutes: number): CronJob["status"] {
  if (!lastRun) return "offline";
  const age = (Date.now() - new Date(lastRun).getTime()) / 60000;
  if (age <= healthyMinutes) return "healthy";
  if (age <= staleMinutes) return "warning";
  return "stale";
}

export async function GET() {
  try {
    const heartbeatPath = workspacePath("HEARTBEAT.md");
    const sessionPath = workspacePath("SESSION-STATE.md");
    const memoryPath = workspacePath("MEMORY.md");
    const watchdogPath = workspacePath("logs", "openclaw-watchdog.log");

    const jobs: CronJob[] = [
      {
        id: "heartbeat",
        name: "Heartbeat Loop",
        schedule: "every 30m (active hours)",
        lastRun: fileMtime(heartbeatPath),
        status: ageStatus(fileMtime(heartbeatPath), 60, 240),
      },
      {
        id: "session-state",
        name: "Session State Sync",
        schedule: "continuous",
        lastRun: fileMtime(sessionPath),
        status: ageStatus(fileMtime(sessionPath), 45, 240),
      },
      {
        id: "memory-distill",
        name: "Memory Distillation",
        schedule: "daily",
        lastRun: fileMtime(memoryPath),
        status: ageStatus(fileMtime(memoryPath), 1440 * 2, 1440 * 7),
      },
      {
        id: "watchdog",
        name: "Watchdog",
        schedule: "every 15m",
        lastRun: fileMtime(watchdogPath),
        status: ageStatus(fileMtime(watchdogPath), 30, 180),
      },
    ];

    const existingSources = [heartbeatPath, sessionPath, memoryPath, watchdogPath].filter((item, index) =>
      jobs[index]?.lastRun,
    );

    const severityRank = { healthy: 0, warning: 1, stale: 2, offline: 3 };
    const maxRank = jobs.reduce((rank, job) => Math.max(rank, severityRank[job.status]), 0);
    const status = maxRank === 0 ? "ok" : maxRank === 1 ? "partial" : "partial";

    const response: MissionApiResponse<{ jobs: CronJob[] }> = {
      meta: buildMeta(
        jobs.every((job) => job.lastRun === null) ? "unavailable" : status,
        existingSources,
        jobs.every((job) => job.lastRun === null)
          ? "No cron source files found in workspace."
          : undefined,
      ),
      data: { jobs },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        meta: buildMeta("unavailable", [], "Failed to read cron health."),
        data: { jobs: [] },
        error: String(error),
      },
      { status: 500 },
    );
  }
}
