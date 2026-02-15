import { ReactNode } from "react";

interface MissionPanelProps {
  title?: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function MissionPanel({
  title,
  subtitle,
  rightSlot,
  children,
  className = "",
}: MissionPanelProps) {
  return (
    <section className={`mc-panel mc-reveal-up ${className}`.trim()}>
      {title ? (
        <header className="mc-panel-header">
          <div>
            <h2 className="mc-panel-title">{title}</h2>
            {subtitle ? <p className="mc-panel-subtitle">{subtitle}</p> : null}
          </div>
          {rightSlot ? <div>{rightSlot}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
