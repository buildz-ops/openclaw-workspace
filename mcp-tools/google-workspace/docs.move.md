# docs.move

**Server:** google-workspace

## Description
Moves a document to a specified folder.

## Parameters
```json
{
  "documentId": {
    "type": "string",
    "description": "The ID of the document to move."
  },
  "folderName": {
    "type": "string",
    "description": "The name of the destination folder."
  }
}
```

**Required:** documentId, folderName

## Usage
```bash
mcporter call google-workspace.docs.move [args...]
```
