let currentPost = '';
let currentMode = 'custom';
let lastGenerateArgs = null;

const history = JSON.parse(localStorage.getItem('xposter_history') || '[]');

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach((tc) => tc.classList.remove('active'));
    tab.classList.add('active');
    const tabId = tab.dataset.tab;
    document.getElementById(`tab-${tabId}`).classList.add('active');
    currentMode = tabId;
  });
});

document.querySelectorAll('.tab-content').forEach((tabContent) => {
  tabContent.querySelectorAll('.format-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      tabContent.querySelectorAll('.format-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});

function getActiveFormat(tabId) {
  const tab = document.getElementById(`tab-${tabId}`);
  const activeBtn = tab.querySelector('.format-btn.active');
  return activeBtn ? activeBtn.dataset.format : 'auto';
}

// --- today's posts ---

async function safeJSON(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(res.ok ? 'invalid response from server' : `server error (${res.status})`);
  }
}

async function loadToday() {
  const emptyEl = document.getElementById('today-empty');
  try {
    const res = await fetch('/api/today');
    const data = await safeJSON(res);
    if (!data.configured) {
      emptyEl.textContent = 'kv not configured. add REDIS_URL (or KV_REST_API_URL + KV_REST_API_TOKEN) to your env vars. get it from upstash console or vercel storage.';
      return;
    }
    if (!data.slots || data.slots.length === 0) {
      emptyEl.textContent = 'no posts generated yet. hit "generate all" to create today\'s posts.';
      return;
    }
    renderTodaySlots(data);
  } catch (e) {
    emptyEl.textContent = 'failed to load: ' + e.message;
    console.error('load today error:', e);
  }
}

async function generateToday() {
  const btn = document.querySelector('.today-actions .btn-sm');
  btn.disabled = true;
  btn.textContent = 'generating...';
  try {
    const res = await fetch('/api/today', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate' }),
    });
    const data = await safeJSON(res);
    if (!res.ok) throw new Error(data.error || 'generation failed');
    renderTodaySlots(data);
    loadStats();
  } catch (e) {
    alert('failed to generate: ' + e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'generate all';
  }
}

async function regenerateSlot(index) {
  const card = document.querySelectorAll('.slot-card')[index];
  const btn = card.querySelector('.slot-regen');
  btn.disabled = true;
  btn.textContent = 'regenerating...';
  try {
    const res = await fetch('/api/today', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'regenerate', slot: index }),
    });
    const data = await safeJSON(res);
    if (!res.ok) throw new Error(data.error || 'regeneration failed');
    renderTodaySlots(data);
  } catch (e) {
    alert('failed to regenerate: ' + e.message);
    btn.disabled = false;
    btn.textContent = 'regenerate';
  }
}

async function approveSlot(index) {
  try {
    const res = await fetch('/api/today', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve', slot: index }),
    });
    const data = await safeJSON(res);
    if (!res.ok) throw new Error(data.error || 'approval failed');
    renderTodaySlots(data);
  } catch (e) {
    alert('failed to approve: ' + e.message);
  }
}

async function approveAll() {
  try {
    const res = await fetch('/api/today', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve_all' }),
    });
    const data = await safeJSON(res);
    if (!res.ok) throw new Error(data.error || 'approval failed');
    renderTodaySlots(data);
  } catch (e) {
    alert('failed to approve all: ' + e.message);
  }
}

async function postSlotNow(index) {
  const card = document.querySelectorAll('.slot-card')[index];
  const btn = card.querySelector('.slot-post');
  btn.disabled = true;
  btn.textContent = 'posting...';
  try {
    const res = await fetch('/api/today', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'post_now', slot: index }),
    });
    const data = await safeJSON(res);
    if (!res.ok) throw new Error(data.error || 'posting failed');
    renderTodaySlots(data);
    loadStats();
    if (data.postedUrl) {
      alert('posted! ' + data.postedUrl);
    }
  } catch (e) {
    alert('failed to post: ' + e.message);
    btn.disabled = false;
    btn.textContent = 'post now';
  }
}

