Skill created at `skills/exa-search/SKILL.md`.

I have:
1.  Verified the MCP server at `https://mcp.exa.ai/mcp` works and exposes 8 tools.
2.  Added the server to your `mcporter` configuration with the alias `exa`.
3.  Created a new skill `exa-search` that documents how to use these tools via `mcporter`.

You (and the agent) can now use the skill by reading `skills/exa-search/SKILL.md` or simply running:
`mcporter call exa.web_search_exa query="..."`

(Note: I successfully ran a test search, so the endpoint appears to be open or free-tier accessible without extra auth.)