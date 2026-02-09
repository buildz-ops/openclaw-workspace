#!/usr/bin/env python3
"""
Complete X Bookmarks Categorization Pipeline
Processes, categorizes with Claude, and generates outputs
"""

import json
from pathlib import Path
from datetime import datetime
from collections import defaultdict
import math

# Load bookmarks
input_file = Path("/Users/vex/.openclaw/media/inbound/e7fd7788-292a-4587-b2f5-d584aee48305.json")

print("Loading bookmarks...")
with open(input_file) as f:
    bookmarks = json.load(f)

print(f"Loaded {len(bookmarks)} bookmarks")

# Deduplicate by ID
seen = set()
unique = []
for b in bookmarks:
    if b['id'] not in seen:
        seen.add(b['id'])
        unique.append(b)

print(f"Unique: {len(unique)}")

# Calculate priority scores
def calc_priority(b):
    created = datetime.strptime(b['created_at'], "%Y-%m-%d %H:%M:%S %z")
    days_old = (datetime.now(created.tzinfo) - created).days
    urgency = max(0, 10 - (days_old / 7))
    
    fav = b.get('favorite_count', 0)
    rt = b.get('retweet_count', 0)
    bm = b.get('bookmark_count', 0)
    
    engagement = (math.log10(fav+1)*2 + math.log10(rt+1)*2 + math.log10(bm+1)*3)
    importance = min(10, engagement)
    
    return {
        'urgency': round(urgency, 1),
        'importance': round(importance, 1),
        'total': round(urgency + importance, 1)
    }

for b in unique:
    b['priority'] = calc_priority(b)

# Save processed
output_dir = Path("clawtex/bookmarks/processed")
output_dir.mkdir(parents=True, exist_ok=True)

with open(output_dir / "bookmarks_processed.json", 'w') as f:
    json.dump(unique, f, indent=2, ensure_ascii=False)

# Prepare for categorization
batches = []
BATCH_SIZE = 25
for i in range(0, len(unique), BATCH_SIZE):
    batch = unique[i:i+BATCH_SIZE]
    # Format for Claude
    formatted = []
    for b in batch:
        formatted.append({
            'id': b['id'],
            'author': f"{b['name']} (@{b['screen_name']})",
            'text': b['full_text'][:500],  # First 500 chars
            'url': b['url']
        })
    batches.append(formatted)

print(f"\nCreated {len(batches)} batches for categorization")
print(f"\nNext step: Run categorization with Claude")
print(f"Each batch will be categorized into:")
print("- AI/ML, Development, Infrastructure, Security")
print("- Business, Startups, Design, Learning") 
print("- News, Productivity, Personal, Misc")

# Save batches
with open(output_dir / "batches_for_claude.json", 'w') as f:
    json.dump(batches, f, indent=2, ensure_ascii=False)

print(f"\n✅ Preprocessing complete!")
print(f"✅ Ready for categorization: {len(unique)} unique bookmarks")
