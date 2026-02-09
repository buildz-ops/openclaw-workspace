import json
import math
from datetime import datetime
from pathlib import Path
import traceback
import sys

# Config
INPUT_FILE = "/Users/vex/.openclaw/media/inbound/e7fd7788-292a-4587-b2f5-d584aee48305.json"
OUTPUT_FILE = "clawtex/bookmarks/outputs/dashboard_full.html"
LOG_FILE = "clawtex/bookmarks/scripts/run_log.txt"

def log(msg):
    with open(LOG_FILE, "a") as f:
        f.write(str(msg) + "\n")
    print(msg)

# Categories mapping (keyword based for speed)
CATEGORIES = {
    "AI/ML": ["ai", "gpt", "llm", "claude", "opus", "sonnet", "gemini", "llama", "model", "agent", "bot", "prompt", "openclaw", "clawdbot", "moltbot", "neural", "training", "inference", "huggingface", "transformer", "diffusion", "genai", "rag", "vector", "embedding"],
    "Development": ["code", "github", "api", "dev", "linux", "python", "javascript", "react", "nextjs", "database", "sql", "git", "terminal", "bash", "css", "html", "web", "app", "stack", "frontend", "backend", "fullstack", "server", "vps", "docker", "kubernetes"],
    "Business": ["business", "money", "marketing", "sales", "revenue", "profit", "startup", "founder", "saas", "agency", "client", "customer", "market", "strategy", "growth", "scale", "monetization", "stripe", "arbitrage", "finance", "invest"],
    "Security": ["security", "hack", "vulnerability", "exploit", "cyber", "infosec", "privacy", "auth", "login", "password", "firewall", "tailscale", "vpn", "ssh", "guardrail", "injection"],
    "Productivity": ["productivity", "tool", "workflow", "system", "organize", "notes", "notion", "obsidian", "linear", "calendar", "task", "email", "automate", "automation", "shortcut", "mac", "keyboard"],
    "Learning": ["learn", "course", "tutorial", "guide", "education", "study", "university", "degree", "resource", "list", "collection", "roadmap", "how to", "tips", "tricks"],
    "News": ["news", "update", "release", "launch", "announce", "breaking", "report", "trend", "future", "prediction"]
}

def get_category(text):
    text = text.lower()
    scores = {cat: 0 for cat in CATEGORIES}
    
    for cat, keywords in CATEGORIES.items():
        for kw in keywords:
            if kw in text:
                scores[cat] += 1
    
    # Priority overrides for specific overlaps
    if scores["AI/ML"] > 0:
        # If it mentions openclaw/clawdbot it's definitely AI/ML
        if "openclaw" in text or "clawdbot" in text or "moltbot" in text:
            return "AI/ML"
            
    best_cat = max(scores, key=scores.get)
    if scores[best_cat] == 0:
        return "Misc"
    return best_cat

def calc_priority(b):
    created = datetime.strptime(b['created_at'], "%Y-%m-%d %H:%M:%S %z")
    days_old = (datetime.now(created.tzinfo) - created).days
    urgency = max(0, 10 - (days_old / 7))
    
    fav = b.get('favorite_count', 0)
    rt = b.get('retweet_count', 0)
    bm = b.get('bookmark_count', 0)
    
    engagement = (math.log10(fav+1)*2 + math.log10(rt+1)*2 + math.log10(bm+1)*3)
    importance = min(10, engagement)
    
    total = round(urgency + importance, 1)
    
    if total >= 15:
        level = "high"
    elif total >= 10:
        level = "medium"
    else:
        level = "low"
        
    return {
        'total': total,
        'level': level
    }

