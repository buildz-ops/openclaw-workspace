import { ReactNode } from "react";
import MissionTopNav from "@/components/mission/mission-top-nav";

interface MissionShellProps {
  children: ReactNode;
}

export default function MissionShell({ children }: MissionShellProps) {
  return (
    <div className="mc-shell">
      <MissionTopNav />
      <main className="mc-main">{children}</main>
    </div>
  );
}
