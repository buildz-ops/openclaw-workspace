import os from "os";
import path from "path";

export const OPENCLAW_HOME = process.env.OPENCLAW_HOME || path.join(os.homedir(), ".openclaw");
export const WORKSPACE_ROOT =
  process.env.OPENCLAW_WORKSPACE || path.join(OPENCLAW_HOME, "workspace");

export function workspacePath(...segments: string[]) {
  return path.join(WORKSPACE_ROOT, ...segments);
}

export function openclawPath(...segments: string[]) {
  return path.join(OPENCLAW_HOME, ...segments);
}
