import { ReactNode } from "react";

interface MissionPageHeaderProps {
  title: string;
  subtitle: string;
  rightSlot?: ReactNode;
}

export default function MissionPageHeader({ title, subtitle, rightSlot }: MissionPageHeaderProps) {
  return (
    <header className="mc-page-header mc-reveal-up">
      <div>
        <h1 className="mc-page-title">{title}</h1>
        <p className="mc-page-subtitle">{subtitle}</p>
      </div>
      {rightSlot ? <div>{rightSlot}</div> : null}
    </header>
  );
}
