# calendar.respondToEvent

**Server:** google-workspace

## Description
Responds to a meeting invitation (accept, decline, or tentative).

## Parameters
```json
{
  "eventId": {
    "type": "string",
    "description": "The ID of the event to respond to."
  },
  "calendarId": {
    "type": "string",
    "description": "The ID of the calendar containing the event."
  },
  "responseStatus": {
    "type": "string",
    "enum": [
      "accepted",
      "declined",
      "tentative"
    ],
    "description": "Your response to the invitation."
  },
  "sendNotification": {
    "type": "boolean",
    "description": "Whether to send a notification to the organizer (default: true)."
  },
  "responseMessage": {
    "type": "string",
    "description": "Optional message to include with your response."
  }
}
```

**Required:** eventId, responseStatus

## Usage
```bash
mcporter call google-workspace.calendar.respondToEvent [args...]
```
