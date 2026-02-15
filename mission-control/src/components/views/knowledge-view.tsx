"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, FileText, Calendar } from "lucide-react";

export default function KnowledgeView() {
  const [observations, setObservations] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/observations")
      .then((res) => res.json())
      .then((data) => setObservations(data.observations || []));

    fetch("/api/priorities")
      .then((res) => res.json())
      .then((data) => setPriorities(data.priorities || []));
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold">Recent Observations</h2>
        </div>
        <div className="space-y-3">
          {observations.length === 0 ? (
            <p className="text-neutral-400">No observations logged yet</p>
          ) : (
            observations.map((obs, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-white/5">
                <p className="text-sm">{obs}</p>
              </div>
            ))
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-3xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold">Priorities</h2>
        </div>
        <div className="space-y-3">
          {priorities.length === 0 ? (
            <p className="text-neutral-400">No priorities set</p>
          ) : (
            priorities.map((priority) => (
              <div key={priority.id} className="p-3 rounded-2xl bg-white/5">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{priority.title}</div>
                  <span className="text-sm text-neutral-400">{priority.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
