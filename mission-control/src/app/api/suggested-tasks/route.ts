import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const WORKSPACE = process.env.OPENCLAW_WORKSPACE || path.join(os.homedir(), ".openclaw/workspace");

export async function GET() {
  try {
    // Read task suggestions from workspace
    const tasksPath = path.join(WORKSPACE, "notes/areas/proactive-tracker.md");
    
    const tasks = [
      {
        id: "1",
        title: "Review daily memory logs",
        priority: "medium",
        category: "maintenance",
      },
    ];
    
    if (fs.existsSync(tasksPath)) {
      const content = fs.readFileSync(tasksPath, "utf-8");
      // Parse tasks
    }
    
    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read tasks" }, { status: 500 });
  }
}
