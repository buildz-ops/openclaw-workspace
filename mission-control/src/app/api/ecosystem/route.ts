import { NextResponse } from "next/server";
import { parseBulletItems } from "@/lib/workspace/markdown-parse";
import { readFileIfExists } from "@/lib/workspace/fs-utils";
import { buildMeta } from "@/lib/workspace/meta";
import { workspacePath } from "@/lib/workspace/paths";
import { CommsItem, MissionApiResponse } from "@/lib/types/mission";

function toEcosystem(line: string, index: number): CommsItem {
  const [name, type = "network"] = line.split(/\s[-–:]\s/);
  return {
    id: `ecosystem-${index + 1}`,
    name: name.trim(),
    type: type.trim(),
    status: "tracked",
  };
}

export async function GET() {
  try {
    const ecosystemPath = workspacePath("notes", "areas", "ecosystem.md");
    const markdown = readFileIfExists(ecosystemPath);
    const ecosystem = markdown ? parseBulletItems(markdown).map(toEcosystem) : [];

    const response: MissionApiResponse<{ ecosystem: CommsItem[] }> = {
      meta: buildMeta(
        ecosystem.length > 0 ? "ok" : markdown ? "partial" : "unavailable",
        markdown ? [ecosystemPath] : [],
        ecosystem.length === 0 ? "No ecosystem records found in notes/areas/ecosystem.md." : undefined,
      ),
      data: { ecosystem },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        meta: buildMeta("unavailable", [], "Failed to read ecosystem."),
        data: { ecosystem: [] },
        error: String(error),
      },
      { status: 500 },
    );
  }
}
