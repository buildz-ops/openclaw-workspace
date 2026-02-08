# Clawtex — Team Training Roadmap

---

## Philosophy: Divide & Conquer

Each team member becomes a **deep specialist** in their domain while maintaining working knowledge of adjacent areas. No more "everyone learns everything" — that's slow and shallow.

**Timeline:** 6 weeks to operational competence · 3 months to mastery.

---

## Domain Assignments

### Ayoub — Director of Operations

**Focus:** Customer success, business strategy, escalations, team coordination  
**Technical depth:** Broad but shallow — knows where to route issues

**Key Skills:**
- OpenClaw architecture overview
- Service tier differentiation
- Customer onboarding flows
- Support ticket triage (when to escalate to Carlos / Navas / Gerson)
- Business metrics (MRR, churn, CAC, LTV)
- Vendor management

**Training Path:**

| Week | Activities |
|------|-----------|
| 1–2 | Read all OpenClaw docs, deploy personal instance, test all channels |
| 3–4 | Shadow Gerson on deployments, create onboarding templates |
| 5–6 | Run mock support scenarios, build customer playbooks |

**Success Criteria:**
- Explain Clawtex value prop in < 2 minutes
- Triage 80% of support tickets without escalation
- Lead customer onboarding calls confidently

---

### Carlos — Security & Monitoring Specialist

**Focus:** Wazuh SIEM, security hardening, compliance, incident response  
**Technical depth:** Deep security expertise, working infra knowledge

**Key Skills:**
- Wazuh mastery — rules, log analysis, alerting, compliance dashboards
- OS hardening (Ubuntu/Debian) — SSH, Fail2Ban, UFW, AppArmor/SELinux
- Compliance — GDPR logging, audit trails, PCI-DSS basics
- Vulnerability scanning — OpenVAS, Lynis, container scanning
- Incident response — forensics, breach detection, remediation
- OpenClaw security — rate limiting, credential storage, API key rotation

**Training Path:**

#### Weeks 1–2: Wazuh Deep Dive
- [ ] Install Wazuh server + agent on test VPS *(done)*
- [ ] Complete official Wazuh training: <https://wazuh.com/blog/wazuh-free-training-courses/>
- [ ] Configure custom rules for OpenClaw logs (failed auth, rate limits, suspicious patterns)
- [ ] Set up Discord alerting for critical events
- [ ] Create compliance dashboards (GDPR, HIPAA baseline)

