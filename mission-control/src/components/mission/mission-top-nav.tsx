"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const NAV_ITEMS = [
  { label: "HOME", href: "/" },
  { label: "OPS", href: "/ops" },
  { label: "AGENTS", href: "/agents" },
  { label: "CHAT", href: "/chat" },
  { label: "CONTENT", href: "/content" },
  { label: "COMMS", href: "/comms" },
  { label: "KNOWLEDGE", href: "/knowledge" },
  { label: "CODE", href: "/code" },
];

export default function MissionTopNav() {
  const pathname = usePathname();
  const [clock, setClock] = useState<string>("00:00:00");
  const [status, setStatus] = useState<"working" | "active" | "idle" | "stale" | "offline">("offline");

  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const pull = async () => {
      try {
        const response = await fetch("/api/system-state", { cache: "no-store" });
        if (!response.ok) {
          setStatus("offline");
          return;
        }
        const payload = await response.json();
        setStatus(payload?.data?.status || "offline");
      } catch {
        setStatus("offline");
      }
    };

    pull();
    const interval = setInterval(pull, 10000);
    return () => clearInterval(interval);
  }, []);

  const statusLabel = useMemo(() => status.toUpperCase(), [status]);

  return (
    <nav className="mc-top-nav">
      <div className="mc-top-nav-inner">
        <div className="mc-brand-wrap">
          <div className="mc-brand-dot" />
          <div>
            <div className="mc-brand">VEX</div>
            <div className="mc-brand-sub">MISSION CONTROL</div>
          </div>
        </div>

        <div className="mc-nav-links">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`mc-nav-link ${isActive ? "is-active" : ""}`}>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mc-nav-meta">
          <span className={`mc-status-dot mc-status-${status}`} />
          <span className={`mc-nav-status mc-nav-status-${status}`}>{statusLabel}</span>
          <span className="mc-nav-time">{clock}</span>
        </div>
      </div>
    </nav>
  );
}
