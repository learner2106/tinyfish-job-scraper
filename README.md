# ⚡ TinyJob — TinyFish-Powered Live Career Scraper

> **Built for the TinyFish × Team Technojam Workshop ("AI That Clicks") at Galgotias University.**  
> **Category:** Technical / Agentic App • **Scoring Tier:** 200 Points (3+ Endpoints Meaningfully Used)

A streamlined, live career web scraper powered by TinyFish. Enter your specific job title (e.g. `UI/UX Designer`) and location/work type (`Remote`, `Delhi, India`, etc.) to scrape live ATS pages and company portals, returning clean, structured listings with direct apply links.

---

## 🏗️ TinyFish 3-Tier Integration (200 Pts Tier)

1. **TinyFish Search API (`api.search.tinyfish.ai`):**  
   Dynamically discovers live postings across Greenhouse, Lever, and Ashby using targeted queries matching your role and location.
2. **TinyFish Fetch API (`api.fetch.tinyfish.ai`):**  
   Renders JavaScript-heavy career pages with TinyFish's headless Chromium fleet, returning clean markdown descriptions and qualifications.
3. **TinyFish Agent API (`agent.tinyfish.ai/v1/automation/run`):**  
   Autonomous browser navigation ("AI That Clicks") for complex, interactive company career portals.

---

## 🚀 Quick Start

### 1. Install & Configure
```bash
cd tinyfish-job-scraper
npm install
```

Ensure `.env` contains your TinyFish API Key:
```env
TINYFISH_API_KEY=your_key_here
PORT=3000
```

### 2. Run the App
```bash
npm start
```
Open **`http://localhost:3000`** in your browser.

---


