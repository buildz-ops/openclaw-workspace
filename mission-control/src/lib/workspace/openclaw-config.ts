import fs from "fs";
import { openclawPath } from "@/lib/workspace/paths";

export interface OpenClawConfig {
  agents?: {
    defaults?: {
      model?: {
        primary?: string;
        fallbacks?: string[];
      };
      models?: Record<string, { alias?: string }>;
      heartbeat?: {
        every?: string;
        model?: string;
      };
      maxConcurrent?: number;
      subagents?: {
        maxConcurrent?: number;
      };
    };
  };
  models?: {
    providers?: Record<
      string,
      {
        baseUrl?: string;
        models?: Array<{
          id: string;
          name?: string;
          reasoning?: boolean;
          input?: string[];
          contextWindow?: number;
          maxTokens?: number;
        }>;
      }
    >;
  };
}

export function readOpenClawConfig(): { path: string; config: OpenClawConfig | null } {
  const configPath = openclawPath("openclaw.json");
  if (!fs.existsSync(configPath)) {
    return { path: configPath, config: null };
  }

  const raw = fs.readFileSync(configPath, "utf-8");
  return { path: configPath, config: JSON.parse(raw) as OpenClawConfig };
}

export function readAgentModelsFile(): {
  path: string;
  config: { providers?: Record<string, { baseUrl?: string; models?: Array<Record<string, unknown>> }> } | null;
} {
  const filePath = openclawPath("agents", "main", "agent", "models.json");
  if (!fs.existsSync(filePath)) {
    return { path: filePath, config: null };
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  return { path: filePath, config: JSON.parse(raw) as { providers?: Record<string, { baseUrl?: string; models?: Array<Record<string, unknown>> }> } };
}
