# SKILL: Daily AI/Tech Brief (daily-brief)

## Description
Generates a daily curated AI/Tech newsletter from the @vex00x00 X feed. Runs automatically at 21:00 CET.
- Collects high-signal posts (filtering out noise/memes).
- Formats as a markdown summary with source links.
- Identifies potential high-value accounts to follow (for user approval).
- Posts directly to Discord channel #📰ai-newsletter (1466764487356055583).

## Usage
Run via `cron` or manually trigger:
`mcporter call openclaw.daily_brief` (or equivalent command)

## Workflow
1. **Launch Browser:** `profile="openclaw"` (isolated session).
2. **Navigate:** `https://x.com/home`.
3. **Scroll & Capture:** Collect top ~20-30 posts (text, author, metrics, link).
4. **Filter:** Use LLM to select high-signal content (technical depth, news, insights).
5. **Analyze Growth:** Identify non-followed authors with high-signal content; propose 1-2 for review.
6. **Format:** Create "The Daily Vex" markdown report.
7. **Publish:** Send to Discord.

## Configuration
- **Schedule:** Daily at 21:00 CET.
- **Target Channel:** Discord #📰ai-newsletter (1466764487356055583).
- **Growth Strategy:** Propose only (do not auto-follow).
