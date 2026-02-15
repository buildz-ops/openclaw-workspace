"use client";

import { useEffect, useMemo, useState } from "react";
import { Bot, CircleDollarSign, ClipboardList, Database, Radar } from "lucide-react";
import MissionDataGrid, { MissionColumn } from "@/components/mission/mission-data-grid";
import MissionPageHeader from "@/components/mission/mission-page-header";
import MissionPanel from "@/components/mission/mission-panel";
import MissionPill from "@/components/mission/mission-pill";
import MissionShell from "@/components/mission/mission-shell";
import MissionStatCard from "@/components/mission/mission-stat-card";
import { fetchMission } from "@/lib/fetch-mission";
import { CommsItem, ContentPipeline, CronJob, SystemState, TaskCard } from "@/lib/types/mission";

interface HomePayload {
  system: SystemState | null;
  cron: CronJob[];
  pipeline: ContentPipeline | null;
  priorities: TaskCard[];
  clients: CommsItem[];
}

const defaultPayload: HomePayload = {
  system: null,
  cron: [],
  pipeline: null,
  priorities: [],
  clients: [],
};

function relativeTime(iso: string | null): string {
  if (!iso) return "N/A";
  const deltaMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(deltaMs / 60000);
  if (mins < 1) return "JUST NOW";
  if (mins < 60) return `${mins}M AGO`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}H AGO`;
  return `${Math.floor(hours / 24)}D AGO`;
}

function nextRun(schedule: string, lastRun: string | null): string {
  if (!lastRun) return "N/A";
  const base = new Date(lastRun);
  const value = schedule.toLowerCase();

  if (value.includes("15m")) base.setMinutes(base.getMinutes() + 15);
  else if (value.includes("30m")) base.setMinutes(base.getMinutes() + 30);
  else if (value.includes("hour")) base.setHours(base.getHours() + 1);
  else if (value.includes("daily")) base.setDate(base.getDate() + 1);
  else if (value.includes("continuous")) return "LIVE";
  else return "TBD";

  return base.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function asMoney(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value}`;
}

