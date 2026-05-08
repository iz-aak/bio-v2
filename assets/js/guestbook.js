import { getJSON, postJSON, relTime } from "./api.js";

const TURNSTILE_SITEKEY = "0x4AAAAAADLpYYb9sWkp27aV"; 

let cursor = null;
let turnstileLoaded = false;
let turnstileWidgetId = null;

export function initGuestbook() {
  const form = document.querySelector("[data-gb-form]");
  const list = document.querySelector("[data-gb-list]");
  const msg  = document.querySelector("[data-gb-msg]");
  const more = document.querySelector("[data-gb-more]");
  const lenEl = document.querySelector("[data-gb-len]");
  const ta = form?.querySelector("textarea");

  if (!form || !list) return;

  ta?.addEventListener("input", () => { if (lenEl) lenEl.textContent = String(ta.value.length); });

  // Lazy-load entries + turnstile when section enters viewport
  const sec = document.getElementById("guestbook");
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      io.disconnect();
      loadEntries(true);
      loadTurnstile();
    }
  }, { rootMargin: "200px" });
  io.observe(sec);

  more?.addEventListener("click", () => loadEntries(false));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.className = "gb-msg";
    msg.textContent = "";
    const data = Object.fromEntries(new FormData(form));
    if (!data.name?.trim() || !data.message?.trim()) {
      msg.classList.add("error"); msg.textContent = "Name and message required."; return;
    }
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    try {
      const token = window.turnstile && turnstileWidgetId != null ? window.turnstile.getResponse(turnstileWidgetId) : "";
      const res = await postJSON("/api/guestbook", {
        name: data.name.trim(),
        message: data.message.trim(),
        emoji: (data.emoji || "").trim().slice(0, 2),
        turnstileToken: token,
      });
      msg.classList.add("ok"); msg.textContent = "Signed. Thanks!";
      form.reset(); if (lenEl) lenEl.textContent = "0";
      if (window.turnstile && turnstileWidgetId != null) window.turnstile.reset(turnstileWidgetId);
      // prepend new entry
      list.querySelectorAll(".gb-skel").forEach((n) => n.remove());
      list.insertAdjacentHTML("afterbegin", renderEntry(res.entry));
    } catch (err) {
      msg.classList.add("error");
      msg.textContent = err?.data?.error || err.message || "Failed to send.";
    } finally {
      btn.disabled = false;
    }
  });
}

async function loadEntries(initial) {
  const list = document.querySelector("[data-gb-list]");
  const more = document.querySelector("[data-gb-more]");
  try {
    const qs = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
    const res = await getJSON(`/api/guestbook${qs}`);
    if (initial) list.innerHTML = "";
    if (!res.entries?.length && initial) {
      list.innerHTML = `<li class="card gb-entry"><span class="gb-body" style="color:var(--fg-mute)">Be the first to sign.</span></li>`;
    } else {
      list.insertAdjacentHTML("beforeend", res.entries.map(renderEntry).join(""));
    }
    cursor = res.cursor || null;
    if (more) more.hidden = !cursor;
  } catch (e) {
    if (initial) list.innerHTML = `<li class="card gb-entry"><span class="gb-body" style="color:var(--bad)">Couldn't load guestbook.</span></li>`;
  }
}

function renderEntry(e) {
  const emoji = e.emoji ? `<span aria-hidden="true">${escapeHtml(e.emoji)}</span> ` : "";
  return `<li class="card gb-entry">
    <div class="gb-entry-head">
      <span class="gb-name">${emoji}${escapeHtml(e.name)}</span>
      <span class="gb-time">${escapeHtml(relTime(e.createdAt))}</span>
    </div>
    <div class="gb-body">${escapeHtml(e.message)}</div>
    ${e.reply ? `<div class="gb-reply">${escapeHtml(e.reply)}</div>` : ""}
  </li>`;
}

function loadTurnstile() {
  if (turnstileLoaded || !TURNSTILE_SITEKEY) return;
  turnstileLoaded = true;
  const s = document.createElement("script");
  s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
  s.async = true; s.defer = true;
  s.onload = () => {
    const el = document.querySelector("[data-turnstile]");
    if (el && window.turnstile) {
      turnstileWidgetId = window.turnstile.render(el, { sitekey: TURNSTILE_SITEKEY, theme: "dark", size: "flexible" });
    }
  };
  document.head.appendChild(s);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]));
}
