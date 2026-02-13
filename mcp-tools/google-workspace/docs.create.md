# docs.create

**Server:** google-workspace

## Description
Creates a new Google Doc. Can be blank or with Markdown content.

## Parameters
```json
{
  "title": {
    "type": "string",
    "description": "The title for the new Google Doc."
  },
  "folderName": {
    "type": "string",
    "description": "The name of the folder to create the document in."
  },
  "markdown": {
    "type": "string",
    "description": "The Markdown content to create the document from."
  }
}
```

**Required:** title

## Usage
```bash
mcporter call google-workspace.docs.create [args...]
```
