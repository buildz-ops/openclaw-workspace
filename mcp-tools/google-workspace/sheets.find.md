# sheets.find

**Server:** google-workspace

## Description
Finds Google Sheets spreadsheets by searching for a query. Supports pagination.

## Parameters
```json
{
  "query": {
    "type": "string",
    "description": "The text to search for in spreadsheets."
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
mcporter call google-workspace.sheets.find [args...]
```
