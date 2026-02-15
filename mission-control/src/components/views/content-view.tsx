"use client";

import { useEffect, useState } from "react";
import MissionPageHeader from "@/components/mission/mission-page-header";
import MissionPanel from "@/components/mission/mission-panel";
import MissionPill from "@/components/mission/mission-pill";
import MissionStatCard from "@/components/mission/mission-stat-card";
import { fetchMission } from "@/lib/fetch-mission";
import { ContentPipeline } from "@/lib/types/mission";

export default function ContentView() {
  const [pipeline, setPipeline] = useState<ContentPipeline | null>(null);

  useEffect(() => {
    fetchMission<ContentPipeline>("/api/content-pipeline")
      .then((res) => setPipeline(res.data))
      .catch(() => setPipeline(null));
  }, []);

  return (
    <div className="mc-stack mc-route-layout-kpi">
      <MissionPageHeader title="Content" subtitle="Pipeline telemetry // memory-derived items" />

      <section className="mc-grid-4">
        <MissionStatCard label="Intakes" value={pipeline?.intakes.total ?? 0} tone="info" />
        <MissionStatCard label="Linked" value={pipeline?.intakes.linked ?? 0} tone="ok" />
        <MissionStatCard label="Queue Pending" value={pipeline?.tasks.pending ?? 0} tone="warn" />
        <MissionStatCard label="Scheduled" value={pipeline?.scheduled.total ?? 0} tone="neutral" />
      </section>

      <MissionPanel title="Revenue" subtitle="Real source only (notes/areas/revenue.md when available)">
        <div className="mc-grid-3">
          <MissionStatCard label="Total Earned" value={pipeline?.revenue.totalEarned ?? 0} tone="ok" />
          <MissionStatCard label="Pending" value={pipeline?.revenue.pendingPayment ?? 0} tone="warn" />
          <MissionStatCard label="Paid Out" value={pipeline?.revenue.paidOut ?? 0} tone="info" />
        </div>
      </MissionPanel>

      <MissionPanel className="mc-route-panel" title="Recent Content Sources" subtitle="Latest docs from memory and notes">
        <div className="mc-list mc-scroll-area">
          {(pipeline?.recentItems || []).map((item) => (
            <article className="mc-list-item" key={item.id}>
              <div className="mc-row">
                <p className="mc-list-title">{item.title}</p>
                <MissionPill tone="neutral">{item.status}</MissionPill>
              </div>
              <p className="mc-list-sub">{item.sourcePath}</p>
            </article>
          ))}
          {pipeline?.recentItems.length === 0 ? (
            <article className="mc-list-item">
              <p className="mc-list-sub">No content sources found in workspace memory/notes.</p>
            </article>
          ) : null}
        </div>
      </MissionPanel>
    </div>
  );
}
