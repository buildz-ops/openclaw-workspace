# web_search_advanced_exa

**Server:** exa

## Description
Advanced web search with full control over filters, domains, dates, and content options.

Best for: When you need specific filters like date ranges, domain restrictions, or category filters.
Not recommended for: Simple searches - use web_search_exa instead.
Returns: Search results with optional highlights, summaries, and subpage content.

## Parameters
```json
{
  "query": {
    "type": "string",
    "description": "Search query - can be a question, statement, or keywords"
  },
  "numResults": {
    "type": "number",
    "description": "Number of results (must be a number, 1-100, default: 10)"
  },
  "type": {
    "type": "string",
    "enum": [
      "auto",
      "fast",
      "neural"
    ],
    "description": "Search type - 'auto': balanced (default), 'fast': quick results, 'neural': semantic search"
  },
  "category": {
    "type": "string",
    "enum": [
      "company",
      "research paper",
      "news",
      "pdf",
      "github",
      "tweet",
      "personal site",
      "people",
      "financial report"
    ],
    "description": "Filter results to a specific category"
  },
  "includeDomains": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "description": "Only include results from these domains (e.g., ['arxiv.org', 'github.com'])"
  },
  "excludeDomains": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "description": "Exclude results from these domains"
  },
  "startPublishedDate": {
    "type": "string",
    "description": "Only include results published after this date (ISO 8601: YYYY-MM-DD)"
  },
  "endPublishedDate": {
    "type": "string",
    "description": "Only include results published before this date (ISO 8601: YYYY-MM-DD)"
  },
  "startCrawlDate": {
    "type": "string",
    "description": "Only include results crawled after this date (ISO 8601: YYYY-MM-DD)"
  },
  "endCrawlDate": {
    "type": "string",
    "description": "Only include results crawled before this date (ISO 8601: YYYY-MM-DD)"
  },
  "includeText": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "description": "Only include results containing ALL of these text strings"
  },
  "excludeText": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "description": "Exclude results containing ANY of these text strings"
  },
  "userLocation": {
    "type": "string",
    "description": "ISO country code for geo-targeted results (e.g., 'US', 'GB', 'DE')"
  },
  "moderation": {
    "type": "boolean",
    "description": "Filter out unsafe/inappropriate content"
  },
  "additionalQueries": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "description": "Additional query variations to expand search coverage"
  },
  "textMaxCharacters": {
    "type": "number",
    "description": "Max characters for text extraction per result (must be a number)"
  },
  "contextMaxCharacters": {
    "type": "number",
    "description": "Max characters for context string (must be a number, default: 10000)"
  },
  "enableSummary": {
    "type": "boolean",
    "description": "Enable summary generation for results"
  },
  "summaryQuery": {
    "type": "string",
    "description": "Focus query for summary generation"
  },
  "enableHighlights": {
    "type": "boolean",
    "description": "Enable highlights extraction"
  },
  "highlightsNumSentences": {
    "type": "number",
    "description": "Number of sentences per highlight (must be a number)"
  },
  "highlightsPerUrl": {
    "type": "number",
    "description": "Number of highlights per URL (must be a number)"
  },
  "highlightsQuery": {
    "type": "string",
    "description": "Query for highlight relevance"
  },
  "livecrawl": {
    "type": "string",
    "enum": [
      "never",
      "fallback",
      "always",
      "preferred"
    ],
    "description": "Live crawl mode - 'never': only cached, 'fallback': cached then live, 'always': always live, 'preferred': prefer live (default: 'fallback')"
  },
  "livecrawlTimeout": {
    "type": "number",
    "description": "Timeout for live crawl in milliseconds (must be a number)"
  },
  "subpages": {
    "type": "number",
    "description": "Number of subpages to crawl from each result (must be a number, 1-10)"
  },
  "subpageTarget": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "description": "Keywords to target when selecting subpages"
  }
}
```

**Required:** query

## Usage
```bash
mcporter call exa.web_search_advanced_exa [args...]
```
