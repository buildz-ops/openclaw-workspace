#!/bin/bash
# Wrapper for mcporter calls that caches JSON responses to files
# Usage: mcp-cached.sh call <server.tool> [args...]

CACHE_DIR="$HOME/.openclaw/workspace/context-cache/mcp"
TIMESTAMP=$(date +%s)
HASH=$(echo "$*" | md5sum | cut -d' ' -f1)
OUTPUT_FILE="$CACHE_DIR/mcp-${TIMESTAMP}-${HASH}.json"

# Run mcporter with JSON output
mcporter "$@" --output json > "$OUTPUT_FILE" 2>&1
EXIT_CODE=$?

# Check output size
OUTPUT_SIZE=$(wc -c < "$OUTPUT_FILE")

# If output is large (>3KB), show summary
if [ "$OUTPUT_SIZE" -gt 3072 ]; then
    echo "=== MCP RESPONSE CACHED (${OUTPUT_SIZE} bytes) ==="
    echo "Full response: $OUTPUT_FILE"
    echo ""
    echo "=== PREVIEW (first 50 lines) ==="
    head -n 50 "$OUTPUT_FILE"
    echo ""
    echo "=== Use jq for parsing ==="
    echo "  jq '.results' $OUTPUT_FILE"
    echo "  jq '.results[0].text' $OUTPUT_FILE"
else
    # Small output, just show it
    cat "$OUTPUT_FILE"
fi

exit $EXIT_CODE
