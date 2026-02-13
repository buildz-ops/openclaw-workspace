# docs.appendText

**Server:** google-workspace

## Description
Appends text to the end of a Google Doc.

## Parameters
```json
{
  "documentId": {
    "type": "string",
    "description": "The ID of the document to modify."
  },
  "text": {
    "type": "string",
    "description": "The text to append to the document."
  },
  "tabId": {
    "type": "string",
    "description": "The ID of the tab to modify. If not provided, modifies the first tab."
  }
}
```

**Required:** documentId, text

## Usage
```bash
mcporter call google-workspace.docs.appendText [args...]
```
