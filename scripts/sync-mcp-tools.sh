#!/bin/bash
# Sync MCP tool schemas to file-based discovery structure
# Usage: sync-mcp-tools.sh [server-name]
# If no server specified, syncs all servers

MCP_TOOLS_DIR="$HOME/.openclaw/workspace/mcp-tools"
TEMP_FILE="/tmp/mcp-schema-$$.json"

# Get list of MCP servers
if [ -n "$1" ]; then
    SERVERS=("$1")
else
    # Parse text output from mcporter config list
    SERVERS=($(mcporter config list 2>/dev/null | grep -E '^[a-z]' | grep -v '  ' | grep -v 'config:' || echo ""))
fi

if [ ${#SERVERS[@]} -eq 0 ]; then
    echo "No MCP servers configured."
    exit 1
fi

for SERVER in "${SERVERS[@]}"; do
    echo "Syncing tools for server: $SERVER"
    
    # Create server directory
    SERVER_DIR="$MCP_TOOLS_DIR/$SERVER"
    mkdir -p "$SERVER_DIR"
    
    # Get schema with all tools
    mcporter list "$SERVER" --schema --output json > "$TEMP_FILE" 2>/dev/null
    
    if [ $? -ne 0 ]; then
        echo "  ⚠️  Failed to get schema for $SERVER"
        continue
    fi
    
    # Parse and create individual tool files
    jq -r '.tools[] | @json' "$TEMP_FILE" | while read -r tool; do
        TOOL_NAME=$(echo "$tool" | jq -r '.name')
        TOOL_DESC=$(echo "$tool" | jq -r '.description // "No description"')
        TOOL_PARAMS=$(echo "$tool" | jq '.inputSchema.properties // {}')
        TOOL_REQUIRED=$(echo "$tool" | jq -r '.inputSchema.required // [] | join(", ")')
        
        TOOL_FILE="$SERVER_DIR/${TOOL_NAME}.md"
        
        cat > "$TOOL_FILE" << EOF
# ${TOOL_NAME}

**Server:** ${SERVER}

## Description
${TOOL_DESC}

## Parameters
\`\`\`json
${TOOL_PARAMS}
\`\`\`

**Required:** ${TOOL_REQUIRED}

## Usage
\`\`\`bash
mcporter call ${SERVER}.${TOOL_NAME} [args...]
\`\`\`
EOF
        
        echo "  ✓ Created $TOOL_FILE"
    done
    
    # Create server index
    INDEX_FILE="$SERVER_DIR/INDEX.md"
    cat > "$INDEX_FILE" << EOF
# MCP Server: $SERVER

## Available Tools
EOF
    ls "$SERVER_DIR"/*.md | grep -v INDEX.md | while read -r file; do
        TOOL_NAME=$(basename "$file" .md)
        echo "- [$TOOL_NAME]($TOOL_NAME.md)" >> "$INDEX_FILE"
    done
    
    echo "  ✓ Created index at $INDEX_FILE"
done

rm -f "$TEMP_FILE"

echo ""
echo "✅ MCP tools synced to: $MCP_TOOLS_DIR"
echo ""
echo "Discovery patterns:"
echo "  ls $MCP_TOOLS_DIR/              # List all servers"
echo "  ls $MCP_TOOLS_DIR/exa/          # List tools for a server"
echo "  grep -r 'search' $MCP_TOOLS_DIR/  # Find tools by keyword"
