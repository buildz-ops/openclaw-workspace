# Clawtex Team Training Roadmap

## Philosophy: Divide & Conquer

Instead of everyone learning everything (slow, shallow), each team member becomes a **deep specialist** in their domain while maintaining **working knowledge** of adjacent areas.

**Timeline:** 6 weeks to operational competence, 3 months to mastery.

---

## 🎯 Domain Assignments

### Ayoub - Director of Operations
**Primary Focus:** Customer success, business strategy, escalations, team coordination  
**Technical Depth:** Broad but shallow (knows where to route issues)

**Key Skills:**
- OpenClaw architecture overview (read docs/ARCHITECTURE.md)
- Service tier differentiation (know what each tier offers)
- Customer onboarding flows
- Support ticket triage (when to escalate to Carlos/Navas/Gerson)
- Business metrics (MRR, churn, CAC, LTV)
- Vendor management (hosting, monitoring tools)

**Training Path:**
1. **Week 1-2:** Read all OpenClaw docs, deploy personal instance, test all channels
2. **Week 3-4:** Shadow Gerson on customer deployments, create onboarding templates
3. **Week 5-6:** Run mock support scenarios, build customer playbooks

**Success Metrics:**
- Can explain Clawtex value prop in <2 minutes
- Can triage 80% of support tickets without escalation
- Comfortable leading customer onboarding calls

---

### Carlos - Security & Monitoring Specialist
**Primary Focus:** Wazuh SIEM, security hardening, compliance, incident response  
**Technical Depth:** Deep security expertise, working infra knowledge

**Key Skills:**
- **Wazuh mastery:** Rule creation, log analysis, alerting, compliance dashboards
- OS hardening (Ubuntu/Debian): SSH hardening, Fail2Ban, UFW, AppArmor/SELinux
- Security compliance: GDPR logging, audit trails, PCI-DSS basics
- Vulnerability scanning: OpenVAS, Lynis, container scanning
- Incident response: Log forensics, breach detection, remediation
- OpenClaw security: Rate limiting, credential storage, API key rotation

**Training Path:**

#### Week 1-2: Wazuh Deep Dive
- [ ] Install Wazuh server + agent on test VPS (already done!)
- [ ] Complete official Wazuh training: https://wazuh.com/blog/wazuh-free-training-courses/
- [ ] Configure custom rules for OpenClaw logs (detect failed auth, rate limit hits, suspicious patterns)
- [ ] Set up Slack/Discord alerting for critical events
- [ ] Create compliance dashboards (GDPR, HIPAA baseline)

**Resources:**
- Wazuh Documentation: https://documentation.wazuh.com/
- NIST Cybersecurity Framework: https://www.nist.gov/cyberframework
- CIS Benchmarks (Ubuntu): https://www.cisecurity.org/cis-benchmarks

#### Week 3-4: Hardening & Compliance
- [ ] Automate OS hardening with Ansible playbook (SSH, Fail2Ban, UFW, unattended-upgrades)
- [ ] Run OpenVAS vulnerability scans on all Clawtex VPS instances
- [ ] Create security checklist for Gold/Platinum deployments
- [ ] Document incident response runbook (detection → containment → eradication → recovery)
- [ ] Set up encrypted backup verification (Restic + rclone)

**Deliverables:**
- `security-baseline.yml` (Ansible playbook)
- `incident-response.md` (runbook)
- Wazuh rule library for OpenClaw

#### Week 5-6: Testing & Refinement
- [ ] Red team exercise: Try to breach a test Clawtex deployment
- [ ] Tune Wazuh rules (reduce false positives)
- [ ] Create customer-facing security reports (monthly summaries for Gold+)
- [ ] Cross-train Navas on Wazuh basics (backup coverage)

**Success Metrics:**
- Can deploy hardened VPS in <30 minutes
- Wazuh alerts trigger within 5 minutes of suspicious activity
- Zero unpatched CVEs on production systems

---

### Navas - Infrastructure Architect
**Primary Focus:** VPS provisioning, networking, performance optimization, disaster recovery  
**Technical Depth:** Deep infra expertise, working security knowledge

