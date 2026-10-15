require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const TinyFishScraper = require('./lib/tinyfish');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let latestResults = [];

app.get('/api/status', (req, res) => {
  const scraper = new TinyFishScraper();
  res.json({
    online: true,
    hasKey: scraper.hasKey(),
    endpoints: [
      { name: 'TinyFish Search', url: 'https://api.search.tinyfish.ai', role: 'Live ATS Discovery' },
      { name: 'TinyFish Fetch', url: 'https://api.fetch.tinyfish.ai', role: 'Batch Chromium Page Render' },
      { name: 'TinyFish Agent', url: 'https://agent.tinyfish.ai/v1/automation/run', role: 'Interactive Browser Scraper' }
    ]
  });
});

app.post('/api/scrape', async (req, res) => {
  try {
    const { role = 'UI/UX Designer', location = 'Remote', keywords = [] } = req.body;
    const scraper = new TinyFishScraper();
    const result = await scraper.scrapeCustomRequirement({ role, location, keywords });
    latestResults = result.jobs;
    res.json(result);
  } catch (err) {
    console.error('Scrape error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/export/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="tinyfish_jobs.json"');
  res.send(JSON.stringify(latestResults, null, 2));
});

app.get('/api/export/csv', (req, res) => {
  const fields = ['company', 'title', 'location', 'workType', 'matchScore', 'source', 'applyUrl'];
  const header = fields.join(',');
  const rows = latestResults.map(j => {
    return fields.map(f => `"${String(j[f] || '').replace(/"/g, '""')}"`).join(',');
  });
  const csv = [header, ...rows].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="tinyfish_jobs.csv"');
  res.send(csv);
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`⚡ TinyFish Live Scraper running at: http://localhost:${PORT}`);
  console.log(`🔍 Search | 🌐 Fetch | 🤖 Agent Active`);
  console.log(`======================================================\n`);
});
