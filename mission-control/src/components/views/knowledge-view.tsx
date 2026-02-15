"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import MissionPageHeader from "@/components/mission/mission-page-header";
import MissionPanel from "@/components/mission/mission-panel";
import MissionPill from "@/components/mission/mission-pill";
import MissionStatCard from "@/components/mission/mission-stat-card";
import MissionTabs from "@/components/mission/mission-tabs";
import { fetchMission } from "@/lib/fetch-mission";
import { KnowledgeDoc } from "@/lib/types/mission";

type SortMode = "date" | "title";

export default function KnowledgeView() {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortMode>("date");

  useEffect(() => {
    fetchMission<{ docs: KnowledgeDoc[] }>("/api/knowledge-index")
      .then((res) => setDocs(res.data.docs))
      .catch(() => setDocs([]));
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(docs.map((doc) => doc.category))).sort();
    return ["all", ...unique];
  }, [docs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = docs.filter((doc) => {
      if (category !== "all" && doc.category !== category) return false;
      if (!q) return true;
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.path.toLowerCase().includes(q) ||
        doc.excerpt.toLowerCase().includes(q)
      );
    });

    return base.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
    });
  }, [docs, category, query, sort]);

  return (
    <div className="mc-stack mc-route-layout-kpi">
      <MissionPageHeader title="Knowledge Base" subtitle="Research // strategy // memory files // documentation" />

      <section className="mc-grid-4">
        <MissionStatCard label="Total Docs" value={docs.length} tone="info" />
        <MissionStatCard label="Filtered" value={filtered.length} tone="ok" />
        <MissionStatCard label="Categories" value={categories.length - 1} tone="warn" />
        <MissionStatCard
          label="Latest"
          value={filtered[0] ? new Date(filtered[0].modifiedAt).toLocaleDateString() : "N/A"}
          tone="neutral"
        />
      </section>

      <MissionPanel title="Filters" subtitle="Search + category + sort">
        <div className="mc-stack">
          <label className="mc-row mc-filter-search">
            <Search size={14} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Search documents, filenames, or excerpt"
              className="mc-input"
            />
          </label>

          <div className="mc-row mc-row-wrap-start">
            {categories.map((item) => (
              <button key={item} className="mc-filter-chip-btn" type="button" onClick={() => setCategory(item)}>
                <MissionPill tone={item === category ? "info" : "neutral"}>{item}</MissionPill>
              </button>
            ))}
          </div>

          <MissionTabs
            tabs={[
              { id: "date", label: "Sort by Date" },
              { id: "title", label: "Sort by Title" },
            ]}
            active={sort}
            onChange={(id) => setSort(id as SortMode)}
          />
        </div>
      </MissionPanel>

      <MissionPanel className="mc-route-panel" title="Knowledge Documents" subtitle="Indexed from memory, notes, and learnings">
        <div className="mc-list mc-scroll-area">
          {filtered.map((doc) => (
            <article className="mc-list-item" key={doc.id}>
              <div className="mc-row">
                <p className="mc-list-title">{doc.title}</p>
                <div className="mc-row mc-pill-group">
                  <MissionPill tone="neutral">{doc.category}</MissionPill>
                  <MissionPill tone="info">{new Date(doc.modifiedAt).toLocaleDateString()}</MissionPill>
                </div>
              </div>
              <p className="mc-list-sub">{doc.path}</p>
              <p className="mc-doc-excerpt">
                {doc.excerpt || "No excerpt available."}
              </p>
            </article>
          ))}
          {filtered.length === 0 ? (
            <article className="mc-list-item">
              <p className="mc-list-sub">No documents match current filters.</p>
            </article>
          ) : null}
        </div>
      </MissionPanel>
    </div>
  );
}
