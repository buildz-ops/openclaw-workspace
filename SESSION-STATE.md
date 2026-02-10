# SESSION-STATE.md

## Active Issue: #ai-news No Text Responses (UNRESOLVED)

**Channel:** #🧠ai-news (1466764486286250240)
**Guild:** 1466038234600444048
**Symptoms:** @mentions get 👀 ack reaction but NO text response. Other channels work fine.
**Config:** Wildcard `"*": {"allow": true}` — should cover all channels
**Models:** Working (proven by DM responses)
**Restarts tried:** Multiple hot-reload + full restart — no effect

**Next step:** Check gateway logs for errors when mention arrives in #ai-news. The ack reaction fires but no agent session generates a response. Could be a Discord plugin routing bug or channel-specific session issue.

## Config State
- Primary model: `anthropic/claude-sonnet-4-5` (temporarily switched from Gemini)
- DM policy: allowlist with Ayoub's ID
- Main session context: ~76% after restart
