from datetime import datetime
try:
    d = datetime.strptime("2025-12-23 19:28:27 +01:00", "%Y-%m-%d %H:%M:%S %z")
    print(f"Success: {d}")
except Exception as e:
    print(f"Error: {e}")
