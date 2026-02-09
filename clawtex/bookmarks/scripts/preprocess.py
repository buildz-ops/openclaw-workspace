import json
import os
import re

# The path where the user uploaded the file
INPUT_FILE = "/Users/vex/.openclaw/media/inbound/e7fd7788-292a-4587-b2f5-d584aee48305.json"
# We also want to save a copy in raw
RAW_FILE = "clawtex/bookmarks/raw/bookmarks.json"
OUTPUT_PROCESSED = "clawtex/bookmarks/processed/bookmarks_clean.json"

def clean_text(text):
    if not text:
        return ""
    # Remove t.co links (they are usually just the media or the link itself which is in metadata)
    text = re.sub(r'https://t\.co/\w+', '', text)
    return text.strip()

def process_bookmarks():
    if not os.path.exists(INPUT_FILE):
        print(f"Error: {INPUT_FILE} not found.")
        # Try to find it in the current dir just in case
        if os.path.exists("bookmarks.json"):
             INPUT_FILE = "bookmarks.json"
        else:
             return

    with open(INPUT_FILE, 'r') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            print("Error: Invalid JSON.")
            return

    # Save to raw
    with open(RAW_FILE, 'w') as f:
        json.dump(data, f, indent=2)

    # Deduplicate by ID
    seen_ids = set()
    unique_bookmarks = []
    
    for item in data:
        if item['id'] in seen_ids:
            continue
        seen_ids.add(item['id'])
        
        # Extract relevant fields
        processed = {
            'id': item['id'],
            'url': item.get('url') or f"https://twitter.com/{item.get('screen_name')}/status/{item.get('id')}",
            'text': clean_text(item.get('full_text')),
            'author': item.get('name', item.get('screen_name')),
            'handle': item.get('screen_name'),
            'created_at': item.get('created_at'),
            'media': [m.get('media_url_https') or m.get('url') for m in item.get('media', [])],
            'stats': {
                'likes': item.get('favorite_count', 0),
                'retweets': item.get('retweet_count', 0),
                'bookmarks': item.get('bookmark_count', 0),
                'views': item.get('views_count', 0)
            }
        }
        unique_bookmarks.append(processed)

    print(f"Processed {len(unique_bookmarks)} bookmarks (from {len(data)} raw).")

    with open(OUTPUT_PROCESSED, 'w') as f:
        json.dump(unique_bookmarks, f, indent=2)

if __name__ == "__main__":
    process_bookmarks()
