# deep_researcher_check

**Server:** exa

## Description
Check status and get results from a deep research task.

Best for: Getting the research report after calling deep_researcher_start.
Returns: Research report when complete, or status update if still running.
Important: Keep calling with the same research ID until status is 'completed'.

## Parameters
```json
{
  "researchId": {
    "type": "string",
    "description": "The research ID returned from deep_researcher_start tool"
  }
}
```

**Required:** researchId

## Usage
```bash
mcporter call exa.deep_researcher_check [args...]
```
