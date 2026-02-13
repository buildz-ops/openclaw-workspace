# chat.listThreads

**Server:** google-workspace

## Description
Lists threads from a Google Chat space in reverse chronological order.

## Parameters
```json
{
  "spaceName": {
    "type": "string",
    "description": "The name of the space to get threads from (e.g., spaces/AAAAN2J52O8)."
  },
  "pageSize": {
    "type": "number",
    "description": "The maximum number of threads to return."
  },
  "pageToken": {
    "type": "string",
    "description": "The token for the next page of results."
  }
}
```

**Required:** spaceName

## Usage
```bash
mcporter call google-workspace.chat.listThreads [args...]
```
