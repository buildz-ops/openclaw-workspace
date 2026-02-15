import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const WORKSPACE = process.env.OPENCLAW_WORKSPACE || path.join(os.homedir(), ".openclaw/workspace");

export async function GET() {
  try {
    // Read agent information from workspace
    const agentsPath = path.join(WORKSPACE, "AGENTS.md");
    
    const agents = [
      {
        id: "main",
        name: "Main Agent",
        status: "active",
        model: "claude-sonnet-4-5",
        lastSeen: new Date().toISOString(),
      },
    ];
    
    if (fs.existsSync(agentsPath)) {
      const content = fs.readFileSync(agentsPath, "utf-8");
      // Could parse for additional agent info
    }
    
    return NextResponse.json({ agents });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read agents" }, { status: 500 });
  }
}
