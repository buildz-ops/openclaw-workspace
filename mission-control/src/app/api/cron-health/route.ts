import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const WORKSPACE = process.env.OPENCLAW_WORKSPACE || path.join(os.homedir(), ".openclaw/workspace");

export async function GET() {
  try {
    // Read cron/heartbeat status
    const heartbeatPath = path.join(WORKSPACE, "HEARTBEAT.md");
    
    const cronJobs = [
      {
        id: "heartbeat",
        name: "Heartbeat",
        schedule: "*/30 * * * *",
        lastRun: new Date().toISOString(),
        status: "healthy",
      },
    ];
    
    if (fs.existsSync(heartbeatPath)) {
      const content = fs.readFileSync(heartbeatPath, "utf-8");
      // Parse heartbeat status
    }
    
    return NextResponse.json({ jobs: cronJobs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read cron health" }, { status: 500 });
  }
}
