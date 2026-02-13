#!/bin/bash
# Capture current chat history to a file for dynamic discovery during summarization
# Usage: capture-chat-history.sh <session-key>

SESSION_KEY="${1:-main}"
HISTORY_DIR="$HOME/.openclaw/workspace/memory/chat-history"
TIMESTAMP=$(date +%Y-%m-%d-%H%M%S)
OUTPUT_FILE="$HISTORY_DIR/${SESSION_KEY}-${TIMESTAMP}.md"

mkdir -p "$HISTORY_DIR"

# Use sessions_history to capture current conversation
# (Assuming sessions_history tool exists)
openclaw sessions history "$SESSION_KEY" --limit 1000 > "$OUTPUT_FILE" 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Chat history captured: $OUTPUT_FILE"
    echo ""
    echo "Discovery commands:"
    echo "  grep 'keyword' $OUTPUT_FILE"
    echo "  tail -n 100 $OUTPUT_FILE"
    echo "  read $OUTPUT_FILE"
else
    echo "⚠️  Failed to capture chat history for session: $SESSION_KEY"
    exit 1
fi
