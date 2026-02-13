# chat.sendDm

**Server:** google-workspace

## Description
Sends a direct message to a user.

## Parameters
```json
{
  "email": {
    "type": "string",
    "format": "email",
    "description": "The email address of the user to send the message to."
  },
  "message": {
    "type": "string",
    "description": "The message to send."
  }
}
```

**Required:** email, message

## Usage
```bash
mcporter call google-workspace.chat.sendDm [args...]
```
