# chat.sendMessage

**Server:** google-workspace

## Description
Sends a message to a Google Chat space.

## Parameters
```json
{
  "spaceName": {
    "type": "string",
    "description": "The name of the space to send the message to (e.g., spaces/AAAAN2J52O8)."
  },
  "message": {
    "type": "string",
    "description": "The message to send."
  }
}
```

**Required:** spaceName, message

## Usage
```bash
mcporter call google-workspace.chat.sendMessage [args...]
```
