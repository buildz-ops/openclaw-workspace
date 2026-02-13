# get_code_context_exa

**Server:** exa

## Description
Find code examples, documentation, and programming solutions. Searches GitHub, Stack Overflow, and official docs.

Best for: Any programming question - API usage, library examples, code snippets, debugging help.
Returns: Relevant code and documentation, formatted for easy reading.

## Parameters
```json
{
  "query": {
    "type": "string",
    "description": "Search query to find relevant context for APIs, Libraries, and SDKs. For example, 'React useState hook examples', 'Python pandas dataframe filtering', 'Express.js middleware', 'Next js partial prerendering configuration'"
  },
  "tokensNum": {
    "type": "number",
    "minimum": 1000,
    "maximum": 50000,
    "default": 5000,
    "description": "Number of tokens to return (must be a number, 1000-50000). Default is 5000 tokens. Adjust this value based on how much context you need - use lower values for focused queries and higher values for comprehensive documentation."
  }
}
```

**Required:** query

## Usage
```bash
mcporter call exa.get_code_context_exa [args...]
```
