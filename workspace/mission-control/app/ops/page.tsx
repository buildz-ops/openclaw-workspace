"use client";

import { useEffect, useState } from "react";
import KpiTile from "@/components/kpi-tile";
import DataTable from "@/components/data-table";
import { Server, Cpu, HardDrive, Network } from "lucide-react";

export default function OpsPage() {
  const [cronHealth, setCronHealth] = useState<any>(null);

  useEffect(() => {
    fetch("/api/cron-health").then(r => r.json()).then(setCronHealth);
  }, []);

  if (!cronHealth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-mission-cyan text-mono-upper tracking-widest">
          LOADING OPS DATA...
        </div>
      </div>
    );
  }

  const columns = [
    { key: "name", label: "JOB NAME" },
    { key: "schedule", label: "SCHEDULE" },
    { key: "lastRun", label: "LAST RUN" },
    { key: "status", label: "STATUS", align: "center" as const },
  ];

  const data = cronHealth.jobs.map((job: any) => ({
    ...job,
    status: (
      <span className={`status-dot ${job.status === "ok" ? "online" : "warning"}`}></span>
    ),
  }));

  return (
    <div className="px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-mono-upper text-4xl tracking-widest text-mission-cyan">
          OPERATIONS
        </h1>
        <p className="text-mission-text-secondary text-sm tracking-wide">
          Infrastructure monitoring and job management
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <KpiTile
          label="SERVICES UP"
          value="12"
          color="green"
          icon={<Server className="w-4 h-4" />}
        />
        <KpiTile
          label="CPU USAGE"
          value="34"
          color="cyan"
          unit="%"
          icon={<Cpu className="w-4 h-4" />}
        />
        <KpiTile
          label="DISK USAGE"
          value="67"
          color="yellow"
          unit="%"
          icon={<HardDrive className="w-4 h-4" />}
        />
        <KpiTile
          label="NETWORK"
          value="OK"
          color="green"
          icon={<Network className="w-4 h-4" />}
        />
      </div>

      <DataTable
        title="SCHEDULED JOBS"
        columns={columns}
        data={data}
      />
    </div>
  );
}
