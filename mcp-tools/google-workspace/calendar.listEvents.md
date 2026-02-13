# calendar.listEvents

**Server:** google-workspace

## Description
Lists events from a calendar. Defaults to upcoming events.

## Parameters
```json
{
  "calendarId": {
    "type": "string",
    "description": "The ID of the calendar to list events from."
  },
  "timeMin": {
    "type": "string",
    "description": "The start time for the event search. Defaults to the current time."
  },
  "timeMax": {
    "type": "string",
    "description": "The end time for the event search."
  },
  "attendeeResponseStatus": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "description": "The response status of the attendee."
  }
}
```

**Required:** calendarId

## Usage
```bash
mcporter call google-workspace.calendar.listEvents [args...]
```
