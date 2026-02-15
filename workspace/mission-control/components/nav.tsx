"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";

const navItems = [
  { name: "HOME", href: "/" },
  { name: "OPS", href: "/ops" },
  { name: "AGENTS", href: "/agents" },
  { name: "CHAT", href: "/chat" },
  { name: "CONTENT", href: "/content" },
  { name: "COMMS", href: "/comms" },
  { name: "KNOWLEDGE", href: "/knowledge" },
  { name: "CODE", href: "/code" },
];

export default function Nav() {
  const pathname = usePathname();
  const now = new Date().toLocaleTimeString("en-US", { 
    hour12: false, 
    hour: "2-digit", 
    minute: "2-digit" 
  });

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-cyan-500/30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-mission-cyan" />
          <span className="text-mono-upper font-bold text-lg tracking-widest text-mission-cyan">
            MISSION-CONTROL
          </span>
        </div>

        {/* Nav Items */}
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-mono-upper text-xs tracking-widest transition-colors ${
                pathname === item.href
                  ? "text-mission-cyan"
                  : "text-mission-text-secondary hover:text-mission-text-primary"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Online Status */}
        <div className="flex items-center gap-2">
          <span className="status-dot online"></span>
          <span className="text-mono-upper text-xs tracking-widest text-mission-green">
            ONLINE
          </span>
          <span className="text-mission-text-secondary text-xs ml-2">
            {now}
          </span>
        </div>
      </div>
    </nav>
  );
}
