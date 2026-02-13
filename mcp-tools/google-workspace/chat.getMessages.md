# chat.getMessages

**Server:** google-workspace

## Description
Gets messages from a Google Chat space.

## Parameters
```json
{
  "spaceName": {
    "type": "string",
    "description": "The name of the space to get messages from (e.g., spaces/AAAAN2J52O8)."
  },
  "threadName": {
    "type": "string",
    "description": "The resource name of the thread to filter messages by. Example: \"spaces/AAAAVJcnwPE/threads/IAf4cnLqYfg\""
  },
  "unreadOnly": {
    "type": "boolean",
    "description": "Whether to return only unread messages."
  },
  "pageSize": {
    "type": "number",
    "description": "The maximum number of messages to return."
  },
  "pageToken": {
    "type": "string",
    "description": "The token for the next page of results."
  },
  "orderBy": {
    "type": "string",
    "description": "The order to list messages in (e.g., \"createTime desc\")."
  }
}
```

**Required:** spaceName

## Usage
```bash
mcporter call google-workspace.chat.getMessages [args...]
```
