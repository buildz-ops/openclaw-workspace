"use client";

import { useEffect, useState } from "react";
import KpiTile from "@/components/kpi-tile";
import DataTable from "@/components/data-table";
import { FileText, Eye, Edit, Calendar } from "lucide-react";

export default function ContentPage() {
  const [contentPipeline, setContentPipeline] = useState<any>(null);

  useEffect(() => {
    fetch("/api/content-pipeline").then(r => r.json()).then(setContentPipeline);
  }, []);

  if (!contentPipeline) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-mission-cyan text-mono-upper tracking-widest">
          LOADING CONTENT DATA...
        </div>
      </div>
    );
  }

  const columns = [
    { key: "title", label: "TITLE" },
    { key: "status", label: "STATUS" },
    { key: "assignee", label: "ASSIGNEE" },
  ];

  const data = contentPipeline.items.map((item: any) => ({
    ...item,
    status: (
      <span className={`text-mono-upper text-xs ${
        item.status === "review" ? "text-mission-yellow" :
        item.status === "in-progress" ? "text-mission-cyan" :
        "text-mission-text-secondary"
      }`}>
        {item.status}
      </span>
    ),
  }));

  return (
    <div className="px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-mono-upper text-4xl tracking-widest text-mission-cyan">
          CONTENT
        </h1>
        <p className="text-mission-text-secondary text-sm tracking-wide">
          Content pipeline and publishing workflow
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <KpiTile
          label="TO REVIEW"
          value={contentPipeline.toReview}
          color="yellow"
          icon={<Eye className="w-4 h-4" />}
        />
        <KpiTile
          label="IN PROGRESS"
          value={contentPipeline.inProgress}
          color="cyan"
          icon={<Edit className="w-4 h-4" />}
        />
        <KpiTile
          label="PUBLISHED"
          value={contentPipeline.published}
          color="green"
          icon={<FileText className="w-4 h-4" />}
        />
        <KpiTile
          label="SCHEDULED"
          value={contentPipeline.scheduled}
          color="cyan"
          icon={<Calendar className="w-4 h-4" />}
        />
      </div>

      <DataTable
        title="CONTENT ITEMS"
        columns={columns}
        data={data}
      />
    </div>
  );
}
