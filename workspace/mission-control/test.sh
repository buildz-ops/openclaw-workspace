#!/bin/bash

echo "🚀 Testing Mission Control Dashboard..."

# Test all API endpoints
echo ""
echo "=== API TESTS ==="
for endpoint in system-state agents cron-health revenue content-pipeline; do
  echo -n "Testing /api/$endpoint... "
  response=$(curl -s http://localhost:3000/api/$endpoint)
  if echo "$response" | jq -e . > /dev/null 2>&1; then
    echo "✅ OK"
  else
    echo "❌ FAILED"
  fi
done

# Test all pages
echo ""
echo "=== PAGE TESTS ==="
for page in "" ops agents chat content comms knowledge code; do
  path="/$page"
  [ "$page" = "" ] && path="/"
  echo -n "Testing $path... "
  status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$path)
  if [ $status -eq 200 ]; then
    echo "✅ OK (200)"
  else
    echo "❌ FAILED (Status: $status)"
  fi
done

echo ""
echo "=== COMPONENT TESTS ==="

# Check for key elements in home page
echo -n "Testing HOME page components... "
home_html=$(curl -s http://localhost:3000/)
if echo "$home_html" | grep -q "COMMAND CENTER" && \
   echo "$home_html" | grep -q "MISSION-CONTROL" && \
   echo "$home_html" | grep -q "ONLINE"; then
  echo "✅ OK"
else
  echo "❌ FAILED"
fi

# Check nav elements
echo -n "Testing navigation elements... "
if echo "$home_html" | grep -q "HOME" && \
   echo "$home_html" | grep -q "OPS" && \
   echo "$home_html" | grep -q "AGENTS" && \
   echo "$home_html" | grep -q "CHAT"; then
  echo "✅ OK"
else
  echo "❌ FAILED"
fi

# Check CSS classes
echo -n "Testing CSS classes... "
if echo "$home_html" | grep -q "glass-panel" && \
   echo "$home_html" | grep -q "text-mono-upper" && \
   echo "$home_html" | grep -q "status-dot"; then
  echo "✅ OK"
else
  echo "❌ FAILED"
fi

echo ""
echo "=== TESTS COMPLETE ==="
echo ""
echo "📝 For chat persistence testing, see TESTING.md for manual steps."
