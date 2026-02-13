# gmail.modify

**Server:** google-workspace

## Description
Modify a Gmail message. Supported modifications include:
    - Add labels to a message.
    - Remove labels from a message.
There are a list of system labels that can be modified on a message:
    - INBOX: removing INBOX label removes the message from inbox and archives the message.
    - SPAM: adding SPAM label marks a message as spam.
    - TRASH: adding TRASH label moves a message to trash.
    - UNREAD: removing UNREAD label marks a message as read.
    - STARRED: adding STARRED label marks a message as starred.
    - IMPORTANT: adding IMPORTANT label marks a message as important.

## Parameters
```json
{
  "messageId": {
    "type": "string",
    "description": "The ID of the message to add labels to and/or remove labels from."
  },
  "addLabelIds": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "maxItems": 100,
    "description": "A list of label IDs to add to the message. Limit to 100 labels."
  },
  "removeLabelIds": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "maxItems": 100,
    "description": "A list of label IDs to remove from the message. Limit to 100 labels."
  }
}
```

**Required:** messageId

## Usage
```bash
mcporter call google-workspace.gmail.modify [args...]
```