def generate_html(bookmarks):
    # Calculate stats
    total = len(bookmarks)
    cats = {}
    priorities = {"high": 0, "medium": 0, "low": 0}
    
    cards_html = ""
    
    for b in bookmarks:
        cat = b['category']
        cats[cat] = cats.get(cat, 0) + 1
        priorities[b['priority']['level']] += 1
        
        # Create card HTML
        p_class = f"score-{b['priority']['level']}"
        
        # Clean text for display (Truncate logic)
        text = b['full_text'].replace('\n', ' ')
        # We will let CSS line-clamp handle the visual truncation, but keeping raw text clean is good.
        
        # Detect media
        media_indicator = ""
        if 'media' in b and b['media']:
            m = b['media'][0]
            if m['type'] == 'photo':
                media_indicator = '<span class="media-badge">📷 Image</span>'
            elif m['type'] == 'video':
                 media_indicator = '<span class="media-badge">▶️ Video</span>'

        card = f"""
            <div class="card" data-category="{cat}" data-priority="{b['priority']['level']}">
                <div class="card-header">
                    <div class="user-profile">
                        <img src="{b['user']['profile_image_url_https']}" class="avatar" alt="">
                        <div class="user-info">
                            <div class="name">{b['user']['name']}</div>
                            <div class="handle">@{b['user']['screen_name']}</div>
                        </div>
                    </div>
                    <span class="score-pill {p_class}">{b['priority']['total']}</span>
                </div>
                
                <div class="card-body">
                    <p class="tweet-text">{text}</p>
                    <div class="media-indicators">{media_indicator}</div>
                </div>
                
                <div class="card-footer">
                    <div class="metrics">
                        <div class="metric">❤️ {b['favorite_count']:,}</div>
                        <div class="metric">🔖 {b['bookmark_count']:,}</div>
                    </div>
                    <span class="tag">{cat}</span>
                    <a href="https://twitter.com/{b['user']['screen_name']}/status/{b['id']}" class="view-btn" target="_blank">Open ↗</a>
                </div>
            </div>
        """
        cards_html += card

    # HTML Template
    html = f"""<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bookmarks OS</title>
    <style>
        :root {{
            --bg-color: #f5f5f7;
            --sidebar-bg: rgba(255, 255, 255, 0.85);
            --card-bg: #ffffff;
            --text-primary: #1d1d1f;
            --text-secondary: #86868b;
            --accent: #0071e3;
            --accent-hover: #0077ed;
            --border-color: rgba(0, 0, 0, 0.1);
            --shadow-sm: 0 1px 3px rgba(0,0,0,0.05);
            --shadow-md: 0 4px 6px rgba(0,0,0,0.05);
            --nav-hover: rgba(0,0,0,0.05);
            --nav-active: rgba(0,0,0,0.1);
            --font-stack: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }}

        [data-theme="dark"] {{
            --bg-color: #1e1e1e;
            --sidebar-bg: rgba(30, 30, 30, 0.85);
            --card-bg: #2c2c2e;
            --text-primary: #f5f5f7;
            --text-secondary: #a1a1a6;
            --accent: #2997ff;
            --accent-hover: #47aeff;
            --border-color: rgba(255, 255, 255, 0.1);
            --shadow-sm: 0 1px 3px rgba(0,0,0,0.2);
            --shadow-md: 0 4px 12px rgba(0,0,0,0.3);
            --nav-hover: rgba(255,255,255,0.1);
            --nav-active: rgba(255,255,255,0.15);
        }}

        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        
        body {{
            font-family: var(--font-stack);
            background-color: var(--bg-color);
            color: var(--text-primary);
            height: 100vh;
            display: flex;
            overflow: hidden;
            -webkit-font-smoothing: antialiased;
            transition: background-color 0.3s ease, color 0.3s ease;
        }}

        /* Sidebar */
        .sidebar {{
            width: 280px;
            background: var(--sidebar-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-right: 1px solid var(--border-color);
            padding: 30px 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            z-index: 100;
            transition: background-color 0.3s ease, border-color 0.3s ease;
        }}

        .brand {{
            font-size: 20px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: var(--text-primary);
            margin-bottom: 20px;
            padding-left: 10px;
        }}

        .brand-text {{ display: flex; align-items: center; gap: 8px; }}
        .brand span {{ opacity: 0.5; font-weight: 400; }}

        .theme-toggle {{
            background: none;
            border: none;
            cursor: pointer;
            font-size: 20px;
            padding: 5px;
            border-radius: 50%;
            transition: background 0.2s;
            color: var(--text-primary);
        }}
        
        .theme-toggle:hover {{ background: var(--nav-hover); }}

        .nav-section {{ margin-bottom: 20px; }}
        .nav-title {{
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-secondary);
            font-weight: 600;
            margin-bottom: 8px;
            padding-left: 12px;
        }}

        .nav-item {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 12px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 14px;
            font-weight: 500;
            color: var(--text-primary);
            text-decoration: none;
            margin-bottom: 2px;
        }}

        .nav-item:hover {{ background: var(--nav-hover); }}
        .nav-item.active {{ background: var(--nav-active); font-weight: 600; }}
        
        .nav-count {{
            background: var(--nav-active);
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            color: var(--text-secondary);
        }}
        
        .nav-item.active .nav-count {{ background: rgba(128,128,128,0.2); color: var(--text-primary); }}

        /* Main Content */
        .main-content {{
            flex: 1;
            overflow-y: auto;
            padding: 40px;
            scroll-behavior: smooth;
        }}

        .header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }}

        .page-title h1 {{ font-size: 28px; font-weight: 700; letter-spacing: -0.5px; color: var(--text-primary); }}
        .page-title p {{ color: var(--text-secondary); font-size: 14px; margin-top: 4px; }}

        .search-wrapper {{
            position: relative;
            width: 300px;
        }}

        .search-input {{
            width: 100%;
            padding: 10px 15px 10px 35px;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            font-size: 14px;
            color: var(--text-primary);
            transition: all 0.2s;
            box-shadow: var(--shadow-sm);
        }}

        .search-input:focus {{
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
        }}

        .search-icon {{
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0.4;
            font-size: 14px;
            color: var(--text-primary);
        }}

        /* Stats Grid */
        .stats-grid {{
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }}

        .stat-card {{
            background: var(--card-bg);
            padding: 20px;
            border-radius: 18px;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            transition: background-color 0.3s ease;
        }}

        .stat-value {{ font-size: 28px; font-weight: 700; letter-spacing: -0.5px; color: var(--text-primary); }}
        .stat-label {{ font-size: 13px; color: var(--text-secondary); font-weight: 500; margin-top: 4px; }}

        /* Masonry Grid */
        .bookmarks-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            align-items: start;
        }}

        .card {{
            background: var(--card-bg);
            border-radius: 16px;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-color);
            overflow: hidden;
            transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease;
            display: flex;
            flex-direction: column;
            height: 100%;
            position: relative;
        }}

        .card:hover {{
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }}

        .card-header {{
            padding: 16px 16px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}

        .user-profile {{ display: flex; align-items: center; gap: 10px; }}
        .avatar {{ width: 32px; height: 32px; border-radius: 50%; background: #eee; object-fit: cover; border: 1px solid var(--border-color); }}
        .user-info {{ line-height: 1.2; }}
        .name {{ font-size: 14px; font-weight: 600; color: var(--text-primary); }}
        .handle {{ font-size: 12px; color: var(--text-secondary); }}

        .score-pill {{
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.3px;
        }}
        .score-high {{ background: rgba(255, 59, 48, 0.15); color: #ff3b30; }}
        .score-medium {{ background: rgba(255, 149, 0, 0.15); color: #ff9500; }}
        .score-low {{ background: rgba(52, 199, 89, 0.15); color: #34c759; }}

        .card-body {{
            padding: 0 16px 16px;
            flex-grow: 1;
        }}

        .tweet-text {{
            font-size: 14px;
            line-height: 1.5;
            color: var(--text-primary);
            display: -webkit-box;
            -webkit-line-clamp: 4; /* Limit to 4 lines */
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-bottom: 8px;
        }}

        .media-indicators {{
            display: flex;
            gap: 8px;
            margin-top: 8px;
        }}

        .media-badge {{
            font-size: 11px;
            color: var(--text-secondary);
            background: var(--bg-color);
            padding: 2px 8px;
            border-radius: 4px;
            font-weight: 500;
        }}

        .card-footer {{
            padding: 12px 16px;
            background: var(--bg-color);
            border-top: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: var(--text-secondary);
            transition: background-color 0.3s ease;
        }}

        .metrics {{ display: flex; gap: 12px; }}
        .metric {{ display: flex; align-items: center; gap: 4px; font-size: 11px; }}
        
        .tag {{
            display: inline-block;
            padding: 2px 8px;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            border-radius: 6px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
        }}

        .view-btn {{
            color: var(--accent);
            font-weight: 600;
            text-decoration: none;
            font-size: 12px;
            transition: opacity 0.2s;
        }}
        .view-btn:hover {{ opacity: 0.7; }}

        /* Scrollbar */
        ::-webkit-scrollbar {{ width: 8px; }}
        ::-webkit-scrollbar-track {{ background: transparent; }}
        ::-webkit-scrollbar-thumb {{ background: rgba(128,128,128,0.2); border-radius: 4px; }}
        ::-webkit-scrollbar-thumb:hover {{ background: rgba(128,128,128,0.3); }}

        @media (max-width: 1000px) {{
            .stats-grid {{ grid-template-columns: repeat(2, 1fr); }}
        }}
        
        @media (max-width: 768px) {{
            body {{ flex-direction: column; height: auto; overflow: visible; }}
            .sidebar {{ width: 100%; height: auto; border-right: none; border-bottom: 1px solid var(--border-color); position: sticky; top: 0; padding: 15px; }}
            .nav-section {{ display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px; }}
            .nav-title {{ display: none; }}
            .nav-item {{ white-space: nowrap; }}
            .main-content {{ overflow: visible; }}
            .stats-grid {{ grid-template-columns: 1fr; }}
        }}
    </style>
</head>
<body>
    <aside class="sidebar">
        <div class="brand">
            <div class="brand-text">🦁 Ayoub's <span>Library</span></div>
            <button class="theme-toggle" id="themeToggle" title="Toggle Dark Mode">🌙</button>
        </div>

        <div class="nav-section">
            <div class="nav-title">Collection</div>
            <div class="nav-item active" data-filter="all">
                <span>All Bookmarks</span>
                <span class="nav-count">{total}</span>
            </div>
            <div class="nav-item" data-filter="high">
                <span>High Priority</span>
                <span class="nav-count">{priorities['high']}</span>
            </div>
        </div>

        <div class="nav-section">
            <div class="nav-title">Categories</div>
            {''.join([f'<div class="nav-item" data-filter="{c}"><span>{c}</span><span class="nav-count">{count}</span></div>' for c, count in sorted(cats.items(), key=lambda x: x[1], reverse=True)])}
        </div>
    </aside>

    <main class="main-content">
        <div class="header">
            <div class="page-title">
                <h1 id="pageTitle">All Bookmarks</h1>
                <p>Curated intelligence & resources</p>
            </div>
            <div class="search-wrapper">
                <span class="search-icon">🔍</span>
                <input type="text" class="search-input" id="search" placeholder="Search...">
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <span class="stat-label">Total Items</span>
                <span class="stat-value">{total}</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">AI & ML Focus</span>
                <span class="stat-value">{round(cats.get('AI/ML', 0)/total*100)}%</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">High Value</span>
                <span class="stat-value">{priorities['high']}</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">Top Source</span>
                <span class="stat-value">Twitter/X</span>
            </div>
        </div>

        <div class="bookmarks-grid" id="grid">
            {cards_html}
        </div>
        
        <div id="empty-state" style="display: none; text-align: center; padding: 60px; color: var(--text-secondary);">
            <p>No bookmarks found matching your criteria.</p>
        </div>
    </main>

    <script>
        // Theme Logic
        const toggleBtn = document.getElementById('themeToggle');
        const html = document.documentElement;
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', savedTheme);
        toggleBtn.innerText = savedTheme === 'light' ? '🌙' : '☀️';

        toggleBtn.addEventListener('click', () => {{
            const current = html.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            toggleBtn.innerText = next === 'light' ? '🌙' : '☀️';
        }});

        // Filter & Search Logic
        const cards = document.querySelectorAll('.card');
        const navItems = document.querySelectorAll('.nav-item');
        const searchInput = document.getElementById('search');
        const pageTitle = document.getElementById('pageTitle');
        const emptyState = document.getElementById('empty-state');
        
        let currentFilter = 'all';
        let searchQuery = '';

        function render() {{
            let visible = 0;
            
            cards.forEach(card => {{
                const category = card.dataset.category;
                const priority = card.dataset.priority;
                const text = card.innerText.toLowerCase();
                
                // Filter logic
                let matchesFilter = false;
                if (currentFilter === 'all') matchesFilter = true;
                else if (currentFilter === 'high') matchesFilter = priority === 'high';
                else matchesFilter = category === currentFilter;

                // Search logic
                const matchesSearch = text.includes(searchQuery);

                if (matchesFilter && matchesSearch) {{
                    card.style.display = 'flex';
                    visible++;
                }} else {{
                    card.style.display = 'none';
                }}
            }});

            emptyState.style.display = visible === 0 ? 'block' : 'none';
        }}

        navItems.forEach(item => {{
            item.addEventListener('click', () => {{
                // Update UI
                navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                
                // Update state
                currentFilter = item.dataset.filter;
                pageTitle.innerText = item.querySelector('span').innerText;
                render();
            }});
        }});

        searchInput.addEventListener('input', (e) => {{
            searchQuery = e.target.value.toLowerCase();
            render();
        }});
    </script>
</body>
</html>
"""
    return html

