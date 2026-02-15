import fs from "fs";
import { NextResponse } from "next/server";
import { buildMeta } from "@/lib/workspace/meta";
import { workspacePath } from "@/lib/workspace/paths";
import { readOpenClawConfig } from "@/lib/workspace/openclaw-config";

interface ChatHistoryItem {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  message?: string;
  history?: ChatHistoryItem[];
}

interface ChatSendData {
  accepted: boolean;
  timestamp: string;
  assistant?: string;
  model?: string;
  latencyMs?: number;
}

const DEFAULT_OLLAMA_BASE = "http://127.0.0.1:11434";
const DEFAULT_MODEL = "llama3.2:3b";
const REQUEST_TIMEOUT_MS = 25000;
const SYSTEM_PROMPT =
  "You are VEX mission control assistant. Respond concisely, action-first, and grounded in the user's request.";

function sanitizeLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeOllamaBase(raw: string | undefined): string {
  const input = (raw || DEFAULT_OLLAMA_BASE).trim().replace(/\/+$/, "");
  return input.endsWith("/v1") ? input.slice(0, -3) : input;
}

function toOllamaModelId(raw: string | undefined): string | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;
  if (!value.includes("/")) return value;

  const [provider, ...rest] = value.split("/");
  if (provider !== "ollama") return null;

  const modelId = rest.join("/").trim();
  return modelId || null;
}

async function callOllama(
  baseUrl: string,
  model: string,
  message: string,
  history: ChatHistoryItem[],
): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const normalizedHistory = history
      .filter((item) => (item.role === "user" || item.role === "assistant") && item.content.trim().length > 0)
      .slice(-10)
      .map((item) => ({
        role: item.role,
        content: sanitizeLine(item.content),
      }));

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      cache: "no-store",
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 400,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...normalizedHistory,
          { role: "user", content: sanitizeLine(message) },
        ],
      }),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = payload?.choices?.[0]?.message?.content?.trim();
    if (!content) return null;
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

function appendMemoryLine(filePath: string, role: "User" | "Assistant", content: string, timestamp: string) {
  fs.appendFileSync(filePath, `\n[${timestamp}] ${role}: ${sanitizeLine(content)}\n`);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ChatRequest;
    const message = (payload.message || "").trim();
    const history = payload.history || [];

    if (!message) {
      return NextResponse.json(
        {
          meta: buildMeta("partial", [], "Empty message payload."),
          data: { accepted: false } as ChatSendData,
        },
        { status: 400 },
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    const memoryDir = workspacePath("memory");
    const memoryPath = workspacePath("memory", `${today}.md`);
    const timestamp = new Date().toISOString();
    const sources: string[] = [memoryPath];

    fs.mkdirSync(memoryDir, { recursive: true });
    if (!fs.existsSync(memoryPath)) {
      fs.writeFileSync(memoryPath, `# ${today} Memory Log\n`, "utf-8");
    }

    appendMemoryLine(memoryPath, "User", message, timestamp);

    const { path: configPath, config } = readOpenClawConfig();
    const baseUrl = normalizeOllamaBase(
      process.env.OPENCLAW_CHAT_BASE_URL ||
        process.env.OLLAMA_BASE_URL ||
        config?.models?.providers?.ollama?.baseUrl,
    );
    const providerDefinedModels = (config?.models?.providers?.ollama?.models || [])
      .map((entry) => (typeof entry.id === "string" ? entry.id : null))
      .filter((entry): entry is string => Boolean(entry));

    const modelCandidates = Array.from(
      new Set([
        toOllamaModelId(process.env.OPENCLAW_CHAT_MODEL),
        toOllamaModelId(config?.agents?.defaults?.heartbeat?.model),
        ...providerDefinedModels.map((entry) => toOllamaModelId(entry)),
        toOllamaModelId(DEFAULT_MODEL),
      ].filter((item): item is string => Boolean(item))),
    );

    sources.push(configPath);

    const startedAt = Date.now();
    let assistant = "";
    let selectedModel = "";

    for (const candidate of modelCandidates) {
      const response = await callOllama(baseUrl, candidate, message, history);
      if (!response) continue;
      assistant = response;
      selectedModel = candidate;
      break;
    }

    if (!assistant) {
      return NextResponse.json({
        meta: buildMeta(
          "partial",
          sources,
          "Message stored, but no assistant response was generated. Check local model service.",
        ),
        data: {
          accepted: true,
          timestamp,
        } as ChatSendData,
      });
    }

    appendMemoryLine(memoryPath, "Assistant", assistant, new Date().toISOString());

    return NextResponse.json({
      meta: buildMeta("ok", sources),
      data: {
        accepted: true,
        timestamp,
        assistant,
        model: selectedModel,
        latencyMs: Date.now() - startedAt,
      } as ChatSendData,
    });
  } catch (error) {
    return NextResponse.json(
      {
        meta: buildMeta("unavailable", [], "Failed to send chat message."),
        data: { accepted: false, timestamp: new Date().toISOString() } as ChatSendData,
        error: String(error),
      },
      { status: 500 },
    );
  }
}
