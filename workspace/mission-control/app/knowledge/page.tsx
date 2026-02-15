"use client";

import KpiTile from "@/components/kpi-tile";
import { BookOpen, Database, FileSearch, Link } from "lucide-react";

export default function KnowledgePage() {
  return (
    <div className="px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-mono-upper text-4xl tracking-widest text-mission-cyan">
          KNOWLEDGE BASE
        </h1>
        <p className="text-mission-text-secondary text-sm tracking-wide">
          Documentation and information repository
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <KpiTile
          label="DOCUMENTS"
          value="1,247"
          color="cyan"
          icon={<BookOpen className="w-4 h-4" />}
        />
        <KpiTile
          label="DATABASES"
          value="8"
          color="green"
          icon={<Database className="w-4 h-4" />}
        />
        <KpiTile
          label="INDEXED"
          value="98"
          color="green"
          unit="%"
          icon={<FileSearch className="w-4 h-4" />}
        />
        <KpiTile
          label="CONNECTIONS"
          value="34"
          color="cyan"
          icon={<Link className="w-4 h-4" />}
        />
      </div>

      <div className="glass-panel rounded-sm p-8 text-center">
        <div className="text-mission-text-secondary text-sm text-mono-upper tracking-widest">
          KNOWLEDGE BASE INTERFACE
        </div>
        <div className="text-mission-cyan mt-4">
          Search and query tools coming soon
        </div>
      </div>
    </div>
  );
}
