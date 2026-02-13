# chat.setUpSpace

**Server:** google-workspace

## Description
Sets up a new Google Chat space with a display name and a list of members.

## Parameters
```json
{
  "displayName": {
    "type": "string",
    "description": "The display name of the space."
  },
  "userNames": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "description": "The user names of the members to add to the space (e.g. users/12345678)"
  }
}
```

**Required:** displayName, userNames

## Usage
```bash
mcporter call google-workspace.chat.setUpSpace [args...]
```
