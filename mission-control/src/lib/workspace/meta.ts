import { MissionDataStatus, MissionMeta } from "@/lib/types/mission";

export function buildMeta(
  status: MissionDataStatus,
  source: string[],
  note?: string,
): MissionMeta {
  return {
    status,
    source,
    updatedAt: new Date().toISOString(),
    ...(note ? { note } : {}),
  };
}
