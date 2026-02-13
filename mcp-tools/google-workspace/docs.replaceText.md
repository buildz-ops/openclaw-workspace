# docs.replaceText

**Server:** google-workspace

## Description
Replaces all occurrences of a given text with new text in a Google Doc.

## Parameters
```json
{
  "documentId": {
    "type": "string",
    "description": "The ID of the document to modify."
  },
  "findText": {
    "type": "string",
    "description": "The text to find in the document."
  },
  "replaceText": {
    "type": "string",
    "description": "The text to replace the found text with."
  },
  "tabId": {
    "type": "string",
    "description": "The ID of the tab to modify. If not provided, replaces in all tabs (legacy behavior)."
  }
}
```

**Required:** documentId, findText, replaceText

## Usage
```bash
mcporter call google-workspace.docs.replaceText [args...]
```
