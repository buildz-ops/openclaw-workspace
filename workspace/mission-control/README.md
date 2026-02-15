# MISSION CONTROL

A high-tech command center dashboard built with Next.js 14, featuring a cyberpunk-inspired aesthetic with deep navy backgrounds, cyan accents, and monospace typography.

## Design System

### Color Palette
- **Background**: `#0a0e17` (deep navy)
- **Card Background**: `rgba(15, 23, 42, 0.5)` (glass morphism)
- **Borders**: `#00d9ff` (cyan) at 30% opacity
- **Accent Green (OK)**: `#00ff88`
- **Accent Magenta (Alert)**: `#ff3366`
- **Accent Cyan (Data)**: `#00d9ff`
- **Accent Yellow (Attention)**: `#ffcc00`
- **Text Primary**: `#f1f5f9` (light slate)
- **Text Secondary**: `#94a3b8` (muted slate)

### Typography
- Font: Inter (primary), System Monospace (data/metrics)
- All section titles: UPPERCASE with wide letter-spacing (0.15em)
- Hierarchy: H1: 28px, H2: 20px, H3: 16px, Body: 14px

### Components
- **Glass Panels**: Semi-transparent backgrounds with thin cyan borders
- **Status Indicators**: Colored dots with glow effects (green/red/yellow)
- **Sharp Corners**: Minimal rounding (rounded-sm or none)
- **No Shadows**: Clean, flat aesthetic with border emphasis

## Features

### Pages
1. **HOME** (`/`) - Command center dashboard with:
   - Hero section
   - 3-column reconciliation panel (Intakes, Tasks, Scheduled)
   - 5 KPI tiles (Items to Review, Pipeline Value, Agents Health, Revenue, Targets)
   - 2-column data section (Cron Health, Revenue Tracker)

2. **OPS** (`/ops`) - Operations monitoring:
   - Service status KPIs
   - Scheduled jobs table
   - Infrastructure metrics

3. **AGENTS** (`/agents`) - Agent management:
   - Agent health overview
   - Active/idle status tracking
   - Uptime monitoring

4. **CHAT** (`/chat`) - Communication interface:
   - Persistent message storage (localStorage)
   - Auto-response simulation
   - Message history preservation across navigation

5. **CONTENT** (`/content`) - Content pipeline:
   - Review queue
   - Publishing workflow status
   - Content item tracking

6. **COMMS** (`/comms`) - Communications hub (placeholder)
7. **KNOWLEDGE** (`/knowledge`) - Knowledge base (placeholder)
8. **CODE** (`/code`) - Repository management (placeholder)

### API Routes
- `/api/system-state` - System reconciliation data
- `/api/agents` - Agent status and health
- `/api/cron-health` - Scheduled job monitoring
- `/api/revenue` - Revenue tracking
- `/api/content-pipeline` - Content workflow data

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build
```bash
npm run build
npm start
```

## Project Structure
```
mission-control/
├── app/
│   ├── api/              # API route handlers
│   ├── agents/           # Agents page
│   ├── chat/             # Chat page
│   ├── code/             # Code page
│   ├── comms/            # Communications page
│   ├── content/          # Content page
│   ├── knowledge/        # Knowledge page
│   ├── ops/              # Operations page
│   ├── globals.css       # Global styles & design system
│   ├── layout.tsx        # Root layout with Nav
│   └── page.tsx          # Home page
├── components/
│   ├── nav.tsx           # Top navigation
│   ├── kpi-tile.tsx      # KPI metric component
│   ├── reconciliation-card.tsx  # Reconciliation panel component
│   └── data-table.tsx    # Table component
└── tailwind.config.ts    # Tailwind configuration
```

## Chat Persistence

The chat page implements localStorage-based persistence:
- Messages saved automatically on send
- History restored on page load
- Survives navigation and page refreshes
- Auto-scroll to latest message

## Testing Checklist

✅ **Visual Design**
- Deep navy background (#0a0e17)
- Cyan borders on all cards
- Monospace uppercase typography
- Glass morphism effects
- Status indicators with colored dots

✅ **Navigation**
- Full-width sticky top nav
- Brand logo and title
- All nav items present
- ONLINE status with timestamp (far right)
- Active page highlighting

✅ **Home Page Layout**
- Hero section with title/subtitle
- 3-column reconciliation panel
- 5 KPI tiles in single row
- 2-column bottom section (60/40 split)

✅ **Functionality**
- All API routes working
- Data fetching and display
- Chat message persistence
- Chat auto-response
- Page navigation smooth

✅ **Components**
- KPI tiles with colored metrics
- Reconciliation cards with status dots
- Data tables with proper styling
- Icons from Lucide React

## Development Notes

- Built with Next.js 14 App Router
- TypeScript for type safety
- Tailwind CSS with custom design tokens
- Lucide React for icons
- Client-side rendering for interactive components
- localStorage for chat persistence

## Future Enhancements
- Real-time data updates via WebSockets
- Advanced filtering and search
- User authentication
- Notification system
- Dark/light mode toggle (currently dark only)
- Mobile responsive improvements
