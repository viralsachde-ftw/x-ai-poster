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
    const data = await res.json();
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
    const data = await res.json();
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

renderHistory();
