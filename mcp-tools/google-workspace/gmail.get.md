# gmail.get

**Server:** google-workspace

## Description
Get the full content of a specific email message.

## Parameters
```json
{
  "messageId": {
    "type": "string",
    "description": "The ID of the message to retrieve."
  },
  "format": {
    "type": "string",
    "enum": [
      "minimal",
      "full",
      "raw",
      "metadata"
    ],
    "description": "Format of the message (default: full)."
  }
}
```

**Required:** messageId

## Usage
```bash
mcporter call google-workspace.gmail.get [args...]
```
