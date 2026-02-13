# calendar.getEvent

**Server:** google-workspace

## Description
Gets the details of a specific calendar event.

## Parameters
```json
{
  "eventId": {
    "type": "string",
    "description": "The ID of the event to retrieve."
  },
  "calendarId": {
    "type": "string",
    "description": "The ID of the calendar the event belongs to. Defaults to the primary calendar."
  }
}
```

**Required:** eventId

## Usage
```bash
mcporter call google-workspace.calendar.getEvent [args...]
```
