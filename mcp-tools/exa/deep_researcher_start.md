# deep_researcher_start

**Server:** exa

## Description
Start an AI research agent that searches, reads, and writes a detailed report. Takes 15 seconds to 2 minutes.

Best for: Complex research questions needing deep analysis and synthesis.
Returns: Research ID - use deep_researcher_check to get results.
Important: Call deep_researcher_check with the returned research ID to get the report.

## Parameters
```json
{
  "instructions": {
    "type": "string",
    "description": "Complex research question or detailed instructions for the AI researcher. Be specific about what you want to research and any particular aspects you want covered."
  },
  "model": {
    "type": "string",
    "enum": [
      "exa-research-fast",
      "exa-research",
      "exa-research-pro"
    ],
    "description": "Research model: 'exa-research-fast' (fastest, ~15s, good for simple queries), 'exa-research' (balanced, 15-45s, good for most queries), or 'exa-research-pro' (most comprehensive, 45s-3min, for complex topics). Default: exa-research-fast"
  },
  "outputSchema": {
    "type": "object",
    "additionalProperties": {},
    "description": "Optional JSON Schema for structured output. When provided, the research report will include a 'parsed' field with data matching this schema."
  }
}
```

**Required:** instructions

## Usage
```bash
mcporter call exa.deep_researcher_start [args...]
```
