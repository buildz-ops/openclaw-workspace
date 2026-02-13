#!/bin/bash
# Wrapper for exec commands that caches long output to files
# Usage: exec-cached.sh <command>

CACHE_DIR="$HOME/.openclaw/workspace/context-cache/exec"
TIMESTAMP=$(date +%s)
OUTPUT_FILE="$CACHE_DIR/exec-${TIMESTAMP}.txt"

# Run the command and capture output
"$@" > "$OUTPUT_FILE" 2>&1
EXIT_CODE=$?

# Check output size
OUTPUT_SIZE=$(wc -c < "$OUTPUT_FILE")
LINE_COUNT=$(wc -l < "$OUTPUT_FILE")

# If output is large (>5KB or >100 lines), show summary + file path
if [ "$OUTPUT_SIZE" -gt 5120 ] || [ "$LINE_COUNT" -gt 100 ]; then
    echo "=== OUTPUT CACHED (${OUTPUT_SIZE} bytes, ${LINE_COUNT} lines) ==="
    echo "Full output: $OUTPUT_FILE"
    echo ""
    echo "=== FIRST 20 LINES ==="
    head -n 20 "$OUTPUT_FILE"
    echo ""
    echo "=== LAST 20 LINES ==="
    tail -n 20 "$OUTPUT_FILE"
    echo ""
    echo "Use: tail -n 50 $OUTPUT_FILE"
    echo "Or:  grep 'pattern' $OUTPUT_FILE"
else
    # Small output, just show it
    cat "$OUTPUT_FILE"
fi

exit $EXIT_CODE
