"use client";

import KpiTile from "@/components/kpi-tile";
import { GitBranch, GitCommit, GitPullRequest, Code } from "lucide-react";

export default function CodePage() {
  return (
    <div className="px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-mono-upper text-4xl tracking-widest text-mission-cyan">
          CODE
        </h1>
        <p className="text-mission-text-secondary text-sm tracking-wide">
          Repository management and development tracking
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <KpiTile
          label="REPOSITORIES"
          value="23"
          color="cyan"
          icon={<Code className="w-4 h-4" />}
        />
        <KpiTile
          label="BRANCHES"
          value="47"
          color="green"
          icon={<GitBranch className="w-4 h-4" />}
        />
        <KpiTile
          label="COMMITS TODAY"
          value="18"
          color="cyan"
          icon={<GitCommit className="w-4 h-4" />}
        />
        <KpiTile
          label="PULL REQUESTS"
          value="5"
          color="yellow"
          icon={<GitPullRequest className="w-4 h-4" />}
        />
      </div>

      <div className="glass-panel rounded-sm p-8 text-center">
        <div className="text-mission-text-secondary text-sm text-mono-upper tracking-widest">
          CODE REPOSITORY DASHBOARD
        </div>
        <div className="text-mission-cyan mt-4">
          Git integration panels coming soon
        </div>
      </div>
    </div>
  );
}
