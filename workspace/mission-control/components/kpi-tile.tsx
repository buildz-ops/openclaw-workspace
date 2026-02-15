interface KpiTileProps {
  label: string;
  value: string | number;
  color: "green" | "magenta" | "cyan" | "yellow";
  unit?: string;
  icon?: React.ReactNode;
}

export default function KpiTile({ label, value, color, unit, icon }: KpiTileProps) {
  return (
    <div className="glass-panel rounded-sm p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        {icon && <span className="text-mission-cyan">{icon}</span>}
        <span className="section-title mb-0">{label}</span>
      </div>
      <div className="flex items-baseline gap-2 mt-auto">
        <span className={`metric-value ${color}`}>{value}</span>
        {unit && <span className="text-mission-text-secondary text-sm">{unit}</span>}
      </div>
    </div>
  );
}
