import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    total: 5,
    active: 4,
    idle: 1,
    health: "good",
    agents: [
      { name: "discord-bot", status: "active", uptime: "12h 34m" },
      { name: "email-processor", status: "active", uptime: "2d 5h" },
      { name: "content-scraper", status: "active", uptime: "8h 12m" },
      { name: "data-sync", status: "idle", uptime: "1d 2h" },
      { name: "scheduler", status: "active", uptime: "5d 14h" },
    ],
  });
}
