const state = {
  role: 'UI/UX Designer',
  location: 'Delhi, India',
  skills: ['Figma', 'UI/UX', 'Wireframing', 'Prototyping', 'Design Systems', 'User Research'],
  jobs: []
};

const LINKEDIN_POST = `🚀 Excited to unveil TinyJob — a TinyFish-powered live web scraper built for the TinyFish × Team Technojam workshop ("AI That Clicks") at Galgotias University!

Instead of manually checking 15+ job portals every day, TinyJob uses TinyFish's 3-tier agentic browser engine to scrape live openings matching your specific requirement (like UI/UX Designer in Delhi NCR or Remote):

1️⃣ TinyFish Search: Live ATS discovery across Greenhouse, Lever & Ashby
2️⃣ TinyFish Fetch: Fast Chromium rendering for clean markdown
3️⃣ TinyFish Agent: "AI That Clicks" to navigate complex company portals

Clean results, real links, and less time refreshing careers pages! ⚡

Check it out: https://github.com/learner2106/tinyfish-job-scraper

#AIThatClicks #TinyFish #WebScraping #JobScraper #TechnoJam #GalgotiasUniversity #BuildInPublic #AI #UIUX`;

const X_POST = `Built TinyJob for the @TinyFish × @TeamTechnoJam workshop! ⚡

A live web scraper that uses TinyFish APIs (Search, Fetch, and Agent) to pull active job openings for your exact requirement (e.g. UI/UX Designer in Delhi NCR or Remote).

Clean results. Real links. Less time refreshing! 🚀
Check it out: https://github.com/learner2106/tinyfish-job-scraper

#AIThatClicks #TinyFish #JobRadar #TechnoJam #WebScraping #UIUX`;

// Elements
const el = {
  inputRole: document.getElementById('inputRole'),
  inputLocation: document.getElementById('inputLocation'),
  skillsContainer: document.getElementById('skillsContainer'),
  btnScrape: document.getElementById('btnScrape'),
  btnIcon: document.getElementById('btnIcon'),
  btnText: document.getElementById('btnText'),
  scrapeConsole: document.getElementById('scrapeConsole'),
  consoleStatus: document.getElementById('consoleStatus'),
  consoleLogs: document.getElementById('consoleLogs'),
  jobsList: document.getElementById('jobsList'),
  jobCountBadge: document.getElementById('jobCountBadge'),
  modalArch: document.getElementById('modalArch'),
  modalSocial: document.getElementById('modalSocial'),
  textLinkedIn: document.getElementById('textLinkedIn'),
  textX: document.getElementById('textX'),
  btnCopyLinkedIn: document.getElementById('btnCopyLinkedIn'),
  btnCopyX: document.getElementById('btnCopyX')
};

document.addEventListener('DOMContentLoaded', () => {
  renderSkills();
  setupEvents();
  el.textLinkedIn.value = LINKEDIN_POST;
  el.textX.value = X_POST;
  // Trigger initial scrape
  runScraper();
});

function renderSkills() {
  el.skillsContainer.innerHTML = '';
  state.skills.forEach(s => {
    const span = document.createElement('span');
    span.className = 'px-2.5 py-1 text-xs font-semibold rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 inline-flex items-center gap-1.5';
    span.innerHTML = `<span>${s}</span><button data-remove="${s}" class="hover:text-cyan-100 text-[10px]">✕</button>`;
    el.skillsContainer.appendChild(span);
  });
}

function setupEvents() {
  // Preset Chips
  document.querySelectorAll('.role-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      el.inputRole.value = btn.textContent.trim();
    });
  });

  document.querySelectorAll('.loc-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      el.inputLocation.value = btn.textContent.trim();
    });
  });

  // Remove skill
  el.skillsContainer.addEventListener('click', (e) => {
    if (e.target.dataset.remove) {
      state.skills = state.skills.filter(s => s !== e.target.dataset.remove);
      renderSkills();
    }
  });

  // Scrape button
  el.btnScrape.addEventListener('click', () => runScraper());

  // Modals
  document.getElementById('btnArchModal').addEventListener('click', () => el.modalArch.classList.remove('hidden'));
  document.getElementById('btnSocialModal').addEventListener('click', () => el.modalSocial.classList.remove('hidden'));
  document.querySelectorAll('.close-modal').forEach(b => {
    b.addEventListener('click', () => {
      el.modalArch.classList.add('hidden');
      el.modalSocial.classList.add('hidden');
    });
  });

  // Copy Buttons
  el.btnCopyLinkedIn.addEventListener('click', () => {
    navigator.clipboard.writeText(LINKEDIN_POST);
    el.btnCopyLinkedIn.textContent = 'Copied! ✓';
    setTimeout(() => el.btnCopyLinkedIn.textContent = 'Copy Post', 2000);
  });

  el.btnCopyX.addEventListener('click', () => {
    navigator.clipboard.writeText(X_POST);
    el.btnCopyX.textContent = 'Copied! ✓';
    setTimeout(() => el.btnCopyX.textContent = 'Copy Post', 2000);
  });
}

