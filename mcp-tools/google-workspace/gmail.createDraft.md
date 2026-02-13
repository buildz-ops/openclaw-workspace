# gmail.createDraft

**Server:** google-workspace

## Description
Create a draft email message.

## Parameters
```json
{
  "to": {
    "anyOf": [
      {
        "type": "string"
      },
      {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    ],
    "description": "Recipient email address(es)."
  },
  "subject": {
    "type": "string",
    "description": "Email subject."
  },
  "body": {
    "type": "string",
    "description": "Email body content."
  },
  "cc": {
    "anyOf": [
      {
        "type": "string"
      },
      {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    ],
    "description": "CC recipient email address(es)."
  },
  "bcc": {
    "anyOf": [
      {
        "type": "string"
      },
      {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    ],
    "description": "BCC recipient email address(es)."
  },
  "isHtml": {
    "type": "boolean",
    "description": "Whether the body is HTML (default: false)."
  }
}
```

**Required:** to, subject, body

## Usage
```bash
mcporter call google-workspace.gmail.createDraft [args...]
```
