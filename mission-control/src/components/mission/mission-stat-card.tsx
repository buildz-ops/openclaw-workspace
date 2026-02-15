import { ReactNode } from "react";

interface MissionStatCardProps {
  label: string;
  value: string | number;
  tone?: "neutral" | "ok" | "warn" | "critical" | "info";
  detail?: string;
  icon?: ReactNode;
}

export default function MissionStatCard({
  label,
  value,
  tone = "neutral",
  detail,
  icon,
}: MissionStatCardProps) {
  return (
    <article className={`mc-stat-card mc-tone-${tone} mc-reveal-up`}>
      <header className="mc-stat-head">
        <span className="mc-stat-label">{label}</span>
        {icon ? <span className="mc-stat-icon">{icon}</span> : null}
      </header>
      <div className="mc-stat-value">{value}</div>
      {detail ? <p className="mc-stat-detail">{detail}</p> : null}
    </article>
  );
}