async function runScraper() {
  const role = el.inputRole.value.trim() || 'UI/UX Designer';
  const location = el.inputLocation.value.trim() || 'Delhi, India';

  el.scrapeConsole.classList.remove('hidden');
  el.consoleLogs.innerHTML = `<div>[TinyFish Search] Querying live ATS pages for "${escapeHtml(role)}" in "${escapeHtml(location)}"...</div>`;
  el.consoleStatus.textContent = 'Scraping Live Web...';
  el.btnScrape.disabled = true;
  el.btnIcon.textContent = '⏳';
  el.btnText.textContent = 'Scraping Web...';

  try {
    const res = await fetch('/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role,
        location,
        keywords: state.skills
      })
    });

    const data = await res.json();
    if (data.success) {
      state.jobs = data.jobs || [];
      el.consoleLogs.innerHTML = (data.logs || []).map(l => `<div>${escapeHtml(l)}</div>`).join('');
      el.consoleStatus.textContent = `Completed (${state.jobs.length} jobs found)`;
      renderJobs(state.jobs);
    }
  } catch (err) {
    el.consoleLogs.innerHTML += `<div class="text-rose-400">[Error] ${escapeHtml(err.message)}</div>`;
  } finally {
    el.btnScrape.disabled = false;
    el.btnIcon.textContent = '⚡';
    el.btnText.textContent = 'Scrape Live Jobs with TinyFish';
  }
}

function renderJobs(jobs) {
  el.jobCountBadge.textContent = jobs.length;
  el.jobsList.innerHTML = '';

  if (jobs.length === 0) {
    el.jobsList.innerHTML = `<div class="glass-panel p-8 text-center text-slate-400 rounded-xl">No active jobs found for this query. Try expanding location.</div>`;
    return;
  }

  jobs.forEach(j => {
    const card = document.createElement('div');
    card.className = 'glass-card rounded-2xl p-5 space-y-3';
    
    const initials = (j.company || 'TC').slice(0, 2).toUpperCase();
    const skillsHtml = (j.skills || []).map(s => `<span class="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-cyan-300 border border-slate-800">${escapeHtml(s)}</span>`).join(' ');

    card.innerHTML = `
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div class="flex items-start space-x-3">
          <div class="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-950 to-blue-950 border border-cyan-800/60 flex items-center justify-center shrink-0 font-bold text-cyan-300 font-mono text-sm">
            ${initials}
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h4 class="font-bold text-white text-base hover:text-cyan-400 transition">${escapeHtml(j.title)}</h4>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60">${escapeHtml(j.source)}</span>
            </div>
            <div class="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
              <span class="font-semibold text-slate-200">${escapeHtml(j.company)}</span>
              <span>•</span>
              <span>📍 ${escapeHtml(j.location)}</span>
              <span>•</span>
              <span class="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">${escapeHtml(j.workType)}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-2 self-end sm:self-center">
          <div class="px-2.5 py-1 rounded-xl text-xs font-bold font-mono score-badge">
            ${j.matchScore}% Match
          </div>
          <a href="${j.applyUrl}" target="_blank" rel="noopener noreferrer" 
            class="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition flex items-center space-x-1">
            <span>Apply Now</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      <p class="text-xs text-slate-300 leading-relaxed">${escapeHtml(j.snippet || '')}</p>

      <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div class="flex flex-wrap gap-1">
          ${skillsHtml}
        </div>
        <div class="font-mono text-cyan-400 text-[10px]">
          ${escapeHtml(j.scrapedVia)}
        </div>
      </div>
    `;

    el.jobsList.appendChild(card);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
