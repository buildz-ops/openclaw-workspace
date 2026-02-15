"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Code, FolderGit } from "lucide-react";

export default function CodeView() {
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/repos")
      .then((res) => res.json())
      .then((data) => setRepos(data.repos || []));
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <FolderGit className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold">Repositories</h2>
        </div>
        <div className="space-y-3">
          {repos.length === 0 ? (
            <p className="text-neutral-400">No repositories found</p>
          ) : (
            repos.map((repo) => (
              <div key={repo.id} className="p-4 rounded-2xl bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-neutral-400" />
                    <span className="font-medium">{repo.name}</span>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-lg ${
                    repo.status === "clean" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {repo.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-neutral-400">
                  <GitBranch className="w-4 h-4" />
                  <span>{repo.branch}</span>
                </div>
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
        <h2 className="text-xl font-semibold mb-4">Recent Commits</h2>
        <div className="text-neutral-400">No recent commits</div>
      </motion.div>
    </div>
  );
}
