# MEMORY (Long-term)

## OpenClaw setup / ops
- Email: Primary email for Vex is **vex00x00@gmail.com** (Mac Mini M4 setup).
- AgentMail (**openclaw@agentmail.to**): Polling disabled per Ayoub's request (2026-02-04). Service files removed from VPS.
- Email secrets are stored on the VPS at **/etc/openclaw/secrets.env** (permissions **chmod 600**).
- **Auto-Resume Watchdog:** Vex now includes a proactive watchdog that detects gateway crashes and automatically resumes conversations with Ayoub upon restart.
- **Model Strategy:** Primary: Claude Sonnet 4.5; Fallbacks: GPT-5.2 → Gemini 3 Pro.
- **Proposed Ladder:** Gemini Flash (default) → Llama-3.3-70B (rate-limit fallback) → Kimi K2.5 (trusted workhorse) → Opus 4.5 (critical/rare).
- **GCP Credits:** €255 available (expires April 28, 2026). Billing alerts set at 50%, 80%, 95%, 98%; manual cutoff at 98%.

## Hardware
- **Mac Mini M4:** 16GB/256GB (macOS Tahoe 26.2). Dedicated accounts (`vex00x00@gmail.com`) for browser automation, iMessage, and autonomous tasks. Setup includes FileVault, Tailscale, and "always-on" power config.

## Discord preferences (Ayoub)
- For new Discord organization: prefers **emoji-prefixed category names**, clean formatting, and a **pinned welcome message**; generally keep resources well-organized.

## Projects

### Clawtex (Business Launch) - 2026-02-05
*Note: Referred to as "Clawtex" in early planning.*
**What:** OpenClaw deployment services for individuals/companies  
**Team:** Ayoub (Director of Ops), Carlos (Security/Wazuh), Navas (Infrastructure), Gerson (Platform/Channels), Web Dev (TBD)  
**Status:** Domain bought, landing page in progress, VPS instances deployed (Carlos/Navas)

**Key Documents (in `clawtex/`):**
- `README.md` - Project hub, quick reference, team schedule
- `PROJECT_STRUCTURE.md` - 4-tier service model ($49-$2000+/mo), tech stack, deployment automation, revenue projections
- `TEAM_TRAINING_ROADMAP.md` - 6-week domain specialization strategy (Carlos/Navas/Gerson/Ayoub paths)
- `X_BOOKMARKS_STRATEGY.md` - Bookmark extraction/organization strategy (twitter-web-exporter + AI categorization)
- `OVERNIGHT_INTENSIVE_SUMMARY.md` - Executive summary of overnight planning session (150 min, Claude Sonnet 4.5)

**Service Tiers:**
- 🥉 Bronze ($49-99/mo): Shared infra, 1 channel, 8h support, <2h deployment
- 🥈 Silver ($199-299/mo): Dedicated VPS (2vCPU/4GB), 2 channels, 4h support, <4h deployment
- 🥇 Gold ($799-1499/mo): Performance VPS + Wazuh, unlimited channels, 1h support, 99.5% SLA, <24h deployment
- 💎 Platinum ($2000+/mo): Multi-region HA, 24/7 support, custom SLA, 1-2 week deployment

**12-Month Target:** 82 customers → $24,750/mo MRR

**Team Specializations:**
- **Ayoub:** Operations, strategy, customer success, escalations
- **Carlos:** Security (Wazuh SIEM, hardening, compliance, incident response)
- **Navas:** Infrastructure (Terraform, Ansible, networking, performance, DR)
- **Gerson:** Platform (OpenClaw deployment, channels, skills, troubleshooting)
- **Web Dev:** Landing page, customer portal, billing (Stripe)

**Training Timeline:**
- Week 1-2: Foundation (core domain learning)
- Week 3-4: Intermediate (build real deliverables)
- Week 5-6: Advanced (test, refine, document)
- Post-Week 6: Cross-training (monthly rotation)

**Weekly Schedule:**
- **Mondays 10 AM CET:** Team sync (progress, blockers, priorities)
- **Fridays 4 PM CET:** Demo hour (show what you learned/built)

**Tech Stack:**
- **IaC:** Terraform + Ansible (automated provisioning)
- **Monitoring:** Prometheus + Grafana (all tiers), Wazuh SIEM (Gold+)
- **Security:** UFW, Fail2Ban, OpenVAS (Gold+), Restic backups
- **Containers:** Docker Compose (Bronze/Silver), Kubernetes (Platinum)

**Bookmark Organization Strategy:**
- **Tool:** twitter-web-exporter (UserScript, no API key, no 800 limit, privacy-first)
- **Workflow:** Export → Preprocess (dedupe/clean) → AI Categorize (Claude Sonnet 4.5) → Generate outputs (Markdown/HTML)
- **Taxonomy:** 12 categories (AI, Dev, Infra, Security, Business, Startups, Design, Learning, News, Productivity, Personal, Misc)
- **Scoring:** Urgency (0-10) + Importance (0-10) → Priority matrix
- **Maintenance:** Weekly incremental updates via cron

**Next Steps:**
1. Team kickoff meeting (schedule ASAP)
2. Week 1 training starts (each person their domain)
3. Ayoub: Export X.com bookmarks → Vex organizes them (48h turnaround)
4. Web Dev: Launch MVP landing page
5. VPS for Gerson (Navas provisions)

**Overnight Intensive Complete:** 2026-02-05 04:31 AM (150 minutes, Claude Sonnet 4.5, ~15,000 words, 5 files)

---

## 2026-02-03
- **Name Change:** Assistant is now officially **Vex**.
- **Credentials:** Dedicated accounts created for Mac Mini M4 (`vex0x76@gmail.com`).
- **News Logic:** 50-entry threshold set for `#📰ai-newsletter` generation.
