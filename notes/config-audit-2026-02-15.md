# Configuration Mismatch Audit (2026-02-15)

## Findings

### 1. Primary Model Mismatch
- **USER.md Requirement:** "Model: Sonnet 4.5 primary; fallbacks GPT-5.2 → Gemini 3 Pro."
- **Current Config (`openclaw.json`):**
  ```json
  "primary": "anthropic/claude-haiku-4-5",
  "fallbacks": [
    "google/gemini-3-pro-preview",
    "github-copilot/gpt-5.2-codex",
    ...
  ]
  ```
- **Impact:** The agent is defaulting to Haiku (faster/cheaper) instead of Sonnet (smarter), contradicting user preference.

### 2. Heartbeat Model Anomaly
- **Config:** `"heartbeat": { "model": "ollama/llama3.2:3b" }`
- **Runtime:** `model=google/gemini-3-pro-preview` (observed in session metadata during heartbeat).
- **Impact:** Heartbeats are running on Gemini Cloud instead of local Llama. This increases cost and may cause "personality drift" (Gemini is chattier).
- **Possible Cause:** Local Llama might be offline/unreachable, causing fallback to the first available cloud model (Gemini).

## Recommendations
1. **Update Config:** Change `agents.defaults.model.primary` to `"anthropic/claude-sonnet-4-5"`.
2. **Debug Local LLM:** Verify `ollama` is running and `llama3.2:3b` is pulled.
3. **Verify Fallbacks:** Ensure Gemini is not the first fallback if "talking to himself" is an issue (User prefers Sonnet -> GPT-5.2).

## Action Plan
- [ ] Update `openclaw.json` to match `USER.md`.
- [ ] Run `ollama list` to check local models.
