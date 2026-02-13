#!/bin/bash
# Smart Search Router - Picks the best search API based on query type
# Based on: "Your Agent Is Only as Good as Its Search" by @Legendaryy
#
# Usage: search-router.sh [query] [--type TYPE] [--max-results N]
#
# Query types (auto-detected if not specified):
#   factual    - General facts, news, current events → Brave
#   semantic   - "Find papers like this", research discovery → Exa
#   extraction - Pull content from specific URL → Exa crawling
#   code       - Find code examples, documentation → Exa code context
#   company    - Research a specific company → Exa company research
#   people     - Find professionals, experts → Exa people search

set -e

QUERY=""
TYPE="auto"
MAX_RESULTS=5

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --type)
            TYPE="$2"
            shift 2
            ;;
        --max-results)
            MAX_RESULTS="$2"
            shift 2
            ;;
        *)
            QUERY="$QUERY $1"
            shift
            ;;
    esac
done

QUERY=$(echo "$QUERY" | xargs)  # Trim whitespace

if [ -z "$QUERY" ]; then
    echo "Usage: search-router.sh [query] [--type TYPE] [--max-results N]"
    echo ""
    echo "Query types:"
    echo "  factual    - General facts, news, current events (Brave)"
    echo "  semantic   - Research discovery, 'find papers like...' (Exa)"
    echo "  extraction - Pull content from specific URL (Exa)"
    echo "  code       - Find code examples, docs (Exa)"
    echo "  company    - Research a company (Exa)"
    echo "  people     - Find professionals (Exa)"
    echo "  auto       - Auto-detect best API (default)"
    exit 1
fi

# Auto-detect query type if not specified
if [ "$TYPE" = "auto" ]; then
    # Check for URL patterns → extraction
    if echo "$QUERY" | grep -qE '^https?://'; then
        TYPE="extraction"
    # Check for code-related keywords → code
    elif echo "$QUERY" | grep -qiE '(code|api|library|sdk|documentation|docs|example|tutorial|github|how to)'; then
        TYPE="code"
    # Check for company research keywords → company
    elif echo "$QUERY" | grep -qiE '^(research|about|what is) .+ (company|business|startup)'; then
        TYPE="company"
    # Check for people search keywords → people
    elif echo "$QUERY" | grep -qiE '(find|who is|experts in|professionals|people who)'; then
        TYPE="people"
    # Check for semantic search patterns → semantic
    elif echo "$QUERY" | grep -qiE '(papers|articles|similar to|like this|related to|explain)'; then
        TYPE="semantic"
    # Default to factual search
    else
        TYPE="factual"
    fi
fi

echo "🔍 Search Router: type=$TYPE query=\"$QUERY\" max_results=$MAX_RESULTS" >&2
echo "" >&2

# Route to appropriate API
case "$TYPE" in
    factual)
        echo "📊 Using: Brave Search (general factual lookup)" >&2
        mcporter call brave-search.brave_web_search query="$QUERY" count=$MAX_RESULTS
        ;;
        
    semantic)
        echo "🧠 Using: Exa (semantic/neural search)" >&2
        mcporter call exa.web_search_advanced_exa query="$QUERY" numResults=$MAX_RESULTS type="neural"
        ;;
        
    extraction)
        echo "📄 Using: Exa Crawling (content extraction)" >&2
        mcporter call exa.crawling_exa url="$QUERY"
        ;;
        
    code)
        echo "💻 Using: Exa Code Context (code/docs search)" >&2
        mcporter call exa.get_code_context_exa query="$QUERY"
        ;;
        
    company)
        # Extract company name from query
        COMPANY=$(echo "$QUERY" | sed -E 's/(research|about|what is|company|business|startup)//gi' | xargs)
        echo "🏢 Using: Exa Company Research (company=$COMPANY)" >&2
        mcporter call exa.company_research_exa companyName="$COMPANY"
        ;;
        
    people)
        echo "👤 Using: Exa People Search" >&2
        mcporter call exa.people_search_exa query="$QUERY" numResults=$MAX_RESULTS
        ;;
        
    *)
        echo "❌ Unknown query type: $TYPE" >&2
        exit 1
        ;;
esac
