import { NextResponse } from "next/server";
import { parseNumber, readFileIfExists } from "@/lib/workspace/fs-utils";
import { buildMeta } from "@/lib/workspace/meta";
import { workspacePath } from "@/lib/workspace/paths";
import { MissionApiResponse, RevenueSummary } from "@/lib/types/mission";

function extractMetric(markdown: string, label: string): number | null {
  const regex = new RegExp(`${label}\\s*[:=]\\s*([^\\n]+)`, "i");
  const match = markdown.match(regex);
  return parseNumber(match?.[1]);
}

export async function GET() {
  try {
    const revenuePath = workspacePath("notes", "areas", "revenue.md");
    const markdown = readFileIfExists(revenuePath);

    const data: RevenueSummary = {
      current: markdown ? extractMetric(markdown, "current") ?? 0 : 0,
      target: markdown ? extractMetric(markdown, "target") ?? 0 : 0,
      growth: markdown ? extractMetric(markdown, "growth") ?? 0 : 0,
      mrr: markdown ? extractMetric(markdown, "mrr") ?? 0 : 0,
    };

    const response: MissionApiResponse<RevenueSummary> = {
      meta: buildMeta(
        markdown ? "partial" : "unavailable",
        markdown ? [revenuePath] : [],
        markdown
          ? "Revenue file loaded; parsed known numeric fields only."
          : "Revenue source file is missing (notes/areas/revenue.md).",
      ),
      data,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        meta: buildMeta("unavailable", [], "Failed to read revenue data."),
        data: { current: 0, target: 0, growth: 0, mrr: 0 },
        error: String(error),
      },
      { status: 500 },
    );
  }
}
