"use client";

import { useEffect, useMemo, useState } from "react";
import { Bot, BrainCircuit, Cable, Cpu } from "lucide-react";
import MissionDataGrid, { MissionColumn } from "@/components/mission/mission-data-grid";
import MissionPageHeader from "@/components/mission/mission-page-header";
import MissionPanel from "@/components/mission/mission-panel";
import MissionPill from "@/components/mission/mission-pill";
import MissionStatCard from "@/components/mission/mission-stat-card";
import MissionTabs from "@/components/mission/mission-tabs";
import { fetchMission } from "@/lib/fetch-mission";
import { AgentSummary, ModelInventory, ModelRecord } from "@/lib/types/mission";

type AgentsTab = "agents" | "models";

export default function AgentsView() {
  const [tab, setTab] = useState<AgentsTab>("agents");
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [models, setModels] = useState<ModelInventory | null>(null);

  useEffect(() => {
    const pull = async () => {
      const [agentsRes, modelsRes] = await Promise.all([
        fetchMission<{ agents: AgentSummary[] }>("/api/agents"),
        fetchMission<ModelInventory>("/api/models"),
      ]);
      setAgents(agentsRes.data.agents);
      setModels(modelsRes.data);
    };

    pull().catch(() => {
      setAgents([]);
      setModels(null);
    });
  }, []);

  const activeAgents = agents.filter((agent) => agent.status === "active").length;

  const modelColumns: Array<MissionColumn<ModelRecord>> = useMemo(
    () => [
      { key: "id", label: "MODEL" },
      { key: "provider", label: "PROVIDER" },
      {
        key: "reasoning",
        label: "CAPABILITIES",
        render: (row) => `${row.reasoning ? "reasoning" : "standard"} · ${row.input.join(",")}`,
      },
      {
        key: "contextWindow",
        label: "CONTEXT",
        align: "right",
        render: (row) => (row.contextWindow ? row.contextWindow.toLocaleString() : "-") as string,
      },
    ],
    [],
  );

  return (
    <div className="mc-stack mc-route-layout-kpi">
      <MissionPageHeader title="Agents" subtitle="Execution surface // model inventory // routing map" />

      <MissionTabs
        tabs={[
          { id: "agents", label: "Agents", badge: agents.length },
          { id: "models", label: "Models", badge: models?.summary.totalModels ?? 0 },
        ]}
        active={tab}
        onChange={(id) => setTab(id as AgentsTab)}
      />

      <section className="mc-grid-4">
        <MissionStatCard
          label="Total Models"
          value={models?.summary.totalModels ?? 0}
          tone="info"
          icon={<BrainCircuit size={14} />}
        />
        <MissionStatCard
          label="Active Agents"
          value={`${activeAgents}/${agents.length}`}
          tone={activeAgents > 0 ? "ok" : "critical"}
          icon={<Bot size={14} />}
        />
        <MissionStatCard
          label="Monthly Subs"
          value={models?.summary.estimatedMonthlySubs ?? "N/A"}
          tone="warn"
          icon={<Cable size={14} />}
          detail="If available from source"
        />
        <MissionStatCard
          label="API Spend"
          value={models?.summary.estimatedApiSpend ?? "N/A"}
          tone="critical"
          icon={<Cpu size={14} />}
          detail="Not exposed in config"
        />
      </section>

      {tab === "agents" ? (
        <MissionPanel className="mc-route-panel" title="Agent Runtime" subtitle="Derived from session and OpenClaw config">
          <div className="mc-scroll-area">
            <div className="mc-list mc-scroll-list">
              {agents.map((agent) => (
                <article key={agent.id} className="mc-list-item">
                  <div className="mc-row">
                    <p className="mc-list-title">{agent.name}</p>
                    <MissionPill tone={agent.status === "active" ? "ok" : agent.status === "idle" ? "warn" : "critical"}>
                      {agent.status}
                    </MissionPill>
                  </div>
                  <p className="mc-list-sub">
                    {agent.role} · {agent.model}
                  </p>
                </article>
              ))}
              {agents.length === 0 ? (
                <article className="mc-list-item">
                  <p className="mc-list-sub">No agent source data available.</p>
                </article>
              ) : null}
            </div>
          </div>
        </MissionPanel>
      ) : null}

      {tab === "models" ? (
        <section className="mc-dual-stack">
          <MissionPanel className="mc-route-panel" title="Task Routing" subtitle="Primary/fallback policy from OpenClaw config">
            <div className="mc-scroll-area">
              <div className="mc-list mc-scroll-list">
                {(models?.routing || []).map((route) => (
                  <article className="mc-list-item" key={route.task}>
                    <div className="mc-row">
                      <p className="mc-list-title">{route.task}</p>
                      <MissionPill tone="info">{route.primary}</MissionPill>
                    </div>
                    <p className="mc-list-sub">Fallback: {route.fallback || "none"}</p>
                  </article>
                ))}
              </div>
            </div>
          </MissionPanel>

          <MissionPanel className="mc-route-panel" title="Model Inventory" subtitle="Sanitized provider/model metadata">
            <div className="mc-scroll-area">
              <MissionDataGrid columns={modelColumns} rows={models?.models || []} emptyText="No model definitions found." />
            </div>
          </MissionPanel>
        </section>
      ) : null}
    </div>
  );
}
