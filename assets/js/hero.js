import { getJSON, postJSON, fmtNum } from "./api.js";

function countUp(el, target, dur = 900) {
  const start = performance.now();
  const from = 0;
  function tick(t) {
    const p = Math.min(1, (t - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmtNum(Math.floor(from + (target - from) * eased));
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

export async function initHero() {
  // views: increment then read
  try {
    const data = await postJSON("/api/views", {});
    const totalEl = document.querySelector("[data-views-total]");
    const todayEl = document.querySelector("[data-views-today]");
    if (totalEl) countUp(totalEl, data.total ?? 0);
    if (todayEl) countUp(todayEl, data.today ?? 0);
  } catch (e) {
    console.warn("views failed", e);
  }

  // stats payload covers discord status + last played
  try {
    const s = await getJSON("/api/stats");
    applyDiscord(s.discord);
    applyLastPlayed(s.lastfm?.now || s.lastfm?.recent?.[0]);
  } catch (e) {
    console.warn("hero stats failed", e);
    applyDiscord(null);
  }
}

function applyDiscord(d) {
  const status = document.querySelector("[data-discord-status]");
  const dot = document.querySelector("[data-status-dot]");
  const label = document.querySelector("[data-status-label]");
  if (!status) return;
  const state = d?.status || "offline";
  status.dataset.state = state;
  const labels = { online: "Online", idle: "Idle", dnd: "Do not disturb", offline: "Offline" };
  label.textContent = labels[state] || "Offline";
  if (d?.activity) {
    label.textContent = `${labels[state]} · ${d.activity}`;
  }
}

function applyLastPlayed(track) {
  if (!track) return;
  const art = document.querySelector("[data-lp-art]");
  const title = document.querySelector("[data-lp-title]");
  const artist = document.querySelector("[data-lp-artist]");
  const label = document.querySelector("[data-lp-label]");
  if (track.nowPlaying) label.textContent = "Now Playing";
  if (art && track.image) { art.src = track.image; art.alt = track.album || ""; }
  if (title) title.textContent = track.name || "—";
  if (artist) artist.textContent = track.artist || "—";
}
