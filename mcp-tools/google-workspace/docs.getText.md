# docs.getText

**Server:** google-workspace

## Description
Retrieves the text content of a Google Doc.

## Parameters
```json
{
  "documentId": {
    "type": "string",
    "description": "The ID of the document to read."
  },
  "tabId": {
    "type": "string",
    "description": "The ID of the tab to read. If not provided, returns all tabs."
  }
}
```

**Required:** documentId

## Usage
```bash
mcporter call google-workspace.docs.getText [args...]
```
