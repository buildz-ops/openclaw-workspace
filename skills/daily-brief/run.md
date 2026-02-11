# Daily Brief Execution Guide

## Optimized Workflow (Scroll-Snapshot Loop Strategy)

### Step 1: Capture Feed (Deep Scroll)
1. Navigate to `https://x.com/home` (profile=openclaw)
2. Wait 2 seconds for initial timeline load
3. **LOOP 15 times:**
   - Scroll down: PageDown 2x
   - Wait 1 second (let new posts load)
   - Take snapshot with `refs="aria"` (stable references)
   - Extract new posts from snapshot
   - Track post IDs to avoid duplicates
4. Close browser

### Step 2: Extract Posts
From each snapshot in the loop:
- Find all article elements (posts)
- Extract for each:
  - Post ID (for deduplication)
  - Author name + handle
  - Post text
  - Link to post
  - Engagement metrics (likes, views, replies)
  - Timestamp
- Target: 150-225 total posts across all snapshots

### Step 3: Filter & Rank
Process extracted posts (in-memory, no more browser):
- Remove: Memes, ads, RTs without added value
- Prioritize: Technical depth, breaking news, insights
- Rank by: Engagement + relevance
- Select top 10-15

### Step 4: Generate Newsletter
Format as markdown:
```
# The Daily Vex — [Date]

## 🔥 Top Stories

1. **[Post summary]**
   Source: [Author] → [Link]

...

## 📈 Suggested Follows
- **@handle** - [Reason based on content quality]

---
Generated at [time]
```

### Step 5: Post to Discord
- Channel: 1471155181352911093
- No embeds, clean markdown

## Token Budget
- 15 snapshots: ~15 × 20K = 300K tokens
- Processing & ranking: ~10K tokens
- Newsletter generation: ~5K tokens
- Total: ~315K tokens (30% of 1M TPM limit - very safe)

## Error Handling
- If snapshot fails → retry once
- If extraction fails → log error, skip that post
- If Discord post fails → save to file, alert Ayoub
