# docs.find

**Server:** google-workspace

## Description
Finds Google Docs by searching for a query in their title. Supports pagination.

## Parameters
```json
{
  "query": {
    "type": "string",
    "description": "The text to search for in the document titles."
  },
  "pageToken": {
    "type": "string",
    "description": "The token for the next page of results."
  },
  "pageSize": {
    "type": "number",
    "description": "The maximum number of results to return."
  }
}
```

**Required:** query

## Usage
```bash
mcporter call google-workspace.docs.find [args...]
```
