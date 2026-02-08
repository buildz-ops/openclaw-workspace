# Clawtex Project Structure

## Service Model

### 🥉 Bronze Tier ($49-99/mo)
**Target:** Individuals, hobbyists, content creators  
**Infrastructure:**
- Shared OpenClaw instance (containerized isolation)
- 1 messaging channel (Discord, Telegram, WhatsApp, or Signal)
- 2GB RAM allocation, 1 vCPU share
- 10GB storage
- Standard skills library access

**Support:**
- 8-hour response time (business hours CET)
- Email/Discord support
- Community knowledge base
- Monthly usage reports

**SLA:** 95% uptime (best-effort)

**Deployment Time:** <2 hours (automated)

---

### 🥈 Silver Tier ($199-299/mo)
**Target:** Small teams, startups, power users  
**Infrastructure:**
- Dedicated VPS (2 vCPU, 4GB RAM, 40GB NVMe)
- Up to 2 messaging channels
- Basic monitoring (Prometheus + Grafana)
- Daily backups (7-day retention)
- Custom skills deployment support

**Support:**
- 4-hour response time (business hours CET)
- Priority Discord/email support
- Quarterly optimization reviews
- Monthly performance reports

**SLA:** 98% uptime

**Deployment Time:** <4 hours (semi-automated with custom config)

---

