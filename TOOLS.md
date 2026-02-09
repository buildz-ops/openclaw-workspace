# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:
- Camera names and locations
- SSH hosts and aliases  
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras
- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH
- home-server → 192.168.1.100, user: admin

### TTS
- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

### Exec Workaround (spawn EBADF)
If `exec` fails with `spawn EBADF`, use PTY mode with file redirect:
```bash
# Write script to /tmp
# Run with: exec pty=true command="/bin/bash /tmp/script.sh"
# Read output from redirect file
```

### browser-use
- **Location:** `skills/browser-use/.venv/`
- **Activate:** `source skills/browser-use/.venv/bin/activate`
- **Usage:** `browser-use open <url>`, `browser-use state`, `browser-use click <index>`
- **Modes:** `--browser chromium` (default headless), `--browser real` (local Chrome profile)
- **Always close when done:** `browser-use close`