export default function HomePage() {
  const [payload, setPayload] = useState<HomePayload>(defaultPayload);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pull = async () => {
      try {
        const [systemRes, cronRes, pipelineRes, prioritiesRes, clientsRes] = await Promise.all([
          fetchMission<SystemState>("/api/system-state"),
          fetchMission<{ jobs: CronJob[] }>("/api/cron-health"),
          fetchMission<ContentPipeline>("/api/content-pipeline"),
          fetchMission<{ priorities: TaskCard[] }>("/api/priorities"),
          fetchMission<{ clients: CommsItem[] }>("/api/clients"),
        ]);

        setPayload({
          system: systemRes.data,
          cron: cronRes.data.jobs,
          pipeline: pipelineRes.data,
          priorities: prioritiesRes.data.priorities,
          clients: clientsRes.data.clients,
        });
      } catch {
        setPayload(defaultPayload);
      } finally {
        setLoading(false);
      }
    };

    pull();
    const interval = setInterval(pull, 30000);
    return () => clearInterval(interval);
  }, []);

  const cronColumns: Array<MissionColumn<CronJob>> = useMemo(
    () => [
      { key: "name", label: "JOB" },
      {
        key: "status",
        label: "STATUS",
        render: (row) => (
          <div className="mc-row mc-status-inline">
            <span className={`mc-status-dot mc-status-${row.status === "healthy" ? "active" : row.status === "warning" ? "idle" : "stale"}`} />
            <span>{row.status.toUpperCase()}</span>
          </div>
        ),
      },
      {
        key: "errorCount",
        label: "ERRORS",
        align: "center",
        render: (row) => String(row.errorCount ?? 0),
      },
      {
        key: "lastRun",
        label: "LAST RUN",
        align: "right",
        render: (row) => relativeTime(row.lastRun),
      },
      {
        key: "nextRun",
        label: "NEXT RUN",
        align: "right",
        render: (row) => nextRun(row.schedule, row.lastRun),
      },
    ],
    [],
  );

  const healthyJobs = payload.cron.filter((job) => job.status === "healthy").length;
  const issuesDetected =
    (payload.pipeline?.intakes.orphaned ?? 0) +
    payload.cron.filter((job) => job.status !== "healthy").length +
    payload.priorities.filter((task) => task.priority === "high").length;

  const tasksTotal = payload.pipeline?.tasks.total ?? 0;
  const tasksPending = payload.pipeline?.tasks.pending ?? 0;
  const scheduledTotal = payload.pipeline?.scheduled.total ?? 0;

  return (
    <MissionShell>
      <div className="mc-home-layout">
        <MissionPageHeader
          title="Command Center"
          subtitle="VEX Operations // System Status"
          rightSlot={loading ? <MissionPill tone="info">Refreshing</MissionPill> : <MissionPill tone="ok">Live</MissionPill>}
        />

        <MissionPanel
          title="Reconciliation"
          rightSlot={
            <MissionPill tone={issuesDetected > 0 ? "critical" : "ok"}>
              {issuesDetected > 0 ? `${issuesDetected} Issues Detected` : "No Issues"}
            </MissionPill>
          }
        >
          <div className="mc-command-triad">
            <article className="mc-command-mini">
              <h3 className="mc-command-mini-title">Intakes</h3>
              <div className="mc-metric-list">
                <div className="mc-metric-line"><span>Total</span><strong>{payload.pipeline?.intakes.total ?? 0}</strong></div>
                <div className="mc-metric-line"><span>Linked</span><strong>{payload.pipeline?.intakes.linked ?? 0}</strong></div>
                <div className="mc-metric-line"><span>Orphaned</span><strong>{payload.pipeline?.intakes.orphaned ?? 0}</strong></div>
              </div>
            </article>

            <article className="mc-command-mini">
              <h3 className="mc-command-mini-title">Tasks</h3>
              <div className="mc-metric-list">
                <div className="mc-metric-line"><span>Total</span><strong>{tasksTotal}</strong></div>
                <div className="mc-metric-line"><span>Proposed</span><strong>{tasksPending}</strong></div>
                <div className="mc-metric-line"><span>Completed</span><strong>{payload.pipeline?.tasks.completed ?? 0}</strong></div>
                <div className="mc-metric-line"><span>Rejected</span><strong>0</strong></div>
              </div>
            </article>

            <article className="mc-command-mini">
              <h3 className="mc-command-mini-title">Scheduled</h3>
              <div className="mc-metric-list">
                <div className="mc-metric-line"><span>Total</span><strong>{scheduledTotal}</strong></div>
                <div className="mc-metric-line"><span>This Week</span><strong>{payload.pipeline?.scheduled.thisWeek ?? 0}</strong></div>
                <div className="mc-metric-line"><span>This Month</span><strong>{payload.pipeline?.scheduled.thisMonth ?? 0}</strong></div>
              </div>
            </article>
          </div>
        </MissionPanel>

        <section className="mc-command-kpis">
          <MissionStatCard
            label="Tasks to Review"
            value={payload.priorities.length}
            tone="warn"
            detail="Queue"
            icon={<ClipboardList size={14} />}
          />
          <MissionStatCard
            label="Pipeline Value"
            value={asMoney(payload.pipeline?.revenue.totalEarned ?? 0)}
            tone="ok"
            detail="Source-derived"
            icon={<CircleDollarSign size={14} />}
          />
          <MissionStatCard
            label="Agents Health"
            value={`${healthyJobs}/${payload.cron.length}`}
            tone={healthyJobs === payload.cron.length && payload.cron.length > 0 ? "ok" : "info"}
            detail="Schedulers healthy"
            icon={<Bot size={14} />}
          />
          <MissionStatCard
            label="Pending"
            value={asMoney(payload.pipeline?.revenue.pendingPayment ?? 0)}
            tone="critical"
            detail="Awaiting payout"
            icon={<Radar size={14} />}
          />
          <MissionStatCard
            label="Clients"
            value={payload.clients.length}
            tone="info"
            detail="Tracked sources"
            icon={<Database size={14} />}
          />
        </section>

        <section className="mc-command-bottom">
          <MissionPanel className="mc-home-cron" title="Cron Health" subtitle="Job // Status // Errors // Last Run // Next Run">
            <MissionDataGrid columns={cronColumns} rows={payload.cron} emptyText="No cron sources detected." />
          </MissionPanel>

          <MissionPanel className="mc-home-revenue" title="Revenue Tracker" subtitle="Pipeline and opportunities">
            <div className="mc-stack">
              <div className="mc-grid-2">
                <article className="mc-command-mini">
                  <p className="mc-list-sub">Current</p>
                  <p className="mc-list-title mc-inline-stat">{asMoney(payload.pipeline?.revenue.totalEarned ?? 0)}</p>
                </article>
                <article className="mc-command-mini">
                  <p className="mc-list-sub">Pending</p>
                  <p className="mc-list-title mc-inline-stat">{asMoney(payload.pipeline?.revenue.pendingPayment ?? 0)}</p>
                </article>
              </div>

              <div className="mc-list-item">
                <p className="mc-list-sub">Pipeline Status</p>
                <p className="mc-list-sub">Ready: {tasksTotal - tasksPending}</p>
                <p className="mc-list-sub">Immediate: {tasksPending}</p>
                <p className="mc-list-sub">Backlog: {payload.pipeline?.intakes.orphaned ?? 0}</p>
              </div>

              <div className="mc-list-item">
                <p className="mc-list-sub">Top Opportunities</p>
                {(payload.priorities.slice(0, 3) || []).map((task) => (
                  <p key={task.id} className="mc-list-sub">• {task.title}</p>
                ))}
                {payload.priorities.length === 0 ? <p className="mc-list-sub">No priority opportunities found.</p> : null}
              </div>
            </div>
          </MissionPanel>
        </section>
      </div>
    </MissionShell>
  );
}
