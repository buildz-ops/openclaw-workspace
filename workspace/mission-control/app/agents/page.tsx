"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/data-table";
import KpiTile from "@/components/kpi-tile";
import { Bot, Activity, AlertCircle, CheckCircle } from "lucide-react";

export default function AgentsPage() {
  const [agents, setAgents] = useState<any>(null);

  useEffect(() => {
    fetch("/api/agents").then(r => r.json()).then(setAgents);
  }, []);

  if (!agents) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-mission-cyan text-mono-upper tracking-widest">
          LOADING AGENTS...
        </div>
      </div>
    );
  }

  const columns = [
    { key: "name", label: "AGENT NAME" },
    { key: "status", label: "STATUS" },
    { key: "uptime", label: "UPTIME", align: "right" as const },
  ];

  const data = agents.agents.map((agent: any) => ({
    ...agent,
    status: (
      <div className="flex items-center gap-2">
        <span className={`status-dot ${agent.status === "active" ? "online" : "warning"}`}></span>
        <span className="text-mono-upper text-xs">{agent.status}</span>
      </div>
    ),
  }));

  return (
    <div className="px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-mono-upper text-4xl tracking-widest text-mission-cyan">
          AGENTS
        </h1>
        <p className="text-mission-text-secondary text-sm tracking-wide">
          Autonomous agent monitoring and control
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <KpiTile
          label="TOTAL AGENTS"
          value={agents.total}
          color="cyan"
          icon={<Bot className="w-4 h-4" />}
        />
        <KpiTile
          label="ACTIVE"
          value={agents.active}
          color="green"
          icon={<CheckCircle className="w-4 h-4" />}
        />
        <KpiTile
          label="IDLE"
          value={agents.idle}
          color="yellow"
          icon={<Activity className="w-4 h-4" />}
        />
        <KpiTile
          label="HEALTH"
          value={agents.health.toUpperCase()}
          color="green"
          icon={<AlertCircle className="w-4 h-4" />}
        />
      </div>

      <DataTable
        title="AGENT STATUS"
        columns={columns}
        data={data}
      />
    </div>
  );
}
