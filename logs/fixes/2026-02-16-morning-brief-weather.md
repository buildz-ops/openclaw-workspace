# Fix: Morning Brief Weather Timeout

**Date:** 2026-02-16  
**Issue:** Morning briefing cron job failing with `curl` exit code 28 (timeout) when fetching weather from wttr.in

## Root Cause
- wttr.in API was timing out (connection established, but no response after 3+ seconds)
- Morning brief cron job had no fallback mechanism
- Single point of failure caused entire briefing to fail

## Solution
Created robust weather script at `scripts/weather-sabadell.sh`:

1. **Primary:** Try wttr.in with 3-second timeout (fast, formatted)
2. **Fallback:** Use Open-Meteo API (https://api.open-meteo.com) with 5-second timeout
3. **Graceful failure:** Return "Weather unavailable" if both APIs fail

### Technical Details
- Open-Meteo coordinates for Sabadell: 41.5433, 2.1089
- JSON parsing using pure shell (grep + sed, no jq dependency)
- Weather code mapping for emoji indicators (☀️ 🌤️ ☁️ 🌧️ ⛈️ etc.)
- Script exits 0 in all cases (never blocks cron job)

## Updated Cron Job
- **Job:** `morning-briefing` (63ba7326-9021-42be-925c-848ddcef4b4f)
- **Old:** `curl -s --max-time 5 "wttr.in/Sabadell?format=3"` (single API, no fallback)
- **New:** `/Users/vex/.openclaw/workspace/scripts/weather-sabadell.sh` (robust, dual-API)

## Testing
- ✅ Script tested manually - works with Open-Meteo fallback
- ✅ Cron job force-run - successfully posted to Discord
- ✅ Returns: "Sabadell: ☁️ 9.7°C (wind: 9.0km/h)"

## Future-Proofing
- Script handles both API failures gracefully
- No external dependencies (pure bash + curl)
- Weather unavailability doesn't block rest of morning brief
- Can add more weather APIs if needed (just extend fallback chain)

---

**Status:** ✅ Fixed and tested  
**Next occurrence:** Tomorrow 08:00 CET
