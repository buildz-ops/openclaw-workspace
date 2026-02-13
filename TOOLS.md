# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## Search Strategy: Multi-API Routing (NEW!)
**Based on:** "Your Agent Is Only as Good as Its Search" by @Legendaryy (Feb 2026)

**ALWAYS use `scripts/search-router.sh` for web searches.**

The router automatically picks the best API based on query type:
- **Brave** → General facts, news, current events (fast, cheap, high-quality)
- **Exa** → Semantic research, code examples, company info, people search

**Usage:**
```bash
# Auto-detect query type (recommended)
scripts/search-router.sh "latest AI news"

# Explicit type
scripts/search-router.sh "transformer papers" --type semantic
scripts/search-router.sh "pandas examples" --type code
scripts/search-router.sh "OpenAI" --type company
```

**Query types:**
- `factual` - General lookups, news (→ Brave)
- `semantic` - Research papers, "find X like Y" (→ Exa Advanced)
- `code` - Code examples, API docs (→ Exa Code Context)
- `company` - Company research (→ Exa Company)
- `people` - Find professionals/experts (→ Exa People)
- `extraction` - Pull content from URL (→ Exa Crawling)
- `auto` - Let router decide (default)

**Why this matters:**
- **Search quality > Model quality** (Brave's research: weaker model + good search > GPT-4 + bad search)
- **Multi-API routing saves 40-60% on costs**
- **Each API has different strengths** - routing maximizes quality per dollar

**Fallback:** If router fails, use `mcporter call exa.web_search_exa query="..."` directly.

---

## Exec Workaround (spawn EBADF)
If `exec` fails with `spawn EBADF`, use PTY mode with file redirect:
```bash
# Write script to /tmp
# Run with: exec pty=true command="/bin/bash /tmp/script.sh"
# Read output from redirect file
```

## Git Config
- User: `Vex <vex00x00@gmail.com>`

## Voice Message Transcription
When Ayoub sends Discord voice messages, transcribe them using Whisper:
```bash
# 1. Download the .ogg file from Discord CDN
curl -o /tmp/voice.ogg "<discord-cdn-url>"

# 2. Convert to .wav (ffmpeg already installed)
ffmpeg -i /tmp/voice.ogg -ac 1 -ar 16000 /tmp/voice.wav

# 3. Transcribe using Whisper (install in venv first time)
python3 -m venv /tmp/whisper-env
source /tmp/whisper-env/bin/activate
pip install openai-whisper
whisper /tmp/voice.ogg --model tiny --output_format txt --output_dir /tmp

# 4. Read the transcription
cat /tmp/voice-message.txt
```
