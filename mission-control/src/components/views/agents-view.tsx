"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Activity } from "lucide-react";

export default function AgentsView() {
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) => setAgents(data.agents || []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-3xl p-6 glass-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl bg-blue-500/10">
                <Bot className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">{agent.status}</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">{agent.name}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400">Model</span>
                <span className="font-mono">{agent.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Last Seen</span>
                <span className="font-mono">
                  {new Date(agent.lastSeen).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
