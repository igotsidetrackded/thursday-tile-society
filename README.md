# 🀄 Thursday Tile Society

The official website for the **Thursday Tile Society**—a casual, recreational American Mahjong league. This repository contains the code and content powering our community site, hosted via GitHub Pages.

📍 **Live Site:** [https://thursdaytilesociety.com](https://thursdaytilesociety.com)

---

## 📌 Features

- **Announcements & Updates:** Post-game recaps, rule clarifications, and season news.
- **Game Schedule:** Dynamic-style timetable tracking dates, start times, locations, and hosting availability.
- **Game Talk:** Link to email Google Group with chatter about recent games.
- **League Guidelines:** Quick reference for table setups, NMJL rule standards, and pusher/rack etiquette.

---

## 🛠️ Tech Stack

- **HTML5 & CSS3:** Lightweight, zero-dependency static build.
- **Hosting:** GitHub Pages with a custom domain.

---

## 📂 Repository Structure

    ├── .github/workflows/sync.yml  # GitHub Actions workflow for scheduled automated Google Sheets data fetches
    ├── favicon.png                 # Site favicon displayed in browser tabs and navigation bar
    ├── index.html                  # Main layout and content (Updates, Schedule, Game Talk, Rules)
    ├── og-image.jpg                # Open Graph preview card image for social media and messaging links
    ├── style.css                   # Global styling, responsive layout, and custom typography
    ├── schedule.json               # Auto-generated JSON file containing current game schedule and player statuses
    ├── script.js                   # Frontend JavaScript to render schedule accordions and handle email un-reversal
    ├── scripts/sync-schedule.js    # Node.js build script to parse Google Sheets data and generate schedule.json
    └── CNAME                       # GitHub Pages custom domain configuration

---

## 📋 TODOs


