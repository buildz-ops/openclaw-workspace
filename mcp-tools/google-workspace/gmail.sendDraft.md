# gmail.sendDraft

**Server:** google-workspace

## Description
Send a previously created draft email.

## Parameters
```json
{
  "draftId": {
    "type": "string",
    "description": "The ID of the draft to send."
  }
}
```

**Required:** draftId

## Usage
```bash
mcporter call google-workspace.gmail.sendDraft [args...]
```
