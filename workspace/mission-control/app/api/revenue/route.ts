import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    current: 45600,
    target: 50000,
    growth: 12.5,
    deals: [
      { client: "Acme Corp", value: 12000, stage: "closing" },
      { client: "TechStart Inc", value: 8500, stage: "negotiation" },
      { client: "Global Solutions", value: 15000, stage: "proposal" },
    ],
  });
}
