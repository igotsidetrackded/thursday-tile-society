# 🀄 Thursday Tile Society

The official website for the **Thursday Tile Society**—a casual, recreational American Mahjong league in D.C. This repository contains the code and content powering our community site, hosted via GitHub Pages.

📍 **Live Site:** [https://thursdaytilesociety.com](https://thursdaytilesociety.com)

---

## 📌 Features

- **Announcements & Updates:** Post-game recaps, rule clarifications, and season news, with previous months neatly collapsed inside expandable accordions.
- **Live Game Schedule:** Automatically synced hourly from Google Sheets into `schedule.json`, rendering the current month alongside expandable accordions for upcoming months and game confirmation/host badges.
- **Charleston Trainer:** Interactive American Mahjong Charleston practice page (`charleston.html`) featuring First & Second Charleston passes, optional Blind/Courtesy passes, Coach Hints, and live NMJL hand-category cohesion scoring.
- **Game Talk & Signup Links:** Direct links to RSVP or volunteer as a host on the signup sheet, plus an obfuscated email link to our Google Group.
- **League Guidelines:** Quick reference for *TTS* game play, host responsibilities, and guest expectations.
- **Analytics & Quiet Opt-Out:** Shared Google Analytics (`analytics.js`) tracking page views and custom interactions (trainer rounds, passes, hints, completions, signup clicks, and accordion opens) with a footer opt-out toggle saved in `localStorage`.

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML5, CSS3 (`style.css` with Fredoka & Nunito typography), and JavaScript (`script.js`, `analytics.js`).
- **Automation:** GitHub Actions + Node.js (`scripts/sync-schedule.js`) fetching schedule tabs from the Google Sheets API.
- **Hosting:** GitHub Pages with a custom domain (`CNAME`) and `.nojekyll` for fast static deployments.
- **Local Preview Server:** Lightweight Node.js / Express static server (`server.js`).

---

## 📂 Repository Structure

```text
├── .github/workflows/sync.yml  # GitHub Actions workflow for hourly Google Sheets schedule syncs
├── scripts/sync-schedule.js    # Node.js script that fetches Google Sheets data into schedule.json
├── index.html                  # Home page (Updates, Schedule, Game Talk, Guidelines)
├── charleston.html             # Interactive American Mahjong Charleston Trainer
├── style.css                   # Shared site styling, responsive layout, and trainer tile styles
├── script.js                   # Schedule renderer, email un-reversal, and home page event tracking
├── analytics.js                # Shared GA4 loader, custom event helper, and footer opt-out toggle
├── schedule.json               # Auto-generated schedule data synced from Google Sheets
├── server.js                   # Express server for local/container preview on port 3000
├── package.json                # Node dependencies and dev/start scripts
├── favicon.png                 # Site favicon used in browser tabs and navigation bar
├── og-image.jpg                # Open Graph preview image for social media and messaging links
├── .nojekyll                   # Disables Jekyll processing on GitHub Pages
├── _config.yml                 # Fallback Jekyll exclusions
└── CNAME                       # GitHub Pages custom domain configuration
```

---

## 🚀 Local Development & Deployment

### Running Locally
```bash
npm install
npm run dev
```
Then open `http://localhost:3000` in your browser.

### Branch & Release Flow
- **`main`**: Development and staging branch (including AI Studio syncs).
- **`live`**: Production branch served by GitHub Pages. Merge a Pull Request from `main` into `live` to publish updates to `thursdaytilesociety.com`.
