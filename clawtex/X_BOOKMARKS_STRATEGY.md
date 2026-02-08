# Clawtex — X.com Bookmark Extraction & Organization Strategy

---

## Overview

Strategy for bulk-extracting and organizing Ayoub's X.com bookmarks — from raw export to categorized, searchable knowledge base.

---

## Extraction Methods

### ⭐ Recommended: twitter-web-exporter

**Tool:** <https://github.com/prinsss/twitter-web-exporter>  
**Type:** UserScript (Tampermonkey/Violentmonkey) · Free, open-source

**Why this wins:**
- No API key required (works directly in browser)
- No 800-bookmark limit (unlike the official API)
- Privacy-first — data never leaves the computer
- Exports JSON, CSV, HTML with full metadata (author, timestamps, engagement)
- Bulk media download at original quality

**Setup (5 min):**
1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Install the script from [latest release](https://github.com/prinsss/twitter-web-exporter/releases/latest/download/twitter-web-exporter.user.js)
3. Navigate to <https://x.com/i/bookmarks>
4. Use the floating 🐈 button → scroll to load all bookmarks
5. Click **Export Data** → download JSON

**Action plan:** Ayoub exports → sends JSON to Vex → Vex processes & categorizes.

### Fallback: Browser Console Script

**Tool:** <https://gist.github.com/gd3kr/948296cf675469f5028911f8eb276dbc>

- Zero installation — paste into DevTools console
- Auto-scrolls and downloads `tweets.json`
- ⚠️ Extracts tweet text only (no author/timestamp/engagement)

### Skipped: Chrome Extensions (Paid/Freemium)

Options like xBookmarks, X Bookmarks Exporter, and Twillot exist but are paid, less transparent, and store data on third-party servers. Only relevant if ongoing sync/search is needed.

---

## Post-Extraction: Organization Pipeline

### Step 1 — Preprocessing

**Script:** `scripts/preprocess-bookmarks.py`

1. Load and parse JSON (text, author, timestamp, engagement, URL, media)
2. Deduplicate
3. Enrich: word count, language detection, hashtag/mention extraction
4. Output: `bookmarks-processed.json`

### Step 2 — AI-Powered Categorization

**Model:** Claude Sonnet 4.5 (batch processing)

**Taxonomy (12 categories):**

| # | Category | Examples |
|---|----------|---------|
| 1 | 🤖 AI/ML | LLMs, agents, ML research, AI tools |
| 2 | 💻 Dev/Engineering | Code, architecture, best practices |
| 3 | 🏗️ Infrastructure | DevOps, cloud, Kubernetes, monitoring |
| 4 | 🔒 Security | Cybersecurity, privacy, compliance |
| 5 | 💼 Business/Strategy | Startups, product management, GTM |
| 6 | 🚀 Startups | Funding, growth, founder stories |
| 7 | 🎨 Design/UX | UI/UX, branding, design systems |
| 8 | 📚 Learning/Resources | Tutorials, courses, guides |
| 9 | 📰 News/Industry | Tech news, trends, announcements |
| 10 | ⚙️ Productivity | Tools, workflows, time management |
| 11 | 🧠 Personal/Inspiration | Motivation, career advice, life lessons |
| 12 | 🗂️ Misc | Uncategorized (fallback) |

Each tweet also gets **Urgency (0–10)** and **Importance (0–10)** scores.

**Batch processing:** 50 tweets/request · ~500 bookmarks = 10 batches · est. cost **~$1–2**.

### Step 3 — Priority Scoring

**Formula:** `Priority = (Urgency × 0.6) + (Importance × 0.4)`

| Tier | Score | Meaning |
|------|-------|---------|
| 🔴 High | 8–10 | Actionable now |
| 🟡 Medium | 5–7 | Relevant, not urgent |
| 🟢 Low | 0–4 | Inspiration / archive |

### Step 4 — Output Formats

**A. Markdown** (`bookmarks-organized.md`)  
Sorted by priority tier → category, with author, reasoning, and scores.

**B. Interactive HTML Dashboard** (`bookmarks-dashboard.html`)  
- Search/filter by category, priority, author
- Charts (category distribution, engagement)
- Tag cloud, timeline view, dark/light mode
- Vanilla HTML/CSS/JS — hostable on GitHub Pages

**C. SQLite Database** *(optional)*  
Full-text search via `bookmarks.db` for CLI queries.

---

## Maintenance

### Weekly Updates (Sundays 10:00 AM CET)
1. Ayoub exports new bookmarks (last 7 days)
2. Sends to Vex via Discord
3. Vex runs incremental update: dedupe → categorize → regenerate outputs
4. Summary posted in `#🛠️ops`

### Monthly Reviews *(optional)*
Re-categorize low-confidence items, archive old low-priority bookmarks.

---

## Implementation Plan

| Phase | Owner | Time | Tasks |
|-------|-------|------|-------|
| 1. Export | Ayoub | 15 min | Install Tampermonkey + script, export JSON, upload |
| 2. Processing | Vex | 2 hours | Preprocess, run Claude categorization, generate outputs |
| 3. Delivery | Vex | 30 min | Upload to `clawtex/bookmarks/`, host dashboard, post summary |
| 4. Feedback | Ayoub | 15 min | Review high-priority items, flag miscategorizations |

**Total turnaround:** ~48 hours (mostly automated).

---

## File Structure

```
clawtex/bookmarks/
├── raw/                          # Original exports
├── processed/                    # Cleaned + categorized JSON, SQLite
├── outputs/                      # Markdown, HTML dashboard, stats
└── scripts/                      # preprocess.py, categorize.py, generate-*.py, weekly-update.sh
```

---

## Success Metrics

1. **Completeness:** 100% of bookmarks extracted (no 800 limit)
2. **Accuracy:** > 90% correct categorization (based on feedback)
3. **Usability:** Find any bookmark in < 30 seconds
4. **Maintenance:** Weekly updates take < 5 min of Ayoub's time

---

## Future Enhancements

- **Smart recommendations** — surface related threads Ayoub missed
- **Auto-archive** — move low-priority items older than 6 months
- **Integrations** — sync with Notion, Obsidian, or Clawtex knowledge base
- **Team sharing** — curated lists for Carlos/Navas/Gerson by domain

---

*Strategy version: 1.1*  
*Last updated: 2026-02-08*
