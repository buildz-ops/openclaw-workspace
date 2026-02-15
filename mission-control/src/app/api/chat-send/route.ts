import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const WORKSPACE = process.env.OPENCLAW_WORKSPACE || path.join(os.homedir(), ".openclaw/workspace");

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    // Log message to memory
    const today = new Date().toISOString().split("T")[0];
    const memoryPath = path.join(WORKSPACE, `memory/${today}.md`);
    
    const timestamp = new Date().toISOString();
    const logEntry = `\n[${timestamp}] User: ${message}\n`;
    
    if (fs.existsSync(memoryPath)) {
      fs.appendFileSync(memoryPath, logEntry);
    }
    
    // In a real implementation, this would send to the agent
    return NextResponse.json({ success: true, timestamp });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
