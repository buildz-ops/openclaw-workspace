# Testing Guide

## Quick Verification

### 1. Visual Design Check
Visit `http://localhost:3000` and verify:
- [ ] Background is deep navy (#0a0e17)
- [ ] All cards have thin cyan borders
- [ ] Text is uppercase with wide letter-spacing
- [ ] No heavy shadows or blur effects
- [ ] Sharp corners (minimal rounding)

### 2. Navigation Test
- [ ] Nav bar is full-width and sticky
- [ ] Brand "MISSION-CONTROL" appears with cyan color
- [ ] All nav items: HOME, OPS, AGENTS, CHAT, CONTENT, COMMS, KNOWLEDGE, CODE
- [ ] ONLINE status indicator on far right with green dot
- [ ] Current time displayed next to status
- [ ] Active page highlighted in cyan
- [ ] Hover effects on inactive nav items

### 3. Home Page Layout
- [ ] Hero: "COMMAND CENTER" title in large cyan text
- [ ] Subtitle below hero
- [ ] Three reconciliation cards (Intakes, Tasks, Scheduled)
- [ ] Five KPI tiles in a row
- [ ] Two tables below (Cron Health 60%, Revenue Tracker 40%)
- [ ] All icons displaying correctly

### 4. API Routes Test
Run these commands to verify APIs:
```bash
curl http://localhost:3000/api/system-state
curl http://localhost:3000/api/agents
curl http://localhost:3000/api/cron-health
curl http://localhost:3000/api/revenue
curl http://localhost:3000/api/content-pipeline
```

All should return valid JSON.

### 5. Chat Persistence Test
1. Navigate to `/chat`
2. Send a message: "Test message 1"
3. Wait for auto-response
4. Navigate to `/ops` (or any other page)
5. Navigate back to `/chat`
6. **Verify**: Both messages should still be visible
7. Refresh the page
8. **Verify**: Messages persist after refresh

### 6. Chat Responsiveness Test
1. Navigate to `/chat`
2. Type a message and send
3. **Verify**: Message appears in chat immediately
4. **Verify**: "PROCESSING..." indicator appears
5. **Verify**: Assistant response appears after ~1 second

### 7. Page Navigation Test
Click through all nav items:
- [ ] `/` - Home loads correctly
- [ ] `/ops` - Operations page loads
- [ ] `/agents` - Agents page loads
- [ ] `/chat` - Chat page loads
- [ ] `/content` - Content page loads
- [ ] `/comms` - Communications page loads
- [ ] `/knowledge` - Knowledge page loads
- [ ] `/code` - Code page loads

All pages should load without errors.

### 8. Component Verification

**KPI Tiles:**
- [ ] Display large colored numbers
- [ ] Show icons
- [ ] Have glass panel background
- [ ] Use correct colors (green/cyan/yellow/magenta)

**Reconciliation Cards:**
- [ ] Show title with icon
- [ ] List items with labels and values
- [ ] Display status dots (green/yellow/red)
- [ ] Proper border styling

**Data Tables:**
- [ ] Headers in uppercase
- [ ] Proper column alignment
- [ ] Row hover effects
- [ ] Cyan border styling

### 9. Typography Check
- [ ] All section titles are UPPERCASE
- [ ] Wide letter-spacing (tracking-widest)
- [ ] Monospace font for data values
- [ ] Proper size hierarchy

### 10. Color Accuracy
Use browser dev tools color picker:
- [ ] Background: #0a0e17
- [ ] Cyan accent: #00d9ff
- [ ] Green status: #00ff88
- [ ] Magenta alert: #ff3366
- [ ] Yellow warning: #ffcc00

## Automated Test Script

```bash
#!/bin/bash

echo "Testing Mission Control Dashboard..."

# Test all API endpoints
echo "\n=== API TESTS ==="
for endpoint in system-state agents cron-health revenue content-pipeline; do
  echo "Testing /api/$endpoint..."
  curl -s http://localhost:3000/api/$endpoint | jq -e . > /dev/null
  if [ $? -eq 0 ]; then
    echo "✅ $endpoint OK"
  else
    echo "❌ $endpoint FAILED"
  fi
done

# Test all pages
echo "\n=== PAGE TESTS ==="
for page in "" ops agents chat content comms knowledge code; do
  echo "Testing /$page..."
  status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/$page)
  if [ $status -eq 200 ]; then
    echo "✅ /$page OK"
  else
    echo "❌ /$page FAILED (Status: $status)"
  fi
done

echo "\n=== TESTS COMPLETE ==="
```

Save as `test.sh`, make executable with `chmod +x test.sh`, and run with `./test.sh`

## Manual Chat Test Procedure

1. **Initial State**
   - Open `/chat`
   - Verify: Empty state message "NO MESSAGES. START A CONVERSATION."

2. **Send Message**
   - Type: "Hello, this is a test"
   - Click send button
   - Verify: Message appears on right side with "USER" label
   - Verify: Timestamp shows current time

3. **Receive Response**
   - Wait ~1 second
   - Verify: Assistant message appears on left side
   - Verify: "ASSISTANT" label visible
   - Verify: Different background color from user message

4. **Persistence Test**
   - Navigate away (click "OPS")
   - Navigate back (click "CHAT")
   - Verify: Both messages still visible

5. **Refresh Test**
   - Press browser refresh (Cmd+R / Ctrl+R)
   - Verify: Messages persist after reload

6. **Multiple Messages**
   - Send 3-4 more messages
   - Verify: Auto-scroll to bottom
   - Verify: All messages visible in order
   - Verify: localStorage contains all messages (check DevTools)

## Expected Results

All tests should pass with:
- No console errors
- Correct visual styling matching reference
- All API routes returning data
- Chat persistence working across navigation
- Smooth page transitions
- Proper component rendering
