import fs from "fs";
import os from "os";
import { NextResponse } from "next/server";
import { buildMeta } from "@/lib/workspace/meta";
import { fileMtime } from "@/lib/workspace/fs-utils";
import { openclawPath, workspacePath, WORKSPACE_ROOT } from "@/lib/workspace/paths";
import { MissionApiResponse, SystemState } from "@/lib/types/mission";

function toEpochMs(iso: string | null): number | null {
  if (!iso) return null;
  const value = new Date(iso).getTime();
  return Number.isNaN(value) ? null : value;
}

function latestIso(values: Array<string | null>): string | null {
  const latest = values
    .map((item) => toEpochMs(item))
    .filter((item): item is number => item !== null)
    .reduce<number | null>((acc, value) => (acc === null || value > acc ? value : acc), null);

  return latest === null ? null : new Date(latest).toISOString();
}

function readTail(filePath: string, bytes = 280000): string {
  if (!fs.existsSync(filePath)) return "";
  const stat = fs.statSync(filePath);
  if (stat.size <= 0) return "";

  const length = Math.min(bytes, stat.size);
  const start = stat.size - length;
  const fd = fs.openSync(filePath, "r");
  const buffer = Buffer.alloc(length);

  try {
    fs.readSync(fd, buffer, 0, length, start);
  } finally {
    fs.closeSync(fd);
  }

  return buffer.toString("utf-8");
}

function latestLogEvent(filePath: string, patterns: RegExp[]): string | null {
  const tail = readTail(filePath);
  if (!tail) return null;

  let latest: number | null = null;
  const lines = tail.split(/\r?\n/);

  for (const line of lines) {
    if (!patterns.some((pattern) => pattern.test(line))) continue;
    const match = line.match(/^(\d{4}-\d{2}-\d{2}T[^\s]+)\s/);
    if (!match) continue;
    const parsed = new Date(match[1]).getTime();
    if (Number.isNaN(parsed)) continue;
    if (latest === null || parsed > latest) {
      latest = parsed;
    }
  }

  return latest === null ? null : new Date(latest).toISOString();
}

function classifyActivity(lastActivity: string | null, lastWork: string | null): SystemState["status"] {
  const now = Date.now();
  const lastActivityMs = toEpochMs(lastActivity);
  const lastWorkMs = toEpochMs(lastWork);
  if (lastActivityMs === null) return "offline";

  if (lastWorkMs !== null) {
    const workDiffMinutes = (now - lastWorkMs) / 60000;
    if (workDiffMinutes <= 4) return "working";
  }

  const diffMinutes = (now - lastActivityMs) / 60000;
  if (diffMinutes <= 45) return "idle";
  if (diffMinutes <= 360) return "stale";
  return "stale";
}

export async function GET() {
  try {
    const sessionPath = workspacePath("SESSION-STATE.md");
    const heartbeatPath = workspacePath("HEARTBEAT.md");
    const memoryTodayPath = workspacePath("memory", `${new Date().toISOString().slice(0, 10)}.md`);
    const gatewayPath = openclawPath("logs", "gateway.log");
    const gatewayErrPath = openclawPath("logs", "gateway.err.log");

    const sessionMtime = fileMtime(sessionPath);
    const heartbeatMtime = fileMtime(heartbeatPath);
    const memoryTodayMtime = fileMtime(memoryTodayPath);
    const gatewayMtime = fileMtime(gatewayPath);
    const gatewayErrMtime = fileMtime(gatewayErrPath);

    const lastWorkEvent = latestIso([
      latestLogEvent(gatewayPath, [/\[ws\].*agent/i, /\[discord\].*MESSAGE_CREATE/i, /\[discord\].*message/i]),
      latestLogEvent(gatewayErrPath, [
        /\[diagnostic\].*lane=session:agent:main:discord/i,
        /\[diagnostic\].*lane=main/i,
        /\[discord\].*MESSAGE_CREATE/i,
      ]),
    ]);

    const lastActivity = latestIso([sessionMtime, heartbeatMtime, memoryTodayMtime, gatewayMtime, gatewayErrMtime, lastWorkEvent]);

    const totalMb = Math.round(os.totalmem() / 1024 / 1024);
    const freeMb = Math.round(os.freemem() / 1024 / 1024);
    const usedMb = totalMb - freeMb;
    const uptimeSeconds = os.uptime();

    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const uptimeLabel = days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`;

    const data: SystemState = {
      status: classifyActivity(lastActivity, lastWorkEvent),
      uptimeSeconds,
      uptimeLabel,
      lastActivity,
      workspace: WORKSPACE_ROOT,
      memory: {
        totalMb,
        usedMb,
        freeMb,
        percentage: totalMb > 0 ? Math.round((usedMb / totalMb) * 100) : 0,
      },
      cpu: {
        cores: os.cpus().length,
        model: os.cpus()[0]?.model || "Unknown",
      },
      platform: {
        type: os.type(),
        release: os.release(),
        arch: os.arch(),
      },
    };

    const meta = buildMeta(
      lastActivity ? "ok" : "partial",
      [sessionPath, heartbeatPath, memoryTodayPath, gatewayPath, gatewayErrPath].filter((item) => fs.existsSync(item)),
      lastActivity
        ? undefined
        : "No activity files were readable. Status derived from host telemetry only.",
    );

    const response: MissionApiResponse<SystemState> = { meta, data };
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        meta: buildMeta("unavailable", [], "Failed to read system telemetry."),
        data: null,
        error: String(error),
      },
      { status: 500 },
    );
  }
}
