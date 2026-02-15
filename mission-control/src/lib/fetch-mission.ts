import { MissionApiResponse } from "@/lib/types/mission";

export async function fetchMission<T>(url: string): Promise<MissionApiResponse<T>> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as MissionApiResponse<T>;
}
