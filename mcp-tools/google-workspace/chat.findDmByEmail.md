# chat.findDmByEmail

**Server:** google-workspace

## Description
Finds a Google Chat DM space by a user's email address.

## Parameters
```json
{
  "email": {
    "type": "string",
    "format": "email",
    "description": "The email address of the user to find the DM space with."
  }
}
```

**Required:** email

## Usage
```bash
mcporter call google-workspace.chat.findDmByEmail [args...]
```
