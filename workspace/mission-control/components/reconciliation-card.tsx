interface ReconciliationItem {
  label: string;
  value: string | number;
  status?: "ok" | "alert" | "warning";
}

interface ReconciliationCardProps {
  title: string;
  items: ReconciliationItem[];
  icon?: React.ReactNode;
}

export default function ReconciliationCard({ title, items, icon }: ReconciliationCardProps) {
  return (
    <div className="glass-panel rounded-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        {icon && <span className="text-mission-cyan">{icon}</span>}
        <h3 className="text-mono-upper text-sm tracking-widest">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center border-b border-cyan-500/10 pb-2 last:border-0">
            <span className="text-mission-text-secondary text-xs uppercase tracking-wider">
              {item.label}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-mission-text-primary font-semibold">
                {item.value}
              </span>
              {item.status === "ok" && <span className="status-dot online"></span>}
              {item.status === "alert" && <span className="status-dot offline"></span>}
              {item.status === "warning" && <span className="status-dot warning"></span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
