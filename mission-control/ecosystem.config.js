module.exports = {
  apps: [
    {
      name: "mission-control-convex",
      script: "npx",
      args: "convex dev",
      cwd: "/Users/vex/.openclaw/workspace/mission-control",
      env: {
        NODE_ENV: "development",
      },
      output: "/Users/vex/.openclaw/logs/mission-control-convex.log",
      error: "/Users/vex/.openclaw/logs/mission-control-convex-error.log",
      merge_logs: true,
    },
    {
      name: "mission-control-next",
      script: "npm",
      args: "run dev -- -H 0.0.0.0 -p 3000",
      cwd: "/Users/vex/.openclaw/workspace/mission-control",
      env: {
        NODE_ENV: "development",
        PORT: "3000",
      },
      output: "/Users/vex/.openclaw/logs/mission-control-next.log",
      error: "/Users/vex/.openclaw/logs/mission-control-next-error.log",
      merge_logs: true,
      kill_timeout: 5000,
      wait_ready: true,
    },
  ],
};
