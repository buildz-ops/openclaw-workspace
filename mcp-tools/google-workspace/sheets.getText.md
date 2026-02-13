# sheets.getText

**Server:** google-workspace

## Description
Retrieves the content of a Google Sheets spreadsheet.

## Parameters
```json
{
  "spreadsheetId": {
    "type": "string",
    "description": "The ID or URL of the spreadsheet to read."
  },
  "format": {
    "type": "string",
    "enum": [
      "text",
      "csv",
      "json"
    ],
    "description": "Output format (default: text)."
  }
}
```

**Required:** spreadsheetId

## Usage
```bash
mcporter call google-workspace.sheets.getText [args...]
```
