import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatusCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  status?: "ok" | "alert" | "data" | "attention" | "neutral";
  subtitle?: string;
  className?: string;
}

/**
 * KPI Card with GLOWING numbers
 * Dark background with color-coded luminance effect
 */
export default function StatusCard({
  title,
  value,
  icon: Icon,
  status = "neutral",
  subtitle,
  className = "",
}: StatusCardProps) {
  const glowClass = {
    ok: "kpi-number-green",
    alert: "kpi-number-red",
    data: "kpi-number-cyan",
    attention: "kpi-number-yellow",
    neutral: "",
  }[status];

  const iconColor = {
    ok: "text-green",
    alert: "text-red",
    data: "text-cyan",
    attention: "text-yellow",
    neutral: "text-label",
  }[status];

  return (
    <div className={`glass-card flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="kpi-label">{title}</span>
        {Icon && <Icon className={`w-4 h-4 ${iconColor}`} style={{ opacity: 0.6 }} />}
      </div>
      
      <div className={`kpi-number ${glowClass} mb-2`}>
        {value}
      </div>

      {subtitle && (
        <div className="text-meta text-xs mt-1">
          {subtitle}
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  icon?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Compact card for nested metric groups (RECONCILIATION section)
 */
export function MetricCard({ title, icon, children, className = "" }: MetricCardProps) {
  return (
    <div className={`glass-card-compact ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        {icon && <span className="text-base" style={{ opacity: 0.7 }}>{icon}</span>}
        <span className="text-header">{title}</span>
      </div>
      {children}
    </div>
  );
}

interface MetricItemProps {
  label: string;
  value: string | number;
  status?: "ok" | "alert" | "data" | "attention" | "neutral";
}

/**
 * Single metric row (label + value with muted styling)
 */
export function MetricItem({ label, value, status = "neutral" }: MetricItemProps) {
  const valueColor = {
    ok: "text-green",
    alert: "text-red",
    data: "text-cyan",
    attention: "text-yellow",
    neutral: "",
  }[status];

  return (
    <div className="metric-row">
      <span className="metric-row-label">{label}</span>
      <span className={`metric-row-value ${valueColor}`}>{value}</span>
    </div>
  );
}
