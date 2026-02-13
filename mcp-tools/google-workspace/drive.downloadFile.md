# drive.downloadFile

**Server:** google-workspace

## Description
Downloads the content of a file from Google Drive to a local path. Note: Google Docs, Sheets, and Slides require specialized handling.

## Parameters
```json
{
  "fileId": {
    "type": "string",
    "description": "The ID of the file to download."
  },
  "localPath": {
    "type": "string",
    "description": "The local file path where the content should be saved (e.g., \"downloads/report.pdf\")."
  }
}
```

**Required:** fileId, localPath

## Usage
```bash
mcporter call google-workspace.drive.downloadFile [args...]
```
