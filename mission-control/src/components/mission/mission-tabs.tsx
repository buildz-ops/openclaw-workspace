"use client";

import Link from "next/link";

export interface MissionTab {
  id: string;
  label: string;
  href?: string;
  badge?: number;
}

interface MissionTabsProps {
  tabs: MissionTab[];
  active: string;
  onChange?: (id: string) => void;
}

export default function MissionTabs({ tabs, active, onChange }: MissionTabsProps) {
  return (
    <div className="mc-tabs mc-reveal-up">
      {tabs.map((tab) => {
        const className = `mc-tab ${active === tab.id ? "is-active" : ""}`;
        const content = (
          <>
            <span>{tab.label}</span>
            {typeof tab.badge === "number" ? <span className="mc-tab-badge">{tab.badge}</span> : null}
          </>
        );

        if (tab.href) {
          return (
            <Link key={tab.id} href={tab.href} className={className}>
              {content}
            </Link>
          );
        }

        return (
          <button key={tab.id} type="button" className={className} onClick={() => onChange?.(tab.id)}>
            {content}
          </button>
        );
      })}
    </div>
  );
}
