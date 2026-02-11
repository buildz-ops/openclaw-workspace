# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## Google Workspace (Email, Calendar, Drive, Docs)
**ALWAYS use the `google-workspace` MCP for Google services.**
- **DO NOT USE `gog` CLI.** It is deprecated.
- Email: `mcporter call google-workspace.gmail.send ...`
- Calendar: `mcporter call google-workspace.calendar.list ...`
- Drive/Docs/Sheets: Use corresponding `google-workspace.*` tools.

## Search Preference: Exa
**ALWAYS use the `exa-search` skill for web searches instead of the native `web_search` tool.**
- To search: `mcporter call exa.web_search_exa query="..."`
- To research companies: `mcporter call exa.company_research_exa companyName="..."`
- To find code: `mcporter call exa.get_code_context_exa query="..."`
- For deep research: `mcporter call exa.deep_researcher_start instructions="..."`
- Only fall back to native `web_search` if Exa fails.

## Exec Workaround (spawn EBADF)
If `exec` fails with `spawn EBADF`, use PTY mode with file redirect:
```bash
# Write script to /tmp
# Run with: exec pty=true command="/bin/bash /tmp/script.sh"
# Read output from redirect file
```

## Git Config
- User: `Vex <vex00x00@gmail.com>`
