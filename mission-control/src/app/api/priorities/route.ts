import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const WORKSPACE = process.env.OPENCLAW_WORKSPACE || path.join(os.homedir(), ".openclaw/workspace");

export async function GET() {
  try {
    // Read priorities from workspace
    const prioritiesPath = path.join(WORKSPACE, "notes/areas/priorities.md");
    
    const priorities = [
      { id: "1", title: "Build Mission Control", status: "in-progress" },
    ];
    
    if (fs.existsSync(prioritiesPath)) {
      const content = fs.readFileSync(prioritiesPath, "utf-8");
      // Parse priorities
    }
    
    return NextResponse.json({ priorities });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read priorities" }, { status: 500 });
  }
}
