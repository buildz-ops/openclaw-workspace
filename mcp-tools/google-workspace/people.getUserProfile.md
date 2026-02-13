# people.getUserProfile

**Server:** google-workspace

## Description
Gets a user's profile information.

## Parameters
```json
{
  "userId": {
    "type": "string",
    "description": "The ID of the user to get profile information for."
  },
  "email": {
    "type": "string",
    "description": "The email address of the user to get profile information for."
  },
  "name": {
    "type": "string",
    "description": "The name of the user to get profile information for."
  }
}
```

**Required:** 

## Usage
```bash
mcporter call google-workspace.people.getUserProfile [args...]
```
