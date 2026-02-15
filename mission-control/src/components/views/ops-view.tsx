"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Server, Timer, Workflow } from "lucide-react";
import MissionDataGrid, { MissionColumn } from "@/components/mission/mission-data-grid";
import MissionPageHeader from "@/components/mission/mission-page-header";
import MissionPanel from "@/components/mission/mission-panel";
import MissionPill from "@/components/mission/mission-pill";
import MissionStatCard from "@/components/mission/mission-stat-card";
import MissionTabs from "@/components/mission/mission-tabs";
import { fetchMission } from "@/lib/fetch-mission";
import { CronJob, SystemState, TaskCard, TimelineEvent } from "@/lib/types/mission";

type OpsTab = "operations" | "tasks" | "calendar";

function relativeTime(iso: string | null): string {
  if (!iso) return "never";
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function toTimeline(priorities: TaskCard[], suggested: TaskCard[], cronJobs: CronJob[]): TimelineEvent[] {
  const out: TimelineEvent[] = [];
  const baseHour = 8;
  const queue = [...priorities, ...suggested].slice(0, 16);

  queue.forEach((task, index) => {
    const hour = (baseHour + index) % 24;
    out.push({
      id: `event-${index}`,
      timeLabel: `${String(hour).padStart(2, "0")}:00`,
      title: task.title,
      owner: "VEX",
      track: task.category,
      priority: task.priority,
    });
  });

  const heartbeat = cronJobs.find((job) => job.id === "heartbeat");
  if (heartbeat) {
    out.unshift({
      id: "event-heartbeat",
      timeLabel: "00:30",
      title: "Heartbeat status sweep",
      owner: "Watchdog",
      track: "Cron",
      priority: heartbeat.status === "healthy" ? "low" : "high",
    });
  }

  return out;
}

export default function OpsView() {
  const [tab, setTab] = useState<OpsTab>("operations");
  const [system, setSystem] = useState<SystemState | null>(null);
  const [cronJobs, setCronJobs] = useState<CronJob[]>([]);
  const [suggested, setSuggested] = useState<TaskCard[]>([]);
  const [priorities, setPriorities] = useState<TaskCard[]>([]);

  useEffect(() => {
    const pull = async () => {
      const [systemRes, cronRes, suggestedRes, prioritiesRes] = await Promise.all([
        fetchMission<SystemState>("/api/system-state"),
        fetchMission<{ jobs: CronJob[] }>("/api/cron-health"),
        fetchMission<{ tasks: TaskCard[] }>("/api/suggested-tasks"),
        fetchMission<{ priorities: TaskCard[] }>("/api/priorities"),
      ]);

      setSystem(systemRes.data);
      setCronJobs(cronRes.data.jobs);
      setSuggested(suggestedRes.data.tasks);
      setPriorities(prioritiesRes.data.priorities);
    };

    pull().catch(() => {
      setSystem(null);
      setCronJobs([]);
      setSuggested([]);
      setPriorities([]);
    });
  }, []);

  const columns: Array<MissionColumn<CronJob>> = useMemo(
    () => [
      { key: "name", label: "JOB" },
      { key: "schedule", label: "SCHEDULE" },
      {
        key: "status",
        label: "STATUS",
        render: (row) => (
          <MissionPill tone={row.status === "healthy" ? "ok" : row.status === "warning" ? "warn" : "critical"}>
            {row.status}
          </MissionPill>
        ),
      },
      {
        key: "lastRun",
        label: "LAST RUN",
        align: "right",
        render: (row) => relativeTime(row.lastRun),
      },
    ],
    [],
  );

  const timeline = useMemo(() => toTimeline(priorities, suggested, cronJobs), [priorities, suggested, cronJobs]);
  const healthyJobs = cronJobs.filter((job) => job.status === "healthy").length;

  return (
    <div className="mc-stack mc-route-layout">
      <MissionPageHeader
        title="Ops"
        subtitle="Live telemetry // cron health // observability // priority stack"
        rightSlot={<MissionPill tone="info">{new Date().toLocaleDateString()}</MissionPill>}
      />

      <MissionTabs
        tabs={[
          { id: "operations", label: "Operations" },
          { id: "tasks", label: "Tasks", badge: suggested.length },
          { id: "calendar", label: "Calendar", badge: timeline.length },
        ]}
        active={tab}
        onChange={(id) => setTab(id as OpsTab)}
      />

      {tab === "operations" ? (
        <section className="mc-ops-operations">
          <section className="mc-grid-4">
            <MissionStatCard label="Status" value={system?.status?.toUpperCase() || "OFFLINE"} tone="ok" icon={<Server size={14} />} />
            <MissionStatCard label="Uptime" value={system?.uptimeLabel || "n/a"} tone="info" icon={<Timer size={14} />} />
            <MissionStatCard label="Cron Healthy" value={`${healthyJobs}/${cronJobs.length}`} tone="warn" icon={<Workflow size={14} />} />
            <MissionStatCard label="Memory" value={`${system?.memory.percentage ?? 0}%`} tone="critical" icon={<RefreshCw size={14} />} />
          </section>

          <MissionPanel className="mc-route-panel" title="Cron Health" subtitle="Workspace heartbeat and scheduler status">
            <div className="mc-scroll-area">
              <MissionDataGrid columns={columns} rows={cronJobs} emptyText="No cron jobs detected." />
            </div>
          </MissionPanel>
        </section>
      ) : null}

      {tab === "tasks" ? (
        <MissionPanel className="mc-route-panel" title="Strategic Task Suggestion" subtitle="Real queue + tracker suggestions only">
          <div className="mc-list mc-scroll-area">
            {[...priorities, ...suggested].slice(0, 12).map((task) => (
              <article className="mc-list-item" key={task.id}>
                <div className="mc-row">
                  <p className="mc-list-title">{task.title}</p>
                  <div className="mc-row mc-pill-group">
                    <MissionPill tone={task.priority === "high" ? "critical" : task.priority === "medium" ? "warn" : "neutral"}>
                      {task.priority}
                    </MissionPill>
                    <MissionPill tone="info">{task.status}</MissionPill>
                  </div>
                </div>
                <p className="mc-list-sub">{task.category}</p>
                <div className="mc-button-row">
                  <button type="button" className="mc-btn mc-btn-approve">
                    Approve
                  </button>
                  <button type="button" className="mc-btn mc-btn-reject">
                    Reject
                  </button>
                </div>
              </article>
            ))}
            {priorities.length + suggested.length === 0 ? (
              <article className="mc-list-item">
                <p className="mc-list-sub">No tasks available from queue or tracker sources.</p>
              </article>
            ) : null}
          </div>
        </MissionPanel>
      ) : null}

      {tab === "calendar" ? (
        <MissionPanel className="mc-route-panel" title="Calendar Timeline" subtitle="Derived from queue priorities + heartbeat cadence">
          <div className="mc-list mc-scroll-area">
            {timeline.map((event) => (
              <article className="mc-list-item" key={event.id}>
                <div className="mc-row">
                  <p className="mc-list-title">
                    {event.timeLabel} · {event.title}
                  </p>
                  <MissionPill tone={event.priority === "high" ? "critical" : event.priority === "medium" ? "warn" : "ok"}>
                    {event.priority}
                  </MissionPill>
                </div>
                <p className="mc-list-sub">
                  {event.owner} · {event.track}
                </p>
              </article>
            ))}
            {timeline.length === 0 ? (
              <article className="mc-list-item">
                <p className="mc-list-sub">No timeline events can be derived from current sources.</p>
              </article>
            ) : null}
          </div>
        </MissionPanel>
      ) : null}
    </div>
  );
}
