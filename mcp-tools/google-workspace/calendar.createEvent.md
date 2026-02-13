# calendar.createEvent

**Server:** google-workspace

## Description
Creates a new event in a calendar.

## Parameters
```json
{
  "calendarId": {
    "type": "string",
    "description": "The ID of the calendar to create the event in."
  },
  "summary": {
    "type": "string",
    "description": "The summary or title of the event."
  },
  "start": {
    "type": "object",
    "properties": {
      "dateTime": {
        "type": "string",
        "description": "The start time in strict ISO 8601 format with seconds and timezone (e.g., 2024-01-15T10:30:00Z or 2024-01-15T10:30:00-05:00)."
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
        "description": "The end time in strict ISO 8601 format with seconds and timezone (e.g., 2024-01-15T11:30:00Z or 2024-01-15T11:30:00-05:00)."
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
    "description": "The email addresses of the attendees."
  }
}
```

**Required:** calendarId, summary, start, end

## Usage
```bash
mcporter call google-workspace.calendar.createEvent [args...]
```
