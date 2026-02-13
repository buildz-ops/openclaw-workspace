# web_search_exa

**Server:** exa

## Description
Search the web for any topic and get clean, ready-to-use content.

Best for: Finding current information, news, facts, or answering questions about any topic.
Returns: Clean text content from top search results, ready for LLM use.

## Parameters
```json
{
  "query": {
    "type": "string",
    "description": "Websearch query"
  },
  "numResults": {
    "type": "number",
    "description": "Number of search results to return (must be a number, default: 8)"
  },
  "livecrawl": {
    "type": "string",
    "enum": [
      "fallback",
      "preferred"
    ],
    "description": "Live crawl mode - 'fallback': use live crawling as backup if cached content unavailable, 'preferred': prioritize live crawling (default: 'fallback')"
  },
  "type": {
    "type": "string",
    "enum": [
      "auto",
      "fast"
    ],
    "description": "Search type - 'auto': balanced search (default), 'fast': quick results"
  },
  "contextMaxCharacters": {
    "type": "number",
    "description": "Maximum characters for context string optimized for LLMs (must be a number, default: 10000)"
  }
}
```

**Required:** query

## Usage
```bash
mcporter call exa.web_search_exa [args...]
```
