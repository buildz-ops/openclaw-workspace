#!/bin/bash
# Clean up old context cache files (>7 days)
# Usage: cleanup-context-cache.sh [days]

DAYS="${1:-7}"
CACHE_DIR="$HOME/.openclaw/workspace/context-cache"

echo "Cleaning up context cache files older than $DAYS days..."
echo ""

for subdir in exec mcp web; do
    DIR="$CACHE_DIR/$subdir"
    if [ -d "$DIR" ]; then
        COUNT_BEFORE=$(find "$DIR" -type f | wc -l | tr -d ' ')
        DELETED=$(find "$DIR" -type f -mtime +$DAYS -delete -print | wc -l | tr -d ' ')
        COUNT_AFTER=$(find "$DIR" -type f | wc -l | tr -d ' ')
        
        if [ "$DELETED" -gt 0 ]; then
            echo "✓ $subdir: Deleted $DELETED files ($COUNT_BEFORE → $COUNT_AFTER remaining)"
        else
            echo "· $subdir: No files to delete ($COUNT_AFTER files)"
        fi
    fi
done

echo ""
echo "✅ Context cache cleanup complete."
