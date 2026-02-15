import { ReactNode } from "react";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Dark nested panel for grouping sections
 * Creates depth hierarchy: background → section → cards
 */
export default function SectionContainer({ children, className = "" }: SectionContainerProps) {
  return (
    <div className={`section-container ${className}`}>
      {children}
    </div>
  );
}
