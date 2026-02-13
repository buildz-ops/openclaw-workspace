# brave_summarizer

**Server:** brave-search

## Description

    Retrieves AI-generated summaries of web search results using Brave's Summarizer API. This tool processes search results to create concise, coherent summaries of information gathered from multiple sources.

    When to use:

    - When you need a concise overview of complex topics from multiple sources
    - For quick fact-checking or getting key points without reading full articles
    - When providing users with summarized information that synthesizes various perspectives
    - For research tasks requiring distilled information from web searches

    Returns a text summary that consolidates information from the search results. Optional features include inline references to source URLs and additional entity information.

    Requirements: Must first perform a web search using brave_web_search with summary=true parameter. Requires a Pro AI subscription to access the summarizer functionality.

## Parameters
```json
{
  "key": {
    "type": "string",
    "description": "The key is equal to value of field key as part of the Summarizer response model."
  },
  "entity_info": {
    "default": false,
    "description": "Returns extra entities info with the summary response.",
    "type": "boolean"
  },
  "inline_references": {
    "default": false,
    "description": "Adds inline references to the summary response.",
    "type": "boolean"
  }
}
```

**Required:** key

## Usage
```bash
mcporter call brave-search.brave_summarizer [args...]
```
