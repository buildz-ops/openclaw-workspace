# Discord Components v2 Reference

## ⚠️ STATUS: BROKEN IN v2026.2.15
**Known Issue:** [#18161](https://github.com/openclaw/openclaw/issues/18161) — The `message` tool silently drops the `components` field before sending to Discord. Components v2 is **non-functional** in this version.

**Additional Issues:**
- [#18145](https://github.com/openclaw/openclaw/issues/18145) — Select menus fail with "unknown component" errors even if #18161 is fixed
- Buttons and modals may work after #18161 is patched

**Wait for v2026.2.16+ before using this feature.**

---

## Overview
OpenClaw v2026.2.15+ documents Discord Components v2 for interactive UI (buttons, selects, modals, media galleries), but the feature is currently broken.

## Usage
Call the `message` tool with a `components` payload. Interactions route back as normal inbound messages.

## Supported Blocks
- `text` — Plain text
- `section` — Text with optional accessory
- `separator` — Visual divider
- `actions` — Button rows or select menus
- `media-gallery` — Multiple media attachments
- `file` — Single file attachment

## Constraints
- **Action rows:** Max 5 buttons OR 1 select menu per row
- **Select types:** `string`, `user`, `role`, `mentionable`, `channel`
- **Modal fields:** Max 5 fields; types: `text`, `checkbox`, `radio`, `select`, `role-select`, `user-select`

## File Attachments
- Use `attachment://<filename>` reference in `file` blocks
- Provide file via `media`, `path`, or `filePath`
- Use `filename` to override upload name

## Example: Buttons + Select

```json5
{
  "channel": "discord",
  "action": "send",
  "to": "channel:1234567890",
  "message": "Fallback text (optional)",
  "components": {
    "text": "Choose a path",
    "blocks": [
      {
        "type": "actions",
        "buttons": [
          { "label": "Approve", "style": "success" },
          { "label": "Decline", "style": "danger" }
        ]
      },
      {
        "type": "actions",
        "select": {
          "type": "string",
          "placeholder": "Pick an option",
          "options": [
            { "label": "Option A", "value": "a" },
            { "label": "Option B", "value": "b" }
          ]
        }
      }
    ]
  }
}
```

## Example: Modal Form

```json5
{
  "channel": "discord",
  "action": "send",
  "to": "channel:1234567890",
  "components": {
    "text": "Fill out this form",
    "modal": {
      "title": "Details",
      "triggerLabel": "Open form",
      "fields": [
        { "type": "text", "label": "Requester" },
        {
          "type": "select",
          "label": "Priority",
          "options": [
            { "label": "Low", "value": "low" },
            { "label": "High", "value": "high" }
          ]
        }
      ]
    }
  }
}
```

## Example: Media Gallery

```json5
{
  "channel": "discord",
  "action": "send",
  "to": "channel:1234567890",
  "components": {
    "blocks": [
      {
        "type": "media-gallery",
        "files": [
          { "path": "/path/to/image1.png" },
          { "path": "/path/to/image2.jpg" }
        ]
      }
    ]
  }
}
```

## Button Styles
- `primary` (blue)
- `secondary` (gray)
- `success` (green)
- `danger` (red)
- `link` (requires `url` field)

## Notes
- Interaction results are routed back to the agent session
- Fallback `message` text is optional but recommended
- Components replace legacy `embeds` when present
- Accent color: `channels.discord.ui.components.accentColor` (default: Discord blurple)

## Related
- **Docs:** `/opt/homebrew/lib/node_modules/openclaw/docs/channels/discord.md`
- **Exec Approvals:** Uses Components v2 for button-based approval UI
