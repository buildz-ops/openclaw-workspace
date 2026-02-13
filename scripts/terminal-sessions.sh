#!/bin/bash
# List and manage terminal sessions
# Usage: terminal-sessions.sh [list|clean|stop <session-name>]

ACTION="${1:-list}"
TERMINAL_DIR="$HOME/.openclaw/workspace/terminal"

case "$ACTION" in
    list)
        echo "=== Active Terminal Sessions ==="
        echo ""
        if [ -f "$TERMINAL_DIR"/*.pid 2>/dev/null ]; then
            for pidfile in "$TERMINAL_DIR"/*.pid; do
                SESSION=$(basename "$pidfile" .pid)
                PID=$(cat "$pidfile")
                
                if ps -p $PID > /dev/null 2>&1; then
                    echo "✓ $SESSION (PID: $PID) - RUNNING"
                    echo "  Log: $TERMINAL_DIR/${SESSION}.log"
                    echo "  Monitor: tail -f $TERMINAL_DIR/${SESSION}.log"
                    echo ""
                else
                    echo "✗ $SESSION (PID: $PID) - STOPPED"
                    echo "  (stale PID file - run 'clean' to remove)"
                    echo ""
                fi
            done
        else
            echo "No active terminal sessions."
        fi
        
        echo ""
        echo "=== Session Logs ==="
        echo ""
        ls -lh "$TERMINAL_DIR"/*.log 2>/dev/null | awk '{print $9, "(" $5 ")"}'
        ;;
        
    clean)
        echo "Cleaning up stale PID files..."
        for pidfile in "$TERMINAL_DIR"/*.pid 2>/dev/null; do
            if [ -f "$pidfile" ]; then
                PID=$(cat "$pidfile")
                if ! ps -p $PID > /dev/null 2>&1; then
                    SESSION=$(basename "$pidfile" .pid)
                    echo "  Removed: $SESSION (PID: $PID)"
                    rm -f "$pidfile"
                fi
            fi
        done
        echo "✅ Cleanup complete."
        ;;
        
    stop)
        if [ -z "$2" ]; then
            echo "Usage: terminal-sessions.sh stop <session-name>"
            exit 1
        fi
        
        SESSION="$2"
        PID_FILE="$TERMINAL_DIR/${SESSION}.pid"
        
        if [ ! -f "$PID_FILE" ]; then
            echo "⚠️  Session not found: $SESSION"
            exit 1
        fi
        
        PID=$(cat "$PID_FILE")
        
        if ps -p $PID > /dev/null 2>&1; then
            echo "Stopping session: $SESSION (PID: $PID)"
            kill $PID
            sleep 1
            
            if ps -p $PID > /dev/null 2>&1; then
                echo "⚠️  Process still running, sending SIGKILL..."
                kill -9 $PID
            fi
            
            rm -f "$PID_FILE"
            echo "✅ Session stopped: $SESSION"
        else
            echo "⚠️  Process not running (PID: $PID)"
            rm -f "$PID_FILE"
        fi
        ;;
        
    *)
        echo "Usage: terminal-sessions.sh [list|clean|stop <session-name>]"
        exit 1
        ;;
esac
