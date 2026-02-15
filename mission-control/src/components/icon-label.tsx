import { LucideIcon } from "lucide-react";

interface IconLabelProps {
  icon?: LucideIcon | string;
  label: string;
  className?: string;
}

/**
 * Icon + Label component for section headers
 * Supports Lucide icons or semantic symbols (⊕, ⊙, ✦)
 */
export default function IconLabel({ icon, label, className = "" }: IconLabelProps) {
  const Icon = typeof icon === "string" ? null : icon;

  return (
    <div className={`section-header ${className}`}>
      {Icon ? (
        <Icon className="w-4 h-4" />
      ) : typeof icon === "string" ? (
        <span className="text-base" style={{ opacity: 0.8 }}>{icon}</span>
      ) : null}
      <span>{label}</span>
    </div>
  );
}