function utcHourToIST(utcHour) {
  const totalMinutes = Math.round(utcHour * 60) + 330;
  let h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${suffix}`;
}

function renderTodaySlots(data) {
  const container = document.getElementById('today-slots');
  if (!data.slots || data.slots.length === 0) {
    container.innerHTML = '<p class="empty-state">no posts generated yet. hit "generate all" to create today\'s posts.</p>';
    return;
  }
  container.innerHTML = data.slots.map((slot, i) => {
    const charCount = slot.text.length;
    const isOver = charCount > 280;
    const isPosted = slot.status === 'posted';
    const isApproved = slot.status === 'approved';
    const timeLabel = slot.postAtUTC != null ? utcHourToIST(slot.postAtUTC) + ' IST' : slot.scheduledTime;
    return `
      <div class="slot-card">
        <div class="slot-header">
          <span class="slot-label">post ${i + 1} &middot; ${timeLabel}</span>
          <div class="slot-meta">
            <span class="slot-type">${slot.type}</span>
            <span class="slot-badge ${slot.status}">${slot.status}</span>
          </div>
        </div>
        <div class="slot-text">${escapeHtml(slot.text)}</div>
        <div class="slot-footer">
          <span class="slot-chars ${isOver ? 'over' : ''}">${charCount}/280</span>
          <div class="slot-actions">
            ${isPosted ? `<span class="slot-done">posted</span>` : `
              <button class="btn btn-sm btn-secondary slot-regen" onclick="regenerateSlot(${i})">regenerate</button>
              ${!isApproved ? `<button class="btn btn-sm btn-approve" onclick="approveSlot(${i})">approve</button>` : ''}
              <button class="btn btn-sm btn-post slot-post" onclick="postSlotNow(${i})">post now</button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// --- custom generation ---

async function generateCustom() {
  const context = document.getElementById('context').value.trim();
  if (!context) {
    showStatus('type something first', 'error');
    return;
  }
  const format = getActiveFormat('custom');
  lastGenerateArgs = { mode: 'custom', format, context };
  await generate({ mode: 'custom', format, context }, 'btn-generate-custom');
}

async function generateDaily() {
  const format = getActiveFormat('daily');
  lastGenerateArgs = { mode: 'daily', format };
  await generate({ mode: 'daily', format }, 'btn-generate-daily');
}

async function generateTrending() {
  const format = getActiveFormat('trending');
  lastGenerateArgs = { mode: 'trending', format };
  await generate({ mode: 'trending', format }, 'btn-generate-trending');
}

async function generate(body, btnId) {
  const btn = document.getElementById(btnId);
  btn.disabled = true;
  btn.textContent = 'generating...';
  hideStatus();

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await safeJSON(res);
    if (!res.ok) throw new Error(data.error || 'generation failed');

    currentPost = data.post;
    showOutput(data.post);
    addToHistory(data.post, 'generated');

    if (body.mode === 'trending' && Array.isArray(data.topic)) {
      showTrending(data.topic);
    }
  } catch (e) {
    showStatus(e.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'generate';
  }
}

function showOutput(text) {
  document.getElementById('output-section').style.display = 'block';
  document.getElementById('output-text').textContent = text;
  const count = text.length;
  const countEl = document.getElementById('char-count');
  countEl.textContent = `${count}/280`;
  countEl.className = count > 280 ? 'char-count over' : 'char-count';
  document.getElementById('output-section').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function postToX() {
  if (!currentPost) return;
  const btn = document.querySelector('.btn-post');
  btn.disabled = true;
  btn.textContent = 'posting...';

  try {
    const res = await fetch('/api/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: currentPost }),
    });
    const data = await safeJSON(res);
    if (!res.ok) throw new Error(data.error || 'posting failed');

    showStatus(`posted! <a href="${data.url}" target="_blank" rel="noopener">view on x</a>`, 'success');
    updateHistory(currentPost, 'posted');
  } catch (e) {
    showStatus(e.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'post to x';
  }
}

function copyPost() {
  if (!currentPost) return;
  navigator.clipboard.writeText(currentPost).then(() => {
    const btn = document.querySelector('.btn-copy');
    btn.textContent = 'copied!';
    updateHistory(currentPost, 'copied');
    setTimeout(() => { btn.textContent = 'copy'; }, 2000);
  });
}

async function regenerate() {
  if (!lastGenerateArgs) return;
  const btnMap = {
    custom: 'btn-generate-custom',
    daily: 'btn-generate-daily',
    trending: 'btn-generate-trending',
  };
  await generate(lastGenerateArgs, btnMap[lastGenerateArgs.mode] || 'btn-generate-custom');
}

async function fetchTrending() {
  try {
    const res = await fetch('/api/trending');
    const data = await res.json();
    if (data.topics) showTrending(data.topics);
  } catch (e) {
    console.error('fetch trending failed:', e);
  }
}

function showTrending(topics) {
  const container = document.getElementById('trending-topics');
  const ul = document.getElementById('trending-ul');
  ul.innerHTML = '';
  topics.forEach((t) => {
    const li = document.createElement('li');
    li.textContent = t;
    ul.appendChild(li);
  });
  container.style.display = 'block';
}

function showStatus(msg, type) {
  const el = document.getElementById('post-status');
  el.innerHTML = msg;
  el.className = `post-status ${type}`;
  el.style.display = 'block';
}

function hideStatus() {
  document.getElementById('post-status').style.display = 'none';
}

function addToHistory(text, status) {
  const entry = {
    text,
    status,
    time: new Date().toISOString(),
  };
  history.unshift(entry);
  if (history.length > 50) history.pop();
  localStorage.setItem('xposter_history', JSON.stringify(history));
  renderHistory();
}

function updateHistory(text, newStatus) {
  const entry = history.find((h) => h.text === text);
  if (entry) {
    entry.status = newStatus;
    localStorage.setItem('xposter_history', JSON.stringify(history));
    renderHistory();
  }
}

function renderHistory() {
  const container = document.getElementById('history-list');
  if (history.length === 0) {
    container.innerHTML = '<p class="empty-state">no posts yet</p>';
    return;
  }
  container.innerHTML = history.slice(0, 20).map((h) => {
    const time = new Date(h.time);
    const timeStr = time.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    });
    return `
      <div class="history-item">
        <div class="history-text">${escapeHtml(h.text)}</div>
        <div class="history-meta">
          <span>${timeStr}</span>
          <span class="history-badge ${h.status}">${h.status}</span>
        </div>
      </div>
    `;
  }).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    const data = await safeJSON(res);
    if (!data.configured) return;
    document.getElementById('stat-total').textContent = data.totalPosts;
    document.getElementById('stat-today-posted').textContent = `${data.todayPosted}/3`;
    document.getElementById('stat-today-pending').textContent = data.todayPending + data.todayApproved;
    document.getElementById('stat-history').textContent = `${data.totalPosts}/200`;
  } catch (e) {
    console.error('load stats error:', e);
  }
}

renderHistory();
loadToday().then(loadStats);
