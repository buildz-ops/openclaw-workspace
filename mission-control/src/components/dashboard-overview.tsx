"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatusCard from "./status-card";
import { Activity, Bot, Clock, TrendingUp, FileText, Users } from "lucide-react";

export default function DashboardOverview() {
  const [systemState, setSystemState] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [cronHealth, setCronHealth] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);

  useEffect(() => {
    // Fetch data from API routes
    fetch("/api/system-state")
      .then((res) => res.json())
      .then(setSystemState);

    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) => setAgents(data.agents || []));

    fetch("/api/cron-health")
      .then((res) => res.json())
      .then(setCronHealth);

    fetch("/api/revenue")
      .then((res) => res.json())
      .then(setRevenue);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Mission Control</h1>
        <p className="text-neutral-400">AI Agent Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatusCard
          title="System Status"
          value={systemState?.status || "Loading..."}
          icon={Activity}
          trend="+0%"
          trendUp={true}
        />
        <StatusCard
          title="Active Agents"
          value={agents.length.toString()}
          icon={Bot}
          trend="+0%"
          trendUp={true}
        />
        <StatusCard
          title="Cron Jobs"
          value={cronHealth?.jobs?.length?.toString() || "0"}
          icon={Clock}
          trend="Healthy"
          trendUp={true}
        />
        <StatusCard
          title="Revenue"
          value={`$${revenue?.current || 0}`}
          icon={TrendingUp}
          trend={`${revenue?.growth || 0}%`}
          trendUp={revenue?.growth > 0}
        />
        <StatusCard
          title="Content Pipeline"
          value="0 drafts"
          icon={FileText}
          trend="+0"
          trendUp={true}
        />
        <StatusCard
          title="Clients"
          value="0"
          icon={Users}
          trend="+0"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">System online</span>
              <span className="text-neutral-500">Just now</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Priorities</h2>
          <div className="space-y-3">
            <div className="text-sm text-neutral-400">No priorities set</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
