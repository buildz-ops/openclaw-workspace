import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const WORKSPACE = process.env.OPENCLAW_WORKSPACE || path.join(os.homedir(), ".openclaw/workspace");

export async function GET() {
  try {
    // Read system state from workspace files
    const sessionStatePath = path.join(WORKSPACE, "SESSION-STATE.md");
    const memoryPath = path.join(WORKSPACE, "MEMORY.md");
    
    let status = "online";
    let uptime = "N/A";
    let lastActivity = new Date().toISOString();
    
    if (fs.existsSync(sessionStatePath)) {
      const content = fs.readFileSync(sessionStatePath, "utf-8");
      // Parse session state for relevant info
      if (content.includes("active")) status = "active";
    }
    
    return NextResponse.json({
      status,
      uptime,
      lastActivity,
      workspace: WORKSPACE,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read system state" }, { status: 500 });
  }
}
