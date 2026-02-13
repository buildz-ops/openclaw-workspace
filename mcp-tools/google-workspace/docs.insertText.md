# docs.insertText

**Server:** google-workspace

## Description
Inserts text at the beginning of a Google Doc.

## Parameters
```json
{
  "documentId": {
    "type": "string",
    "description": "The ID of the document to modify."
  },
  "text": {
    "type": "string",
    "description": "The text to insert at the beginning of the document."
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
mcporter call google-workspace.docs.insertText [args...]
```
