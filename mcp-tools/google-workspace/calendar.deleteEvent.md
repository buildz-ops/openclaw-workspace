# calendar.deleteEvent

**Server:** google-workspace

## Description
Deletes an event from a calendar.

## Parameters
```json
{
  "eventId": {
    "type": "string",
    "description": "The ID of the event to delete."
  },
  "calendarId": {
    "type": "string",
    "description": "The ID of the calendar to delete the event from. Defaults to the primary calendar."
  }
}
```

**Required:** eventId

## Usage
```bash
mcporter call google-workspace.calendar.deleteEvent [args...]
```
