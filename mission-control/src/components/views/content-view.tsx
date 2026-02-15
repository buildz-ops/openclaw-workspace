"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle, Lightbulb } from "lucide-react";

export default function ContentView() {
  const [pipeline, setPipeline] = useState<any>(null);

  useEffect(() => {
    fetch("/api/content-pipeline")
      .then((res) => res.json())
      .then(setPipeline);
  }, []);

  const stats = [
    { label: "Ideas", value: pipeline?.ideas || 0, icon: Lightbulb, color: "text-yellow-400" },
    { label: "Drafts", value: pipeline?.drafts || 0, icon: FileText, color: "text-blue-400" },
    { label: "Scheduled", value: pipeline?.scheduled || 0, icon: Clock, color: "text-purple-400" },
    { label: "Published", value: pipeline?.published || 0, icon: CheckCircle, color: "text-green-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-3xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-neutral-400">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-3xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Recent Content</h2>
        <div className="text-neutral-400">No content yet</div>
      </motion.div>
    </div>
  );
}