**Key Skills:**
- **IaC mastery:** Terraform (VPS provisioning), Ansible (config management)
- Cloud providers: Hetzner, DigitalOcean, Vultr, AWS/GCP (Platinum tier)
- Networking: Firewalls, load balancing, reverse proxies (Nginx, Traefik, Caddy)
- Performance tuning: CPU/RAM profiling, disk I/O optimization, caching strategies
- Monitoring: Prometheus, Grafana, Loki (logs), node_exporter
- Disaster recovery: Backup strategies, failover testing, multi-region replication

**Training Path:**

#### Week 1-2: Infrastructure as Code
- [ ] Learn Terraform basics: https://developer.hashicorp.com/terraform/tutorials
- [ ] Create Terraform module for Clawtex VPS (Hetzner/DigitalOcean)
  - Input variables: tier (bronze/silver/gold), region, specs
  - Outputs: IP, SSH key, firewall rules
- [ ] Write Ansible playbook for OpenClaw deployment
  - Install Node.js, Docker, OpenClaw CLI
  - Configure systemd service
  - Set up monitoring (Prometheus + Grafana)
- [ ] Test full Bronze → Silver → Gold deployment pipeline

**Resources:**
- Terraform Registry: https://registry.terraform.io/
- Ansible Galaxy: https://galaxy.ansible.com/
- Hetzner Cloud API: https://docs.hetzner.cloud/

#### Week 3-4: Monitoring & Performance
- [ ] Deploy Prometheus + Grafana stack on monitoring VPS
- [ ] Create Grafana dashboards for:
  - System metrics (CPU, RAM, disk, network)
  - OpenClaw metrics (API latency, message throughput, error rates)
  - Customer-specific views (per-tier SLA tracking)
- [ ] Set up alerting (PagerDuty for Gold+, Slack for Silver)
- [ ] Performance testing: Load test OpenClaw with simulated traffic (Apache Bench, k6)
- [ ] Optimize bottlenecks (database query tuning, caching, CDN for assets)

**Deliverables:**
- `terraform/` directory with reusable modules
- `ansible/` directory with deployment playbooks
- Grafana dashboard templates

#### Week 5-6: Disaster Recovery & Scaling
- [ ] Implement backup strategy:
  - Restic for encrypted snapshots (hourly for Gold+, daily for Silver)
  - rclone for off-site storage (Backblaze B2)
  - Automated restore testing (cron job)
- [ ] Create failover plan for Platinum tier (multi-region HA)
- [ ] Document capacity planning (when to scale up, add regions)
- [ ] Cross-train Gerson on Terraform basics (deployment handoff)

**Success Metrics:**
- Can provision new VPS in <5 minutes (Terraform)
- Full Bronze→Gold deployment automated (<4h for Gold)
- Backup restore tested weekly (recovery time <1 hour)

---

### Gerson - Platform Engineer (New!)
**Primary Focus:** OpenClaw deployment, channel integrations, skills, customer troubleshooting  
**Technical Depth:** Deep OpenClaw expertise, working infra/security knowledge

**Key Skills:**
- **OpenClaw mastery:** CLI, config, skills, channels, sessions, gateway management
- Channel integrations: Discord, Telegram, WhatsApp, Signal, Slack, iMessage
- Skills development: Writing custom skills, debugging, testing
- Troubleshooting: Log analysis, error reproduction, customer support
- Documentation: Customer-facing guides, runbooks, FAQs

**Training Path:**

#### Week 1-2: OpenClaw Foundations
- [ ] Complete OpenClaw docs cover-to-cover: https://docs.openclaw.ai
- [ ] Deploy 3 test instances:
  - Bronze tier (shared Docker container)
  - Silver tier (dedicated VPS)
  - Gold tier (with Wazuh monitoring)
- [ ] Configure all supported channels:
  - Discord (bot setup, permissions)
  - Telegram (bot token, webhook)
  - WhatsApp (via Twilio or local instance)
  - Signal (signal-cli or docker container)
- [ ] Test every built-in skill (web search, calendar, email, etc.)
- [ ] Read source code: `/home/ubuntu/.npm-global/lib/node_modules/openclaw/`

**Resources:**
- OpenClaw GitHub: https://github.com/openclaw/openclaw
- Discord Developer Portal: https://discord.com/developers
- Telegram Bot API: https://core.telegram.org/bots/api

