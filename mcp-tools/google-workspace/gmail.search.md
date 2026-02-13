# gmail.search

**Server:** google-workspace

## Description
Search for emails in Gmail using query parameters.

## Parameters
```json
{
  "query": {
    "type": "string",
    "description": "Search query (same syntax as Gmail search box, e.g., \"from:someone@example.com is:unread\")."
  },
  "maxResults": {
    "type": "number",
    "description": "Maximum number of results to return (default: 100)."
  },
  "pageToken": {
    "type": "string",
    "description": "Token for the next page of results."
  },
  "labelIds": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "description": "Filter by label IDs (e.g., [\"INBOX\", \"UNREAD\"])."
  },
  "includeSpamTrash": {
    "type": "boolean",
    "description": "Include messages from SPAM and TRASH (default: false)."
  }
}
```

**Required:** 

## Usage
```bash
mcporter call google-workspace.gmail.search [args...]
```
