# sheets.getRange

**Server:** google-workspace

## Description
Gets values from a specific range in a Google Sheets spreadsheet.

## Parameters
```json
{
  "spreadsheetId": {
    "type": "string",
    "description": "The ID or URL of the spreadsheet."
  },
  "range": {
    "type": "string",
    "description": "The A1 notation range to get (e.g., \"Sheet1!A1:B10\")."
  }
}
```

**Required:** spreadsheetId, range

## Usage
```bash
mcporter call google-workspace.sheets.getRange [args...]
```
