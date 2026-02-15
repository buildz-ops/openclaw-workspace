"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function OpsView() {
  const [cronJobs, setCronJobs] = useState<any[]>([]);
  const [systemState, setSystemState] = useState<any>(null);

  useEffect(() => {
    fetch("/api/cron-health")
      .then((res) => res.json())
      .then((data) => setCronJobs(data.jobs || []));

    fetch("/api/system-state")
      .then((res) => res.json())
      .then(setSystemState);
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4">System Status</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-neutral-400">Status</span>
            <span className="font-mono">{systemState?.status || "Loading..."}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Workspace</span>
            <span className="font-mono text-sm">{systemState?.workspace || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Last Activity</span>
            <span className="font-mono text-sm">
              {systemState?.lastActivity ? new Date(systemState.lastActivity).toLocaleString() : "N/A"}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-3xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Cron Jobs</h2>
        <div className="space-y-3">
          {cronJobs.length === 0 ? (
            <p className="text-neutral-400">No cron jobs found</p>
          ) : (
            cronJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/5">
                <div>
                  <div className="font-medium">{job.name}</div>
                  <div className="text-sm text-neutral-400">{job.schedule}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${job.status === "healthy" ? "text-green-400" : "text-red-400"}`}>
                    {job.status}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {job.lastRun ? new Date(job.lastRun).toLocaleTimeString() : "Never"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
