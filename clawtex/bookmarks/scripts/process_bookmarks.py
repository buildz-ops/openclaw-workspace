#!/usr/bin/env python3
"""
X Bookmarks Processing Pipeline
Deduplicates, categorizes, and generates outputs for Ayoub's Twitter bookmarks
"""

import json
import sys
from pathlib import Path
from datetime import datetime
from collections import defaultdict
import hashlib

# Categories based on strategy document
CATEGORIES = {
    "AI/ML": "AI tools, models, techniques, OpenClaw, agents, prompts",
    "Development": "Coding, software engineering, tools, frameworks",
    "Infrastructure": "DevOps, hosting, cloud, deployment, VPS",
    "Security": "Cybersecurity, privacy, hardening, vulnerabilities",
    "Business": "Entrepreneurship, marketing, sales, monetization",
    "Startups": "Startup advice, funding, growth, product-market fit",
    "Design": "UI/UX, visual design, branding, user experience",
    "Learning": "Education, courses, tutorials, skill development",
    "News": "Industry news, announcements, updates",
    "Productivity": "Workflows, tools, systems, time management",
    "Personal": "Personal development, mindset, health",
    "Misc": "Miscellaneous content not fitting other categories"
}

def load_bookmarks(file_path):
    """Load bookmarks from JSON file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def deduplicate_bookmarks(bookmarks):
    """Remove duplicate bookmarks based on tweet ID"""
    seen_ids = set()
    unique = []
    duplicates = []
    
    for bookmark in bookmarks:
        tweet_id = bookmark.get('id')
        if tweet_id not in seen_ids:
            seen_ids.add(tweet_id)
            unique.append(bookmark)
        else:
            duplicates.append(bookmark)
    
    return unique, duplicates

def calculate_priority_score(bookmark):
    """Calculate priority score based on engagement metrics"""
    # Urgency score (0-10) based on recency
    created = datetime.strptime(bookmark['created_at'], "%Y-%m-%d %H:%M:%S %z")
    days_old = (datetime.now(created.tzinfo) - created).days
    urgency = max(0, 10 - (days_old / 7))  # Decay over weeks
    
    # Importance score (0-10) based on engagement
    favorites = bookmark.get('favorite_count', 0)
    retweets = bookmark.get('retweet_count', 0)
    bookmarks_count = bookmark.get('bookmark_count', 0)
    
    # Normalize engagement (logarithmic scale)
    import math
    engagement_score = (
        math.log10(favorites + 1) * 2 +
        math.log10(retweets + 1) * 2 +
        math.log10(bookmarks_count + 1) * 3
    )
    importance = min(10, engagement_score)
    
    return {
        'urgency': round(urgency, 1),
        'importance': round(importance, 1),
        'total': round(urgency + importance, 1)
    }

def clean_text(text):
    """Clean tweet text for better readability"""
    if not text:
        return ""
    # Remove excessive whitespace
    text = ' '.join(text.split())
    return text

def prepare_for_categorization(bookmarks):
    """Prepare bookmarks for Claude categorization"""
    batches = []
    batch_size = 25  # Smaller batches for better accuracy
    
    for i in range(0, len(bookmarks), batch_size):
        batch = bookmarks[i:i+batch_size]
        batches.append(batch)
    
    return batches

def generate_markdown_output(categorized_bookmarks, output_path):
    """Generate markdown file with categorized bookmarks"""
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# X (Twitter) Bookmarks - Organized\n\n")
        f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
        f.write(f"**Total Bookmarks:** {sum(len(tweets) for tweets in categorized_bookmarks.values())}\n\n")
        f.write("---\n\n")
        
        # Table of contents
        f.write("## Table of Contents\n\n")
        for category in CATEGORIES:
            count = len(categorized_bookmarks.get(category, []))
            if count > 0:
                anchor = category.lower().replace('/', '').replace(' ', '-')
                f.write(f"- [{category}](#f{anchor}) ({count})\n")
        f.write("\n---\n\n")
        
        # Content by category
        for category, description in CATEGORIES.items():
            tweets = categorized_bookmarks.get(category, [])
            if not tweets:
                continue
                
            anchor = category.lower().replace('/', '').replace(' ', '-')
            f.write(f"## {category}\n\n")
            f.write(f"*{description}*\n\n")
            
            # Sort by priority score
            tweets.sort(key=lambda x: x.get('priority', {}).get('total', 0), reverse=True)
            
            for tweet in tweets:
                priority = tweet.get('priority', {})
                f.write(f"### [{tweet.get('name', 'Unknown')} (@{tweet.get('screen_name', 'unknown')})]({tweet.get('url', '#')})\n\n")
                f.write(f"**Priority:** {priority.get('total', 0)}/20 (Urgency: {priority.get('urgency', 0)}, Importance: {priority.get('importance', 0)})\n\n")
                f.write(f"**Date:** {tweet.get('created_at', 'Unknown')}\n\n")
                
                # Engagement stats
                f.write(f"**Engagement:** ")
                f.write(f"❤️ {tweet.get('favorite_count', 0):,} | ")
                f.write(f"🔄 {tweet.get('retweet_count', 0):,} | ")
                f.write(f"🔖 {tweet.get('bookmark_count', 0):,}\n\n")
                
                # Content
                text = clean_text(tweet.get('full_text', ''))
                if len(text) > 500:
                    f.write(f"{text[:500]}...\n\n")
                else:
                    f.write(f"{text}\n\n")
                
                f.write("---\n\n")

def main():
    """Main processing pipeline"""
    print("🦞 X Bookmarks Processing Pipeline")
    print("=" * 50)
    
    # Step 1: Load bookmarks
    print("\n📂 Loading bookmarks...")
    input_file = Path("clawtex/bookmarks/raw/e7fd7788-292a-4587-b2f5-d584aee48305.json")
    if not input_file.exists():
        print(f"❌ Error: File not found: {input_file}")
        return 1
    
    bookmarks = load_bookmarks(input_file)
    print(f"✅ Loaded {len(bookmarks)} bookmarks")
    
    # Step 2: Deduplicate
    print("\n🔍 Deduplicating...")
    unique_bookmarks, duplicates = deduplicate_bookmarks(bookmarks)
    print(f"✅ Found {len(unique_bookmarks)} unique bookmarks")
    if duplicates:
        print(f"⚠️  Removed {len(duplicates)} duplicates")
    
    # Step 3: Calculate priority scores
    print("\n📊 Calculating priority scores...")
    for bookmark in unique_bookmarks:
        bookmark['priority'] = calculate_priority_score(bookmark)
    print("✅ Priority scores calculated")
    
    # Step 4: Save processed data
    print("\n💾 Saving processed data...")
    processed_file = Path("clawtex/bookmarks/processed/bookmarks_processed.json")
    processed_file.parent.mkdir(parents=True, exist_ok=True)
    with open(processed_file, 'w', encoding='utf-8') as f:
        json.dump(unique_bookmarks, f, indent=2, ensure_ascii=False)
    print(f"✅ Saved to {processed_file}")
    
    # Step 5: Prepare categorization batches
    print("\n📦 Preparing batches for categorization...")
    batches = prepare_for_categorization(unique_bookmarks)
    print(f"✅ Created {len(batches)} batches")
    
    # Save batches for Claude processing
    batches_file = Path("clawtex/bookmarks/processed/categorization_batches.json")
    with open(batches_file, 'w', encoding='utf-8') as f:
        json.dump(batches, f, indent=2, ensure_ascii=False)
    print(f"✅ Saved batches to {batches_file}")
    
    print("\n✨ Preprocessing complete!")
    print(f"\n📋 Summary:")
    print(f"  Total bookmarks: {len(bookmarks)}")
    print(f"  Unique bookmarks: {len(unique_bookmarks)}")
    print(f"  Duplicates removed: {len(duplicates)}")
    print(f"  Batches for categorization: {len(batches)}")
    print(f"\n🚀 Ready for Claude categorization!")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
