# App Factory Leaderboard Dashboard

A read-only web dashboard that visualizes App Factory's global leaderboard with a clean, modern interface.

## 🚀 Quick Start

```bash
# Install dependencies
cd dashboard
npm install

# Sync latest leaderboard data
npm run sync

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

## 📊 Features

- **Real-time filtering**: Search by idea name, target user, or evidence
- **Multi-dimensional sorting**: Sort by score, rank, date, or idea name
- **Run filtering**: Filter by specific App Factory runs
- **Market filtering**: Filter by market category
- **Statistics overview**: Total entries, runs, unique ideas, and average scores
- **Responsive design**: Works on desktop and mobile devices
- **Dark theme**: Modern, easy-on-the-eyes interface

## 🔄 Data Synchronization

The dashboard reads leaderboard data from the main App Factory repository. To get the latest data:

```bash
npm run sync
```

This copies `../leaderboards/app_factory_all_time.json` to `dashboard/public/leaderboard.json` for local access.

**Important**: Run this command whenever the main leaderboard is updated to see the latest results.

## 🔒 Isolation Guarantees

This dashboard is completely isolated from the main App Factory pipeline:

- **Read-only access**: Only reads leaderboard data, never modifies it
- **No coupling**: Does not import or depend on App Factory modules
- **Separate dependencies**: Has its own package.json and node_modules
- **Isolated directory**: Lives entirely within `dashboard/` folder
- **No pipeline integration**: Cannot trigger or interfere with App Factory commands

## 🏗️ Architecture

### Tech Stack
- **Vite**: Fast development server and build tool
- **React**: User interface framework
- **TypeScript**: Type safety and better developer experience
- **Lucide React**: Modern icon library
- **CSS3**: Custom styling with flexbox and grid

### Data Flow
1. App Factory generates `leaderboards/app_factory_all_time.json`
2. `npm run sync` copies the file to `dashboard/public/leaderboard.json`
3. Dashboard fetches `/leaderboard.json` via HTTP
4. React components render the data with filtering and sorting

### Components Structure
```
src/
├── App.tsx              # Main application component
├── lib/
│   └── leaderboard.ts   # Data loading and processing logic
├── components/
│   ├── StatsCards.tsx   # Statistics summary cards
│   ├── FilterControls.tsx # Search and filter controls
│   └── LeaderboardTable.tsx # Main data table
└── styles.css           # Global styles and theme
```

## 🎨 UI/UX Design

The dashboard follows modern leaderboard design patterns:

- **Clean hierarchy**: Clear visual distinction between elements
- **Scannable layout**: Easy to quickly find and compare entries
- **Color coding**: Score badges and rank indicators for quick assessment
- **Responsive tables**: Horizontal scrolling on mobile devices
- **Contextual information**: Evidence quotes and core loops for insight

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run sync` - Sync leaderboard data from main repository

## 🔧 Configuration

The dashboard is pre-configured for optimal performance:

- **Hot reload**: Instant updates during development
- **TypeScript**: Strict type checking enabled
- **Source maps**: For debugging in production
- **Modern target**: Optimized for current browsers

## 🐛 Troubleshooting

### "Failed to load leaderboard" Error
1. Make sure you've run `npm run sync` to copy the data
2. Verify that `../leaderboards/app_factory_all_time.json` exists
3. Check that you're running the command from the `dashboard/` directory

### No Data Showing
1. Ensure the main App Factory has been run at least once
2. Check browser dev tools network tab for fetch errors
3. Verify the JSON format matches the expected schema

### Development Server Issues
1. Make sure you're using Node.js 20+ or 22+
2. Delete `node_modules` and run `npm install` again
3. Check that port 5173 isn't being used by another process

## 🎯 Inspiration & References

This dashboard design was inspired by:

- **GitHub Topics**: Modern leaderboard patterns and ranking systems
- **Dribbble/Behance**: Clean dashboard layouts and dark theme aesthetics  
- **Open Source Projects**: CTF scoreboards, gaming leaderboards, and ML evaluation dashboards
- **Modern Web Design**: Material Design principles and contemporary UI patterns

The implementation prioritizes clarity, performance, and user experience while maintaining complete isolation from the main App Factory system.