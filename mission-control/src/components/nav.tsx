"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { label: "HOME", href: "/" },
  { label: "OPS", href: "/ops" },
  { label: "AGENTS", href: "/agents" },
  { label: "CHAT", href: "/chat" },
  { label: "CONTENT", href: "/content" },
  { label: "COMMS", href: "/comms" },
  { label: "KNOWLEDGE", href: "/knowledge" },
  { label: "CODE", href: "/code" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<"online" | "offline" | "checking">("checking");

  useEffect(() => {
    // Update time
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setTime(timeStr);
    };
    
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // Check system status
    const checkStatus = async () => {
      try {
        const response = await fetch("/api/system-state");
        if (response.ok) {
          setStatus("online");
        } else {
          setStatus("offline");
        }
      } catch {
        setStatus("offline");
      }
    };

    checkStatus();
    const statusInterval = setInterval(checkStatus, 30000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(statusInterval);
    };
  }, []);

  return (
    <nav className="nav-container sticky top-0 z-50">
      <div className="flex items-center justify-between px-8 py-3 max-w-[1800px] mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-3 mr-12">
          <Activity className="w-4 h-4 text-cyan" strokeWidth={2} />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-title">
            MISSION-CONTROL
          </span>
        </div>

        {/* Divider */}
        <div className="divider-vertical h-8 mx-4" />

        {/* Nav Items */}
        <div className="flex-1 flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? "nav-item-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="divider-vertical h-8 mx-4" />

        {/* Status */}
        <div className="flex items-center gap-3 ml-8">
          <div className="flex items-center gap-2">
            <span 
              className={`status-dot ${
                status === "online" ? "status-ok" : 
                status === "offline" ? "status-alert" : 
                "status-data"
              } ${status === "online" ? "animate-pulse" : ""}`}
            />
            <span 
              className={`text-[0.65rem] uppercase tracking-[0.15em] font-bold ${
                status === "online" ? "text-green" :
                status === "offline" ? "text-magenta" :
                "text-cyan"
              }`}
            >
              {status.toUpperCase()}
            </span>
          </div>
          <div className="divider-vertical h-6" />
          <span className="text-[0.65rem] text-value font-mono tracking-wider">
            {time || "00:00:00"}
          </span>
        </div>
      </div>
    </nav>
  );
}
