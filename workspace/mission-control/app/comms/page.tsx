"use client";

import KpiTile from "@/components/kpi-tile";
import { Mail, MessageSquare, Bell, Send } from "lucide-react";

export default function CommsPage() {
  return (
    <div className="px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-mono-upper text-4xl tracking-widest text-mission-cyan">
          COMMUNICATIONS
        </h1>
        <p className="text-mission-text-secondary text-sm tracking-wide">
          Message channels and notification systems
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <KpiTile
          label="EMAILS"
          value="142"
          color="cyan"
          icon={<Mail className="w-4 h-4" />}
        />
        <KpiTile
          label="MESSAGES"
          value="89"
          color="green"
          icon={<MessageSquare className="w-4 h-4" />}
        />
        <KpiTile
          label="ALERTS"
          value="3"
          color="yellow"
          icon={<Bell className="w-4 h-4" />}
        />
        <KpiTile
          label="SENT TODAY"
          value="45"
          color="cyan"
          icon={<Send className="w-4 h-4" />}
        />
      </div>

      <div className="glass-panel rounded-sm p-8 text-center">
        <div className="text-mission-text-secondary text-sm text-mono-upper tracking-widest">
          COMMUNICATIONS DASHBOARD
        </div>
        <div className="text-mission-cyan mt-4">
          Integration panels coming soon
        </div>
      </div>
    </div>
  );
}
