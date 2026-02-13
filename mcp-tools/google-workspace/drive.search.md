# drive.search

**Server:** google-workspace

## Description
Searches for files and folders in Google Drive. The query can be a simple search term, a Google Drive URL, or a full query string. For more information on query strings see: https://developers.google.com/drive/api/guides/search-files

## Parameters
```json
{
  "query": {
    "type": "string",
    "description": "A simple search term (e.g., \"Budget Q3\"), a Google Drive URL, or a full query string (e.g., \"name contains 'Budget' and owners in 'user@example.com'\")."
  },
  "pageSize": {
    "type": "number",
    "description": "The maximum number of results to return."
  },
  "pageToken": {
    "type": "string",
    "description": "The token for the next page of results."
  },
  "corpus": {
    "type": "string",
    "description": "The corpus of files to search (e.g., \"user\", \"domain\")."
  },
  "unreadOnly": {
    "type": "boolean",
    "description": "Whether to filter for unread files only."
  },
  "sharedWithMe": {
    "type": "boolean",
    "description": "Whether to search for files shared with the user."
  }
}
```

**Required:** 

## Usage
```bash
mcporter call google-workspace.drive.search [args...]
```
