import json
import traceback
import sys

LOG_FILE = "clawtex/bookmarks/scripts/debug_log.txt"

def log(msg):
    with open(LOG_FILE, "a") as f:
        f.write(msg + "\n")
    print(msg)

try:
    INPUT_FILE = "/Users/vex/.openclaw/media/inbound/e7fd7788-292a-4587-b2f5-d584aee48305.json"
    log(f"Starting script. Reading {INPUT_FILE}")
    
    with open(INPUT_FILE, 'r') as f:
        data = json.load(f)
    
    log(f"Loaded {len(data)} items.")
    
except Exception as e:
    log(f"Error: {str(e)}")
    log(traceback.format_exc())
    sys.exit(1)
