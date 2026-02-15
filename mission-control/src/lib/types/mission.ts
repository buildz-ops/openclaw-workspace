export type MissionDataStatus = "ok" | "partial" | "unavailable";

export interface MissionMeta {
  status: MissionDataStatus;
  updatedAt: string;
  source: string[];
  note?: string;
}

export interface MissionApiResponse<T> {
  meta: MissionMeta;
  data: T;
}

export interface SystemState {
  status: "working" | "active" | "idle" | "stale" | "offline";
  uptimeSeconds: number;
  uptimeLabel: string;
  lastActivity: string | null;
  workspace: string;
  memory: {
    totalMb: number;
    usedMb: number;
    freeMb: number;
    percentage: number;
  };
  cpu: {
    cores: number;
    model: string;
  };
  platform: {
    type: string;
    release: string;
    arch: string;
  };
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  lastRun: string | null;
  status: "healthy" | "warning" | "stale" | "offline";
  details?: string;
  errorCount?: number;
}

export interface TaskCard {
  id: string;
  title: string;
  category: string;
  priority: "high" | "medium" | "low" | "unknown";
  status: "ready" | "in-progress" | "blocked" | "done" | "unknown";
  whyNow?: string;
  nextAction?: string;
  blocker?: string;
}

export interface TimelineEvent {
  id: string;
  timeLabel: string;
  title: string;
  owner: string;
  track: string;
  priority: string;
}

export interface AgentSummary {
  id: string;
  name: string;
  role: string;
  status: "active" | "idle" | "stale" | "offline";
  model: string;
  lastSeen: string | null;
}

export interface ModelProviderSummary {
  id: string;
  baseUrl: string;
  modelCount: number;
}

export interface ModelRecord {
  id: string;
  provider: string;
  name: string;
  alias?: string;
  reasoning: boolean;
  input: string[];
  contextWindow?: number;
  maxTokens?: number;
}

export interface ModelRoutingRule {
  task: string;
  primary: string;
  fallback?: string;
}

export interface ModelInventory {
  summary: {
    totalModels: number;
    providers: number;
    localModels: number;
    paidModels: number;
    estimatedMonthlySubs: number | null;
    estimatedApiSpend: number | null;
  };
  providers: ModelProviderSummary[];
  models: ModelRecord[];
  routing: ModelRoutingRule[];
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  path: string;
  modifiedAt: string;
  sizeBytes: number;
  tags: string[];
  excerpt: string;
}

export interface RepoHealth {
  id: string;
  name: string;
  path: string;
  branch: string;
  status: "clean" | "dirty" | "missing";
  changed: number;
  untracked: number;
  ahead: number;
  behind: number;
  lastCommit: string | null;
}

export interface CommsItem {
  id: string;
  name: string;
  type: string;
  status: string;
  details?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  status: string;
  sourcePath: string;
  updatedAt: string;
}

export interface ContentPipeline {
  intakes: {
    total: number;
    linked: number;
    orphaned: number;
  };
  tasks: {
    total: number;
    completed: number;
    pending: number;
  };
  scheduled: {
    total: number;
    thisWeek: number;
    thisMonth: number;
  };
  revenue: {
    totalEarned: number;
    pendingPayment: number;
    paidOut: number;
    breakdown: Array<{ source: string; amount: number }>;
  };
  recentItems: ContentItem[];
}

export interface RevenueSummary {
  current: number;
  target: number;
  growth: number;
  mrr: number;
}
