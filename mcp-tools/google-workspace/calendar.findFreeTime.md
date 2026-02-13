# calendar.findFreeTime

**Server:** google-workspace

## Description
Finds a free time slot for multiple people to meet.

## Parameters
```json
{
  "attendees": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "description": "The email addresses of the attendees."
  },
  "timeMin": {
    "type": "string",
    "description": "The start time for the search in strict ISO 8601 format with seconds and timezone (e.g., 2024-01-15T09:00:00Z or 2024-01-15T09:00:00-05:00)."
  },
  "timeMax": {
    "type": "string",
    "description": "The end time for the search in strict ISO 8601 format with seconds and timezone (e.g., 2024-01-15T18:00:00Z or 2024-01-15T18:00:00-05:00)."
  },
  "duration": {
    "type": "number",
    "description": "The duration of the meeting in minutes."
  }
}
```

**Required:** attendees, timeMin, timeMax, duration

## Usage
```bash
mcporter call google-workspace.calendar.findFreeTime [args...]
```
