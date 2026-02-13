# slides.getText

**Server:** google-workspace

## Description
Retrieves the text content of a Google Slides presentation.

## Parameters
```json
{
  "presentationId": {
    "type": "string",
    "description": "The ID or URL of the presentation to read."
  }
}
```

**Required:** presentationId

## Usage
```bash
mcporter call google-workspace.slides.getText [args...]
```
