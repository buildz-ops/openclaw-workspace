import fs from "fs";
import { execSync } from "child_process";
import { NextResponse } from "next/server";
import { buildMeta } from "@/lib/workspace/meta";
import { WORKSPACE_ROOT } from "@/lib/workspace/paths";
import { MissionApiResponse, RepoHealth } from "@/lib/types/mission";

function runGit(repoPath: string, command: string): string {
  return execSync(command, { cwd: repoPath, encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}

function parseAheadBehind(value: string): { ahead: number; behind: number } {
  const [ahead, behind] = value.split(/\s+/).map((n) => Number(n || "0"));
  return {
    ahead: Number.isFinite(ahead) ? ahead : 0,
    behind: Number.isFinite(behind) ? behind : 0,
  };
}

function inspectRepo(id: string, name: string, repoPath: string): RepoHealth {
  if (!fs.existsSync(repoPath)) {
    return {
      id,
      name,
      path: repoPath,
      branch: "n/a",
      status: "missing",
      changed: 0,
      untracked: 0,
      ahead: 0,
      behind: 0,
      lastCommit: null,
    };
  }

  try {
    const branch = runGit(repoPath, "git rev-parse --abbrev-ref HEAD");
    const porcelain = runGit(repoPath, "git status --porcelain");
    const changed = porcelain
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0 && !line.startsWith("??"))
      .length;
    const untracked = porcelain
      .split(/\r?\n/)
      .filter((line) => line.trim().startsWith("??"))
      .length;

    const aheadBehindRaw = runGit(
      repoPath,
      "git rev-list --left-right --count @{upstream}...HEAD || echo '0 0'",
    );
    const { ahead, behind } = parseAheadBehind(aheadBehindRaw);

    const lastCommit = runGit(repoPath, "git log -1 --pretty=%cI || true") || null;

    return {
      id,
      name,
      path: repoPath,
      branch,
      status: changed === 0 && untracked === 0 ? "clean" : "dirty",
      changed,
      untracked,
      ahead,
      behind,
      lastCommit,
    };
  } catch {
    return {
      id,
      name,
      path: repoPath,
      branch: "n/a",
      status: "missing",
      changed: 0,
      untracked: 0,
      ahead: 0,
      behind: 0,
      lastCommit: null,
    };
  }
}

export async function GET() {
  try {
    const repos: RepoHealth[] = [
      inspectRepo("workspace", "OpenClaw Workspace", WORKSPACE_ROOT),
      inspectRepo("mission-control", "Mission Control", process.cwd()),
    ];

    const response: MissionApiResponse<{ repos: RepoHealth[] }> = {
      meta: buildMeta(
        repos.some((repo) => repo.status !== "missing") ? "ok" : "unavailable",
        repos.filter((repo) => repo.status !== "missing").map((repo) => repo.path),
        repos.every((repo) => repo.status === "missing") ? "No readable git repositories found." : undefined,
      ),
      data: { repos },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        meta: buildMeta("unavailable", [], "Failed to inspect repositories."),
        data: { repos: [] },
        error: String(error),
      },
      { status: 500 },
    );
  }
}
