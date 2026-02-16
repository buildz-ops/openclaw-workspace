#!/bin/bash
# Robust weather fetch for Sabadell with fallback
# Exits 0 with weather string or "Weather unavailable"

# Try wttr.in first (fast, formatted)
WEATHER=$(curl -s --max-time 3 "wttr.in/Sabadell?format=3" 2>/dev/null)

if [ $? -eq 0 ] && [ -n "$WEATHER" ] && [[ ! "$WEATHER" =~ "Unknown location" ]]; then
    echo "$WEATHER"
    exit 0
fi

# Fallback to Open-Meteo (Sabadell coords: 41.5433, 2.1089)
JSON=$(curl -s --max-time 5 "https://api.open-meteo.com/v1/forecast?latitude=41.5433&longitude=2.1089&current_weather=true&timezone=Europe%2FMadrid" 2>/dev/null)

if [ $? -eq 0 ] && [ -n "$JSON" ]; then
    # Parse JSON manually (no jq dependency) - extract from current_weather section
    TEMP=$(echo "$JSON" | sed -n 's/.*"current_weather":{[^}]*"temperature":\([0-9.-]*\).*/\1/p')
    WIND=$(echo "$JSON" | sed -n 's/.*"current_weather":{[^}]*"windspeed":\([0-9.]*\).*/\1/p')
    CODE=$(echo "$JSON" | sed -n 's/.*"current_weather":{[^}]*"weathercode":\([0-9]*\).*/\1/p')
    
    # Map weathercode to emoji (simplified)
    case "$CODE" in
        0) ICON="☀️" ;; # Clear
        1|2) ICON="🌤️" ;; # Partly cloudy
        3) ICON="☁️" ;; # Overcast
        45|48) ICON="🌫️" ;; # Fog
        51|53|55|61|63|65|80|81|82) ICON="🌧️" ;; # Rain
        71|73|75|77|85|86) ICON="🌨️" ;; # Snow
        95|96|99) ICON="⛈️" ;; # Thunderstorm
        *) ICON="🌡️" ;;
    esac
    
    if [ -n "$TEMP" ]; then
        echo "Sabadell: $ICON ${TEMP}°C (wind: ${WIND}km/h)"
        exit 0
    fi
fi

# Both failed - return fallback message
echo "Weather unavailable"
exit 0
