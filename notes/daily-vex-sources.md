# Daily Vex — Source Strategy (Post-X Suspension)

**Status:** One-week trial (2026-02-16 → 2026-02-23)  
**Goal:** Match X-based quality without xAI/Grok API cost

## Source Mix

### 1. Reddit (Primary for Real-Time Buzz)
**Subreddits to monitor:**
- r/LocalLLaMA — open-source models, quantization, hardware
- r/MachineLearning — research papers, breakthroughs
- r/singularity — AGI discourse, industry news
- r/OpenAI — GPT updates, API changes
- r/ClaudeAI — Anthropic news
- r/StableDiffusion — image gen updates
- r/Ollama — local model deployment

**Method:** Use `reddit-readonly` skill with `find` command  
**Frequency:** Daily scrape (hot + new posts from last 24h)

### 2. Hacker News
**Why:** Early tech adoption, YC startups, thoughtful discussion  
**Method:** Public API (`https://hacker-news.firebaseio.com/v0/`)  
**Filter:** Stories tagged "ai" OR containing AI keywords in title  
**Frequency:** Daily top 30 stories

### 3. RSS Feeds (Depth & Analysis)
**Core feeds:**
- The Batch (DeepLearning.AI) — weekly digest
- Import AI (Jack Clark) — policy + research
- Papers with Code — new benchmark results
- Hugging Face blog — model releases
- OpenAI blog — official updates
- Anthropic blog — Claude releases

**Method:** Standard RSS parser (curl + XML parsing)  
**Frequency:** Check daily, aggregate weekly releases

### 4. Web Search (Gap Filling)
**Use case:** When sources miss breaking news mentioned in other channels  
**Method:** Brave Search API with `freshness=pd` (past day)  
**Queries:** Automated daily sweep for "AI news", "LLM release", "model benchmark"

## Quality Metrics (Week 1 Trial)
Track these to evaluate vs X-based approach:
- [ ] Breaking news latency (did we catch releases within 24h?)
- [ ] Founder/researcher commentary (did we miss key voices?)
- [ ] Technical depth (better/worse than X threads?)
- [ ] Signal-to-noise ratio (fewer/more irrelevant stories?)
- [ ] Ayoub satisfaction score (subjective, end of week)

## Backup Plan
If quality drops significantly:
- **Option A:** Add xAI/Grok API for X access (cost TBD)
- **Option B:** Manual curation by Ayoub (paste X links for me to research)
- **Option C:** Hybrid (automated sources + manual X highlights)

## Automation Setup
**Cron job:** `daily-ai-brief` (21:00 CET)  
**Target channel:** #ai-newsletter (1471155181352911093)  
**Format:** Unchanged (summary + source links)

---

*Trial start: 2026-02-16*  
*Review date: 2026-02-23*
