# gmail.downloadAttachment

**Server:** google-workspace

## Description
Downloads an attachment from a Gmail message to a local file.

## Parameters
```json
{
  "messageId": {
    "type": "string",
    "description": "The ID of the message containing the attachment."
  },
  "attachmentId": {
    "type": "string",
    "description": "The ID of the attachment to download."
  },
  "localPath": {
    "type": "string",
    "description": "The absolute local path where the attachment should be saved (e.g., \"/Users/name/downloads/report.pdf\")."
  }
}
```

**Required:** messageId, attachmentId, localPath

## Usage
```bash
mcporter call google-workspace.gmail.downloadAttachment [args...]
```
