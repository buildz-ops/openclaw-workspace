"use client";

import { useEffect, useState } from "react";
import KpiTile from "@/components/kpi-tile";
import ReconciliationCard from "@/components/reconciliation-card";
import DataTable from "@/components/data-table";
import { 
  Inbox, 
  CheckSquare, 
  Calendar, 
  Activity, 
  DollarSign, 
  Users, 
  Target,
  Clock,
  TrendingUp 
} from "lucide-react";

export default function Home() {
  const [systemState, setSystemState] = useState<any>(null);
  const [agents, setAgents] = useState<any>(null);
  const [cronHealth, setCronHealth] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);
  const [contentPipeline, setContentPipeline] = useState<any>(null);

  useEffect(() => {
    // Fetch all data
    Promise.all([
      fetch("/api/system-state").then(r => r.json()),
      fetch("/api/agents").then(r => r.json()),
      fetch("/api/cron-health").then(r => r.json()),
      fetch("/api/revenue").then(r => r.json()),
      fetch("/api/content-pipeline").then(r => r.json()),
    ]).then(([sys, ag, cron, rev, content]) => {
      setSystemState(sys);
      setAgents(ag);
      setCronHealth(cron);
      setRevenue(rev);
      setContentPipeline(content);
    });
  }, []);

  if (!systemState || !agents || !cronHealth || !revenue || !contentPipeline) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-mission-cyan text-mono-upper tracking-widest">
          LOADING SYSTEMS...
        </div>
      </div>
    );
  }

  const cronColumns = [
    { key: "name", label: "JOB NAME" },
    { key: "schedule", label: "SCHEDULE" },
    { key: "lastRun", label: "LAST RUN" },
    { key: "status", label: "STATUS", align: "center" as const },
  ];

  const cronData = cronHealth.jobs.map((job: any) => ({
    ...job,
    status: (
      <span className={`status-dot ${job.status === "ok" ? "online" : "warning"}`}></span>
    ),
  }));

  const revenueColumns = [
    { key: "client", label: "CLIENT" },
    { key: "value", label: "VALUE", align: "right" as const },
    { key: "stage", label: "STAGE" },
  ];

  const revenueData = revenue.deals.map((deal: any) => ({
    ...deal,
    value: `$${deal.value.toLocaleString()}`,
  }));

  return (
    <div className="px-8 py-8 space-y-8">
      {/* Hero */}
      <div className="space-y-2">
        <h1 className="text-mono-upper text-4xl tracking-widest text-mission-cyan">
          COMMAND CENTER
        </h1>
        <p className="text-mission-text-secondary text-sm tracking-wide">
          Real-time operational intelligence and system monitoring
        </p>
      </div>

      {/* Reconciliation Panel - 3 Columns */}
      <div className="grid grid-cols-3 gap-6">
        <ReconciliationCard
          title="INTAKES"
          icon={<Inbox className="w-4 h-4" />}
          items={[
            { label: "Email", value: systemState.intakes.email, status: "ok" },
            { label: "Slack", value: systemState.intakes.slack, status: "ok" },
            { label: "Discord", value: systemState.intakes.discord, status: "ok" },
          ]}
        />
        <ReconciliationCard
          title="TASKS"
          icon={<CheckSquare className="w-4 h-4" />}
          items={[
            { label: "Pending", value: systemState.tasks.pending, status: "warning" },
            { label: "Active", value: systemState.tasks.active, status: "ok" },
            { label: "Completed", value: systemState.tasks.completed, status: "ok" },
          ]}
        />
        <ReconciliationCard
          title="SCHEDULED"
          icon={<Calendar className="w-4 h-4" />}
          items={[
            { label: "Today", value: systemState.scheduled.today, status: "ok" },
            { label: "This Week", value: systemState.scheduled.week, status: "ok" },
            { label: "Overdue", value: systemState.scheduled.overdue, status: "alert" },
          ]}
        />
      </div>

      {/* KPI Row - 5 Tiles */}
      <div className="grid grid-cols-5 gap-6">
        <KpiTile
          label="ITEMS TO REVIEW"
          value={contentPipeline.toReview}
          color="yellow"
          icon={<Activity className="w-4 h-4" />}
        />
        <KpiTile
          label="PIPELINE VALUE"
          value={`$${(revenue.current / 1000).toFixed(0)}K`}
          color="cyan"
          icon={<DollarSign className="w-4 h-4" />}
        />
        <KpiTile
          label="AGENTS HEALTH"
          value={`${agents.active}/${agents.total}`}
          color="green"
          icon={<Users className="w-4 h-4" />}
        />
        <KpiTile
          label="REVENUE"
          value={`${((revenue.current / revenue.target) * 100).toFixed(0)}%`}
          color="green"
          unit="OF TARGET"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <KpiTile
          label="TARGETS"
          value={contentPipeline.scheduled}
          color="cyan"
          icon={<Target className="w-4 h-4" />}
        />
      </div>

      {/* Bottom Section - 2 Columns */}
      <div className="grid grid-cols-[60%_40%] gap-6">
        <DataTable
          title="CRON HEALTH"
          icon={<Clock className="w-4 h-4" />}
          columns={cronColumns}
          data={cronData}
        />
        <DataTable
          title="REVENUE TRACKER"
          icon={<DollarSign className="w-4 h-4" />}
          columns={revenueColumns}
          data={revenueData}
        />
      </div>
    </div>
  );
}