### 🥇 Gold Tier ($799-1499/mo)
**Target:** Businesses, agencies, compliance-heavy orgs  
**Infrastructure:**
- Performance VPS (4 vCPU, 8GB RAM, 80GB NVMe)
- Unlimited messaging channels
- Full Wazuh SIEM monitoring (Carlos's specialty)
- Real-time alerting (PagerDuty/Opsgenie integration)
- Hourly backups (30-day retention)
- Custom domain & SSL
- Advanced skills (API integrations, custom workflows)

**Support:**
- 1-hour response time (24/5, CET+extended)
- Dedicated Slack/Discord channel
- Monthly strategy calls with Ayoub
- Proactive performance tuning
- Security audits (quarterly)

**SLA:** 99.5% uptime with credits

**Deployment Time:** <24 hours (white-glove onboarding)

---

### 💎 Platinum Tier ($2000+/mo, custom pricing)
**Target:** Enterprise, multi-national, high-security environments  
**Infrastructure:**
- Multi-region HA setup (active-active or active-passive)
- Load-balanced, auto-scaling architecture
- Full disaster recovery (cross-region backups)
- Dedicated infrastructure (no shared resources)
- Advanced Wazuh + custom compliance logging (GDPR, HIPAA, SOC 2)
- White-label deployment options
- Custom AI model endpoints (GPT, Claude, Gemini fine-tuning)

**Support:**
- 24/7/365 support with on-call engineers
- Dedicated account manager (Ayoub)
- Custom SLA negotiation
- On-site deployment support (if needed)
- Quarterly business reviews

**SLA:** 99.9%+ uptime with custom guarantees

**Deployment Time:** 1-2 weeks (full custom architecture)

---

## Tech Stack

### Core Platform
- **OpenClaw Framework** - Latest stable + LTS backport option
- **Node.js 22+** - Runtime
- **Docker/Podman** - Containerization (Bronze/Silver)
- **Kubernetes** - Orchestration (Platinum only)

### Infrastructure as Code
- **Terraform** - VPS provisioning (Navas)
- **Ansible** - Configuration management (Navas)
- **GitHub Actions** - CI/CD pipelines

### Monitoring & Security
- **Prometheus + Grafana** - Metrics & dashboards (all tiers)
- **Wazuh SIEM** - Security monitoring (Gold+, Carlos)
- **Fail2Ban** - Intrusion prevention
- **UFW/iptables** - Firewall management
- **Let's Encrypt** - SSL automation
- **OpenVAS** - Vulnerability scanning (Gold+)

### Backup & DR
- **Restic** - Encrypted backups
- **rclone** - Cloud sync (S3, Backblaze B2)
- **pg_dump/mongodump** - Database backups

### Communication & Collaboration
- **Discord** - Internal ops + customer support
- **Slack** - Gold/Platinum customer channels
- **PagerDuty/Opsgenie** - Incident management (Gold+)

---

## Deployment Automation

### Bronze Tier Pipeline
1. Customer sign-up → Stripe webhook
2. Provision Docker container on shared infra
3. Run `openclaw init` with customer config
4. Connect messaging channel (OAuth flow)
5. Send welcome email + onboarding guide
6. **Total time:** <2 hours (fully automated)

### Silver Tier Pipeline
1. Customer sign-up → Stripe webhook
2. Terraform: Provision VPS (Hetzner/DigitalOcean/Vultr)
3. Ansible: Harden OS, install OpenClaw, configure monitoring
4. Connect channels, deploy custom skills
5. Run smoke tests, generate handoff report
6. **Total time:** <4 hours (90% automated)

### Gold Tier Pipeline
1. Sales call → Custom requirements doc
2. Terraform: Provision performance VPS + Wazuh VM
3. Ansible: Full stack deployment (OpenClaw + monitoring + SIEM)
4. Carlos: Configure Wazuh rules, compliance logging
5. Gerson: Deploy custom skills, test integrations
6. Ayoub: Onboarding call, training session
7. **Total time:** <24 hours (white-glove)

### Platinum Tier Pipeline
1. Enterprise sales cycle (1-2 weeks negotiation)
2. Architecture design session (Navas + Ayoub)
3. Multi-region Terraform deployment
4. HA setup (load balancer, failover, replication)
5. Security hardening (Carlos: Wazuh + compliance)
6. Custom integration development (Gerson + Web Dev)
7. Load testing, DR drills
8. **Total time:** 1-2 weeks (fully custom)

---

## Revenue Projections (12-Month)

### Conservative Model
- **Bronze:** 50 customers × $75/mo avg = $3,750/mo
- **Silver:** 20 customers × $250/mo avg = $5,000/mo
- **Gold:** 10 customers × $1,000/mo avg = $10,000/mo
- **Platinum:** 2 customers × $3,000/mo avg = $6,000/mo
- **Total MRR:** $24,750/mo → **$297k ARR**

### Team Cost Structure (Monthly)
- Ayoub: Director of Ops (equity-heavy, modest salary)
- Carlos: $3-4k/mo (part-time, security focus)
- Navas: $3-4k/mo (part-time, infra focus)
- Gerson: $2-3k/mo (junior, platform focus)
- Web Dev: $2-3k/mo (frontend/billing)
- **Total Labor:** ~$12-16k/mo
- **Infra Costs:** ~$2-4k/mo (hosting, backups, monitoring)
- **Total OpEx:** ~$14-20k/mo

### Profitability
- **Conservative:** $24.75k revenue - $20k costs = **$4.75k/mo profit** (19% margin)
- **Optimistic:** $35k revenue - $20k costs = **$15k/mo profit** (43% margin)

**Breakeven:** ~40 Bronze customers OR 8 Gold customers

---

## Key Success Metrics

### Operations (Ayoub)
- Customer acquisition rate (new signups/month)
- Churn rate (target: <5%)
- Customer satisfaction (NPS score)
- Average resolution time (support tickets)

### Security (Carlos)
- Wazuh alert response time
- Security incidents detected/resolved
- Compliance audit readiness
- Vulnerability scan results

### Infrastructure (Navas)
- Deployment time (automated vs. manual)
- Uptime % (per tier SLA)
- Infrastructure costs per customer
- Scalability bottlenecks identified

### Platform (Gerson)
- Skill deployment success rate
- Channel integration uptime
- Customer feature requests completed
- Troubleshooting MTTR (mean time to resolution)

---

## Next Steps

1. **Week 1:** Complete training roadmap (specialized tracks)
2. **Week 2:** Build deployment automation (Terraform + Ansible)
3. **Week 3:** Launch MVP landing page + Bronze tier
4. **Week 4:** Onboard first 10 Bronze customers
5. **Week 5:** Launch Silver tier, refine support processes
6. **Week 6:** Gold tier beta (invite-only for early customers)
7. **Month 3:** Platinum tier for enterprise prospects

---

*Document version: 1.0*  
*Last updated: 2026-02-05 02:00 AM CET*