#### Week 3-4: Custom Skills & Troubleshooting
- [ ] Write 3 custom skills for common customer use cases:
  - `clawtex-onboarding`: Automated welcome flow
  - `status-check`: Health check + usage stats
  - `backup-verify`: Test backup integrity
- [ ] Create troubleshooting playbook:
  - Channel connection failures
  - Skill errors (dependency issues, API rate limits)
  - Performance degradation
  - Gateway crashes
- [ ] Set up test harness:
  - Automated skill testing (pytest or similar)
  - Channel integration tests (mock messages)
- [ ] Shadow Carlos/Navas on infrastructure basics (read-only access)

**Deliverables:**
- `skills/clawtex-*` custom skills library
- `troubleshooting-playbook.md`
- Customer onboarding video walkthrough

#### Week 5-6: Customer Success & Cross-Training
- [ ] Take ownership of first 10 Bronze customer deployments
- [ ] Create customer-facing documentation:
  - Quick start guides (per channel)
  - FAQ (common issues + solutions)
  - Video tutorials (channel setup, skill usage)
- [ ] Build internal tooling:
  - Deployment health checker (automated smoke tests)
  - Customer usage dashboard (Grafana + OpenClaw metrics)
- [ ] Cross-train with Navas on Ansible deployments

**Success Metrics:**
- Can deploy + test new customer instance in <30 minutes
- Resolve 70% of support tickets without escalation
- 3+ custom skills deployed to production

---

## 📅 Weekly Structure

### Monday 10 AM CET - Team Sync (60 min)
**Agenda:**
1. Progress check-ins (each person: wins, blockers, this week's goals)
2. Carlos: Security updates (Wazuh alerts, incidents, patches)
3. Navas: Infra status (uptime, deployments, capacity)
4. Gerson: Customer issues (trends, feature requests, bugs)
5. Ayoub: Business updates (new customers, revenue, priorities)
6. Action items + task assignment

**Output:** Shared notes in `#🛠️ops`, updated Trello/GitHub board

### Friday 4 PM CET - Demo Hour (60 min)
**Format:** Each person presents one thing they learned/built this week
- 10-15 min per person (show, don't tell)
- Demos > slides
- Q&A + feedback
- Celebrate wins 🎉

**Purpose:** Knowledge sharing, accountability, team bonding

### Daily Async Updates
Post in `#🛠️ops` (optional but encouraged):
- 🌅 Morning: Today's plan
- 🌙 Evening: What shipped, what's blocked

---

## 🧰 Shared Knowledge Base

Everyone contributes to:
- **Runbooks:** Step-by-step guides for common tasks
- **Incident Postmortems:** What went wrong, how we fixed it, lessons learned
- **Customer FAQs:** Common questions + answers (crowd-sourced)
- **Tool Registry:** What tools we use, why, how to access

**Location:** `clawtex/docs/` (Markdown files, versioned in Git)

---

## 🎓 Learning Resources (Shared)

### Required Reading (Everyone)
- [ ] OpenClaw Documentation: https://docs.openclaw.ai
- [ ] The Phoenix Project (book on DevOps culture)
- [ ] Site Reliability Engineering (Google SRE book, free online)

### Recommended Courses
- **Carlos:** 
  - Wazuh SIEM Fundamentals (free)
  - Linux Security & Hardening (Udemy)
- **Navas:** 
  - Terraform: From Beginner to Advanced (Udemy)
  - Kubernetes for Absolute Beginners (KodeKloud)
- **Gerson:** 
  - Node.js Advanced Concepts (Udemy)
  - Discord.js Guide (official docs)

---

## 🚀 Post-Week 6: Cross-Training Rotation

After initial specialization, monthly rotation:
- Carlos shadows Navas on infra (learn Terraform)
- Navas shadows Carlos on security (learn Wazuh)
- Gerson shadows Navas on deployments (learn Ansible)
- Everyone shadows Ayoub on customer calls

**Goal:** Build T-shaped skills (deep specialty + broad competence)

---

## 📊 Quarterly Reviews

Every 3 months:
1. **Skills assessment:** What gaps remain?
2. **Domain updates:** Any new tools/tech to learn?
3. **Customer feedback:** What are we missing?
4. **Career growth:** Promotions, raises, new responsibilities

---

*This is a living document. Adapt as needed.*

*Last updated: 2026-02-05 02:00 AM CET*
