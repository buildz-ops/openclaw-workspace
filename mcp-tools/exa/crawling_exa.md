# crawling_exa

**Server:** exa

## Description
Get the full content of a specific webpage. Use when you have an exact URL.

Best for: Extracting content from a known URL.
Returns: Full text content and metadata from the page.

## Parameters
```json
{
  "url": {
    "type": "string",
    "description": "URL to crawl and extract content from"
  },
  "maxCharacters": {
    "type": "number",
    "description": "Maximum characters to extract (must be a number, default: 3000)"
  }
}
```

**Required:** url

## Usage
```bash
mcporter call exa.crawling_exa [args...]
```
