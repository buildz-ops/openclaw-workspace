# company_research_exa

**Server:** exa

## Description
Research any company to get business information, news, and insights.

Best for: Learning about a company's products, services, recent news, or industry position.
Returns: Company information from trusted business sources.

## Parameters
```json
{
  "companyName": {
    "type": "string",
    "description": "Name of the company to research"
  },
  "numResults": {
    "type": "number",
    "description": "Number of search results to return (must be a number, default: 3)"
  }
}
```

**Required:** companyName

## Usage
```bash
mcporter call exa.company_research_exa [args...]
```
