"use client";

import { useEffect, useMemo, useState } from "react";
import MissionDataGrid, { MissionColumn } from "@/components/mission/mission-data-grid";
import MissionPageHeader from "@/components/mission/mission-page-header";
import MissionPanel from "@/components/mission/mission-panel";
import MissionPill from "@/components/mission/mission-pill";
import { fetchMission } from "@/lib/fetch-mission";
import { RepoHealth } from "@/lib/types/mission";

export default function CodeView() {
  const [repos, setRepos] = useState<RepoHealth[]>([]);

  useEffect(() => {
    fetchMission<{ repos: RepoHealth[] }>("/api/repos")
      .then((res) => setRepos(res.data.repos))
      .catch(() => setRepos([]));
  }, []);

  const columns: Array<MissionColumn<RepoHealth>> = useMemo(
    () => [
      { key: "name", label: "REPO" },
      { key: "branch", label: "BRANCH" },
      {
        key: "status",
        label: "STATUS",
        render: (row) => <MissionPill tone={row.status === "clean" ? "ok" : row.status === "dirty" ? "warn" : "critical"}>{row.status}</MissionPill>,
      },
      {
        key: "changed",
        label: "CHANGES",
        align: "right",
        render: (row) => `${row.changed}/${row.untracked}`,
      },
      {
        key: "ahead",
        label: "AHEAD/BEHIND",
        align: "right",
        render: (row) => `${row.ahead}/${row.behind}`,
      },
    ],
    [],
  );

  return (
    <div className="mc-stack mc-route-layout-split">
      <MissionPageHeader title="Code" subtitle="Repository health from real git state" />

      <MissionPanel className="mc-route-panel" title="Repositories" subtitle="Workspace and mission-control git status">
        <div className="mc-scroll-area">
          <MissionDataGrid columns={columns} rows={repos} emptyText="No readable repositories found." />
        </div>
      </MissionPanel>

      <MissionPanel className="mc-route-panel" title="Latest Commits" subtitle="Most recent commit timestamps">
        <div className="mc-list mc-scroll-area">
          {repos.map((repo) => (
            <article className="mc-list-item" key={repo.id}>
              <div className="mc-row">
                <p className="mc-list-title">{repo.name}</p>
                <MissionPill tone="info">{repo.branch}</MissionPill>
              </div>
              <p className="mc-list-sub">{repo.lastCommit ? new Date(repo.lastCommit).toLocaleString() : "No commit metadata"}</p>
              <p className="mc-list-sub">{repo.path}</p>
            </article>
          ))}
        </div>
      </MissionPanel>
    </div>
  );
}
