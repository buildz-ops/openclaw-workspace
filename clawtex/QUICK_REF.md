# Clawtex Quick Reference

**What:** OpenClaw deployment services for individuals/companies  
**Team:** Ayoub (Director of Ops), Carlos (Security/Wazuh), Navas (Infrastructure), Gerson (Platform/Channels), Web Dev (TBD)  
**Status:** Domain bought, landing page in progress, VPS instances deployed (Carlos/Navas)

## Key Documents
- `README.md` - Project hub, quick reference, team schedule
- `PROJECT_STRUCTURE.md` - 4-tier service model, tech stack, deployment automation, revenue projections
- `TEAM_TRAINING_ROADMAP.md` - 6-week domain specialization strategy
- `X_BOOKMARKS_STRATEGY.md` - Bookmark extraction/organization strategy
- `OVERNIGHT_INTENSIVE_SUMMARY.md` - Executive summary of overnight planning session (150 min, Claude Sonnet 4.5)

## Service Tiers
- 🥉 **Bronze** ($49-99/mo): Shared infra, 1 channel, 8h support, <2h deployment
- 🥈 **Silver** ($199-299/mo): Dedicated VPS (2vCPU/4GB), 2 channels, 4h support, <4h deployment
- 🥇 **Gold** ($799-1499/mo): Performance VPS + Wazuh, unlimited channels, 1h support, 99.5% SLA, <24h deployment
- 💎 **Platinum** ($2000+/mo): Multi-region HA, 24/7 support, custom SLA, 1-2 week deployment

**12-Month Target:** 82 customers → $24,750/mo MRR

## Team Specializations
- **Ayoub:** Operations, strategy, customer success, escalations
- **Carlos:** Security (Wazuh SIEM, hardening, compliance, incident response)
- **Navas:** Infrastructure (Terraform, Ansible, networking, performance, DR)
- **Gerson:** Platform (OpenClaw deployment, channels, skills, troubleshooting)
- **Web Dev:** Landing page, customer portal, billing (Stripe)

## Training Timeline
- Week 1-2: Foundation (core domain learning)
- Week 3-4: Intermediate (build real deliverables)
- Week 5-6: Advanced (test, refine, document)
- Post-Week 6: Cross-training (monthly rotation)

## Weekly Schedule
- **Mondays 10 AM CET:** Team sync (progress, blockers, priorities)
- **Fridays 4 PM CET:** Demo hour (show what you learned/built)

## Tech Stack
- **IaC:** Terraform + Ansible (automated provisioning)
- **Monitoring:** Prometheus + Grafana (all tiers), Wazuh SIEM (Gold+)
- **Security:** UFW, Fail2Ban, OpenVAS (Gold+), Restic backups
- **Containers:** Docker Compose (Bronze/Silver), Kubernetes (Platinum)

## Bookmark Organization Strategy
- **Tool:** twitter-web-exporter (UserScript, no API key, no 800 limit, privacy-first)
- **Workflow:** Export → Preprocess (dedupe/clean) → AI Categorize (Claude Sonnet 4.5) → Generate outputs (Markdown/HTML)
- **Taxonomy:** 12 categories (AI, Dev, Infra, Security, Business, Startups, Design, Learning, News, Productivity, Personal, Misc)
- **Scoring:** Urgency (0-10) + Importance (0-10) → Priority matrix
- **Maintenance:** Weekly incremental updates via cron

## Next Steps
1. Team kickoff meeting (schedule ASAP)
2. Week 1 training starts (each person their domain)
3. Ayoub: Export X.com bookmarks → Vex organizes them (48h turnaround)
4. Web Dev: Launch MVP landing page
5. VPS for Gerson (Navas provisions)

**Overnight Intensive Complete:** 2026-02-05 04:31 AM (150 minutes, Claude Sonnet 4.5, ~15,000 words, 5 files)
