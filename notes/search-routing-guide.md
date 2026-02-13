# Search Routing Guide

**Based on:** "Your Agent Is Only as Good as Its Search" by @Legendaryy  
**Source:** <https://x.com/legendaryy/status/2022270816679772598>  
**Implemented:** February 2026

---

## The Core Insight

**"An agent that can't search well can't reason well."**

Search quality matters MORE than model quality. Brave's research showed:
- Qwen3 (open-weight) + high-quality search context **beat** ChatGPT, Perplexity, and Google AI Mode
- **Context quality > Model capability**

---

## The Five Search APIs

### 1. Brave LLM Context API (NEW - Feb 12, 2026)
**Best for:** General factual lookups, news, grounding

**Strengths:**
- Independent 35B-page index (not Google/Bing wrapper)
- Smart chunks: clean text, structured data, tables, code, YouTube captions
- Latency: <600ms at p90, <130ms overhead
- Token-budget controlled
- SOC 2 Type II, Zero Data Retention
- $5/1K requests (simpler than competitors)

**Status:** MCP server available (`@brave/brave-search-mcp-server`)  
**Note:** Requires API key (2,000 free requests/month)

### 2. Exa (formerly Metaphor)
**Best for:** Semantic research, "find things like this"

**Strengths:**
- Neural embeddings (meaning-based, not keyword)
- Sub-200ms latency (Exa Instant, Feb 2026)
- Refreshed every minute
- Multiple tiers: Fast (350ms), Auto, Deep (3.5s)

**Tools:**
- `web_search_exa` - Basic search
- `web_search_advanced_exa` - Neural search with filters
- `get_code_context_exa` - Code/docs search
- `company_research_exa` - Company intel
- `people_search_exa` - Find professionals
- `crawling_exa` - Extract from URL

**Status:** ✅ Integrated

### 3. Tavily
**Best for:** AI agents, multi-step research

**Strengths:**
- Default in LangChain/LlamaIndex (800K+ devs)
- Agent skills, /research endpoint
- Domain governance for regulated industries

**Status:** Not yet integrated

### 4. Perplexity Sonar
**Best for:** Quick synthesized answers

**Strengths:**
- Bundles search + LLM
- Returns answers with citations
- Multiple tiers: Sonar, Sonar Pro, Deep Research

**Drawback:** Can't use your own LLM

**Status:** Not yet integrated

### 5. Firecrawl
**Best for:** Deep extraction from specific URLs

**Strengths:**
- Handles JS rendering, pagination, auth, CAPTCHAs
- Open source, self-hostable
- Flat pricing: 1 credit per page
- 77.2% coverage vs Exa's 69.2% (vendor benchmark)

**Status:** Not yet integrated

---

## The Routing Strategy

### Article's Recommendation
**DON'T pick one API. Route by query type.**

Multi-API approach reduces costs **40-60%** vs single provider.

### Router Implementation

**Script:** `scripts/search-router.sh`

**Auto-routing logic:**
```bash
# URL patterns → extraction (Exa crawling)
https://example.com/article

# Code keywords → code search (Exa code context)
"API documentation", "code example", "how to use library"

# Company patterns → company research (Exa company)
"research OpenAI company", "about Anthropic business"

# People patterns → people search (Exa people)
"find AI experts", "who is", "professionals in"

# Semantic patterns → semantic search (Exa advanced)
"papers about", "articles similar to", "explain like"

# Default → factual (Brave web search)
Everything else
```

### Query Type Reference

| Type | API | Tool | Use Case |
|------|-----|------|----------|
| **factual** | Brave | `brave_web_search` | News, facts, current events |
| **semantic** | Exa | `web_search_advanced_exa` | Research papers, discovery |
| **code** | Exa | `get_code_context_exa` | Code examples, API docs |
| **company** | Exa | `company_research_exa` | Company intelligence |
| **people** | Exa | `people_search_exa` | Find professionals |
| **extraction** | Exa | `crawling_exa` | Pull content from URL |

---

## Usage Examples

### Auto-detection (Recommended)
```bash
# General fact → Brave
scripts/search-router.sh "latest AI news"

# Research → Exa semantic
scripts/search-router.sh "papers about transformers"

# Code → Exa code context
scripts/search-router.sh "python pandas examples"

# Company → Exa company
scripts/search-router.sh "research Anthropic company"

# URL → Exa crawling
scripts/search-router.sh "https://example.com/article"
```

### Explicit Type
```bash
scripts/search-router.sh "query" --type semantic
scripts/search-router.sh "query" --type code --max-results 10
```

---

## Cost Comparison

**Single API (Brave only):**
- 1,000 queries/month = $5

**Multi-API routing (article's recommendation):**
- 600 Brave (factual) = $3
- 200 Exa (semantic) = ~$1
- 200 Exa (code/company) = ~$1
- **Total: ~$5 for 1,000 queries, but MUCH higher quality**

**Savings:** 40-60% cost reduction through smart routing + better results

---

## Implementation Status

- [x] Exa integration (8 tools)
- [x] Search router script (auto-detection)
- [x] TOOLS.md updated (use router by default)
- [ ] Brave API key setup (needs manual configuration)
- [ ] Tavily integration
- [ ] Firecrawl integration
- [ ] Perplexity Sonar integration

---

## The Article's Cheat Sheet

**If you pick one:** Brave LLM Context API  
- Independent, LLM-optimized, clean pricing, ZDR

**If you pick two:** Brave + Exa  
- Brave handles factual grounding
- Exa handles semantic discovery
- Together = 90% of agent search needs

**If you go all-in:** Brave + Exa + Firecrawl + Perplexity Sonar  
- Route by query type
- Budget $50-100/month
- Comprehensive stack outperforms any single provider

---

## Key Takeaway

**"Your agent is only as good as its search. The LLM handles reasoning. The search handles reality. Get both right."**

Search quality is now the differentiator as models commoditize. The search API you choose is a product decision, not just infrastructure.