**Resources:** [Wazuh Docs](https://documentation.wazuh.com/) · [NIST Framework](https://www.nist.gov/cyberframework) · [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks)

#### Weeks 3–4: Hardening & Compliance
- [ ] Automate OS hardening with Ansible (SSH, Fail2Ban, UFW, unattended-upgrades)
- [ ] Run OpenVAS scans on all Clawtex VPS instances
- [ ] Create security checklist for Gold/Platinum deployments
- [ ] Document incident response runbook (detection → containment → eradication → recovery)
- [ ] Set up encrypted backup verification (Restic + rclone)

**Deliverables:** `security-baseline.yml` · `incident-response.md` · Wazuh rule library for OpenClaw

#### Weeks 5–6: Testing & Refinement
- [ ] Red team exercise on a test Clawtex deployment
- [ ] Tune Wazuh rules (reduce false positives)
- [ ] Create customer-facing security reports (monthly summaries for Gold+)
- [ ] Cross-train Navas on Wazuh basics (backup coverage)

**Success Criteria:**
- Deploy hardened VPS in < 30 minutes
- Wazuh alerts trigger within 5 minutes of suspicious activity
- Zero unpatched CVEs on production systems

---

### Navas — Infrastructure Architect

**Focus:** VPS provisioning, networking, performance optimization, disaster recovery  
**Technical depth:** Deep infra expertise, working security knowledge

**Key Skills:**
- IaC mastery — Terraform (provisioning), Ansible (config management)
- Cloud providers — Hetzner, DigitalOcean, Vultr, AWS/GCP (Platinum)
- Networking — firewalls, load balancing, reverse proxies (Nginx, Traefik, Caddy)
- Performance tuning — CPU/RAM profiling, disk I/O, caching
- Monitoring — Prometheus, Grafana, Loki, node_exporter
- Disaster recovery — backup strategies, failover, multi-region replication

**Training Path:**

#### Weeks 1–2: Infrastructure as Code
- [ ] Learn Terraform basics: <https://developer.hashicorp.com/terraform/tutorials>
- [ ] Create Terraform module for Clawtex VPS (Hetzner/DigitalOcean)
  - Inputs: tier (bronze/silver/gold), region, specs
  - Outputs: IP, SSH key, firewall rules
- [ ] Write Ansible playbook for OpenClaw deployment (Node.js, Docker, systemd, monitoring)
- [ ] Test full Bronze → Silver → Gold pipeline

**Resources:** [Terraform Registry](https://registry.terraform.io/) · [Ansible Galaxy](https://galaxy.ansible.com/) · [Hetzner Cloud API](https://docs.hetzner.cloud/)

#### Weeks 3–4: Monitoring & Performance
- [ ] Deploy Prometheus + Grafana stack on monitoring VPS
- [ ] Create Grafana dashboards: system metrics, OpenClaw metrics, per-tier SLA tracking
- [ ] Set up alerting (PagerDuty for Gold+, Discord for Silver)
- [ ] Load test OpenClaw with simulated traffic (k6)
- [ ] Optimize bottlenecks (query tuning, caching, CDN)

**Deliverables:** `terraform/` modules · `ansible/` playbooks · Grafana dashboard templates

#### Weeks 5–6: Disaster Recovery & Scaling
- [ ] Implement backup strategy: Restic snapshots (hourly Gold+, daily Silver) + rclone to Backblaze B2
- [ ] Automated restore testing (cron)
- [ ] Create failover plan for Platinum (multi-region HA)
- [ ] Document capacity planning guidelines
- [ ] Cross-train Gerson on Terraform basics

**Success Criteria:**
- Provision new VPS in < 5 minutes (Terraform)
- Full Bronze → Gold deployment automated (< 4h for Gold)
- Backup restore tested weekly, recovery time < 1 hour

---

### Gerson — Platform Engineer *(New)*

**Focus:** OpenClaw deployment, channel integrations, skills, customer troubleshooting  
**Technical depth:** Deep OpenClaw expertise, working infra/security knowledge

**Key Skills:**
- OpenClaw mastery — CLI, config, skills, channels, sessions, gateway
- Channel integrations — Discord, Telegram, WhatsApp, Signal, Slack, iMessage
- Skills development — writing, debugging, testing custom skills
- Troubleshooting — log analysis, error reproduction, customer support
- Documentation — customer guides, runbooks, FAQs

**Training Path:**

#### Weeks 1–2: OpenClaw Foundations
- [ ] Read OpenClaw docs cover-to-cover: <https://docs.openclaw.ai>
- [ ] Deploy 3 test instances: Bronze (Docker), Silver (dedicated VPS), Gold (with Wazuh)
- [ ] Configure all supported channels: Discord, Telegram, WhatsApp, Signal
- [ ] Test every built-in skill
- [ ] Read source code: `/home/ubuntu/.npm-global/lib/node_modules/openclaw/`

**Resources:** [OpenClaw GitHub](https://github.com/openclaw/openclaw) · [Discord Dev Portal](https://discord.com/developers) · [Telegram Bot API](https://core.telegram.org/bots/api)

#### Weeks 3–4: Custom Skills & Troubleshooting
- [ ] Write 3 custom skills:
  - `clawtex-onboarding` — automated welcome flow
  - `status-check` — health check + usage stats
  - `backup-verify` — backup integrity testing
- [ ] Create troubleshooting playbook (channel failures, skill errors, performance, crashes)
- [ ] Set up automated test harness (pytest or similar)
- [ ] Shadow Carlos/Navas on infra basics (read-only)

**Deliverables:** `skills/clawtex-*` library · `troubleshooting-playbook.md` · onboarding video walkthrough

#### Weeks 5–6: Customer Success & Cross-Training
- [ ] Own first 10 Bronze customer deployments
- [ ] Create customer docs: quick-start guides, FAQ, video tutorials
- [ ] Build internal tooling: deployment health checker, usage dashboard
- [ ] Cross-train with Navas on Ansible deployments

**Success Criteria:**
- Deploy + test new customer instance in < 30 minutes
- Resolve 70% of support tickets without escalation
- 3+ custom skills deployed to production

---

## Weekly Structure

### Monday 10:00 AM CET — Team Sync (60 min)

1. Check-ins: wins, blockers, this week's goals
2. Carlos: security updates (alerts, incidents, patches)
3. Navas: infra status (uptime, deployments, capacity)
4. Gerson: customer issues (trends, feature requests, bugs)
5. Ayoub: business updates (customers, revenue, priorities)
6. Action items + task assignment

**Output:** Notes in `#🛠️ops`, updated task board

### Friday 4:00 PM CET — Demo Hour (60 min)

- 10–15 min per person: show what you learned/built
- **Demos > slides** — show, don't tell
- Q&A + feedback
- Celebrate wins 🎉

### Daily Async Updates *(encouraged)*

Post in `#🛠️ops`:
- 🌅 Morning: today's plan
- 🌙 Evening: what shipped, what's blocked

---

## Shared Knowledge Base

Everyone contributes to:
- **Runbooks** — step-by-step guides for common tasks
- **Incident Postmortems** — what went wrong, how we fixed it, lessons learned
- **Customer FAQs** — common questions + answers
- **Tool Registry** — what we use, why, how to access

**Location:** `clawtex/docs/` (Markdown, versioned in Git)

---

## Learning Resources

### Required Reading (Everyone)
- [ ] [OpenClaw Documentation](https://docs.openclaw.ai)
- [ ] *The Phoenix Project* (DevOps culture)
- [ ] *Site Reliability Engineering* (Google SRE book, free online)

### Recommended Courses
- **Carlos:** Wazuh SIEM Fundamentals (free) · Linux Security & Hardening (Udemy)
- **Navas:** Terraform Beginner to Advanced (Udemy) · Kubernetes for Beginners (KodeKloud)
- **Gerson:** Node.js Advanced Concepts (Udemy) · Discord.js Guide (official docs)

---

## Post-Week 6: Cross-Training Rotation

Monthly rotation to build T-shaped skills:
- Carlos ↔ Navas (security / infra)
- Gerson → Navas (learn Ansible deployments)
- Everyone → Ayoub (shadow customer calls)

**Goal:** Deep specialty + broad competence across the stack.

---

## Quarterly Reviews

Every 3 months:
1. Skills assessment — what gaps remain?
2. Domain updates — new tools/tech to learn?
3. Customer feedback — what are we missing?
4. Career growth — promotions, raises, new responsibilities

---

*This is a living document. Adapt as needed.*  
*Last updated: 2026-02-08*
