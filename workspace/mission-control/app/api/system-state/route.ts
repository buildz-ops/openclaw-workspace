import { NextResponse } from "next/server";

export async function GET() {
  // Mock data - replace with actual system queries
  return NextResponse.json({
    status: "operational",
    timestamp: new Date().toISOString(),
    intakes: {
      email: 12,
      slack: 8,
      discord: 23,
    },
    tasks: {
      pending: 15,
      active: 3,
      completed: 47,
    },
    scheduled: {
      today: 6,
      week: 18,
      overdue: 2,
    },
  });
}
