import { NextResponse } from "next/server";
import { buildMeta } from "@/lib/workspace/meta";
import { readAgentModelsFile, readOpenClawConfig } from "@/lib/workspace/openclaw-config";
import { sanitizeProviderUrl } from "@/lib/workspace/safety";
import { MissionApiResponse, ModelInventory, ModelRecord } from "@/lib/types/mission";

function splitModelId(modelKey: string): { provider: string; model: string } {
  const [provider, ...rest] = modelKey.split("/");
  return { provider: provider || "unknown", model: rest.join("/") || modelKey };
}

function safeModelRecord(input: Partial<ModelRecord> & { id: string; provider: string }): ModelRecord {
  return {
    id: input.id,
    provider: input.provider,
    name: input.name || input.id,
    alias: input.alias,
    reasoning: Boolean(input.reasoning),
    input: input.input || ["text"],
    contextWindow: input.contextWindow,
    maxTokens: input.maxTokens,
  };
}

export async function GET() {
  try {
    const { path: configPath, config } = readOpenClawConfig();
    const { path: agentModelsPath, config: agentModels } = readAgentModelsFile();

    const records = new Map<string, ModelRecord>();

    const defaultModels = config?.agents?.defaults?.models || {};
    for (const [modelKey, modelConfig] of Object.entries(defaultModels)) {
      const split = splitModelId(modelKey);
      records.set(
        modelKey,
        safeModelRecord({
          id: modelKey,
          provider: split.provider,
          name: split.model,
          alias: modelConfig?.alias,
          reasoning: false,
          input: ["text"],
        }),
      );
    }

    const providerSummary = new Map<string, { id: string; baseUrl: string; modelCount: number }>();

    const providers = config?.models?.providers || {};
    for (const [providerId, provider] of Object.entries(providers)) {
      const list = provider.models || [];
      providerSummary.set(providerId, {
        id: providerId,
        baseUrl: sanitizeProviderUrl(provider.baseUrl),
        modelCount: list.length,
      });

      for (const model of list) {
        const key = `${providerId}/${model.id}`;
        records.set(
          key,
          safeModelRecord({
            id: key,
            provider: providerId,
            name: model.name || model.id,
            reasoning: model.reasoning,
            input: model.input || ["text"],
            contextWindow: model.contextWindow,
            maxTokens: model.maxTokens,
          }),
        );
      }
    }

    const agentProviders = agentModels?.providers || {};
    for (const [providerId, provider] of Object.entries(agentProviders)) {
      const existing = providerSummary.get(providerId);
      const list = provider.models || [];
      providerSummary.set(providerId, {
        id: providerId,
        baseUrl: sanitizeProviderUrl(provider.baseUrl),
        modelCount: Math.max(existing?.modelCount || 0, list.length),
      });

      for (const model of list) {
        const id = typeof model.id === "string" ? model.id : "unknown";
        const key = `${providerId}/${id}`;
        if (records.has(key)) continue;

        records.set(
          key,
          safeModelRecord({
            id: key,
            provider: providerId,
            name: typeof model.name === "string" ? model.name : id,
            reasoning: model.reasoning === true,
            input: Array.isArray(model.input) ? model.input.filter((entry): entry is string => typeof entry === "string") : ["text"],
            contextWindow: typeof model.contextWindow === "number" ? model.contextWindow : undefined,
            maxTokens: typeof model.maxTokens === "number" ? model.maxTokens : undefined,
          }),
        );
      }
    }

    const primary = config?.agents?.defaults?.model?.primary || "unknown";
    const fallback = config?.agents?.defaults?.model?.fallbacks?.[0];

    const routing = [
      { task: "Reasoning / Strategy", primary, fallback },
      { task: "Coding / PRs", primary, fallback },
      { task: "Heartbeat / Monitoring", primary: config?.agents?.defaults?.heartbeat?.model || primary, fallback },
      { task: "Content / Drafting", primary, fallback },
      { task: "Research / Web", primary, fallback },
    ];

    const models = [...records.values()].sort((a, b) => a.id.localeCompare(b.id));
    const providersOut = [...providerSummary.values()].sort((a, b) => a.id.localeCompare(b.id));

    const data: ModelInventory = {
      summary: {
        totalModels: models.length,
        providers: providersOut.length,
        localModels: models.filter((item) => item.provider === "ollama").length,
        paidModels: models.filter((item) => item.provider !== "ollama").length,
        estimatedMonthlySubs: null,
        estimatedApiSpend: null,
      },
      providers: providersOut,
      models,
      routing,
    };

    const sources: string[] = [];
    if (config) sources.push(configPath);
    if (agentModels) sources.push(agentModelsPath);

    const response: MissionApiResponse<ModelInventory> = {
      meta: buildMeta(
        models.length > 0 ? "ok" : sources.length > 0 ? "partial" : "unavailable",
        sources,
        models.length === 0 ? "No model definitions found in OpenClaw config files." : undefined,
      ),
      data,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        meta: buildMeta("unavailable", [], "Failed to read model inventory."),
        data: {
          summary: {
            totalModels: 0,
            providers: 0,
            localModels: 0,
            paidModels: 0,
            estimatedMonthlySubs: null,
            estimatedApiSpend: null,
          },
          providers: [],
          models: [],
          routing: [],
        },
        error: String(error),
      },
      { status: 500 },
    );
  }
}
