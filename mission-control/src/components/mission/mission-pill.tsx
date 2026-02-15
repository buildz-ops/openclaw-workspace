import { ReactNode } from "react";

interface MissionPillProps {
  children: ReactNode;
  tone?: "neutral" | "ok" | "warn" | "critical" | "info";
}

export default function MissionPill({ children, tone = "neutral" }: MissionPillProps) {
  return <span className={`mc-pill mc-pill-${tone}`}>{children}</span>;
}
