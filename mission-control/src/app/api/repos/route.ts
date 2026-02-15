import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const WORKSPACE = process.env.OPENCLAW_WORKSPACE || path.join(os.homedir(), ".openclaw/workspace");

export async function GET() {
  try {
    // Read repo information from workspace git status
    const repos: Array<{ id: string; name: string; branch: string; status: string }> = [];
    
    try {
      const { stdout } = await execAsync("git branch --show-current", { cwd: WORKSPACE });
      const branch = stdout.trim();
      
      repos.push({
        id: "workspace",
        name: "Workspace",
        branch,
        status: "clean",
      });
    } catch (err) {
      // Not a git repo or error
    }
    
    return NextResponse.json({ repos });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read repos" }, { status: 500 });
  }
}
