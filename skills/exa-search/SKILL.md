---
name: exa-search
description: Use Exa AI for advanced web search, company research, and deep research tasks. Part of the multi-API search routing strategy.
---

# Exa Search

This skill provides access to Exa AI's search and research capabilities via the `mcporter` tool.

**Note:** For general searches, use `scripts/search-router.sh` which automatically picks the best API (Brave or Exa) based on query type.

## Prerequisites

Ensure the `exa` server is configured in `mcporter`:
`mcporter config list`

If not present, add it:
`mcporter config add exa "https://mcp.exa.ai/mcp?tools=web_search_exa,web_search_advanced_exa,get_code_context_exa,crawling_exa,company_research_exa,people_search_exa,deep_researcher_start,deep_researcher_check"`

## Tools

Use `mcporter call exa.<tool_name>` to invoke these tools.

### web_search_exa
Basic web search.
```bash
mcporter call exa.web_search_exa query="latest AI news" numResults=5
```
- `query` (string): Search query.
- `numResults` (number, optional): Number of results (default 8).
- `type` (string, optional): "auto" or "fast".
- `livecrawl` (string, optional): "fallback" or "preferred".

### web_search_advanced_exa
Advanced search with filters.
```bash
mcporter call exa.web_search_advanced_exa query="transformer architecture" category="research paper"
```
- `query` (string): Search query.
- `category` (string, optional): "company", "research paper", "news", "github", "tweet", etc.
- `includeDomains` (array[string], optional): List of domains to include.
- `startPublishedDate` (string, optional): ISO 8601 date.

### company_research_exa
Research a specific company.
```bash
mcporter call exa.company_research_exa companyName="OpenAI"
```
- `companyName` (string): Company name.

### crawling_exa
Get full content of a URL.
```bash
mcporter call exa.crawling_exa url="https://example.com"
```
- `url` (string): URL to crawl.

### people_search_exa
Find professionals.
```bash
mcporter call exa.people_search_exa query="AI engineers in SF"
```
- `query` (string): Search query.

### get_code_context_exa
Find code snippets and docs.
```bash
mcporter call exa.get_code_context_exa query="python pandas dataframe filtering"
```
- `query` (string): Search query.

### deep_researcher_start
Start a deep research task (15s - 2min).
```bash
mcporter call exa.deep_researcher_start instructions="Compare Llama 3 and GPT-4 architecture" model="exa-research"
```
- `instructions` (string): Research question.
- `model` (string, optional): "exa-research-fast", "exa-research", "exa-research-pro".

### deep_researcher_check
Check status/get results of a deep research task.
```bash
mcporter call exa.deep_researcher_check researchId="<id_from_start>"
```
- `researchId` (string): ID from `deep_researcher_start`.
