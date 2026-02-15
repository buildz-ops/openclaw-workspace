import { NextResponse } from "next/server";
import { parseBulletItems } from "@/lib/workspace/markdown-parse";
import { readFileIfExists } from "@/lib/workspace/fs-utils";
import { buildMeta } from "@/lib/workspace/meta";
import { workspacePath } from "@/lib/workspace/paths";
import { CommsItem, MissionApiResponse } from "@/lib/types/mission";

function toClient(line: string, index: number): CommsItem {
  const [name, status = "active"] = line.split(/\s[-–:]\s/);
  return {
    id: `client-${index + 1}`,
    name: name.trim(),
    type: "client",
    status: status.trim(),
  };
}

export async function GET() {
  try {
    const clientsPath = workspacePath("notes", "areas", "clients.md");
    const markdown = readFileIfExists(clientsPath);
    const clients = markdown ? parseBulletItems(markdown).map(toClient) : [];

    const response: MissionApiResponse<{ clients: CommsItem[] }> = {
      meta: buildMeta(
        clients.length > 0 ? "ok" : markdown ? "partial" : "unavailable",
        markdown ? [clientsPath] : [],
        clients.length === 0 ? "No client records found in notes/areas/clients.md." : undefined,
      ),
      data: { clients },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        meta: buildMeta("unavailable", [], "Failed to read clients."),
        data: { clients: [] },
        error: String(error),
      },
      { status: 500 },
    );
  }
}
