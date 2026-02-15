import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    jobs: [
      { name: "Daily Backup", schedule: "0 2 * * *", lastRun: "2h ago", status: "ok" },
      { name: "Email Sync", schedule: "*/15 * * * *", lastRun: "3m ago", status: "ok" },
      { name: "Data Pipeline", schedule: "0 */6 * * *", lastRun: "1h ago", status: "ok" },
      { name: "Report Generation", schedule: "0 8 * * 1", lastRun: "2d ago", status: "warning" },
      { name: "Cache Cleanup", schedule: "0 3 * * *", lastRun: "1h ago", status: "ok" },
    ],
  });
}
