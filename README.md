Ephy — Phase 1 (Core Productivity & Habit Tracking)
==================================================

Overview
--------
Ephy is a life-long personal AI assistant and achievement system. This Phase 1 build focuses on a foundational habit/task tracker with a simple AI personality and a cosmic monochrome dashboard.

Features in this build
----------------------
- Habit and task creation, editing (toggle), and deletion
- Daily habit streak tracking with overview
- Basic reminders for tasks (in-page alerts or Notifications API)
- Local persistence via `localStorage`
- AI Personality (Calm, Encouraging, Energetic) with randomized encouragement
- Simple avatar orb reacting to personality and actions

How to run
----------
Open `index.html` in a modern browser. Data persists locally in the browser.

Files
-----
- `index.html` — dashboard UI
- `styles.css` — cosmic monochrome theme
- `script.js` — data layer, streaks, reminders, and AI personality

Optional: Run AIRI (VTuber) locally and embed
--------------------------------------------
1) Clone AIRI and install deps:
```bash
git clone https://github.com/moeru-ai/airi.git
cd airi
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
```
2) Start AIRI (refer to their docs if multiple apps exist). Typical dev:
```bash
pnpm -C apps/web dev
```
3) In Ephy, open `index.html` in a browser. In the "AIRI VTuber" box, set the URL to your AIRI dev server (e.g., `http://localhost:5173`) or hosted `https://airi.moeru.ai`, then click "Load AIRI". The iframe is permissioned for camera and microphone.
4) Permissions: your browser will ask for camera/mic when AIRI loads.

Next steps (Phase 2/3 ideas)
----------------------------
- Achievement tiers (Beginner → Legendary) with XP and levels
- Predictive analytics for slump detection and interventions
- Anki, calendar, fitness integrations; advanced avatar and voice