def main():
    try:
        log("Reading input...")
        with open(INPUT_FILE) as f:
            data = json.load(f)
        
        # Deduplicate
        seen = set()
        unique = []
        for b in data:
            if b['id'] not in seen:
                seen.add(b['id'])
                # Normalize user object if needed
                if 'user' not in b:
                    b['user'] = {
                        'name': b.get('name', 'Unknown'),
                        'screen_name': b.get('screen_name', 'unknown'),
                        'profile_image_url_https': b.get('profile_image_url', '')
                    }
                # Normalize media entries to avoid KeyError on media_url_https
                if 'media' in b and b['media']:
                    normalized_media = []
                    for m in b['media']:
                        if isinstance(m, dict):
                            if 'media_url_https' not in m:
                                m = {**m, 'media_url_https': m.get('media_url') or m.get('url') or ''}
                            normalized_media.append(m)
                        else:
                            normalized_media.append({'media_url_https': str(m), 'type': 'photo'})
                    b['media'] = normalized_media
                unique.append(b)
        
        # Process
        log(f"Processing {len(unique)} bookmarks...")
        for b in unique:
            try:
                b['category'] = get_category(b.get('full_text', ''))
                b['priority'] = calc_priority(b)
            except Exception as e:
                log(f"Error processing bookmark {b.get('id')}: {e}")
                b['category'] = "Misc"
                b['priority'] = {'total': 0, 'level': 'low'}
        
        # Sort by priority
        unique.sort(key=lambda x: x['priority']['total'], reverse=True)
        
        # Generate
        log("Generating HTML...")
        html = generate_html(unique)
        
        # Write
        with open(OUTPUT_FILE, 'w') as f:
            f.write(html)
            
        log(f"Done! Written to {OUTPUT_FILE}")
        
    except Exception as e:
        log(f"Fatal error: {e}")
        log(traceback.format_exc())

if __name__ == "__main__":
    main()
