"use client";

import { useEffect, useState } from "react";
import MissionPanel from "@/components/mission/mission-panel";
import MissionStatCard from "@/components/mission/mission-stat-card";
import { fetchMission } from "@/lib/fetch-mission";
import { AgentSummary, CronJob, SystemState } from "@/lib/types/mission";

export default function DashboardOverview() {
  const [system, setSystem] = useState<SystemState | null>(null);
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [cron, setCron] = useState<CronJob[]>([]);

  useEffect(() => {
    Promise.all([
      fetchMission<SystemState>("/api/system-state"),
      fetchMission<{ agents: AgentSummary[] }>("/api/agents"),
      fetchMission<{ jobs: CronJob[] }>("/api/cron-health"),
    ])
      .then(([systemRes, agentsRes, cronRes]) => {
        setSystem(systemRes.data);
        setAgents(agentsRes.data.agents);
        setCron(cronRes.data.jobs);
      })
      .catch(() => {
        setSystem(null);
        setAgents([]);
        setCron([]);
      });
  }, []);

  const activeAgents = agents.filter((agent) => agent.status === "active").length;
  const healthyJobs = cron.filter((job) => job.status === "healthy").length;

  return (
    <MissionPanel title="Overview" subtitle="Quick system digest">
      <div className="mc-grid-3">
        <MissionStatCard label="System" value={system?.status || "offline"} tone="ok" />
        <MissionStatCard label="Agents" value={`${activeAgents}/${agents.length}`} tone="info" />
        <MissionStatCard label="Cron" value={`${healthyJobs}/${cron.length}`} tone="warn" />
      </div>
    </MissionPanel>
  );
}
