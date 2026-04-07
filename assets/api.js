const WORKER_URL = "https://sparkling-recipe-1606.kultforge.workers.dev/";

// Accepts a plain string or a messages array
async function callClaude(input, maxTokens) {
  const messages = typeof input === "string"
    ? [{ role: "user", content: input }]
    : input;
  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens || 800,
      messages
    })
  });
  if (!res.ok) throw new Error("Worker error: " + res.status);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content ? data.content.map(c => c.text || "").join("") : "";
}

function copyText(text, btnId) {
  navigator.clipboard.writeText(text).then(function() {
    const b = document.getElementById(btnId);
    if (!b) return;
    const orig = b.textContent;
    b.textContent = "Copied!";
    b.classList.add("copied");
    setTimeout(function() { b.textContent = orig; b.classList.remove("copied"); }, 2000);
  });
}

function setStep(i, state) {
  const icon = document.getElementById("si-" + i);
  const name = document.getElementById("sn-" + i);
  if (!icon || !name) return;
  icon.className = "step-icon " + state;
  name.className = "step-name" + (state === "done" ? " done" : state === "running" ? " active" : "");
  icon.textContent = state === "done" ? "✓" : state === "error" ? "✕" : (i + 1).toString();
}

function setProgress(p) {
  const bar = document.getElementById("pbar");
  if (bar) bar.style.width = p + "%";
}

function addLoading(id, title, badge, bc) {
  const area = document.getElementById("outputArea");
  if (!area) return;
  const el = document.createElement("div");
  el.className = "block";
  el.id = "block-" + id;
  el.innerHTML =
    '<div class="block-header"><div class="block-title">' + title +
    ' <span class="block-badge ' + bc + '">' + badge + '</span></div></div>' +
    '<div class="block-loading"><div class="spinner"></div> Generating with Claude...</div>';
  area.appendChild(el);
  el.scrollIntoView({ behavior: "smooth", block: "end" });
}

function fillText(id, title, badge, bc, text) {
  const el = document.getElementById("block-" + id);
  if (!el) return;
  el.innerHTML =
    '<div class="block-header"><div class="block-title">' + title +
    ' <span class="block-badge ' + bc + '">' + badge + '</span></div>' +
    '<div class="block-actions"><button class="copy-btn" id="copy-' + id + '" onclick="copyText(document.getElementById(\'content-' + id + '\').textContent,\'copy-' + id + '\')">Copy</button></div></div>' +
    '<div class="block-body" id="content-' + id + '">' + text + '</div>';
}
