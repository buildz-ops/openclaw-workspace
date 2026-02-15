#!/usr/bin/env node
/**
 * Log session token usage and cost data
 * Designed to be called from heartbeat or cron
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = process.env.WORKSPACE || '/Users/vex/.openclaw/workspace';
const LOG_DIR = path.join(WORKSPACE, 'logs/costs');
const today = new Date().toISOString().split('T')[0];
const LOG_FILE = path.join(LOG_DIR, `cost-log-${today.slice(0, 7)}.jsonl`);

// Ensure log directory exists
fs.mkdirSync(LOG_DIR, { recursive: true });

// Capture session data from stdin (expect JSON from session_status)
let input = '';

if (process.stdin.isTTY) {
  console.error('Usage: session_status | node log-session-cost.js');
  process.exit(1);
}

process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    
    const entry = {
      timestamp: new Date().toISOString(),
      date: today,
      session: data.sessionKey || 'unknown',
      model: data.model || 'unknown',
      usage: data.usage || {},
      cost: data.cost || {},
      uptime: data.uptime || null
    };

    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n');
    console.log(`✅ Logged to ${LOG_FILE}`);
  } catch (err) {
    console.error('❌ Failed to parse session data:', err.message);
    process.exit(1);
  }
});
