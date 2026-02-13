# calendar.updateEvent

**Server:** google-workspace

## Description
Updates an existing event in a calendar.

## Parameters
```json
{
  "eventId": {
    "type": "string",
    "description": "The ID of the event to update."
  },
  "calendarId": {
    "type": "string",
    "description": "The ID of the calendar to update the event in."
  },
  "summary": {
    "type": "string",
    "description": "The new summary or title of the event."
  },
  "start": {
    "type": "object",
    "properties": {
      "dateTime": {
        "type": "string",
        "description": "The new start time in strict ISO 8601 format with seconds and timezone (e.g., 2024-01-15T10:30:00Z or 2024-01-15T10:30:00-05:00)."
      }
    },
    "required": [
      "dateTime"
    ],
    "additionalProperties": false
  },
  "end": {
    "type": "object",
    "properties": {
      "dateTime": {
        "type": "string",
        "description": "The new end time in strict ISO 8601 format with seconds and timezone (e.g., 2024-01-15T11:30:00Z or 2024-01-15T11:30:00-05:00)."
      }
    },
    "required": [
      "dateTime"
    ],
    "additionalProperties": false
  },
  "attendees": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "description": "The new list of attendees for the event."
  }
}
```

**Required:** eventId

## Usage
```bash
mcporter call google-workspace.calendar.updateEvent [args...]
```
