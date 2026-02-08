# Clawtex — Project Structure & Service Model

---

## Service Tiers

### 🥉 Bronze ($49–99/mo)

**Target:** Individuals, hobbyists, content creators

| Category | Details |
|----------|---------|
| **Infrastructure** | Shared OpenClaw instance (containerized), 1 channel, 2 GB RAM, 1 vCPU, 10 GB storage, standard skills |
| **Support** | 8h response (business hours CET), email/Discord, community KB, monthly usage reports |
| **SLA** | 95% uptime (best-effort) |
| **Deployment** | < 2 hours (fully automated) |

---

### 🥈 Silver ($199–299/mo)

**Target:** Small teams, startups, power users

| Category | Details |
|----------|---------|
| **Infrastructure** | Dedicated VPS (2 vCPU, 4 GB RAM, 40 GB NVMe), up to 2 channels, basic monitoring (Prometheus + Grafana), daily backups (7-day retention), custom skills support |
| **Support** | 4h response (business hours CET), priority Discord/email, quarterly optimization reviews, monthly performance reports |
| **SLA** | 98% uptime |
| **Deployment** | < 4 hours (semi-automated) |

---

### 🥇 Gold ($799–1,499/mo)

**Target:** Businesses, agencies, compliance-heavy orgs

| Category | Details |
|----------|---------|
| **Infrastructure** | Performance VPS (4 vCPU, 8 GB RAM, 80 GB NVMe), unlimited channels, Wazuh SIEM, real-time alerting (PagerDuty/Opsgenie), hourly backups (30-day retention), custom domain & SSL, advanced skills |
| **Support** | 1h response (24/5 CET+extended), dedicated Slack/Discord channel, monthly strategy calls with Ayoub, proactive tuning, quarterly security audits |
| **SLA** | 99.5% uptime with credits |
| **Deployment** | < 24 hours (white-glove onboarding) |

---

### 💎 Platinum ($2,000+/mo — custom pricing)

**Target:** Enterprise, multi-national, high-security environments

| Category | Details |
|----------|---------|
| **Infrastructure** | Multi-region HA (active-active or active-passive), auto-scaling, full DR (cross-region backups), dedicated resources, Wazuh + compliance logging (GDPR, HIPAA, SOC 2), white-label options, custom AI model endpoints |
| **Support** | 24/7/365 with on-call engineers, dedicated account manager (Ayoub), custom SLA, on-site support if needed, quarterly business reviews |
| **SLA** | 99.9%+ with custom guarantees |
| **Deployment** | 1–2 weeks (fully custom architecture) |

---

## Tech Stack

### Core Platform
- **OpenClaw** — Latest stable + LTS backport option
- **Node.js 22+** — Runtime
- **Docker / Podman** — Containerization (Bronze/Silver)
- **Kubernetes** — Orchestration (Platinum only)

### Infrastructure as Code
- **Terraform** — VPS provisioning (Navas)
- **Ansible** — Configuration management (Navas)
- **GitHub Actions** — CI/CD pipelines

### Monitoring & Security
- **Prometheus + Grafana** — Metrics & dashboards (all tiers)
- **Wazuh SIEM** — Security monitoring (Gold+, Carlos)
- **Fail2Ban** — Intrusion prevention
- **UFW / iptables** — Firewall management
- **Let's Encrypt** — SSL automation
- **OpenVAS** — Vulnerability scanning (Gold+)

### Backup & DR
- **Restic** — Encrypted backups
- **rclone** — Cloud sync (S3, Backblaze B2)
- **pg_dump / mongodump** — Database backups

### Communication
- **Discord** — Internal ops + customer support
- **Slack** — Gold/Platinum customer channels
- **PagerDuty / Opsgenie** — Incident management (Gold+)

---

## Deployment Pipelines

### Bronze (< 2 hours, fully automated)
1. Customer sign-up → Stripe webhook
2. Provision Docker container on shared infra
3. Run `openclaw init` with customer config
4. Connect messaging channel (OAuth flow)
5. Send welcome email + onboarding guide

### Silver (< 4 hours, 90% automated)
1. Customer sign-up → Stripe webhook
2. Terraform: provision VPS (Hetzner / DigitalOcean / Vultr)
3. Ansible: harden OS, install OpenClaw, configure monitoring
4. Connect channels, deploy custom skills
5. Run smoke tests, generate handoff report

### Gold (< 24 hours, white-glove)
1. Sales call → custom requirements doc
2. Terraform: provision performance VPS + Wazuh VM
3. Ansible: full-stack deployment
4. Carlos: configure Wazuh rules, compliance logging
5. Gerson: deploy custom skills, test integrations
6. Ayoub: onboarding call + training session

### Platinum (1–2 weeks, fully custom)
1. Enterprise sales cycle (1–2 weeks negotiation)
2. Architecture design session (Navas + Ayoub)
3. Multi-region Terraform deployment
4. HA setup (load balancer, failover, replication)
5. Security hardening (Carlos: Wazuh + compliance)
6. Custom integration development (Gerson + Web Dev)
7. Load testing, DR drills

---

## Revenue Projections (12-Month Conservative)

| Tier | Customers | Avg Price | Monthly Revenue |
|------|-----------|-----------|-----------------|
| Bronze | 50 | $75 | $3,750 |
| Silver | 20 | $250 | $5,000 |
| Gold | 10 | $1,000 | $10,000 |
| Platinum | 2 | $3,000 | $6,000 |
| **Total MRR** | | | **$24,750** |
| **Projected ARR** | | | **$297,000** |

### Cost Structure (Monthly)

| Item | Range |
|------|-------|
| Carlos (part-time, security) | $3–4k |
| Navas (part-time, infra) | $3–4k |
| Gerson (junior, platform) | $2–3k |
| Web Dev (frontend/billing) | $2–3k |
| Ayoub (equity-heavy, modest salary) | — |
| Infrastructure (hosting, backups, monitoring) | $2–4k |
| **Total OpEx** | **$14–20k** |

### Profitability

- **Conservative:** $24.75k − $20k = **$4.75k/mo profit** (19% margin)
- **Optimistic:** $35k − $20k = **$15k/mo profit** (43% margin)
- **Breakeven:** ~40 Bronze customers **or** ~8 Gold customers

---

## Key Success Metrics

| Domain | Owner | Metrics |
|--------|-------|---------|
| Operations | Ayoub | Acquisition rate, churn (< 5%), NPS, avg resolution time |
| Security | Carlos | Wazuh alert response time, incidents resolved, audit readiness, vuln scan results |
| Infrastructure | Navas | Deployment time, uptime vs. SLA, cost per customer, scalability bottlenecks |
| Platform | Gerson | Skill deployment success rate, channel uptime, feature requests completed, MTTR |

---

## Roadmap

| Week | Milestone |
|------|-----------|
| 1 | Complete training roadmap (specialized tracks) |
| 2 | Build deployment automation (Terraform + Ansible) |
| 3 | Launch MVP landing page + Bronze tier |
| 4 | Onboard first 10 Bronze customers |
| 5 | Launch Silver tier, refine support processes |
| 6 | Gold tier beta (invite-only) |
| Month 3 | Platinum tier for enterprise prospects |

---

*Document version: 1.1*  
*Last updated: 2026-02-08*
