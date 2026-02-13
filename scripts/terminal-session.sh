#!/bin/bash
# Create a persistent terminal session with logging
# Usage: terminal-session.sh <session-name> <command...>

if [ $# -lt 2 ]; then
    echo "Usage: terminal-session.sh <session-name> <command...>"
    echo ""
    echo "Examples:"
    echo "  terminal-session.sh dev-server npm run dev"
    echo "  terminal-session.sh build-process make all"
    exit 1
fi

SESSION_NAME="$1"
shift
COMMAND="$@"

TERMINAL_DIR="$HOME/.openclaw/workspace/terminal"
LOG_FILE="$TERMINAL_DIR/${SESSION_NAME}.log"
PID_FILE="$TERMINAL_DIR/${SESSION_NAME}.pid"

mkdir -p "$TERMINAL_DIR"

echo "=== Terminal Session: $SESSION_NAME ===" | tee -a "$LOG_FILE"
echo "Command: $COMMAND" | tee -a "$LOG_FILE"
echo "Started: $(date)" | tee -a "$LOG_FILE"
echo "Log: $LOG_FILE" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Run command with output to both stdout and log file
$COMMAND 2>&1 | tee -a "$LOG_FILE" &
COMMAND_PID=$!

echo $COMMAND_PID > "$PID_FILE"

echo ""
echo "✅ Session started (PID: $COMMAND_PID)"
echo ""
echo "Monitor:"
echo "  tail -f $LOG_FILE"
echo "  grep 'ERROR' $LOG_FILE"
echo ""
echo "Stop:"
echo "  kill $COMMAND_PID"
echo "  # or: kill \$(cat $PID_FILE)"

# Wait for process to complete
wait $COMMAND_PID
EXIT_CODE=$?

echo "" | tee -a "$LOG_FILE"
echo "Ended: $(date)" | tee -a "$LOG_FILE"
echo "Exit code: $EXIT_CODE" | tee -a "$LOG_FILE"

rm -f "$PID_FILE"
exit $EXIT_CODE
