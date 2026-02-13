# people_search_exa

**Server:** exa

## Description
Find people and their professional profiles.

Best for: Finding professionals, executives, or anyone with a public profile.
Returns: Profile information and links.

## Parameters
```json
{
  "query": {
    "type": "string",
    "description": "Search query for finding people"
  },
  "numResults": {
    "type": "number",
    "description": "Number of profile results to return (must be a number, default: 5)"
  }
}
```

**Required:** query

## Usage
```bash
mcporter call exa.people_search_exa [args...]
```
