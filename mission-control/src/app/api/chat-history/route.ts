import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const WORKSPACE = process.env.OPENCLAW_WORKSPACE || path.join(os.homedir(), ".openclaw/workspace");

export async function GET() {
  try {
    // Read chat history from memory
    const today = new Date().toISOString().split("T")[0];
    const memoryPath = path.join(WORKSPACE, `memory/${today}.md`);
    
    const messages: Array<{ role: string; content: string; timestamp: string }> = [];
    
    if (fs.existsSync(memoryPath)) {
      const content = fs.readFileSync(memoryPath, "utf-8");
      // Parse chat messages
    }
    
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read chat history" }, { status: 500 });
  }
}
